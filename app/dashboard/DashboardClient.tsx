'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { OnboardingTour } from '@/components/OnboardingTour'

interface DashboardClientProps {
  userRole: string | null
  userEmail: string | null
}

function DashboardClientContent({ userRole, userEmail }: DashboardClientProps) {
  const [tourCompleted, setTourCompleted] = useState(true)
  const [userId, setUserId] = useState<string | undefined>()
  const searchParams = useSearchParams()
  const forceRefazerTour = searchParams.get('refazerTour') === '1'

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

  if (!userRole) return null

  const effectiveTourCompleted = forceRefazerTour ? false : tourCompleted

  return (
    <OnboardingTour
      role={userRole as 'admin' | 'equipe' | 'recepcao'}
      tourCompleted={effectiveTourCompleted}
      userId={userId}
    />
  )
}

export default function DashboardClient({ userRole, userEmail }: DashboardClientProps) {
  return (
    <Suspense fallback={null}>
      <DashboardClientContent userRole={userRole} userEmail={userEmail} />
    </Suspense>
  )
}

