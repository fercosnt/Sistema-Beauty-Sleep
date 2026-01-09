'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Lock, AlertCircle, CheckCircle } from 'lucide-react'
import { Input, Label, GlassCard, GlassButton } from '@beautysmile/components'
import Image from 'next/image'

export default function ResetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isValidatingCode, setIsValidatingCode] = useState(true)

  // Processar code, token ou hash quando a página carregar
  useEffect(() => {
    const processCode = async () => {
      const code = searchParams.get('code')
      const token = searchParams.get('token')
      const errorParam = searchParams.get('error')
      const supabase = createClient()

      // Se houver erro na query string (vindo do redirect), mostrar erro
      if (errorParam && !code && !token) {
        setError(decodeURIComponent(errorParam))
        setIsValidatingCode(false)
        return
      }

      // Verificar se há tokens no hash (#) da URL
      const hash = window.location.hash
      if (hash && !code && !token) {
        const hashParams = new URLSearchParams(hash.substring(1))
        const hashType = hashParams.get('type')
        const accessToken = hashParams.get('access_token')
        
        if (hashType === 'recovery' && accessToken) {
          try {
            const refreshToken = hashParams.get('refresh_token')
            
            // Definir sessão usando tokens do hash
            const { error: sessionError } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken || '',
            })
            
            if (!sessionError) {
              // Limpar hash da URL
              window.history.replaceState({}, '', window.location.pathname + window.location.search)
              setIsValidatingCode(false)
              return
            } else {
              setError('Erro ao processar link de recuperação. Solicite um novo link.')
              setIsValidatingCode(false)
              return
            }
          } catch (err: any) {
            setError(`Erro: ${err.message || 'Erro desconhecido'}`)
            setIsValidatingCode(false)
            return
          }
        }
      }

      if (code) {
        try {
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
          
          if (exchangeError) {
            setError(`Erro ao validar link: ${exchangeError.message}`)
            setIsValidatingCode(false)
            return
          }

          // Verificar se o usuário está autenticado
          const { data: { user } } = await supabase.auth.getUser()
          
          if (!user) {
            setError('Link inválido ou expirado. Solicite um novo link de recuperação.')
            setIsValidatingCode(false)
            return
          }

          setIsValidatingCode(false)
        } catch (err: any) {
          setError(`Erro: ${err.message || 'Erro desconhecido'}`)
          setIsValidatingCode(false)
        }
      } else if (token) {
        // Se tiver token, processar através do endpoint de verify do Supabase
        try {
          const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
          if (!supabaseUrl) {
            setError('Configuração inválida. Contate o suporte.')
            setIsValidatingCode(false)
            return
          }

          // Fazer requisição para verificar o token
          // O Supabase processa o token e cria a sessão automaticamente
          const verifyUrl = `${supabaseUrl}/auth/v1/verify?token=${encodeURIComponent(token)}&type=recovery`
          
          const response = await fetch(verifyUrl, {
            method: 'GET',
            credentials: 'include',
            headers: {
              'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
            },
          })

          // Aguardar um pouco para o Supabase processar
          await new Promise(resolve => setTimeout(resolve, 500))

          // Verificar se está autenticado agora
          const { data: { user }, error: userError } = await supabase.auth.getUser()
          
          if (user && !userError) {
            // Token processado com sucesso, pode redefinir senha
            setIsValidatingCode(false)
          } else {
            setError('Token inválido ou expirado. Solicite um novo link de recuperação.')
            setIsValidatingCode(false)
          }
        } catch (err: any) {
          setError(`Erro ao processar token: ${err.message || 'Erro desconhecido'}`)
          setIsValidatingCode(false)
        }
      } else {
        // Se não tiver code nem token, verificar se já está autenticado
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          setError('Link inválido ou expirado. Solicite um novo link de recuperação.')
        }
        
        setIsValidatingCode(false)
      }
    }

    processCode()
  }, [searchParams])

  // Translate password error messages to friendly Portuguese
  const translatePasswordError = (errorMessage: string): string => {
    // Check if it's a password requirements error
    if (errorMessage.includes('Password should contain at least one character') || 
        errorMessage.includes('abcdefghijklmnopqrstuvwxyz')) {
      return 'A senha deve conter pelo menos uma letra minúscula, uma letra maiúscula, um número e um caractere especial (!@#$%^&*...)'
    }
    
    // Check for other common password errors
    if (errorMessage.includes('Password should be at least')) {
      return 'A senha deve ter pelo menos 6 caracteres'
    }
    
    if (errorMessage.includes('Invalid login credentials') || errorMessage.includes('Invalid credentials')) {
      return 'Credenciais inválidas'
    }
    
    if (errorMessage.includes('same as the old password')) {
      return 'A nova senha deve ser diferente da senha atual'
    }
    
    // Default: return original message if no translation found
    return errorMessage
  }

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string

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
    const { error: resetError } = await supabase.auth.updateUser({
      password: password,
    })

    if (resetError) {
      const friendlyMessage = translatePasswordError(resetError.message)
      setError(friendlyMessage)
      setIsLoading(false)
    } else {
      setSuccess(true)
      setTimeout(() => {
        router.push('/dashboard')
      }, 2000)
    }
  }

  // Mostrar loading enquanto valida o code
  if (isValidatingCode) {
    return (
      <div
        className="min-h-screen bg-gradient-to-br from-accent via-primary to-accent relative"
        style={{
          background: 'linear-gradient(135deg, #35bfad 0%, #00109e 50%, #35bfad 100%)'
        }}
      >
        <div className="absolute inset-0 bg-black/20 pointer-events-none" />
        <div className="relative z-10 flex min-h-screen items-center justify-center">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p>Validando link de recuperação...</p>
          </div>
        </div>
      </div>
    )
  }

  // Mostrar erro se houver e não tiver código válido
  if (error && !searchParams.get('code')) {
    return (
      <div
        className="min-h-screen bg-gradient-to-br from-accent via-primary to-accent relative"
        style={{
          background: 'linear-gradient(135deg, #35bfad 0%, #00109e 50%, #35bfad 100%)'
        }}
      >
        <div className="absolute inset-0 bg-black/20 pointer-events-none" />
        <div className="relative z-10">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="w-full max-w-md space-y-8">
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
              <GlassCard variant="light" blur="lg" className="p-8">
                <GlassCard.Header className="space-y-2 text-center">
                  <GlassCard.Title className="text-2xl font-bold text-white">
                    Link Inválido
                  </GlassCard.Title>
                  <GlassCard.Description className="text-white/90">
                    {error}
                  </GlassCard.Description>
                </GlassCard.Header>
                <GlassCard.Content className="mt-6">
                  <GlassButton
                    onClick={() => router.push('/login')}
                    variant="accent"
                    className="w-full"
                  >
                    Ir para Login
                  </GlassButton>
                </GlassCard.Content>
              </GlassCard>
            </div>
          </div>
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
                  Redefinir Senha
                </GlassCard.Title>
                <GlassCard.Description className="text-white/90">
                  Digite sua nova senha para continuar
                </GlassCard.Description>
              </GlassCard.Header>

              <GlassCard.Content className="mt-6">
                <form onSubmit={handleResetPassword} className="space-y-6">
                  {/* Nova Senha */}
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-white">
                      Nova Senha
                    </Label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <Lock className="h-5 w-5 text-white/50" />
                      </div>
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="new-password"
                        placeholder="••••••••"
                        required
                        disabled={isLoading || success}
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
                        autoComplete="new-password"
                        placeholder="••••••••"
                        required
                        disabled={isLoading || success}
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
                      <span>Senha redefinida com sucesso! Redirecionando...</span>
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
                    {isLoading ? 'Redefinindo...' : success ? 'Sucesso!' : 'Redefinir Senha'}
                  </GlassButton>

                  {/* Link para login */}
                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => router.push('/login')}
                      disabled={isLoading}
                      className="text-sm text-white/80 hover:text-white transition-colors"
                    >
                      Voltar para login
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

