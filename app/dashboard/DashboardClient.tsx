'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { OnboardingTour } from '@/components/OnboardingTour'
import { CheckCircle } from 'lucide-react'

interface DashboardClientProps {
  userRole: string | null
  userEmail: string | null
}

export default function DashboardClient({ userRole, userEmail }: DashboardClientProps) {
  const [tourCompleted, setTourCompleted] = useState(true)
  const [userId, setUserId] = useState<string | undefined>()
  const [showSuccessMessage, setShowSuccessMessage] = useState<string | null>(null)
  const searchParams = useSearchParams()
  const router = useRouter()
  const forceRefazerTour = searchParams.get('refazerTour') === '1'
  const emailConfirmed = searchParams.get('email_confirmed')
  const magicLinkLogin = searchParams.get('magic_link_login')

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userEmail) return

      const supabase = createClient()
      const { data: userData } = await supabase
        .from('users')
        .select('id, tour_completed')
        .eq('email', userEmail)
        .single()

      if (userData) {
        setUserId(userData.id)
        setTourCompleted(userData.tour_completed || false)
      }
    }

    fetchUserData()
  }, [userEmail])

  // Mostrar mensagens de sucesso
  useEffect(() => {
    if (emailConfirmed === 'true') {
      setShowSuccessMessage('Email confirmado com sucesso!')
      // Remover parâmetro da URL após 5 segundos
      setTimeout(() => {
        const newUrl = new URL(window.location.href)
        newUrl.searchParams.delete('email_confirmed')
        router.replace(newUrl.pathname + newUrl.search)
        setShowSuccessMessage(null)
      }, 5000)
    } else if (magicLinkLogin === 'true') {
      setShowSuccessMessage('Login realizado com sucesso via Magic Link!')
      // Remover parâmetro da URL após 5 segundos
      setTimeout(() => {
        const newUrl = new URL(window.location.href)
        newUrl.searchParams.delete('magic_link_login')
        router.replace(newUrl.pathname + newUrl.search)
        setShowSuccessMessage(null)
      }, 5000)
    }
  }, [emailConfirmed, magicLinkLogin, router])

  if (!userRole) return null

  const effectiveTourCompleted = forceRefazerTour ? false : tourCompleted

  return (
    <>
      {/* Mensagem de sucesso */}
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-5">
          <div className="bg-success/90 backdrop-blur-sm border border-success/30 rounded-lg shadow-lg p-4 flex items-center gap-3 min-w-[300px] max-w-md">
            <CheckCircle className="h-5 w-5 text-white flex-shrink-0" />
            <p className="text-white text-sm font-medium">{showSuccessMessage}</p>
          </div>
        </div>
      )}

      <OnboardingTour
        role={userRole as 'admin' | 'equipe' | 'recepcao'}
        tourCompleted={effectiveTourCompleted}
        userId={userId}
      />
    </>
  )
}

