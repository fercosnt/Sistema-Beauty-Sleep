'use client'

import { useState } from 'react'
import { BarChart3, Activity, Heart } from 'lucide-react'

interface DashboardTabsProps {
  activeTab: 'geral' | 'ronco' | 'apneia'
  onTabChange: (tab: 'geral' | 'ronco' | 'apneia') => void
}

export default function DashboardTabs({ activeTab, onTabChange }: DashboardTabsProps) {
  const tabs = [
    { id: 'geral' as const, label: 'Geral', icon: BarChart3 },
    { id: 'ronco' as const, label: 'Ronco', icon: Activity },
    { id: 'apneia' as const, label: 'Apneia', icon: Heart },
  ]

  return (
    <div className="border-b border-gray-200 mb-6">
      <nav className="-mb-px flex space-x-8">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors
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

