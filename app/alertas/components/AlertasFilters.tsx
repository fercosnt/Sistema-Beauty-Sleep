'use client'

import { Filter, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'

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
  { value: 'critico', label: 'Crítico' },
  { value: 'manutencao', label: 'Manutenção' },
  { value: 'followup', label: 'Follow-up' },
]

const URGENCIAS = [
  { value: 'alta', label: 'Alta' },
  { value: 'media', label: 'Média' },
  { value: 'baixa', label: 'Baixa' },
]

const STATUS = [
  { value: 'pendente', label: 'Pendente' },
  { value: 'resolvido', label: 'Resolvido' },
  { value: 'ignorado', label: 'Ignorado' },
]

export default function AlertasFilters({ filters, onFiltersChange }: AlertasFiltersProps) {
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

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Filter className="h-5 w-5 text-primary-600" />
          Filtros
          {getActiveFiltersCount() > 0 && (
            <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-primary-600 rounded-full">
              {getActiveFiltersCount()}
            </span>
          )}
        </CardTitle>
        {getActiveFiltersCount() > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearFilters}
            className="flex items-center gap-1"
          >
            <X className="h-4 w-4" />
            Limpar
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filtro por Tipo */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">Tipo</label>
          <div className="flex flex-wrap gap-2">
            {TIPOS.map((tipo) => (
              <button
                key={tipo.value}
                onClick={() => toggleFilter('tipo', tipo.value)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  filters.tipo.includes(tipo.value)
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                type="button"
              >
                {tipo.label}
              </button>
            ))}
          </div>
        </div>

        {/* Filtro por Urgência */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">Urgência</label>
          <div className="flex flex-wrap gap-2">
            {URGENCIAS.map((urgencia) => (
              <button
                key={urgencia.value}
                onClick={() => toggleFilter('urgencia', urgencia.value)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  filters.urgencia.includes(urgencia.value)
                    ? urgencia.value === 'alta'
                      ? 'bg-error-600 text-white'
                      : urgencia.value === 'media'
                      ? 'bg-warning-500 text-white'
                      : 'bg-success-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                type="button"
              >
                {urgencia.label}
              </button>
            ))}
          </div>
        </div>

        {/* Filtro por Status */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">Status</label>
          <div className="flex flex-wrap gap-2">
            {STATUS.map((status) => (
              <button
                key={status.value}
                onClick={() => toggleFilter('status', status.value)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  filters.status.includes(status.value)
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                type="button"
              >
                {status.label}
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

