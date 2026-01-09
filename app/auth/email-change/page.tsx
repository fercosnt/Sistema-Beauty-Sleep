'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { MailCheck, AlertCircle, CheckCircle, Loader2 } from 'lucide-react'
import { GlassCard, GlassButton } from '@beautysmile/components'
import Image from 'next/image'

export default function EmailChangePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(true)
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('Processando mudança de email...')
  const [newEmail, setNewEmail] = useState<string | null>(null)

  useEffect(() => {
    const processEmailChange = async () => {
      const supabase = createClient()
      const code = searchParams.get('code')
      const token = searchParams.get('token')
      const tokenHash = searchParams.get('token_hash')
      const type = searchParams.get('type')

      try {
        // Se tiver code, usar exchangeCodeForSession
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code)
          
          if (error) {
            setStatus('error')
            setMessage(`Erro ao processar mudança de email: ${error.message}`)
            setIsLoading(false)
            return
          }

          // Verificar o usuário e obter o novo email
          const { data: { user } } = await supabase.auth.getUser()
          
          if (user) {
            setNewEmail(user.email || null)
            setStatus('success')
            setMessage('Email alterado com sucesso! Redirecionando...')
            
            setTimeout(() => {
              router.push('/dashboard')
            }, 2000)
          } else {
            setStatus('error')
            setMessage('Não foi possível processar a mudança de email.')
          }
        } else if (tokenHash || token) {
          // Se tiver token_hash, verificar se já está processado
          const { data: { user } } = await supabase.auth.getUser()
          
          if (user) {
            setNewEmail(user.email || null)
            setStatus('success')
            setMessage('Email alterado com sucesso! Redirecionando...')
            
            setTimeout(() => {
              router.push('/dashboard')
            }, 2000)
          } else {
            setStatus('error')
            setMessage('Link inválido ou expirado. Solicite uma nova mudança de email.')
          }
        } else {
          setStatus('error')
          setMessage('Link inválido. Verifique se copiou o link completo do email.')
        }
      } catch (err: any) {
        setStatus('error')
        setMessage(`Erro: ${err.message || 'Erro desconhecido'}`)
      } finally {
        setIsLoading(false)
      }
    }

    processEmailChange()
  }, [searchParams, router])

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
                <GlassCard.Title className="text-2xl font-bold text-white flex items-center justify-center gap-2">
                  <MailCheck className="h-6 w-6" />
                  Mudança de Email
                </GlassCard.Title>
                <GlassCard.Description className="text-white/90">
                  Processando alteração do seu endereço de email...
                </GlassCard.Description>
              </GlassCard.Header>

              <GlassCard.Content className="mt-6">
                <div className="space-y-6">
                  {/* Loading State */}
                  {isLoading && (
                    <div className="flex flex-col items-center justify-center py-8">
                      <Loader2 className="h-12 w-12 animate-spin text-white mb-4" />
                      <p className="text-white text-center">{message}</p>
                    </div>
                  )}

                  {/* Success State */}
                  {!isLoading && status === 'success' && (
                    <div className="flex flex-col items-center justify-center py-8 space-y-4">
                      <div className="rounded-full bg-success/20 p-4">
                        <CheckCircle className="h-12 w-12 text-success" />
                      </div>
                      <p className="text-white text-center text-lg font-semibold">
                        Email Alterado!
                      </p>
                      {newEmail && (
                        <div className="bg-white/10 rounded-lg p-4 w-full">
                          <p className="text-white/80 text-sm text-center">
                            Seu novo email é:
                          </p>
                          <p className="text-white text-center font-semibold mt-1">
                            {newEmail}
                          </p>
                        </div>
                      )}
                      <p className="text-white/80 text-center text-sm">
                        {message}
                      </p>
                    </div>
                  )}

                  {/* Error State */}
                  {!isLoading && status === 'error' && (
                    <div className="flex flex-col items-center justify-center py-8 space-y-4">
                      <div className="rounded-full bg-error/20 p-4">
                        <AlertCircle className="h-12 w-12 text-error" />
                      </div>
                      <p className="text-white text-center text-lg font-semibold">
                        Erro ao Alterar Email
                      </p>
                      <p className="text-white/80 text-center text-sm">
                        {message}
                      </p>
                      <GlassButton
                        onClick={() => router.push('/dashboard')}
                        variant="accent"
                        className="w-full mt-4"
                      >
                        Ir para Dashboard
                      </GlassButton>
                    </div>
                  )}
                </div>
              </GlassCard.Content>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  )
}

