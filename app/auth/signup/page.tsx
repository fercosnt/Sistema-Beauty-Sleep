'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Lock, AlertCircle, CheckCircle, User, Mail } from 'lucide-react'
import { Input, Label, GlassCard, GlassButton } from '@beautysmile/components'
import Image from 'next/image'

export default function SignupPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [email, setEmail] = useState<string>('')
  const [emailFromToken, setEmailFromToken] = useState<string>('') // Email vindo do token (não editável)
  const [isValidatingToken, setIsValidatingToken] = useState(true)

  // Verificar token do convite na URL
  useEffect(() => {
    const validateInvite = async () => {
      const supabase = createClient()
      const code = searchParams.get('code')
      const tokenHash = searchParams.get('token_hash')
      const type = searchParams.get('type')

      console.log('[signup] Parâmetros da URL:', { code: code ? 'presente' : 'ausente', tokenHash: tokenHash ? 'presente' : 'ausente', type })

      // Fluxo principal: Se tiver code, trocar por sessão (Supabase já processou o token_hash)
      if (code) {
        console.log('[signup] Processando code...')
        const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
        if (!exchangeError && data?.user) {
          const userEmail = data.user.email || ''
          console.log('[signup] Code processado com sucesso, email:', userEmail)
          setEmail(userEmail)
          setEmailFromToken(userEmail) // Marcar como email do token (não editável)
          setIsValidatingToken(false)
          return
        } else if (exchangeError) {
          console.error('[signup] Erro ao processar code:', exchangeError)
          setError('Erro ao processar convite: ' + exchangeError.message)
          setIsValidatingToken(false)
          return
        }
      }

      // Se tiver token_hash diretamente (sem code), o Supabase ainda não processou
      // Isso pode acontecer se o usuário acessar o link diretamente
      if (tokenHash && type === 'invite' && !code) {
        console.log('[signup] Token_hash encontrado, verificando sessão...')
        // Verificar se já temos uma sessão válida
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        
        if (user && !userError) {
          const userEmail = user.email || ''
          console.log('[signup] Sessão encontrada, email:', userEmail)
          setEmail(userEmail)
          setEmailFromToken(userEmail) // Marcar como email do token (não editável)
          setIsValidatingToken(false)
          return
        }

        console.log('[signup] Sem sessão, redirecionando para callback...')
        // Se não tiver sessão, redirecionar para callback que processará o token_hash
        // O callback redirecionará de volta para signup com code
        const callbackUrl = `/auth/callback?token_hash=${tokenHash}&type=invite`
        window.location.href = callbackUrl
        return
      }

      // Verificar se já temos uma sessão válida (usuário já autenticado)
      console.log('[signup] Verificando sessão existente...')
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      if (session?.user && !sessionError) {
        const userEmail = session.user.email || ''
        console.log('[signup] Sessão encontrada, email:', userEmail)
        setEmail(userEmail)
        setEmailFromToken(userEmail) // Marcar como email do token (não editável)
        setIsValidatingToken(false)
        return
      }
      
      console.log('[signup] Nenhum token ou sessão encontrada. Permitindo cadastro manual.')

      // Se não tiver token válido, verificar se há email na URL
      const emailParam = searchParams.get('email')
      if (emailParam) {
        setEmail(emailParam)
        setEmailFromToken(emailParam) // Se veio por parâmetro, também não é editável
      }

      // Verificar se há erro na URL
      const errorParam = searchParams.get('error')
      if (errorParam) {
        const errorMessage = decodeURIComponent(errorParam)
        // Só mostrar erro se for um erro específico, não erro genérico
        if (!errorMessage.includes('inválido') && !errorMessage.includes('expirado')) {
          setError(errorMessage)
        }
      }

      // Se não tiver code, token_hash, nem sessão, não bloquear - pode ser acesso direto
      // O usuário pode tentar fazer cadastro mesmo assim
      // Não mostrar erro aqui - deixar o usuário tentar fazer o cadastro
      setIsValidatingToken(false)
    }

    validateInvite()
  }, [searchParams])

  // Traduzir erros de senha para português
  const translatePasswordError = (errorMessage: string): string => {
    if (errorMessage.includes('Password should contain at least one character') || 
        errorMessage.includes('abcdefghijklmnopqrstuvwxyz')) {
      return 'A senha deve conter pelo menos uma letra minúscula, uma letra maiúscula, um número e um caractere especial (!@#$%^&*...)'
    }
    
    if (errorMessage.includes('Password should be at least')) {
      return 'A senha deve ter pelo menos 6 caracteres'
    }
    
    if (errorMessage.includes('Invalid login credentials') || errorMessage.includes('Invalid credentials')) {
      return 'Credenciais inválidas'
    }
    
    if (errorMessage.includes('same as the old password')) {
      return 'A nova senha deve ser diferente da senha atual'
    }
    
    if (errorMessage.includes('User already registered')) {
      return 'Este email já está cadastrado. Faça login em vez de criar uma nova conta.'
    }

    if (errorMessage.includes('expired') || errorMessage.includes('invalid')) {
      return 'O link de convite expirou ou é inválido. Solicite um novo convite.'
    }
    
    return errorMessage
  }

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string
    const formEmail = formData.get('email') as string || email

    if (!formEmail) {
      setError('Email é obrigatório')
      setIsLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem')
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres')
      setIsLoading(false)
      return
    }

    const supabase = createClient()
    
    // Verificar se já temos uma sessão (usuário convidado)
    const { data: { session } } = await supabase.auth.getSession()
    
    if (session?.user) {
      // Usuário já está autenticado via convite, apenas atualizar senha
      console.log('[signup] Usuário tem sessão, atualizando senha...')
      console.log('[signup] Email confirmado?', session.user.email_confirmed_at ? 'Sim' : 'Não')
      
      console.log('[signup] Atualizando senha para usuário:', session.user.id, session.user.email)
      
      const { data: updateData, error: updateError } = await supabase.auth.updateUser({
        password: password,
        email: session.user.email, // Garantir que o email está presente
      })

      if (updateError) {
        console.error('[signup] Erro ao atualizar senha:', updateError)
        const friendlyMessage = translatePasswordError(updateError.message)
        setError(friendlyMessage)
        setIsLoading(false)
        return
      }

      console.log('[signup] Senha atualizada com sucesso!')
      console.log('[signup] Dados retornados:', {
        user: updateData?.user?.id,
        email: updateData?.user?.email,
        emailConfirmed: updateData?.user?.email_confirmed_at ? 'Sim' : 'Não'
      })
      
      // Aguardar um pouco para garantir que a atualização foi processada
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Verificar novamente o usuário após atualização
      const { data: { user: updatedUser }, error: getUserError } = await supabase.auth.getUser()
      
      if (getUserError) {
        console.error('[signup] Erro ao buscar usuário após atualização:', getUserError)
        setError('Erro ao verificar cadastro. Por favor, tente fazer login.')
        setIsLoading(false)
        return
      }
      
      console.log('[signup] Estado do usuário após atualização:', {
        id: updatedUser?.id,
        email: updatedUser?.email,
        emailConfirmed: updatedUser?.email_confirmed_at ? 'Sim' : 'Não',
        hasPassword: 'Sim' // Assumimos que tem senha se updateUser não deu erro
      })
      
      // Se o email não estiver confirmado, confirmar via API
      if (!updatedUser?.email_confirmed_at) {
        console.log('[signup] Email não confirmado, confirmando via API...')
        try {
          const confirmResponse = await fetch('/api/auth/confirm-email-after-signup', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          })
          
          const confirmData = await confirmResponse.json()
          console.log('[signup] Resposta da API de confirmação:', confirmData)
          
          if (confirmResponse.ok && confirmData.success) {
            console.log('[signup] Email confirmado com sucesso via API')
            // Aguardar um pouco para a confirmação ser processada
            await new Promise(resolve => setTimeout(resolve, 500))
            // Atualizar a sessão para refletir a confirmação
            await supabase.auth.refreshSession()
          } else {
            console.warn('[signup] Erro ao confirmar email via API:', confirmData.error)
            // Continuar mesmo assim - o usuário pode fazer login depois
          }
        } catch (confirmError) {
          console.error('[signup] Erro ao chamar API de confirmação:', confirmError)
          // Continuar mesmo assim
        }
      }
      
      // Verificar novamente a sessão antes de redirecionar
      const { data: { session: finalSession } } = await supabase.auth.getSession()
      if (!finalSession) {
        console.error('[signup] Sessão perdida após atualizar senha!')
        setError('Erro ao finalizar cadastro. Por favor, faça login com suas credenciais.')
        setIsLoading(false)
        return
      }
      
      console.log('[signup] Sessão final válida, redirecionando para dashboard...')
      setSuccess(true)
      // Redirecionar imediatamente sem delay para evitar problemas
      router.push('/dashboard')
      router.refresh() // Forçar refresh para garantir que a sessão seja reconhecida
      return
    }

    // Não temos sessão - tentar obter sessão via code ou token_hash
    const code = searchParams.get('code')
    const tokenHash = searchParams.get('token_hash')
    
    // Se tiver code, tentar trocar por sessão
    if (code) {
      console.log('[signup] Tentando trocar code por sessão...')
      const { data: exchangeData, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
      
      if (!exchangeError && exchangeData?.user) {
        console.log('[signup] Sessão obtida via code, atualizando senha...')
        console.log('[signup] Email confirmado?', exchangeData.user.email_confirmed_at ? 'Sim' : 'Não')
        
        // Agora temos sessão, atualizar senha
        const { error: updateError } = await supabase.auth.updateUser({
          password: password,
          email: exchangeData.user.email, // Garantir que o email está presente
        })

        if (updateError) {
          console.error('[signup] Erro ao atualizar senha após exchange:', updateError)
          const friendlyMessage = translatePasswordError(updateError.message)
          setError(friendlyMessage)
          setIsLoading(false)
        } else {
          console.log('[signup] Senha atualizada com sucesso após exchange!')
          
          // Verificar se o email está confirmado após atualizar senha
          const { data: { user: updatedUser } } = await supabase.auth.getUser()
          console.log('[signup] Email confirmado após atualização?', updatedUser?.email_confirmed_at ? 'Sim' : 'Não')
          
          // Se o email não estiver confirmado, confirmar via API
          if (!updatedUser?.email_confirmed_at) {
            console.log('[signup] Email não confirmado, confirmando via API...')
            try {
              const confirmResponse = await fetch('/api/auth/confirm-email-after-signup', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
              })
              
              const confirmData = await confirmResponse.json()
              
              if (confirmResponse.ok && confirmData.success) {
                console.log('[signup] Email confirmado com sucesso via API')
                // Atualizar a sessão para refletir a confirmação
                await supabase.auth.refreshSession()
              } else {
                console.warn('[signup] Erro ao confirmar email via API:', confirmData.error)
              }
            } catch (confirmError) {
              console.error('[signup] Erro ao chamar API de confirmação:', confirmError)
            }
          }
          
          // Aguardar um pouco para garantir que a atualização foi processada
          await new Promise(resolve => setTimeout(resolve, 500))
          
          // Verificar novamente a sessão antes de redirecionar
          const { data: { session: finalSession } } = await supabase.auth.getSession()
          if (!finalSession) {
            console.error('[signup] Sessão perdida após atualizar senha!')
            setError('Erro ao finalizar cadastro. Por favor, faça login com suas credenciais.')
            setIsLoading(false)
            return
          }
          
          setSuccess(true)
          // Redirecionar imediatamente sem delay para evitar problemas
          router.push('/dashboard')
          router.refresh() // Forçar refresh para garantir que a sessão seja reconhecida
        }
        return
      } else if (exchangeError) {
        console.error('[signup] Erro ao trocar code por sessão:', exchangeError)
        setError('Erro ao processar código de convite: ' + exchangeError.message + '. Por favor, use o link de convite novamente.')
        setIsLoading(false)
        return
      }
    }
    
    // Se tiver token_hash mas não code, redirecionar para callback
    if (tokenHash && !code) {
      console.log('[signup] Token_hash encontrado sem code, redirecionando para callback...')
      setError('Processando convite... Por favor, aguarde.')
      const callbackUrl = `/auth/callback?token_hash=${tokenHash}&type=invite`
      window.location.href = callbackUrl
      return
    }

    // Sem sessão, code ou token_hash válido
    // Se o email foi preenchido automaticamente (veio de token), significa que deveria ter sessão
    if (emailFromToken) {
      console.error('[signup] Email veio de token mas não há sessão válida')
      setError('Link de convite inválido ou expirado. Por favor, solicite um novo convite ou use o link do email novamente.')
      setIsLoading(false)
      return
    }

    // Caso contrário, tentar fazer signup normal (cadastro direto, sem convite)
    console.log('[signup] Tentando cadastro direto (sem convite)...')
    const { data, error: signupError } = await supabase.auth.signUp({
      email: formEmail,
      password: password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      }
    })

    if (signupError) {
      console.error('[signup] Erro no signup:', signupError)
      // Se der erro de "already registered", o usuário já existe
      if (signupError.message.includes('already registered') || 
          signupError.message.includes('already been registered')) {
        setError('Este email já está cadastrado. Se você foi convidado, use o link do email de convite. Caso contrário, faça login ou use "Esqueci minha senha".')
      } else {
        const friendlyMessage = translatePasswordError(signupError.message)
        setError(friendlyMessage)
      }
      setIsLoading(false)
    } else if (data?.user) {
      console.log('[signup] Cadastro direto realizado com sucesso!')
      setSuccess(true)
      setTimeout(() => {
        router.push('/dashboard')
      }, 2000)
    } else {
      setError('Erro desconhecido ao criar conta. Tente novamente.')
      setIsLoading(false)
    }
  }

  if (isValidatingToken) {
    return (
      <div 
        className="min-h-screen bg-gradient-to-br from-accent via-primary to-accent flex items-center justify-center"
        style={{
          background: 'linear-gradient(135deg, #35bfad 0%, #00109e 50%, #35bfad 100%)'
        }}
      >
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Validando convite...</p>
        </div>
      </div>
    )
  }

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-accent via-primary to-accent relative"
      style={{
        background: 'linear-gradient(135deg, #35bfad 0%, #00109e 50%, #35bfad 100%)'
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/20 pointer-events-none" />
      
      <div className="relative z-10">
        <div className="flex min-h-screen items-center justify-center p-4">
          <div className="w-full max-w-md space-y-8">
            {/* Logo */}
            <div className="flex justify-center">
              <Image
                src="/beauty-smile-logo.svg"
                alt="Beauty Smile"
                width={300}
                height={60}
                className="h-16 w-auto"
                style={{ filter: 'brightness(0) invert(1)' }}
              />
            </div>

            {/* Glass Card */}
            <GlassCard variant="light" blur="lg" className="p-8">
              <GlassCard.Header className="space-y-2 text-center">
                <GlassCard.Title className="text-2xl font-bold text-white">
                  Complete seu Cadastro
                </GlassCard.Title>
                <GlassCard.Description className="text-white/90">
                  Você foi convidado para o sistema. Defina sua senha para começar.
                </GlassCard.Description>
              </GlassCard.Header>

              <GlassCard.Content className="mt-6">
                <form onSubmit={handleSignup} className="space-y-6">
                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white">
                      Email
                    </Label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <Mail className="h-5 w-5 text-white/50" />
                      </div>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="seu@email.com"
                        required
                        disabled={isLoading || !!emailFromToken}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50 pl-10"
                      />
                    </div>
                  </div>

                  {/* Senha */}
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-white">
                      Senha
                    </Label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <Lock className="h-5 w-5 text-white/50" />
                      </div>
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        required
                        disabled={isLoading}
                        minLength={6}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50 pl-10"
                      />
                    </div>
                    <p className="text-xs text-white/70">
                      Mínimo de 6 caracteres
                    </p>
                  </div>

                  {/* Confirmar Senha */}
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-white">
                      Confirmar Senha
                    </Label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <Lock className="h-5 w-5 text-white/50" />
                      </div>
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                        required
                        disabled={isLoading}
                        minLength={6}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50 pl-10"
                      />
                    </div>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="flex items-center gap-2 rounded-lg bg-error/20 backdrop-blur-sm border border-error/30 p-3 text-sm text-white">
                      <AlertCircle className="h-5 w-5 flex-shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  {/* Success Message */}
                  {success && (
                    <div className="flex items-center gap-2 rounded-lg bg-success/20 backdrop-blur-sm border border-success/30 p-3 text-sm text-white">
                      <CheckCircle className="h-5 w-5 flex-shrink-0" />
                      <span>Cadastro concluído com sucesso! Redirecionando...</span>
                    </div>
                  )}

                  {/* Submit Button */}
                  <GlassButton
                    type="submit"
                    variant="accent"
                    size="lg"
                    className="w-full"
                    isLoading={isLoading}
                    disabled={isLoading || success}
                  >
                    {isLoading ? 'Criando conta...' : success ? 'Sucesso!' : 'Criar Conta'}
                  </GlassButton>

                  {/* Link para login */}
                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => router.push('/login')}
                      disabled={isLoading}
                      className="text-sm text-white/80 hover:text-white transition-colors"
                    >
                      Já tem uma conta? Fazer login
                    </button>
                  </div>
                </form>
              </GlassCard.Content>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  )
}

