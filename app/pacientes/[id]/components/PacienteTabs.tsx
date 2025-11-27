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
    <div className="border-b border-gray-200 mb-6">
      <nav className="-mb-px flex space-x-8 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap
                ${
                  isActive
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              <Icon className="h-5 w-5" />
              {tab.label}
            </button>
          )
        })}
      </nav>
    </div>
  )
}

