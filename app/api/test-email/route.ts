import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

type EmailType = 'invite' | 'recovery' | 'confirmation' | 'magic_link' | 'email_change'

// Função para gerar senha forte e única para testes
// Usa timestamp + caracteres aleatórios para garantir unicidade e evitar detecção como "pwned"
function generateStrongPassword(): string {
  // Gerar parte única baseada em timestamp e random
  const timestamp = Date.now().toString(36) // Base36 do timestamp
  const randomPart = Math.random().toString(36).substring(2, 10) // 8 caracteres aleatórios
  
  // Caracteres para garantir complexidade
  const uppercase = 'ABCDEFGHJKLMNPQRSTUVWXYZ' // Removido I e O para evitar confusão
  const lowercase = 'abcdefghijkmnpqrstuvwxyz' // Removido l e o
  const numbers = '23456789' // Removido 0, 1 para evitar confusão
  const symbols = '!@#$%&*'
  
  // Combinar partes únicas com caracteres aleatórios
  let password = ''
  
  // Adicionar caracteres obrigatórios
  password += uppercase[Math.floor(Math.random() * uppercase.length)]
  password += lowercase[Math.floor(Math.random() * lowercase.length)]
  password += numbers[Math.floor(Math.random() * numbers.length)]
  password += symbols[Math.floor(Math.random() * symbols.length)]
  
  // Adicionar parte única (timestamp + random)
  password += timestamp.substring(0, 4)
  password += randomPart.substring(0, 4)
  
  // Adicionar mais caracteres aleatórios para chegar a 20+ caracteres
  const allChars = uppercase + lowercase + numbers + symbols
  while (password.length < 20) {
    password += allChars[Math.floor(Math.random() * allChars.length)]
  }
  
  // Embaralhar a senha para não ter padrão previsível
  return password.split('').sort(() => Math.random() - 0.5).join('')
}

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticação
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user?.email) {
      return NextResponse.json({ 
        success: false,
        message: 'Não autenticado' 
      }, { status: 401 })
    }

    // Verificar se é admin
    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('email', user.email)
      .single()

    if (userData?.role !== 'admin') {
      return NextResponse.json({ 
        success: false,
        message: 'Acesso negado. Apenas administradores podem testar emails.' 
      }, { status: 403 })
    }

    const body = await request.json()
    const { email, type }: { email: string; type: EmailType } = body

    if (!email) {
      return NextResponse.json({ 
        success: false,
        message: 'Email é obrigatório' 
      }, { status: 400 })
    }

    if (!type) {
      return NextResponse.json({ 
        success: false,
        message: 'Tipo de email é obrigatório' 
      }, { status: 400 })
    }

    const supabaseAdmin = createAdminClient()
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 
                   (process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('supabase.co') 
                     ? 'https://beauty-sleep.vercel.app' 
                     : 'http://localhost:3000')
    const cleanSiteUrl = siteUrl.replace(/\/$/, '')
    const signupUrl = `${cleanSiteUrl}/auth/signup`

    // Verificar variáveis de ambiente necessárias
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Erro: Variáveis de ambiente do Supabase não configuradas.' 
        },
        { status: 500 }
      )
    }

    let result: { success: boolean; message: string } = { success: false, message: '' }

    switch (type) {
      case 'invite':
        try {
          // Enviar convite
          const { error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
            redirectTo: signupUrl,
            data: {
              nome: 'Usuário de Teste',
              role: 'equipe',
            },
          })

          if (inviteError) {
            result = {
              success: false,
              message: `Erro: ${inviteError.message}`,
            }
          } else {
            result = {
              success: true,
              message: 'Email de convite enviado! Verifique sua caixa de entrada.',
            }
          }
        } catch (err: any) {
          result = {
            success: false,
            message: `Erro: ${err.message || 'Erro desconhecido ao enviar convite'}`,
          }
        }
        break

      case 'recovery':
        try {
          // Enviar recovery
          const { createClient: createServerClient } = await import('@supabase/supabase-js')
          const tempClient = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
          )
          
          const { error: recoveryError } = await tempClient.auth.resetPasswordForEmail(email, {
            redirectTo: `${siteUrl}/auth/reset-password`,
          })

          if (recoveryError) {
            result = {
              success: false,
              message: `Erro: ${recoveryError.message}`,
            }
          } else {
            result = {
              success: true,
              message: 'Email de recuperação enviado! Verifique sua caixa de entrada.',
            }
          }
        } catch (err: any) {
          result = {
            success: false,
            message: `Erro: ${err.message || 'Erro desconhecido ao enviar recovery'}`,
          }
        }
        break

      case 'confirmation':
        // Para confirmation, precisamos criar um usuário novo ou verificar se existe
        try {
          console.log(`[test-email] Tentando enviar email de confirmação para: ${email}`)
          
          // Primeiro, verificar se o usuário já existe
          const { data: existingUsers, error: listError } = await supabaseAdmin.auth.admin.listUsers()
          
          if (listError) {
            console.error('[test-email] Erro ao listar usuários:', listError)
            result = {
              success: false,
              message: `Erro ao verificar usuário: ${listError.message}`,
            }
            break
          }
          
          const existingUser = existingUsers?.users?.find(u => u.email === email)
          
          if (existingUser) {
            // Se o usuário já existe e está confirmado, não podemos reenviar confirmação
            if (existingUser.email_confirmed_at) {
              result = {
                success: false,
                message: `Usuário já existe e está confirmado. Use um email diferente ou delete o usuário primeiro.`,
              }
            } else {
              // Usuário existe mas não está confirmado - tentar reenviar confirmação
              console.log(`[test-email] Usuário existe mas não está confirmado, deletando para recriar...`)
              
              // Primeiro, deletar o usuário não confirmado para poder criar novamente
              const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(existingUser.id)
              
              if (deleteError) {
                console.error('[test-email] Erro ao deletar usuário:', deleteError)
                result = {
                  success: false,
                  message: `Erro ao deletar usuário não confirmado: ${deleteError.message}. Delete manualmente no Supabase Dashboard.`,
                }
                break
              }
              
              console.log(`[test-email] Usuário deletado, criando novamente via signUp...`)
              
              // Agora criar novamente via signUp para enviar email de confirmação
              const { createClient: createSignUpClient } = await import('@supabase/supabase-js')
              const signUpClient = createSignUpClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
              )
              
              const { data: signUpData, error: signUpError } = await signUpClient.auth.signUp({
                email,
                password: generateStrongPassword(), // Senha forte gerada para teste
                options: {
                  emailRedirectTo: `${siteUrl}/auth/callback`,
                },
              })

              if (signUpError) {
                console.error('[test-email] Erro no signUp após deletar:', signUpError)
                result = {
                  success: false,
                  message: `Erro ao criar usuário: ${signUpError.message}. Verifique se "Enable email confirmations" está ativado no Supabase Dashboard.`,
                }
              } else {
                console.log('[test-email] SignUp bem-sucedido após deletar, email de confirmação deve ser enviado')
                result = {
                  success: true,
                  message: 'Email de confirmação enviado! Verifique sua caixa de entrada.',
                }
              }
            }
          } else {
            // Usuário não existe - criar via signUp (envia email de confirmação automaticamente)
            console.log(`[test-email] Usuário não existe, criando novo via signUp...`)
            
            const { createClient: createSignUpClient } = await import('@supabase/supabase-js')
            const signUpClient = createSignUpClient(
              process.env.NEXT_PUBLIC_SUPABASE_URL!,
              process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
            )
            
            // Criar usuário via signUp (envia email de confirmação automaticamente)
            const { data: signUpData, error: signUpError } = await signUpClient.auth.signUp({
              email,
              password: generateStrongPassword(), // Senha forte gerada para teste
              options: {
                emailRedirectTo: `${siteUrl}/auth/callback`,
              },
            })

            if (signUpError) {
              console.error('[test-email] Erro no signUp:', signUpError)
              result = {
                success: false,
                message: `Erro: ${signUpError.message}. Verifique se "Enable email confirmations" está ativado no Supabase Dashboard.`,
              }
            } else {
              console.log('[test-email] SignUp bem-sucedido, email de confirmação deve ser enviado automaticamente')
              result = {
                success: true,
                message: 'Email de confirmação enviado! Verifique sua caixa de entrada.',
              }
            }
          }
        } catch (err: any) {
          console.error('Erro ao processar confirmation:', err)
          result = {
            success: false,
            message: `Erro: ${err.message || 'Erro desconhecido'}`,
          }
        }
        break

      case 'magic_link':
        // Enviar magic link (OTP)
        // IMPORTANTE: signInWithOtp só envia magic link se o usuário existir E estiver confirmado
        // Se o usuário não existir ou não estiver confirmado, pode enviar email de confirmação
        try {
          console.log(`[test-email] Tentando enviar magic link para: ${email}`)
          
          // Verificar se o usuário existe E está confirmado
          const { data: allUsers, error: listError } = await supabaseAdmin.auth.admin.listUsers()
          
          if (listError) {
            console.error('[test-email] Erro ao listar usuários:', listError)
            result = {
              success: false,
              message: `Erro ao verificar usuário: ${listError.message}`,
            }
            break
          }
          
          const userExists = allUsers?.users?.find(u => u.email === email)
          
          if (!userExists) {
            result = {
              success: false,
              message: 'Usuário não existe. Magic Link funciona apenas para usuários já cadastrados e confirmados. Crie o usuário primeiro ou use um email existente.',
            }
            break
          }

          // Verificar se o usuário está confirmado
          if (!userExists.email_confirmed_at) {
            result = {
              success: false,
              message: 'Usuário existe mas não está confirmado. Confirme o email primeiro antes de usar Magic Link. Use o tipo "Confirmation" para enviar email de confirmação.',
            }
            break
          }

          console.log(`[test-email] Usuário existe e está confirmado, enviando magic link...`)

          const { createClient: createMagicClient } = await import('@supabase/supabase-js')
          const magicClient = createMagicClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
          )
          
          // Usar shouldCreateUser: false para garantir que não cria usuário novo
          const { data: magicData, error: magicLinkError } = await magicClient.auth.signInWithOtp({
            email,
            options: {
              emailRedirectTo: `${siteUrl}/auth/callback`,
              shouldCreateUser: false, // Não criar usuário novo
            },
          })

          if (magicLinkError) {
            console.error('[test-email] Erro ao enviar magic link:', magicLinkError)
            result = {
              success: false,
              message: `Erro: ${magicLinkError.message}`,
            }
          } else {
            console.log('[test-email] Magic link enviado com sucesso')
            result = {
              success: true,
              message: 'Magic link enviado! Verifique sua caixa de entrada.',
            }
          }
        } catch (err: any) {
          console.error('[test-email] Erro ao processar magic link:', err)
          result = {
            success: false,
            message: `Erro: ${err.message || 'Erro desconhecido'}`,
          }
        }
        break

      case 'email_change':
        // Para email_change, precisamos que o usuário já exista e esteja autenticado
        // O Supabase requer que o usuário esteja logado para mudar email
        // Vamos tentar usar updateUserByEmail do Admin API para iniciar o processo
        try {
          console.log(`[test-email] Tentando enviar email de mudança de email para: ${email}`)
          
          const { data: allUsers, error: listError } = await supabaseAdmin.auth.admin.listUsers()
          
          if (listError) {
            console.error('[test-email] Erro ao listar usuários:', listError)
            result = {
              success: false,
              message: `Erro ao verificar usuário: ${listError.message}`,
            }
            break
          }
          
          const userExists = allUsers?.users?.find(u => u.email === email)
          
          if (!userExists) {
            result = {
              success: false,
              message: 'Usuário não existe. Crie o usuário primeiro ou use um email existente.',
            }
            break
          }

          // IMPORTANTE: Mudança de email no Supabase requer que o usuário esteja autenticado
          // Os emails só são enviados quando o usuário inicia o processo pela interface
          // Não é possível testar via Admin API sem autenticação do usuário
          
          result = {
            success: false,
            message: `Mudança de email não pode ser testada desta forma. Os emails de mudança de email só são enviados quando o usuário está logado e inicia a mudança pela interface do aplicativo. Para testar: 1) Faça login com o usuário, 2) Use a funcionalidade de mudança de email na interface, 3) Os emails serão enviados automaticamente para o email atual e o novo email.`,
          }
        } catch (err: any) {
          console.error('[test-email] Erro ao processar mudança de email:', err)
          result = {
            success: false,
            message: `Erro: ${err.message || 'Erro desconhecido'}`,
          }
        }
        break

      default:
        result = {
          success: false,
          message: `Tipo de email não suportado: ${type}`,
        }
    }

    // Log para debug
    if (!result.success) {
      console.log(`[test-email] Erro ao enviar ${type} para ${email}:`, result.message)
    }

    // Sempre retornar resultado, mesmo se for erro
    // Não usar status 500 para erros de negócio (já tratados)
    return NextResponse.json(result, { 
      status: result.success ? 200 : 400 
    })
  } catch (error: any) {
    console.error('Erro inesperado ao testar email:', error)
    return NextResponse.json(
      { 
        success: false,
        message: `Erro inesperado: ${error.message || 'Erro desconhecido'}` 
      },
      { status: 500 }
    )
  }
}

