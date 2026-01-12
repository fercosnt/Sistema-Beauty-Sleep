'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { login, resetPassword } from './actions'
import { createClient } from '@/lib/supabase/client'
import { AlertCircle, CheckCircle } from 'lucide-react'
import { Input, Label, Checkbox, GlassCard, GlassButton } from '@beautysmile/components'
import Image from 'next/image'

// Função para traduzir erros do Supabase para português
function translateError(error: string): string {
  const errorLower = error.toLowerCase()
  
  if (errorLower.includes('invalid login credentials') || errorLower.includes('invalid credentials')) {
    return 'Email ou senha incorretos. Verifique suas credenciais e tente novamente.'
  }
  if (errorLower.includes('email not confirmed')) {
    return 'Por favor, confirme seu email antes de fazer login.'
  }
  if (errorLower.includes('too many requests')) {
    return 'Muitas tentativas. Aguarde alguns minutos e tente novamente.'
  }
  if (errorLower.includes('user not found')) {
    return 'Usuário não encontrado. Verifique seu email.'
  }
  if (errorLower.includes('password')) {
    return 'Senha incorreta. Verifique e tente novamente.'
  }
  if (errorLower.includes('email')) {
    return 'Email inválido. Verifique e tente novamente.'
  }
  
  // Se não encontrar tradução, retorna a mensagem original
  return error
}

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [showResetPassword, setShowResetPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [rememberMe, setRememberMe] = useState(false)

  useEffect(() => {
    const checkUser = async () => {
      const supabase = createClient()
      
      // Verificar se há parâmetros de invite na query string
      const typeParam = searchParams.get('type')
      const codeParam = searchParams.get('code')
      const tokenHashParam = searchParams.get('token_hash')
      
      // Se for invite na query string, redirecionar para signup
      if ((typeParam === 'invite' || typeParam === 'signup') || tokenHashParam) {
        // Redirecionar para signup com os parâmetros
        const signupUrl = new URL('/auth/signup', window.location.origin)
        if (codeParam) signupUrl.searchParams.set('code', codeParam)
        if (typeParam) signupUrl.searchParams.set('type', typeParam)
        if (tokenHashParam) signupUrl.searchParams.set('token_hash', tokenHashParam)
        router.push(signupUrl.toString())
        return
      }
      
      // Verificar se há tokens de recovery ou invite no hash (#)
      const hash = window.location.hash
      if (hash) {
        const hashParams = new URLSearchParams(hash.substring(1)) // Remove o #
        const type = hashParams.get('type')
        const accessToken = hashParams.get('access_token')
        const error = hashParams.get('error')
        const errorCode = hashParams.get('error_code')
        
        // Se for invite, redirecionar para página de signup
        if (type === 'invite' || type === 'signup') {
          // Limpar hash da URL
          window.history.replaceState({}, '', window.location.pathname + window.location.search)
          
          if (accessToken) {
            // Tem token válido, processar e redirecionar para signup
            try {
              const refreshToken = hashParams.get('refresh_token')
              
              const { error: sessionError } = await supabase.auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken || '',
              })
              
              if (!sessionError) {
                // Redirecionar para signup com sessão válida
                router.push('/auth/signup')
                return
              } else {
                // Se houver erro na sessão, redirecionar mesmo assim para signup
                // que tentará processar o token novamente
                router.push('/auth/signup')
                return
              }
            } catch (err) {
              console.error('Erro ao processar tokens de invite:', err)
              // Redirecionar para signup mesmo com erro
              router.push('/auth/signup')
              return
            }
          } else {
            // Sem token, mas é invite - redirecionar para signup
            router.push('/auth/signup')
            return
          }
        }
        
        // Se for recovery (mesmo com erro), tentar processar
        if (type === 'recovery') {
          if (accessToken) {
            // Tem token válido, processar
            try {
              const refreshToken = hashParams.get('refresh_token')
              
              const { error: sessionError } = await supabase.auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken || '',
              })
              
              if (!sessionError) {
                // Limpar hash e redirecionar para reset-password
                window.history.replaceState({}, '', window.location.pathname + window.location.search)
                router.push('/auth/reset-password')
                return
              }
            } catch (err) {
              console.error('Erro ao processar tokens de recovery:', err)
            }
          }
          
          // Se houver erro, mostrar mensagem e redirecionar para reset-password mesmo assim
          // para que o usuário veja a mensagem de erro na página correta
          if (error) {
            const errorMsg = errorCode === 'otp_expired' 
              ? 'Link expirado. Solicite um novo link de recuperação de senha.'
              : 'Link inválido. Solicite um novo link de recuperação de senha.'
            
            // Limpar hash e redirecionar para reset-password com mensagem de erro
            window.history.replaceState({}, '', window.location.pathname + window.location.search)
            router.push(`/auth/reset-password?error=${encodeURIComponent(errorMsg)}`)
            return
          }
        }
      }
      
      // If logout parameter is present, force sign out first
      const logoutParam = searchParams.get('logout')
      const sessionExpired = searchParams.get('session_expired')
      
      if (logoutParam === 'true' || sessionExpired === 'true') {
        // Ensure complete sign out
        await supabase.auth.signOut()
        // Wait a bit to ensure sign out completes
        await new Promise(resolve => setTimeout(resolve, 100))
        // Force refresh session state
        await supabase.auth.getSession()
        // Remove params from URL
        const newUrl = new URL(window.location.href)
        newUrl.searchParams.delete('logout')
        newUrl.searchParams.delete('session_expired')
        window.history.replaceState({}, '', newUrl.toString())
        return
      }
      
      // Check if user is already logged in (with fresh check)
      // MAS: não redirecionar se houver erro na URL (significa que o login falhou)
      const errorParam = searchParams.get('error')
      if (errorParam) {
        // Se houver erro, não verificar usuário logado (evita loop)
        return
      }
      
      const { data: { user }, error } = await supabase.auth.getUser()
      
      // Only redirect if user exists and no error
      if (user && !error) {
        router.push('/dashboard')
        router.refresh() // Force page refresh to clear any cached state
      }
    }
    
    checkUser()

    // Get error/message from URL params (executar sempre que searchParams mudar)
    const errorParam = searchParams.get('error')
    const messageParam = searchParams.get('message')
    
    if (errorParam) {
      // Traduzir mensagens de erro do Supabase para português
      const decodedError = decodeURIComponent(errorParam)
      const translatedError = translateError(decodedError)
      console.log('[login] Erro encontrado na URL:', decodedError, 'Traduzido:', translatedError)
      setError(translatedError)
      // Limpar o parâmetro da URL após exibir o erro (mas manter o estado)
      setTimeout(() => {
        const newUrl = new URL(window.location.href)
        newUrl.searchParams.delete('error')
        window.history.replaceState({}, '', newUrl.toString())
      }, 100)
    } else {
      // Se não há erro na URL, não limpar o estado de erro (pode ter sido definido pelo handleLogin)
    }
    
    if (messageParam) {
      const decodedMessage = decodeURIComponent(messageParam)
      console.log('[login] Mensagem encontrada na URL:', decodedMessage)
      setMessage(decodedMessage)
      // Limpar o parâmetro da URL após exibir a mensagem
      setTimeout(() => {
        const newUrl = new URL(window.location.href)
        newUrl.searchParams.delete('message')
        window.history.replaceState({}, '', newUrl.toString())
      }, 100)
    }
  }, [router, searchParams])

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setMessage(null)
    
    const formData = new FormData(e.currentTarget)
    
    try {
      await login(formData)
      // Se o login for bem-sucedido, o redirect vai acontecer
      // Não resetar isLoading aqui porque a página vai ser redirecionada
    } catch (err: any) {
      console.error('[login] Erro ao processar login:', err)
      setError(err.message || 'Erro ao fazer login. Tente novamente.')
      setIsLoading(false) // IMPORTANTE: resetar loading em caso de erro
    }
    
    // Se chegou aqui sem redirect, significa que houve erro
    // O erro será mostrado via URL params no useEffect, mas garantimos que isLoading está false
    // Adicionar um timeout de segurança para garantir que isLoading seja resetado
    setTimeout(() => {
      setIsLoading(false)
    }, 3000) // Timeout de segurança de 3 segundos
  }

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    
    const formData = new FormData(e.currentTarget)
    await resetPassword(formData)
    
    setIsLoading(false)
  }

  // Reset Password Form
  if (showResetPassword) {
    return (
      <div 
        className="min-h-screen bg-gradient-to-br from-accent via-primary to-accent"
        style={{
          background: 'linear-gradient(135deg, #35bfad 0%, #00109e 50%, #35bfad 100%)'
        }}
      >
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
                  Recuperar Senha
                </GlassCard.Title>
                <GlassCard.Description className="text-white/90">
                  Digite seu email para receber um link de recuperação
                </GlassCard.Description>
              </GlassCard.Header>

              <GlassCard.Content className="mt-6">
                <form onSubmit={handleResetPassword} className="space-y-6">
                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white">
                      Email
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="seu@email.com"
                      required
                      disabled={isLoading}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    />
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="flex items-center gap-2 rounded-lg bg-error/20 backdrop-blur-sm border border-error/30 p-3 text-sm text-white">
                      <AlertCircle className="h-5 w-5" />
                      <span>{error}</span>
                    </div>
                  )}

                  {/* Success Message */}
                  {message && (
                    <div className="flex items-center gap-2 rounded-lg bg-success/20 backdrop-blur-sm border border-success/30 p-3 text-sm text-white">
                      <CheckCircle className="h-5 w-5" />
                      <span>{message}</span>
                    </div>
                  )}

                  {/* Buttons */}
                  <div className="flex gap-3">
                    <GlassButton
                      type="button"
                      variant="light"
                      onClick={() => setShowResetPassword(false)}
                      disabled={isLoading}
                      className="flex-1"
                    >
                      Voltar
                    </GlassButton>
                    <GlassButton
                      type="submit"
                      variant="accent"
                      isLoading={isLoading}
                      disabled={isLoading}
                      className="flex-1"
                    >
                      {isLoading ? 'Enviando...' : 'Enviar Email'}
                    </GlassButton>
                  </div>
                </form>
              </GlassCard.Content>
            </GlassCard>
          </div>
        </div>
      </div>
    )
  }

  // Login Form
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
                Bem-vindo de volta
              </GlassCard.Title>
              <GlassCard.Description className="text-white/90">
                Entre para acessar sua conta
              </GlassCard.Description>
            </GlassCard.Header>

            <GlassCard.Content className="mt-6">
              <form onSubmit={handleLogin} className="space-y-6">
                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="seu@email.com"
                    required
                    disabled={isLoading}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  />
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white">
                    Senha
                  </Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    required
                    disabled={isLoading}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  />
                </div>

                {/* Error Message */}
                {error && (
                  <div className="flex items-center gap-2 rounded-lg bg-error/20 backdrop-blur-sm border border-error/30 p-3 text-sm text-white">
                    <AlertCircle className="h-5 w-5" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Success Message */}
                {message && (
                  <div className="flex items-center gap-2 rounded-lg bg-success/20 backdrop-blur-sm border border-success/30 p-3 text-sm text-white">
                    <CheckCircle className="h-5 w-5" />
                    <span>{message}</span>
                  </div>
                )}

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember"
                      checked={rememberMe}
                      onCheckedChange={(checked) =>
                        setRememberMe(checked as boolean)
                      }
                      disabled={isLoading}
                      className="border-white/30"
                    />
                    <Label
                      htmlFor="remember"
                      className="text-sm text-white/90 cursor-pointer"
                    >
                      Lembrar de mim
                    </Label>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowResetPassword(true)}
                    disabled={isLoading}
                    className="text-sm text-white hover:text-white/80 transition-colors"
                  >
                    Esqueceu sua senha?
                  </button>
                </div>

                {/* Submit Button */}
                <GlassButton
                  type="submit"
                  variant="accent"
                  size="lg"
                  className="w-full"
                  isLoading={isLoading}
                  disabled={isLoading}
                >
                  {isLoading ? 'Entrando...' : 'Entrar'}
                </GlassButton>
              </form>
            </GlassCard.Content>
          </GlassCard>
        </div>
      </div>
      </div>
    </div>
  )
}
