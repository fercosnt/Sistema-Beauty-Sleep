import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const token = searchParams.get('token')
  const type = searchParams.get('type')
  const tokenHash = searchParams.get('token_hash')
  
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get('next') ?? '/dashboard'

  // Se tiver token mas não code, processar token e redirecionar para reset-password
  if (token && type === 'recovery' && !code) {
    const supabase = await createClient()
    
    // Processar o token de recovery através do endpoint verify do Supabase
    // Isso cria uma sessão temporária para permitir redefinir a senha
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const verifyResponse = await fetch(
        `${supabaseUrl}/auth/v1/verify?token=${encodeURIComponent(token)}&type=recovery`,
        {
          method: 'GET',
          headers: {
            'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
          },
        }
      )

      // Se o token foi processado, verificar se está autenticado
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        // Token processado com sucesso, redirecionar para reset-password
        const forwardedHost = request.headers.get('x-forwarded-host')
        const isLocalEnv = process.env.NODE_ENV === 'development'
        const redirectUrl = isLocalEnv 
          ? `${origin}/auth/reset-password`
          : forwardedHost 
            ? `https://${forwardedHost}/auth/reset-password`
            : `${origin}/auth/reset-password`
        return NextResponse.redirect(redirectUrl)
      }
    } catch (err) {
      console.error('Erro ao processar token de recovery:', err)
    }
    
    // Se falhar, redirecionar mesmo assim para reset-password que tentará processar
    const forwardedHost = request.headers.get('x-forwarded-host')
    const isLocalEnv = process.env.NODE_ENV === 'development'
    const redirectUrl = isLocalEnv 
      ? `${origin}/auth/reset-password?token=${token}&type=recovery`
      : forwardedHost 
        ? `https://${forwardedHost}/auth/reset-password?token=${token}&type=recovery`
        : `${origin}/auth/reset-password?token=${token}&type=recovery`
    return NextResponse.redirect(redirectUrl)
  }

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      const forwardedHost = request.headers.get('x-forwarded-host') // original origin before load balancer
      const isLocalEnv = process.env.NODE_ENV === 'development'
      
      // Se for um convite (invite) ou signup, redirecionar para página de cadastro
      if (type === 'invite' || type === 'signup' || tokenHash) {
        const redirectUrl = isLocalEnv 
          ? `${origin}/auth/signup?code=${code}&type=${type || 'invite'}`
          : forwardedHost 
            ? `https://${forwardedHost}/auth/signup?code=${code}&type=${type || 'invite'}`
            : `${origin}/auth/signup?code=${code}&type=${type || 'invite'}`
        return NextResponse.redirect(redirectUrl)
      }
      
      // Se for reset de senha, redirecionar para página de reset
      if (type === 'recovery') {
        const redirectUrl = isLocalEnv 
          ? `${origin}/auth/reset-password?code=${code}`
          : forwardedHost 
            ? `https://${forwardedHost}/auth/reset-password?code=${code}`
            : `${origin}/auth/reset-password?code=${code}`
        return NextResponse.redirect(redirectUrl)
      }
      
      // Se for confirmação de email, processar e redirecionar para dashboard com mensagem
      if (type === 'email' || type === 'signup') {
        const redirectUrl = isLocalEnv 
          ? `${origin}/dashboard?email_confirmed=true`
          : forwardedHost 
            ? `https://${forwardedHost}/dashboard?email_confirmed=true`
            : `${origin}/dashboard?email_confirmed=true`
        return NextResponse.redirect(redirectUrl)
      }
      
      // Se for magic link, processar e redirecionar para dashboard com mensagem
      if (type === 'magiclink' || type === 'otp') {
        const redirectUrl = isLocalEnv 
          ? `${origin}/dashboard?magic_link_login=true`
          : forwardedHost 
            ? `https://${forwardedHost}/dashboard?magic_link_login=true`
            : `${origin}/dashboard?magic_link_login=true`
        return NextResponse.redirect(redirectUrl)
      }
      
      // Se for mudança de email, redirecionar para página de mudança de email
      if (type === 'email_change' || type === 'emailchange') {
        const redirectUrl = isLocalEnv 
          ? `${origin}/auth/email-change?code=${code}&type=${type}`
          : forwardedHost 
            ? `https://${forwardedHost}/auth/email-change?code=${code}&type=${type}`
            : `${origin}/auth/email-change?code=${code}&type=${type}`
        return NextResponse.redirect(redirectUrl)
      }
      
      // Caso padrão: redirecionar para dashboard
      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        return NextResponse.redirect(`${origin}${next}`)
      }
    }
  }

  // Se tiver token_hash mas não code, processar o token_hash
  if (tokenHash && type === 'invite') {
    const supabase = await createClient()
    
    // Tentar verificar o token_hash e criar sessão
    // O Supabase processa token_hash através da URL, mas precisamos verificar se funciona
    // Vamos redirecionar para signup com o token_hash para que seja processado
    const redirectUrl = `${origin}/auth/signup?token_hash=${tokenHash}&type=invite`
    return NextResponse.redirect(redirectUrl)
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}

