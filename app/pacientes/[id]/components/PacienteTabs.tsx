'use client'

import { useState } from 'react'
import { FileText, Calendar, TrendingUp, Scale, StickyNote, History } from 'lucide-react'

interface PacienteTabsProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export default function PacienteTabs({ activeTab, onTabChange }: PacienteTabsProps) {
  const tabs = [
    { id: 'exames', label: 'Exames', icon: FileText },
    { id: 'sessoes', label: 'Sessões', icon: Calendar },
    { id: 'evolucao', label: 'Evolução', icon: TrendingUp },
    { id: 'peso', label: 'Peso/IMC', icon: Scale },
    { id: 'notas', label: 'Notas', icon: StickyNote },
    { id: 'historico', label: 'Histórico', icon: History },
  ]

  return (
    <div className="border-b border-white/20 mb-6">
      <nav className="-mb-px flex space-x-8 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                flex items-center gap-2 py-4 px-1 border-b-2 font-semibold text-sm transition-all whitespace-nowrap
                ${
                  isActive
                    ? 'border-white text-white drop-shadow'
                    : 'border-transparent text-white/60 hover:text-white hover:border-white/40'
                }
              `}
            >
              <Icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-white/60'}`} />
              {tab.label}
            </button>
          )
        })}
      </nav>
    </div>
  )
}

