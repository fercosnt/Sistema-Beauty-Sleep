'use client'

import { X } from 'lucide-react'
import { FiltrosAvancadosState } from './FiltrosAvancados'

interface FilterChipsProps {
  filtros: FiltrosAvancadosState
  tags: Array<{ id: string; nome: string; cor: string }>
  onRemoveFilter: (type: keyof FiltrosAvancadosState, value?: string) => void
}

const STATUS_LABELS: Record<string, string> = {
  lead: 'Lead',
  ativo: 'Ativo',
  finalizado: 'Finalizado',
  inativo: 'Inativo',
}

export default function FilterChips({ filtros, tags, onRemoveFilter }: FilterChipsProps) {
  const chips: Array<{ type: keyof FiltrosAvancadosState; label: string; value?: string; color?: string }> = []

  // Status chips
  filtros.status.forEach((status) => {
    chips.push({
      type: 'status',
      label: STATUS_LABELS[status] || status,
      value: status,
    })
  })

  // Tag chips
  filtros.tags.forEach((tagId) => {
    const tag = tags.find((t) => t.id === tagId)
    if (tag) {
      chips.push({
        type: 'tags',
        label: tag.nome,
        value: tagId,
        color: tag.cor,
      })
    }
  })

  // Adesão chip
  if (filtros.adesaoMin > 0 || filtros.adesaoMax < 100) {
    chips.push({
      type: 'adesaoMin',
      label: `Adesão: ${filtros.adesaoMin}% - ${filtros.adesaoMax}%`,
    })
  }

  // Data chips
  if (filtros.dataInicio) {
    chips.push({
      type: 'dataInicio',
      label: `Desde: ${new Date(filtros.dataInicio).toLocaleDateString('pt-BR')}`,
    })
  }
  if (filtros.dataFim) {
    chips.push({
      type: 'dataFim',
      label: `Até: ${new Date(filtros.dataFim).toLocaleDateString('pt-BR')}`,
    })
  }

  if (chips.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {chips.map((chip, index) => (
        <span
          key={`${chip.type}-${chip.value || index}`}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800"
          style={chip.color ? { backgroundColor: chip.color, color: 'white' } : undefined}
        >
          {chip.label}
          <button
            onClick={() => {
              if (chip.type === 'status' || chip.type === 'tags') {
                onRemoveFilter(chip.type, chip.value)
              } else if (chip.type === 'adesaoMin') {
                onRemoveFilter('adesaoMin')
                onRemoveFilter('adesaoMax')
              } else {
                onRemoveFilter(chip.type)
              }
            }}
            className="hover:bg-white hover:bg-opacity-20 rounded-full p-0.5 transition-colors"
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}
    </div>
  )
}

