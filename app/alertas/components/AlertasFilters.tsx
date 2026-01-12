'use client'

import { useState } from 'react'
import { Filter, X, AlertCircle, Wrench, UserCheck, TrendingUp, AlertTriangle, TrendingDown, Clock, CheckCircle2, XCircle, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { cn } from '@/utils/cn'

export interface AlertasFiltersState {
  tipo: string[]
  urgencia: string[]
  status: string[]
}

interface AlertasFiltersProps {
  filters: AlertasFiltersState
  onFiltersChange: (filters: AlertasFiltersState) => void
}

const TIPOS = [
  { value: 'critico', label: 'Crítico', icon: AlertCircle, color: 'error' },
  { value: 'manutencao', label: 'Manutenção', icon: Wrench, color: 'warning' },
  { value: 'followup', label: 'Follow-up', icon: UserCheck, color: 'primary' },
]

const URGENCIAS = [
  { value: 'alta', label: 'Alta', icon: TrendingUp, color: 'error' },
  { value: 'media', label: 'Média', icon: AlertTriangle, color: 'warning' },
  { value: 'baixa', label: 'Baixa', icon: TrendingDown, color: 'success' },
]

const STATUS = [
  { value: 'pendente', label: 'Pendente', icon: Clock, color: 'warning' },
  { value: 'resolvido', label: 'Resolvido', icon: CheckCircle2, color: 'success' },
  { value: 'ignorado', label: 'Ignorado', icon: XCircle, color: 'gray' },
]

export default function AlertasFilters({ filters, onFiltersChange }: AlertasFiltersProps) {
  const [isOpen, setIsOpen] = useState(false)

  const toggleFilter = (category: keyof AlertasFiltersState, value: string) => {
    const currentValues = filters[category]
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value]
    
    onFiltersChange({
      ...filters,
      [category]: newValues,
    })
  }

  const clearFilters = () => {
    onFiltersChange({
      tipo: [],
      urgencia: [],
      status: [],
    })
  }

  const getActiveFiltersCount = () => {
    return filters.tipo.length + filters.urgencia.length + filters.status.length
  }

  const activeCount = getActiveFiltersCount()

  return (
    <Card data-tour="alertas-filtros">
      <CardHeader 
        className="flex flex-row items-center justify-between space-y-0 pb-2 cursor-pointer hover:bg-gray-50/50 transition-colors rounded-t-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Filter className="h-5 w-5 text-primary-600" />
          Filtros
          {activeCount > 0 && (
            <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold leading-none text-white bg-primary-600 rounded-full">
              {activeCount}
            </span>
          )}
        </CardTitle>
        <div className="flex items-center gap-2">
          {activeCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                clearFilters()
              }}
              className="flex items-center gap-1.5 text-gray-700 hover:text-gray-900 border-gray-300 hover:border-gray-400"
            >
              <X className="h-4 w-4" />
              Limpar
            </Button>
          )}
          <ChevronDown 
            className={cn(
              'h-5 w-5 text-gray-500 transition-transform duration-200',
              isOpen && 'transform rotate-180'
            )} 
          />
        </div>
      </CardHeader>
      {isOpen && (
        <CardContent className="space-y-4 pt-0 pb-4">
        {/* Filtro por Tipo */}
        <div>
          <label className="text-sm font-semibold text-gray-900 mb-2 block">Tipo</label>
          <div className="flex flex-wrap gap-2">
            {TIPOS.map((tipo) => {
              const Icon = tipo.icon
              const isActive = filters.tipo.includes(tipo.value)
              return (
                <button
                  key={tipo.value}
                  onClick={() => toggleFilter('tipo', tipo.value)}
                  className={cn(
                    'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200',
                    'border-2 focus:outline-none focus:ring-2 focus:ring-offset-2',
                    isActive
                      ? tipo.color === 'error'
                        ? 'bg-error-600 text-white border-error-600 shadow-sm focus:ring-error-500'
                        : tipo.color === 'warning'
                        ? 'bg-warning-500 text-white border-warning-500 shadow-sm focus:ring-warning-500'
                        : 'bg-primary-600 text-white border-primary-600 shadow-sm focus:ring-primary-500'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-50 focus:ring-gray-500'
                  )}
                  type="button"
                >
                  <Icon className={cn('h-3.5 w-3.5', isActive ? 'text-white' : 'text-gray-500')} />
                  {tipo.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Filtro por Urgência */}
        <div>
          <label className="text-sm font-semibold text-gray-900 mb-2 block">Urgência</label>
          <div className="flex flex-wrap gap-2">
            {URGENCIAS.map((urgencia) => {
              const Icon = urgencia.icon
              const isActive = filters.urgencia.includes(urgencia.value)
              return (
                <button
                  key={urgencia.value}
                  onClick={() => toggleFilter('urgencia', urgencia.value)}
                  className={cn(
                    'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200',
                    'border-2 focus:outline-none focus:ring-2 focus:ring-offset-2',
                    isActive
                      ? urgencia.color === 'error'
                        ? 'bg-error-600 text-white border-error-600 shadow-sm focus:ring-error-500'
                        : urgencia.color === 'warning'
                        ? 'bg-warning-500 text-white border-warning-500 shadow-sm focus:ring-warning-500'
                        : 'bg-success-600 text-white border-success-600 shadow-sm focus:ring-success-500'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-50 focus:ring-gray-500'
                  )}
                  type="button"
                >
                  <Icon className={cn('h-3.5 w-3.5', isActive ? 'text-white' : 'text-gray-500')} />
                  {urgencia.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Filtro por Status */}
        <div>
          <label className="text-sm font-semibold text-gray-900 mb-2 block">Status</label>
          <div className="flex flex-wrap gap-2">
            {STATUS.map((status) => {
              const Icon = status.icon
              const isActive = filters.status.includes(status.value)
              return (
                <button
                  key={status.value}
                  onClick={() => toggleFilter('status', status.value)}
                  className={cn(
                    'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200',
                    'border-2 focus:outline-none focus:ring-2 focus:ring-offset-2',
                    isActive
                      ? status.color === 'success'
                        ? 'bg-success-600 text-white border-success-600 shadow-sm focus:ring-success-500'
                        : status.color === 'warning'
                        ? 'bg-warning-500 text-white border-warning-500 shadow-sm focus:ring-warning-500'
                        : status.color === 'gray'
                        ? 'bg-gray-600 text-white border-gray-600 shadow-sm focus:ring-gray-500'
                        : 'bg-primary-600 text-white border-primary-600 shadow-sm focus:ring-primary-500'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-50 focus:ring-gray-500'
                  )}
                  type="button"
                >
                  <Icon className={cn('h-3.5 w-3.5', isActive ? 'text-white' : 'text-gray-500')} />
                  {status.label}
                </button>
              )
            })}
          </div>
        </div>
      </CardContent>
      )}
    </Card>
  )
}

