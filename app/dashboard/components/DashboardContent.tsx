'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { DashboardAdminTemplate } from '@beautysmile/templates/admin/DashboardAdminTemplate'
import { LayoutDashboard, Users, UserCog, FileText } from 'lucide-react'
import BuscaGlobal from '@/components/ui/BuscaGlobal'
import DashboardTabs from './DashboardTabs'
import KPICards from './KPICards'
import WidgetAcoesPendentes from './WidgetAcoesPendentes'
import ExamesRecentes from './ExamesRecentes'
import DashboardRonco from './DashboardRonco'
import DashboardApneia from './DashboardApneia'
import TempoMedioTratamento from './TempoMedioTratamento'

interface DashboardContentProps {
  userRole: string | null
}

export default function DashboardContent({ userRole }: DashboardContentProps) {
  const [activeTab, setActiveTab] = useState<'geral' | 'ronco' | 'apneia'>('geral')
  const [userData, setUserData] = useState<any>(null)
  const [kpiMetrics, setKpiMetrics] = useState<any[]>([])
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const fetchUserData = async () => {
      const supabase = createClient()
      const { data: { user: authUser } } = await supabase.auth.getUser()
      
      if (authUser?.email) {
        const { data: userDataFromDb } = await supabase
          .from('users')
          .select('*')
          .eq('email', authUser.email)
          .single()
        
        if (userDataFromDb) {
          setUserData(userDataFromDb)
        }
      }
    }

    const fetchKPIData = async () => {
      try {
        const supabase = createClient()

        // Total de Pacientes
        const { count: totalPacientes } = await supabase
          .from('pacientes')
          .select('*', { count: 'exact', head: true })

        // Leads para Converter
        const { count: leadsParaConverter } = await supabase
          .from('pacientes')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'lead')

        // Exames Realizados
        const { count: examesRealizados } = await supabase
          .from('exames')
          .select('*', { count: 'exact', head: true })

        // Taxa de Conversão
        const { count: totalLeads } = await supabase
          .from('pacientes')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'lead')

        const { count: leadsConvertidos } = await supabase
          .from('pacientes')
          .select('*', { count: 'exact', head: true })
          .in('status', ['ativo', 'finalizado'])

        const taxaConversao = totalLeads && totalLeads > 0
          ? ((leadsConvertidos || 0) / totalLeads) * 100
          : 0

        setKpiMetrics([
          {
            title: 'Total de Pacientes',
            value: (totalPacientes || 0).toLocaleString('pt-BR'),
            icon: <Users className="h-5 w-5" />,
          },
          {
            title: 'Leads para Converter',
            value: (leadsParaConverter || 0).toLocaleString('pt-BR'),
            icon: <Users className="h-5 w-5" />,
          },
          {
            title: 'Exames Realizados',
            value: (examesRealizados || 0).toLocaleString('pt-BR'),
            icon: <FileText className="h-5 w-5" />,
          },
          {
            title: 'Taxa de Conversão',
            value: `${taxaConversao.toFixed(1)}%`,
            trend: { value: Math.abs(taxaConversao - 70), isPositive: taxaConversao >= 70 },
          },
        ])
      } catch (error) {
        console.error('Erro ao buscar dados de KPI:', error)
      }
    }

    fetchUserData()
    fetchKPIData()
  }, [])

  const isAdmin = userRole === 'admin'
  const userName = userData?.nome || userData?.email || 'Usuário'

  const navItems = [
    { 
      label: 'Dashboard', 
      icon: <LayoutDashboard className="h-5 w-5" />,
      isActive: pathname === '/dashboard',
      onClick: () => router.push('/dashboard')
    },
    { 
      label: 'Pacientes', 
      icon: <Users className="h-5 w-5" />,
      isActive: pathname?.startsWith('/pacientes'),
      onClick: () => router.push('/pacientes')
    },
    ...(isAdmin ? [
      { 
        label: 'Usuários', 
        icon: <UserCog className="h-5 w-5" />,
        isActive: pathname?.startsWith('/usuarios'),
        onClick: () => router.push('/usuarios')
      },
      { 
        label: 'Logs', 
        icon: <FileText className="h-5 w-5" />,
        isActive: pathname?.startsWith('/logs'),
        onClick: () => router.push('/logs')
      },
    ] : []),
  ]

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = '/login?logout=true'
  }

  const handleUserMenuClick = () => {
    router.push('/perfil')
  }

  return (
    <DashboardAdminTemplate
      title="Dashboard"
      userName={userName}
      userAvatar={userData?.avatar_url}
      userEmail={userData?.email}
      metrics={kpiMetrics}
      navItems={navItems}
      onUserMenuClick={handleUserMenuClick}
      onLogout={handleLogout}
      searchComponent={<BuscaGlobal />}
    >
      <DashboardTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === 'geral' && (
        <div>
          {/* KPIs já estão no template, não precisa duplicar */}
          <WidgetAcoesPendentes />
          <ExamesRecentes />
          <TempoMedioTratamento userRole={userRole} />
        </div>
      )}

      {activeTab === 'ronco' && <DashboardRonco userRole={userRole} />}

      {activeTab === 'apneia' && <DashboardApneia userRole={userRole} />}
    </DashboardAdminTemplate>
  )
}

