import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // Verificar variáveis de ambiente antes de continuar
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      console.error('NEXT_PUBLIC_SUPABASE_URL não está configurada')
      return NextResponse.json(
        { 
          error: 'Configuração do servidor incompleta. NEXT_PUBLIC_SUPABASE_URL não está definida. Verifique seu arquivo .env.local' 
        },
        { status: 500 }
      )
    }

    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('SUPABASE_SERVICE_ROLE_KEY não está configurada')
      return NextResponse.json(
        { 
          error: 'Configuração do servidor incompleta. SUPABASE_SERVICE_ROLE_KEY não está definida. Verifique seu arquivo .env.local e certifique-se de usar a Service Role Key (não a Anon Key).' 
        },
        { status: 500 }
      )
    }

    const supabase = await createClient()
    
    // Verificar se o usuário é admin
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
      return NextResponse.json({ error: 'Acesso negado. Apenas administradores podem criar usuários.' }, { status: 403 })
    }

    const body = await request.json()
    const { nome, email, role, senha } = body

    if (!nome || !email || !role) {
      return NextResponse.json(
        { error: 'Campos obrigatórios: nome, email, role' },
        { status: 400 }
      )
    }

    // Criar usuário no Supabase Auth usando Admin API
    let supabaseAdmin
    try {
      supabaseAdmin = createAdminClient()
    } catch (error: any) {
      console.error('Erro ao criar cliente admin:', error)
      return NextResponse.json(
        { 
          error: `Erro de configuração: ${error.message}. Verifique as variáveis de ambiente no arquivo .env.local` 
        },
        { status: 500 }
      )
    }
    
    // Criar usuário no Auth (com ou sem senha)
    const createUserOptions: any = {
      email,
      email_confirm: true,
      user_metadata: {
        nome,
        role,
      },
    }

    if (senha) {
      createUserOptions.password = senha
    }

    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser(createUserOptions)

    if (authError) {
      console.error('Erro ao criar usuário no Auth:', authError)
      
      // Mensagens de erro mais específicas
      let errorMessage = authError.message
      
      if (authError.message.includes('Failed to fetch') || authError.message.includes('network')) {
        errorMessage = `Erro de conexão com o Supabase. Verifique: 
        1. Se NEXT_PUBLIC_SUPABASE_URL está correta no .env.local
        2. Se SUPABASE_SERVICE_ROLE_KEY está correta (use a Service Role Key, não a Anon Key)
        3. Se há problemas de rede/firewall bloqueando a conexão
        4. Se o projeto Supabase está ativo e acessível`
      } else if (authError.message.includes('Invalid API key') || authError.message.includes('JWT')) {
        errorMessage = `Chave de API inválida. Verifique se SUPABASE_SERVICE_ROLE_KEY está correta no .env.local. 
        Você pode encontrar a Service Role Key no Supabase Dashboard → Settings → API.`
      } else if (authError.message.includes('already registered')) {
        errorMessage = `Este email já está cadastrado no sistema.`
      }
      
      return NextResponse.json(
        { error: `Erro ao criar usuário: ${errorMessage}` },
        { status: 500 }
      )
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: 'Erro: usuário não foi criado no Auth' },
        { status: 500 }
      )
    }

    // Inserir na tabela users
    const { error: insertError } = await supabase.from('users').insert({
      email,
      nome: nome.trim(),
      role,
      ativo: true,
    })

    if (insertError) {
      console.error('Erro ao inserir usuário na tabela:', insertError)
      // Tentar remover do Auth se falhou na tabela
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
      return NextResponse.json(
        { error: `Erro ao criar usuário: ${insertError.message}` },
        { status: 500 }
      )
    }

    // Enviar email de convite/reset de senha
    // IMPORTANTE: Para que o email seja enviado, o SMTP precisa estar configurado no Supabase
    // No ambiente local, você pode verificar os emails em http://localhost:54324 (Inbucket)
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 
                   process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, '') || 
                   'http://localhost:3000'
    
    let emailSent = false
    let resetLink = null
    
    // Tentar enviar email usando inviteUserByEmail (método recomendado)
    // Isso envia um email de convite com link para definir senha
    try {
      const { data: inviteData, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
        redirectTo: `${siteUrl}/login?reset=true`,
        data: {
          nome,
          role,
        },
      })

      if (inviteError) {
        console.warn('Erro ao enviar convite por email:', inviteError)
        // Se invite falhar, tentar gerar link de recovery
        const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
          type: 'recovery',
          email,
          options: {
            redirectTo: `${siteUrl}/login?reset=true`,
          },
        })

        if (linkError) {
          console.warn('Erro ao gerar link de recovery:', linkError)
        } else if (linkData?.properties?.action_link) {
          resetLink = linkData.properties.action_link
          console.log('Link de recovery gerado (email pode não ter sido enviado):', resetLink)
          console.log('NOTA: Para enviar emails automaticamente, configure SMTP no Supabase Dashboard:')
          console.log('  1. Vá para Settings > Auth > SMTP Settings')
          console.log('  2. Configure seu servidor SMTP (SendGrid, AWS SES, etc.)')
          console.log('  3. Ou use o Inbucket local em http://localhost:54324 para desenvolvimento')
        }
      } else {
        emailSent = true
        console.log('Email de convite enviado com sucesso para:', email)
      }
    } catch (err: any) {
      console.error('Erro inesperado ao tentar enviar email:', err)
      // Gerar link como fallback
      const { data: linkData } = await supabaseAdmin.auth.admin.generateLink({
        type: 'recovery',
        email,
        options: {
          redirectTo: `${siteUrl}/login?reset=true`,
        },
      })
      if (linkData?.properties?.action_link) {
        resetLink = linkData.properties.action_link
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Usuário criado com sucesso!',
      emailSent,
      resetLink: resetLink || undefined, // Link manual se email não foi enviado
      warning: !emailSent ? 'Email pode não ter sido enviado. Configure SMTP no Supabase Dashboard (Settings > Auth > SMTP Settings) para envio automático. Em desenvolvimento local, verifique http://localhost:54324 (Inbucket).' : null
    })
  } catch (error: any) {
    console.error('Erro inesperado:', error)
    return NextResponse.json(
      { error: `Erro inesperado ao criar usuário: ${error.message || 'Erro desconhecido'}` },
      { status: 500 }
    )
  }
}

