'use client'

import { useState } from 'react'
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

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-black">Dashboard</h1>
        <p className="mt-2 text-black">Visão geral do sistema Beauty Sleep</p>
      </div>

      <DashboardTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === 'geral' && (
        <div>
          <KPICards userRole={userRole} />
          <WidgetAcoesPendentes />
          <ExamesRecentes />
          <TempoMedioTratamento userRole={userRole} />
        </div>
      )}

      {activeTab === 'ronco' && <DashboardRonco userRole={userRole} />}

      {activeTab === 'apneia' && <DashboardApneia userRole={userRole} />}
    </div>
  )
}

