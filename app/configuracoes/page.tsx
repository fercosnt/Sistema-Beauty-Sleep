'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { startTour } from '@/components/OnboardingTour'
import { useRouter } from 'next/navigation'
import { SettingsTemplate } from '@beautysmile/templates'
import { User, PlayCircle, Tag } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Label } from '@/components/ui/Label'
import ContentContainer from '@/components/ui/ContentContainer'

export default function ConfiguracoesPage() {
  const [user, setUser] = useState<any>(null)
  const [userData, setUserData] = useState<any>(null)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient()
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (authUser?.email) {
        setUser(authUser)
        const { data } = await supabase
          .from('users')
          .select('*')
          .eq('email', authUser.email)
          .single()
        if (data) {
          setUserData(data)
        }
      }
    }
    fetchUser()
  }, [])

  // Tour da página Configurações (admin/equipe)
  useEffect(() => {
    if (!userData?.role) return
    const flow = searchParams.get('tourFlow') as 'admin' | 'equipe' | null
    if (!flow) return

    import('@/components/OnboardingTour').then(({ startConfigTour }) => {
      startConfigTour(userData.role as 'admin' | 'equipe' | 'recepcao', flow)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, userData?.role])

  const handleRefazerTour = async () => {
    if (!userData?.role || !userData?.id) return

    try {
      const supabase = createClient()

      // Marcar tour como não concluído para forçar novo tour no dashboard
      await supabase
        .from('users')
        .update({ tour_completed: false })
        .eq('id', userData.id)

      // Redirecionar para o dashboard com flag para forçar o tour
      router.push('/dashboard?refazerTour=1')
    } catch (error) {
      console.error('Erro ao reconfigurar tour guiado:', error)
      // Fallback: ainda assim tenta iniciar o tour na página atual
      startTour(userData.role as 'admin' | 'equipe' | 'recepcao')
    }
  }

  const sections = [
    {
      id: 'perfil',
      title: 'Perfil',
      description: 'Informações da sua conta',
      icon: <User className="h-5 w-5" />,
      content: (
        <div className="space-y-4" data-tour="config-perfil">
          <div className="space-y-2">
            <Label className="text-white drop-shadow" htmlFor="userName">Nome</Label>
            <div className="bg-white border border-gray-300 rounded-lg px-4 py-3">
              <p className="text-gray-900">{userData?.nome || 'N/A'}</p>
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-white drop-shadow" htmlFor="userEmail">Email</Label>
            <div className="bg-white border border-gray-300 rounded-lg px-4 py-3">
              <p className="text-gray-900">{userData?.email || user?.email || 'N/A'}</p>
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-white drop-shadow" htmlFor="userRole">Função</Label>
            <div className="bg-white border border-gray-300 rounded-lg px-4 py-3">
              <p className="text-gray-900 capitalize">{userData?.role || 'N/A'}</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'tour',
      title: 'Tour Guiado',
      description: 'Revise o tour guiado para relembrar as funcionalidades do sistema',
      icon: <PlayCircle className="h-5 w-5" />,
      content: (
        <div className="space-y-4" data-tour="config-tour">
          <p className="text-white/70">
            O tour guiado ajuda você a entender melhor as funcionalidades do sistema Beauty Sleep.
            Clique no botão abaixo para iniciar o tour novamente.
          </p>
          <Button
            variant="primary"
            onClick={handleRefazerTour}
            disabled={!userData?.role}
            className="bg-white/10 hover:bg-white/20 border border-white/30 text-white backdrop-blur-md"
          >
            Refazer Tour Guiado
          </Button>
        </div>
      ),
    },
    {
      id: 'tags',
      title: 'Gestão de Tags',
      description: 'Gerencie as tags usadas para categorizar e organizar pacientes',
      icon: <Tag className="h-5 w-5" />,
      content: (
        <div className="space-y-4">
          <p className="text-white/70">
            As tags ajudam a organizar e categorizar pacientes de forma eficiente.
            Gerencie todas as tags disponíveis no sistema.
          </p>
          <Button
            variant="primary"
            onClick={() => router.push('/configuracoes/tags')}
            className="bg-white/10 hover:bg-white/20 border border-white/30 text-white backdrop-blur-md"
          >
            Gerenciar Tags
          </Button>
        </div>
      ),
    },
  ]

  return (
    <ContentContainer>
      <SettingsTemplate
        title="Configurações"
        description="Gerencie suas configurações pessoais e preferências do sistema"
        sections={sections}
        layout="stacked"
        showSaveButton={false}
      />
    </ContentContainer>
  )
}

