import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticação e permissões
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user?.email) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('email', user.email)
      .single()

    if (userData?.role !== 'admin') {
      return NextResponse.json({ error: 'Acesso negado. Apenas administradores podem enviar emails.' }, { status: 403 })
    }

    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json({ error: 'Email é obrigatório' }, { status: 400 })
    }

    const supabaseAdmin = createAdminClient()
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 
                   process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, '') || 
                   'http://localhost:3000'

    // Gerar link de recovery
    const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'recovery',
      email,
      options: {
        redirectTo: `${siteUrl}/auth/reset-password`,
      },
    })

    if (linkError) {
      console.error('Erro ao gerar link de recovery:', linkError)
      return NextResponse.json(
        { error: `Erro ao gerar link: ${linkError.message}` },
        { status: 500 }
      )
    }

    if (!linkData?.properties?.action_link) {
      return NextResponse.json(
        { error: 'Link não foi gerado' },
        { status: 500 }
      )
    }

    // Enviar email de recovery
    // O Supabase Admin API não tem método direto para enviar email de recovery
    // Vamos usar o método do cliente que envia automaticamente usando o template configurado
    // Criar um cliente temporário para enviar o email
    const { createClient: createServerClient } = await import('@supabase/supabase-js')
    const tempClient = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    
    const { error: resetError } = await tempClient.auth.resetPasswordForEmail(email, {
      redirectTo: `${siteUrl}/auth/reset-password`,
    })

    if (resetError) {
      console.error('Erro ao enviar email de recovery:', resetError)
      // Retornar o link mesmo se o email falhar, para que o admin possa enviar manualmente
      return NextResponse.json({
        success: true,
        message: 'Link gerado, mas email não foi enviado automaticamente. Use o link abaixo:',
        link: linkData.properties.action_link,
        emailSent: false,
        error: resetError.message,
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Email de recuperação de senha enviado com sucesso!',
      emailSent: true,
      link: linkData.properties.action_link, // Link de backup caso o email não chegue
    })
  } catch (error: any) {
    console.error('Erro inesperado ao enviar email:', error)
    return NextResponse.json(
      { error: `Erro inesperado: ${error.message || 'Erro desconhecido'}` },
      { status: 500 }
    )
  }
}

