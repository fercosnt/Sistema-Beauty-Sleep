'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { X, Filter, Calendar, Tag, Sliders } from 'lucide-react'

export interface FiltrosAvancadosState {
  status: string[]
  tags: string[]
  adesaoMin: number
  adesaoMax: number
  dataInicio: string
  dataFim: string
}

interface Tag {
  id: string
  nome: string
  cor: string
}

interface FiltrosAvancadosProps {
  filtros: FiltrosAvancadosState
  onFiltrosChange: (filtros: FiltrosAvancadosState) => void
}

const STATUS_OPTIONS = [
  { value: 'lead', label: 'Lead' },
  { value: 'ativo', label: 'Ativo' },
  { value: 'finalizado', label: 'Finalizado' },
  { value: 'inativo', label: 'Inativo' },
]

export default function FiltrosAvancados({ filtros, onFiltrosChange }: FiltrosAvancadosProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [tags, setTags] = useState<Tag[]>([])
  const [isLoadingTags, setIsLoadingTags] = useState(true)

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const supabase = createClient()
        const { data, error } = await supabase.from('tags').select('id, nome, cor').order('nome')

        if (error) {
          console.error('Erro ao buscar tags:', error)
          return
        }

        setTags(data || [])
      } catch (error) {
        console.error('Erro inesperado ao buscar tags:', error)
      } finally {
        setIsLoadingTags(false)
      }
    }

    fetchTags()
  }, [])

  const handleStatusToggle = (status: string) => {
    const newStatus = filtros.status.includes(status)
      ? filtros.status.filter((s) => s !== status)
      : [...filtros.status, status]
    onFiltrosChange({ ...filtros, status: newStatus })
  }

  const handleTagToggle = (tagId: string) => {
    const newTags = filtros.tags.includes(tagId)
      ? filtros.tags.filter((t) => t !== tagId)
      : [...filtros.tags, tagId]
    onFiltrosChange({ ...filtros, tags: newTags })
  }

  const handleAdesaoChange = (type: 'min' | 'max', value: number) => {
    if (type === 'min') {
      onFiltrosChange({ ...filtros, adesaoMin: Math.min(value, filtros.adesaoMax) })
    } else {
      onFiltrosChange({ ...filtros, adesaoMax: Math.max(value, filtros.adesaoMin) })
    }
  }

  const handleDataChange = (type: 'inicio' | 'fim', value: string) => {
    if (type === 'inicio') {
      onFiltrosChange({ ...filtros, dataInicio: value })
    } else {
      onFiltrosChange({ ...filtros, dataFim: value })
    }
  }

  const limparFiltros = () => {
    onFiltrosChange({
      status: [],
      tags: [],
      adesaoMin: 0,
      adesaoMax: 100,
      dataInicio: '',
      dataFim: '',
    })
  }

  const hasActiveFilters =
    filtros.status.length > 0 ||
    filtros.tags.length > 0 ||
    filtros.adesaoMin > 0 ||
    filtros.adesaoMax < 100 ||
    filtros.dataInicio !== '' ||
    filtros.dataFim !== ''

  return (
    <div className="space-y-4">
      {/* Botão para abrir/fechar filtros */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors backdrop-blur-md ${
            hasActiveFilters
              ? 'bg-white/20 text-white border border-white/30 hover:bg-white/25'
              : 'bg-white/10 text-white/70 hover:bg-white/15 border border-white/20'
          }`}
        >
          <Filter className="h-5 w-5" />
          <span>Filtros Avançados</span>
          {hasActiveFilters && (
            <span className="ml-2 px-2 py-0.5 bg-white bg-opacity-20 rounded-full text-xs font-medium">
              {[
                filtros.status.length,
                filtros.tags.length,
                filtros.adesaoMin > 0 || filtros.adesaoMax < 100 ? 1 : 0,
                filtros.dataInicio || filtros.dataFim ? 1 : 0,
              ]
                .filter((n) => n > 0)
                .reduce((a, b) => a + b, 0)}
            </span>
          )}
        </button>

        {hasActiveFilters && (
          <button
            onClick={limparFiltros}
            className="flex items-center gap-2 px-4 py-2 text-sm text-white/70 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
            Limpar Filtros
          </button>
        )}
      </div>

      {/* Painel de filtros */}
      {isOpen && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6 shadow-lg">
          {/* Filtro por Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Status</label>
            <div className="flex flex-wrap gap-2">
              {STATUS_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleStatusToggle(option.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filtros.status.includes(option.value)
                      ? 'bg-primary-600 text-white border border-primary-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Filtro por Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
              <Tag className="h-4 w-4" />
              Tags
            </label>
            {isLoadingTags ? (
              <p className="text-sm text-gray-500">Carregando tags...</p>
            ) : tags.length === 0 ? (
              <p className="text-sm text-gray-500">Nenhuma tag cadastrada</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <button
                    key={tag.id}
                    onClick={() => handleTagToggle(tag.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                      filtros.tags.includes(tag.id)
                        ? 'text-white border border-gray-300'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
                    }`}
                    style={
                      filtros.tags.includes(tag.id)
                        ? { backgroundColor: tag.cor }
                        : undefined
                    }
                  >
                    {tag.nome}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Filtro por Adesão */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
              <Sliders className="h-4 w-4" />
              Adesão (%)
            </label>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="block text-xs text-gray-600 mb-1">Mínimo</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={filtros.adesaoMin}
                    onChange={(e) => handleAdesaoChange('min', parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="text-xs text-gray-700 mt-1">{filtros.adesaoMin}%</div>
                </div>
                <div className="flex-1">
                  <label className="block text-xs text-gray-600 mb-1">Máximo</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={filtros.adesaoMax}
                    onChange={(e) => handleAdesaoChange('max', parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="text-xs text-gray-700 mt-1">{filtros.adesaoMax}%</div>
                </div>
              </div>
              <div className="text-sm text-gray-700">
                Faixa: {filtros.adesaoMin}% - {filtros.adesaoMax}%
              </div>
            </div>
          </div>

          {/* Filtro por Data de Cadastro */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Data de Cadastro
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Data Inicial</label>
                <input
                  type="date"
                  value={filtros.dataInicio}
                  onChange={(e) => handleDataChange('inicio', e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Data Final</label>
                <input
                  type="date"
                  value={filtros.dataFim}
                  onChange={(e) => handleDataChange('fim', e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

