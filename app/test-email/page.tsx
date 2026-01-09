'use client'

import { Mail, UserPlus, KeyRound, ShieldCheck, Sparkles, MailCheck, ArrowRight } from 'lucide-react'
import { GlassCard, GlassButton } from '@beautysmile/components'
import Image from 'next/image'
import Link from 'next/link'

const emailTypes = [
  {
    id: 'invite',
    title: 'Convite',
    description: 'Envie convites para novos usuários criarem suas contas',
    icon: UserPlus,
    href: '/test-email/invite',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'recovery',
    title: 'Recuperação de Senha',
    description: 'Envie emails de recuperação de senha para usuários',
    icon: KeyRound,
    href: '/test-email/recovery',
    color: 'from-orange-500 to-red-500',
  },
  {
    id: 'confirmation',
    title: 'Confirmação de Email',
    description: 'Envie emails de confirmação para verificar endereços de email',
    icon: ShieldCheck,
    href: '/test-email/confirmation',
    color: 'from-green-500 to-emerald-500',
  },
  {
    id: 'magic_link',
    title: 'Magic Link',
    description: 'Envie links mágicos para login sem senha',
    icon: Sparkles,
    href: '/test-email/magic-link',
    color: 'from-purple-500 to-pink-500',
  },
  {
    id: 'email_change',
    title: 'Mudança de Email',
    description: 'Teste o processo de mudança de endereço de email',
    icon: MailCheck,
    href: '/test-email/email-change',
    color: 'from-indigo-500 to-blue-500',
  },
]

export default function TestEmailPage() {

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
          <div className="w-full max-w-2xl space-y-8">
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
                  <Mail className="h-6 w-6" />
                  Teste de Envio de Emails
                </GlassCard.Title>
                <GlassCard.Description className="text-white/90">
                  Escolha um tipo de email para testar os templates configurados no Supabase
                </GlassCard.Description>
              </GlassCard.Header>

              <GlassCard.Content className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {emailTypes.map((type) => {
                    const Icon = type.icon
                    return (
                      <Link
                        key={type.id}
                        href={type.href}
                        className="group"
                      >
                        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6 hover:bg-white/20 hover:border-white/30 transition-all duration-200 h-full">
                          <div className="flex items-start gap-4">
                            <div className={`p-3 rounded-lg bg-gradient-to-br ${type.color} flex-shrink-0`}>
                              <Icon className="h-6 w-6 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-white mb-1 group-hover:text-white/90">
                                {type.title}
                              </h3>
                              <p className="text-sm text-white/70 mb-3">
                                {type.description}
                              </p>
                              <div className="flex items-center text-xs text-white/60 group-hover:text-white/80">
                                <span>Testar</span>
                                <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>

                {/* Informações */}
                <div className="mt-6 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4 space-y-2">
                  <p className="text-sm font-semibold text-white">ℹ️ Informações:</p>
                  <ul className="text-xs text-white/80 space-y-1 list-disc list-inside">
                    <li>Os emails serão enviados usando os templates configurados no Supabase</li>
                    <li>Verifique sua caixa de entrada (e spam) após alguns segundos</li>
                    <li>Em desenvolvimento local, verifique o Inbucket em http://localhost:54324</li>
                    <li>Certifique-se de que o SMTP está configurado no Supabase Dashboard</li>
                  </ul>
                </div>
              </GlassCard.Content>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  )
}

