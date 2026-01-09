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
    
    // Verificar se o usuário já existe no Auth
    let authData: any = null
    let userAlreadyExists = false
    let userConfirmed = false
    
    try {
      console.log(`[criar-usuario] Verificando se usuário ${email} já existe no Auth...`)
      const { data: existingUsers, error: listError } = await supabaseAdmin.auth.admin.listUsers()
      
      if (listError) {
        console.warn('[criar-usuario] Erro ao listar usuários:', listError)
      } else if (existingUsers?.users) {
        // Buscar usuário com email exato (case-insensitive)
        const existingUser = existingUsers.users.find(u => 
          u.email && u.email.toLowerCase().trim() === email.toLowerCase().trim()
        )
        
        if (existingUser) {
          userAlreadyExists = true
          userConfirmed = !!existingUser.email_confirmed_at
          authData = { user: existingUser }
          console.log(`[criar-usuario] Usuário já existe no Auth:`, {
            id: existingUser.id,
            email: existingUser.email,
            confirmed: userConfirmed,
            created_at: existingUser.created_at
          })
        } else {
          console.log(`[criar-usuario] Usuário ${email} não encontrado no Auth. Total de usuários listados: ${existingUsers.users.length}`)
        }
      } else {
        console.log('[criar-usuario] Nenhum usuário encontrado na lista (sistema vazio ou erro)')
      }
    } catch (listError) {
      console.warn('[criar-usuario] Erro ao listar usuários (continuando...):', listError)
    }
    
    // Se o usuário não existe, criar novo
    if (!userAlreadyExists) {
      console.log(`[criar-usuario] Criando novo usuário: ${email}`)
      const createUserOptions: any = {
        email: email.trim().toLowerCase(),
        email_confirm: false, // Não confirmar automaticamente para que o convite funcione
        user_metadata: {
          nome,
          role,
        },
      }

      if (senha) {
        createUserOptions.password = senha
      }

      const createResult = await supabaseAdmin.auth.admin.createUser(createUserOptions)
      authData = createResult.data
      const authError = createResult.error

      if (authError) {
        console.error('[criar-usuario] Erro ao criar usuário no Auth:', authError)
        
        // Se o erro for "already registered", verificar novamente
        if (authError.message.includes('already registered') || 
            authError.message.includes('already been registered') ||
            authError.code === 'email_exists') {
          
          console.log('[criar-usuario] Erro "already registered" ao criar, verificando novamente...')
          // Verificar novamente se o usuário existe
          try {
            const { data: verifyUsers } = await supabaseAdmin.auth.admin.listUsers()
            const verifyUser = verifyUsers?.users?.find(u => 
              u.email && u.email.toLowerCase().trim() === email.toLowerCase().trim()
            )
            
            if (verifyUser) {
              // Usuário realmente existe agora
              userAlreadyExists = true
              userConfirmed = !!verifyUser.email_confirmed_at
              authData = { user: verifyUser }
              console.log('[criar-usuario] Usuário confirmado como existente após erro:', verifyUser.id)
            } else {
              // Usuário não existe, mas deu erro - pode ser problema temporário
              return NextResponse.json(
                { error: `Erro ao criar usuário: ${authError.message}. Tente novamente.` },
                { status: 500 }
              )
            }
          } catch (verifyErr) {
            return NextResponse.json(
              { error: `Erro ao verificar usuário: ${authError.message}` },
              { status: 500 }
            )
          }
        } else {
          // Outro tipo de erro
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
          }
          
          return NextResponse.json(
            { error: `Erro ao criar usuário: ${errorMessage}` },
            { status: 500 }
          )
        }
      } else if (authData?.user) {
        console.log(`[criar-usuario] Usuário criado com sucesso no Auth:`, authData.user.id)
      } else {
        return NextResponse.json(
          { error: 'Erro: usuário não foi criado no Auth' },
          { status: 500 }
        )
      }
    }

    // Verificar se o usuário já existe na tabela users
    const { data: existingUserInTable } = await supabase
      .from('users')
      .select('id, email, nome, role, ativo')
      .eq('email', email)
      .single()

    if (existingUserInTable) {
      // Usuário já existe na tabela - atualizar informações
      const { error: updateError } = await supabase
        .from('users')
        .update({
          nome: nome.trim(),
          role,
          ativo: true,
        })
        .eq('email', email)

      if (updateError) {
        console.error('Erro ao atualizar usuário na tabela:', updateError)
        return NextResponse.json(
          { error: `Erro ao atualizar usuário: ${updateError.message}` },
          { status: 500 }
        )
      }
    } else {
      // Inserir na tabela users
      const { error: insertError } = await supabase.from('users').insert({
        email,
        nome: nome.trim(),
        role,
        ativo: true,
      })

      if (insertError) {
        console.error('Erro ao inserir usuário na tabela:', insertError)
        // Se o usuário foi criado agora, tentar remover do Auth
        if (!userAlreadyExists && authData?.user?.id) {
          await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
        }
        return NextResponse.json(
          { error: `Erro ao criar usuário: ${insertError.message}` },
          { status: 500 }
        )
      }
    }

    // Enviar email de convite/reset de senha
    // IMPORTANTE: Para que o email seja enviado, o SMTP precisa estar configurado no Supabase
    // IMPORTANTE: Usar NEXT_PUBLIC_SITE_URL para garantir que o redirectTo aponte para a URL correta
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 
                   (process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('supabase.co') 
                     ? 'https://beauty-sleep.vercel.app' 
                     : 'http://localhost:3000')
    
    // Garantir que não tenha barra no final
    const cleanSiteUrl = siteUrl.replace(/\/$/, '')
    const signupUrl = `${cleanSiteUrl}/auth/signup`
    
    console.log(`[criar-usuario] URL de signup configurada: ${signupUrl}`)
    
    // Detectar se está em ambiente local (Supabase local) ou remoto
    const isLocalEnv = process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('127.0.0.1') || 
                      process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('localhost') ||
                      process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('127.0.0.1:54321')
    
    let emailSent = false
    let resetLink = null
    let emailError = null
    
    // Verificar se o usuário já existe antes de tentar enviar convite
    // Se o usuário já existe, não tentar enviar convite (vai dar erro)
    // Em vez disso, gerar link de recovery ou reenvio de convite
    if (userAlreadyExists) {
      console.log('Usuário já existe, gerando link de recovery em vez de convite...')
      
      // Para usuários existentes, gerar link de recovery (reset de senha)
      // ou tentar reenviar convite se o usuário ainda não confirmou email
      try {
        // Verificar se o usuário já confirmou email
        const { data: existingUserData } = await supabaseAdmin.auth.admin.getUserById(authData.user.id)
        const isEmailConfirmed = existingUserData?.user?.email_confirmed_at !== null

        if (!isEmailConfirmed) {
          // Se email não foi confirmado, tentar reenviar convite
          const { data: inviteData, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
            redirectTo: signupUrl,
            data: {
              nome,
              role,
            },
          })

          if (!inviteError) {
            emailSent = true
            console.log('Convite reenviado com sucesso para:', email)
          } else {
            console.warn('Erro ao reenviar convite:', inviteError.message)
            emailError = 'Não foi possível reenviar o convite. Gerando link de recovery...'
          }
        }

        // Se não conseguiu enviar convite ou email já está confirmado, enviar email de recovery
        if (!emailSent) {
          // Enviar email de recovery usando cliente normal (usa template do Supabase)
          const { createClient: createServerClient } = await import('@supabase/supabase-js')
          const tempClient = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
          )
          
          const { error: resetError } = await tempClient.auth.resetPasswordForEmail(email, {
            redirectTo: `${cleanSiteUrl}/auth/reset-password`,
          })

          if (resetError) {
            console.warn('Erro ao enviar email de recovery:', resetError)
            emailError = resetError.message
            
            // Se falhar, gerar link como fallback
            const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
              type: 'recovery',
              email,
              options: {
                redirectTo: `${cleanSiteUrl}/auth/reset-password`,
              },
            })

            if (!linkError && linkData?.properties?.action_link) {
              resetLink = linkData.properties.action_link
              console.log('Link de recovery gerado (copie e envie manualmente ao usuário):', resetLink)
            }
          } else {
            emailSent = true
            console.log('Email de recovery enviado com sucesso para:', email)
          }
        }
      } catch (err: any) {
        console.error('Erro ao processar usuário existente:', err)
        emailError = err.message || 'Erro ao processar usuário existente'
      }
    } else {
      // Usuário novo - tentar enviar convite
      try {
        const { data: inviteData, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
          redirectTo: signupUrl,
          data: {
            nome,
            role,
          },
        })

        if (inviteError) {
          console.warn('Erro ao enviar convite por email:', inviteError)
          
          // Verificar se o erro é porque o usuário já está registrado
          if (inviteError.message.includes('already registered') || 
              inviteError.message.includes('already been registered') ||
              inviteError.message.includes('User already registered') ||
              inviteError.code === 'email_exists') {
            
            // Verificar novamente se o usuário realmente existe no Auth
            try {
              const { data: verifyUsers } = await supabaseAdmin.auth.admin.listUsers()
              const verifyUser = verifyUsers?.users?.find(u => u.email?.toLowerCase() === email.toLowerCase())
              
              if (verifyUser) {
                // Usuário realmente existe, enviar recovery
                emailError = 'Este email já está registrado. Enviando link de recuperação de senha.'
                console.log('Usuário confirmado como existente, gerando link de recovery...')
                
                const { createClient: createServerClient } = await import('@supabase/supabase-js')
                const tempClient = createServerClient(
                  process.env.NEXT_PUBLIC_SUPABASE_URL!,
                  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
                )
                
                const { error: resetError } = await tempClient.auth.resetPasswordForEmail(email, {
                  redirectTo: `${siteUrl}/auth/reset-password`,
                })

                if (resetError) {
                  console.warn('Erro ao enviar email de recovery:', resetError)
                  // Se falhar, gerar link como último recurso
                  const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
                    type: 'recovery',
                    email,
                    options: {
                      redirectTo: `${siteUrl}/auth/reset-password`,
                    },
                  })

                  if (!linkError && linkData?.properties?.action_link) {
                    resetLink = linkData.properties.action_link
                    console.log('Link de recovery gerado (copie e envie manualmente ao usuário):', resetLink)
                  }
                } else {
                  emailSent = true
                  console.log('Email de recovery enviado com sucesso para:', email)
                }
              } else {
                // Usuário não existe, mas o invite falhou - pode ser problema temporário
                emailError = `Erro ao enviar convite: ${inviteError.message}. Tente novamente ou verifique se o email está correto.`
                console.error('Usuário não existe mas invite falhou:', inviteError)
              }
            } catch (verifyErr) {
              emailError = `Erro ao verificar usuário: ${inviteError.message}`
              console.error('Erro ao verificar usuário após invite falhar:', verifyErr)
            }
          } else {
            // Outro tipo de erro no invite
            emailError = inviteError.message
            console.error('Erro desconhecido ao enviar convite:', inviteError)
          }
        } else {
          emailSent = true
          console.log('Email de convite enviado com sucesso para:', email)
        }
      } catch (err: any) {
        console.error('Erro inesperado ao tentar enviar email:', err)
        
        // Verificar se o erro é porque o usuário já está registrado
        if (err.message?.includes('already registered') || 
            err.message?.includes('already been registered') ||
            err.message?.includes('User already registered') ||
            err.code === 'email_exists') {
          emailError = 'Este email já está registrado. Usando link de recuperação de senha como alternativa.'
        } else {
          emailError = err.message || 'Erro desconhecido ao enviar email'
        }
        
        // Gerar link como fallback
        try {
          const { data: linkData } = await supabaseAdmin.auth.admin.generateLink({
            type: 'recovery',
            email,
            options: {
              redirectTo: `${siteUrl}/auth/reset-password`,
            },
          })
          if (linkData?.properties?.action_link) {
            resetLink = linkData.properties.action_link
          }
        } catch (linkErr) {
          console.error('Erro ao gerar link de fallback:', linkErr)
        }
      }
    }

    // Construir mensagem de aviso mais informativa
    let warning = null
    let successMessage = userAlreadyExists 
      ? 'Usuário atualizado com sucesso!' 
      : 'Usuário criado com sucesso!'
    
    if (!emailSent) {
      if (emailError?.includes('já está registrado')) {
        // Se o usuário já existe, não é um erro crítico - apenas informar sobre o link de recovery
        warning = `O usuário já estava registrado no sistema. Um link de recuperação de senha foi gerado e pode ser enviado manualmente ao usuário.`
      } else if (isLocalEnv) {
        warning = `Email pode não ter sido enviado. Em desenvolvimento local, verifique o Inbucket em http://localhost:54324 para ver os emails capturados. Se o Inbucket não estiver rodando, inicie o Supabase local com 'supabase start'.`
      } else {
        warning = `Email não foi enviado automaticamente. Configure SMTP no Supabase Dashboard (Settings > Auth > SMTP Settings) para envio automático de emails. Um link de reset foi gerado e está disponível no console (F12).`
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: successMessage,
      emailSent,
      resetLink: resetLink || undefined, // Link manual se email não foi enviado
      warning,
      emailError: emailError || undefined,
      isLocalEnv,
      inbucketUrl: isLocalEnv ? 'http://localhost:54324' : undefined,
      userAlreadyExists
    })
  } catch (error: any) {
    console.error('Erro inesperado:', error)
    return NextResponse.json(
      { error: `Erro inesperado ao criar usuário: ${error.message || 'Erro desconhecido'}` },
      { status: 500 }
    )
  }
}

