import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  // Detectar tokens de recovery ou invite na URL e redirecionar para callback ou signup
  const url = request.nextUrl.clone()
  const token = url.searchParams.get('token')
  const type = url.searchParams.get('type')
  const code = url.searchParams.get('code')
  const tokenHash = url.searchParams.get('token_hash')
  
  // Se for invite, redirecionar para signup
  if ((type === 'invite' || type === 'signup' || tokenHash) && (url.pathname === '/' || url.pathname === '/login')) {
    const signupUrl = new URL('/auth/signup', url.origin)
    if (code) signupUrl.searchParams.set('code', code)
    if (type) signupUrl.searchParams.set('type', type)
    if (tokenHash) signupUrl.searchParams.set('token_hash', tokenHash)
    return NextResponse.redirect(signupUrl)
  }
  
  // Se tiver token de recovery na raiz ou login, redirecionar para callback
  if (token && type === 'recovery' && (url.pathname === '/' || url.pathname === '/login')) {
    url.pathname = '/auth/callback'
    return NextResponse.redirect(url)
  }

  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: Don't remove getUser() - it refreshes the auth token
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  // Handle refresh token errors - these are expected when cookies are invalid/expired
  const isRefreshTokenError = authError?.code === 'refresh_token_not_found' || 
                              authError?.message?.includes('Invalid Refresh Token') ||
                              authError?.message?.includes('Refresh Token Not Found')

  // If refresh token is invalid and we're not on login/auth routes, clear cookies and redirect
  if (isRefreshTokenError && 
      !request.nextUrl.pathname.startsWith('/login') && 
      !request.nextUrl.pathname.startsWith('/auth')) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('session_expired', 'true')
    
    // Clear auth cookies
    const response = NextResponse.redirect(url)
    response.cookies.delete('sb-access-token')
    response.cookies.delete('sb-refresh-token')
    response.cookies.delete('sb-provider-token')
    
    // Clear all Supabase auth cookies (they use patterns like sb-*-auth-token)
    request.cookies.getAll().forEach((cookie) => {
      if (cookie.name.includes('sb-') && cookie.name.includes('auth-token')) {
        response.cookies.delete(cookie.name)
      }
    })
    
    return response
  }

  // Protect routes - redirect to login if not authenticated
  // Allow access to login and auth callback routes
  if (
    (!user || authError) &&
    !request.nextUrl.pathname.startsWith('/login') &&
    !request.nextUrl.pathname.startsWith('/auth')
  ) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    // Clear any cached session data by adding a cache-busting param
    url.searchParams.set('session_expired', 'true')
    return NextResponse.redirect(url)
  }

  // If user is authenticated, fetch their role from the users table
  if (user) {
    const { data: userData } = await supabase
      .from('users')
      .select('role, ativo')
      .eq('email', user.email)
      .single()

    // Check if user exists in users table and is active
    if (!userData || !userData.ativo) {
      // User not found in users table or inactive - redirect to login
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      url.searchParams.set('error', 'Usuário não autorizado')
      return NextResponse.redirect(url)
    }

    // Role-based access control: Admin-only routes
    const adminOnlyRoutes = ['/usuarios', '/logs']
    const isAdminRoute = adminOnlyRoutes.some(route => 
      request.nextUrl.pathname.startsWith(route)
    )

    if (isAdminRoute && userData.role !== 'admin') {
      // Non-admin trying to access admin route - redirect to dashboard
      const url = request.nextUrl.clone()
      url.pathname = '/dashboard'
      return NextResponse.redirect(url)
    }

    // Add user role to request headers for use in components
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-user-role', userData.role)
    requestHeaders.set('x-user-email', user.email || '')

    // Create new response with updated headers, preserving cookies
    const newResponse = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
    // Copy cookies from original response
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      newResponse.cookies.set(cookie.name, cookie.value, cookie)
    })
    supabaseResponse = newResponse
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is.
  // If you're creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse
}

