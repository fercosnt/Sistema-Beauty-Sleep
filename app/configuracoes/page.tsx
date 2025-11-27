'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { startTour } from '@/components/OnboardingTour'
import { useRouter } from 'next/navigation'

export default function ConfiguracoesPage() {
  const [user, setUser] = useState<any>(null)
  const [userData, setUserData] = useState<any>(null)
  const router = useRouter()

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

  const handleRefazerTour = () => {
    if (userData?.role) {
      startTour(userData.role as 'admin' | 'equipe' | 'recepcao')
    }
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Configurações</h1>
        <p className="mt-2 text-gray-600">Gerencie suas configurações pessoais</p>
      </div>

      <div className="space-y-6">
        {/* Perfil */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Perfil</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nome</label>
              <p className="mt-1 text-gray-900">{userData?.nome || 'N/A'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <p className="mt-1 text-gray-900">{userData?.email || user?.email || 'N/A'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Role</label>
              <p className="mt-1 text-gray-900 capitalize">{userData?.role || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Tour Guiado */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Tour Guiado</h2>
          <p className="text-gray-600 mb-4">
            Revise o tour guiado para relembrar as funcionalidades do sistema.
          </p>
          <button
            onClick={handleRefazerTour}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Refazer Tour Guiado
          </button>
        </div>

        {/* Gestão de Tags */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Gestão de Tags</h2>
          <p className="text-gray-600 mb-4">
            Gerencie as tags usadas para categorizar e organizar pacientes.
          </p>
          <button
            onClick={() => router.push('/configuracoes/tags')}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Gerenciar Tags
          </button>
        </div>
      </div>
    </div>
  )
}

