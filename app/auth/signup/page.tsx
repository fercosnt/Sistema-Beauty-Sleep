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
      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      })

      if (updateError) {
        const friendlyMessage = translatePasswordError(updateError.message)
        setError(friendlyMessage)
        setIsLoading(false)
      } else {
        setSuccess(true)
        setTimeout(() => {
          router.push('/dashboard')
        }, 2000)
      }
    } else {
      // Não temos sessão - tentar diferentes abordagens
      const code = searchParams.get('code')
      const tokenHash = searchParams.get('token_hash')
      
      // Se tiver code mas não criou sessão, tentar novamente
      if (code) {
        const { data: exchangeData, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
        
        if (!exchangeError && exchangeData?.user) {
          // Agora temos sessão, atualizar senha
          const { error: updateError } = await supabase.auth.updateUser({
            password: password,
          })

          if (updateError) {
            const friendlyMessage = translatePasswordError(updateError.message)
            setError(friendlyMessage)
            setIsLoading(false)
          } else {
            setSuccess(true)
            setTimeout(() => {
              router.push('/dashboard')
            }, 2000)
          }
          return
        } else if (exchangeError) {
          setError('Erro ao processar código de convite: ' + exchangeError.message)
          setIsLoading(false)
          return
        }
      }
      
      // Se tiver token_hash, tentar fazer signup com o email e senha
      if (tokenHash) {
        const { data, error: signupError } = await supabase.auth.signUp({
          email: formEmail,
          password: password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          }
        })

        if (signupError) {
          const friendlyMessage = translatePasswordError(signupError.message)
          setError(friendlyMessage)
          setIsLoading(false)
        } else if (data?.user) {
          setSuccess(true)
          setTimeout(() => {
            router.push('/dashboard')
          }, 2000)
        }
      } else {
        // Sem code nem token_hash - pode ser que o usuário esteja acessando diretamente
        // Tentar fazer signup normal (pode funcionar se o usuário foi criado mas não tem senha)
        const { data, error: signupError } = await supabase.auth.signUp({
          email: formEmail,
          password: password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          }
        })

        if (signupError) {
          // Se der erro de "already registered", tentar fazer login e depois atualizar senha
          if (signupError.message.includes('already registered') || 
              signupError.message.includes('already been registered')) {
            // Tentar fazer sign in para ver se consegue autenticar
            const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
              email: formEmail,
              password: password,
            })
            
            if (!signInError && signInData?.user) {
              // Login funcionou, redirecionar
              setSuccess(true)
              setTimeout(() => {
                router.push('/dashboard')
              }, 2000)
            } else {
              setError('Este email já está cadastrado, mas a senha informada está incorreta. Use a opção "Esqueci minha senha" para redefinir.')
              setIsLoading(false)
            }
          } else {
            const friendlyMessage = translatePasswordError(signupError.message)
            setError(friendlyMessage)
            setIsLoading(false)
          }
        } else if (data?.user) {
          setSuccess(true)
          setTimeout(() => {
            router.push('/dashboard')
          }, 2000)
        }
      }
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

