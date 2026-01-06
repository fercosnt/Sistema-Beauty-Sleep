'use client'

import { useState, useEffect, Suspense } from 'react'
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

function LoginPageContent() {
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
      
      // Get all URL params
      const errorParam = searchParams.get('error')
      const logoutParam = searchParams.get('logout')
      const sessionExpired = searchParams.get('session_expired')
      
      // If there's ANY error or session param, handle it and DON'T redirect
      if (errorParam || logoutParam === 'true' || sessionExpired === 'true') {
        // Force sign out to clear any session
        await supabase.auth.signOut()
        
        // If session_expired or logout, clean up URL after a delay
        if (sessionExpired === 'true' || logoutParam === 'true') {
          await new Promise(resolve => setTimeout(resolve, 300))
          const newUrl = new URL(window.location.href)
          newUrl.searchParams.delete('logout')
          newUrl.searchParams.delete('session_expired')
          window.history.replaceState({}, '', newUrl.toString())
        }
        return // CRITICAL: Don't check user or redirect if there's any error/session param
      }
      
      // Only check user if there are NO error/session params
      const { data: { user }, error } = await supabase.auth.getUser()
      
      // Only redirect if user exists, no error, and verified in users table
      if (user && !error) {
        try {
          const { data: userData } = await supabase
            .from('users')
            .select('id, ativo')
            .eq('email', user.email)
            .single()
          
          // Only redirect if user exists in users table and is active
          if (userData && userData.ativo) {
            // Use window.location for a full page reload
            window.location.href = '/dashboard'
          }
        } catch (err) {
          // If error checking users table, don't redirect
          console.error('Error checking user:', err)
        }
      }
    }
    
    checkUser()

    // Get error/message from URL params
    const errorParam = searchParams.get('error')
    const messageParam = searchParams.get('message')
    if (errorParam) {
      // Traduzir mensagens de erro do Supabase para português
      let translatedError = translateError(errorParam)
      
      // Traduzir erros específicos do sistema
      if (errorParam === 'usuario_nao_autorizado') {
        translatedError = 'Usuário não autorizado. Entre em contato com o administrador.'
      } else if (errorParam === 'config') {
        translatedError = 'Erro de configuração do servidor. Entre em contato com o suporte.'
      }
      
      setError(translatedError)
    }
    if (messageParam) setMessage(messageParam)
  }, [router, searchParams])

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    
    const formData = new FormData(e.currentTarget)
    await login(formData)
    
    setIsLoading(false)
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

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div 
        className="min-h-screen bg-gradient-to-br from-accent via-primary to-accent flex items-center justify-center"
        style={{
          background: 'linear-gradient(135deg, #35bfad 0%, #00109e 50%, #35bfad 100%)'
        }}
      >
        <div className="text-white">Carregando...</div>
      </div>
    }>
      <LoginPageContent />
    </Suspense>
  )
}
