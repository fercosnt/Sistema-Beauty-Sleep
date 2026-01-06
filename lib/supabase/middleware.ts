import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  // Check if environment variables are set
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables')
    // Instead of returning 500, redirect to login with error message
    // This prevents the entire app from breaking
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('error', 'config')
    return NextResponse.redirect(url)
  }

  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
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

  // Protect routes - redirect to login if not authenticated
  // Allow access to login, auth callback, and root page (which handles its own redirect)
  const isLoginPage = request.nextUrl.pathname === '/login' || request.nextUrl.pathname.startsWith('/login/')
  const isAuthCallback = request.nextUrl.pathname.startsWith('/auth')
  const isRootPage = request.nextUrl.pathname === '/'
  
  if (!user || authError) {
    // If already on login, auth callback, or root page, allow it
    if (isLoginPage || isAuthCallback || isRootPage) {
      return supabaseResponse
    }
    // Otherwise, redirect to login
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    // Only add session_expired if not already present
    if (!url.searchParams.has('session_expired')) {
      url.searchParams.set('session_expired', 'true')
    }
    return NextResponse.redirect(url)
  }

  // If user is authenticated, fetch their role from the users table
  // BUT: Skip this check if already on login page to avoid loops
  if (user && user.email && !isLoginPage) {
    try {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('role, ativo')
        .eq('email', user.email)
        .single()

      // Check if user exists in users table and is active
      if (userError || !userData || !userData.ativo) {
        // User not found in users table or inactive
        // Sign out the user to clear invalid session
        await supabase.auth.signOut()
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        url.searchParams.set('error', 'usuario_nao_autorizado')
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
    } catch (error) {
      console.error('Error fetching user data:', error)
      // On error, allow request to proceed but without role headers
      // This prevents middleware from breaking the entire app
    }
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

