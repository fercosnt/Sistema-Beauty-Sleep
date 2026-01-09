'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Mail, Send, CheckCircle, AlertCircle, Sparkles } from 'lucide-react'
import { Input, Label, GlassCard, GlassButton } from '@beautysmile/components'
import Image from 'next/image'
import Link from 'next/link'

export default function MagicLinkEmailPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  const handleSendMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setResult(null)

    try {
      const response = await fetch('/api/test-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          type: 'magic_link',
        }),
      })

      const data = await response.json()

      setResult({
        success: data.success || false,
        message: data.message || data.error || 'Erro ao enviar magic link',
      })
    } catch (error: any) {
      setResult({
        success: false,
        message: `Erro: ${error.message || 'Erro desconhecido'}`,
      })
    } finally {
      setIsLoading(false)
    }
  }

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
                alt="Beauty Sleep"
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
                  <Sparkles className="h-6 w-6" />
                  Magic Link
                </GlassCard.Title>
                <GlassCard.Description className="text-white/90">
                  Envie um link mágico para login sem senha
                </GlassCard.Description>
              </GlassCard.Header>

              <GlassCard.Content className="mt-6">
                <form onSubmit={handleSendMagicLink} className="space-y-6">
                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white">
                      Email do Usuário
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="usuario@email.com"
                      required
                      disabled={isLoading}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    />
                    <p className="text-xs text-white/70">
                      O usuário deve existir e estar com email confirmado. O magic link permite login sem senha.
                    </p>
                  </div>

                  {/* Result Message */}
                  {result && (
                    <div className={`flex items-start gap-2 rounded-lg backdrop-blur-sm border p-3 text-sm ${
                      result.success 
                        ? 'bg-success/20 border-success/30 text-white' 
                        : 'bg-error/20 border-error/30 text-white'
                    }`}>
                      {result.success ? (
                        <CheckCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                      ) : (
                        <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                      )}
                      <span>{result.message}</span>
                    </div>
                  )}

                  {/* Submit Button */}
                  <GlassButton
                    type="submit"
                    variant="accent"
                    size="lg"
                    className="w-full"
                    isLoading={isLoading}
                    disabled={isLoading}
                  >
                    <Send className="h-5 w-5 mr-2" />
                    {isLoading ? 'Enviando...' : 'Enviar Magic Link'}
                  </GlassButton>

                  {/* Back Link */}
                  <div className="text-center">
                    <Link 
                      href="/test-email" 
                      className="text-sm text-white/80 hover:text-white underline"
                    >
                      ← Voltar para Testes de Email
                    </Link>
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

