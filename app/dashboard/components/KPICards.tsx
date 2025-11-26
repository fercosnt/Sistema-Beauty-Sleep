'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Users, UserPlus, FileText, TrendingUp, Calendar } from 'lucide-react'

interface KPICardsProps {
  userRole: string | null
}

interface KPIData {
  totalPacientes: number
  leadsParaConverter: number
  examesRealizados: number
  taxaConversao: number
  adesaoMedia: number
}

export default function KPICards({ userRole }: KPICardsProps) {
  const [kpiData, setKpiData] = useState<KPIData>({
    totalPacientes: 0,
    leadsParaConverter: 0,
    examesRealizados: 0,
    taxaConversao: 0,
    adesaoMedia: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
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

        // Taxa de Conversão (% leads que viraram ativos)
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

        // Adesão Média ao Tratamento (avg % sessoes utilizadas)
        const { data: pacientes } = await supabase
          .from('pacientes')
          .select('sessoes_compradas, sessoes_adicionadas, sessoes_utilizadas')
          .in('status', ['ativo', 'finalizado'])

        let adesaoMedia = 0
        if (pacientes && pacientes.length > 0) {
          const adesoes = pacientes
            .map((p) => {
              const total = (p.sessoes_compradas || 0) + (p.sessoes_adicionadas || 0)
              if (total === 0) return null
              return ((p.sessoes_utilizadas || 0) / total) * 100
            })
            .filter((a): a is number => a !== null)

          if (adesoes.length > 0) {
            adesaoMedia = adesoes.reduce((sum, a) => sum + a, 0) / adesoes.length
          }
        }

        setKpiData({
          totalPacientes: totalPacientes || 0,
          leadsParaConverter: leadsParaConverter || 0,
          examesRealizados: examesRealizados || 0,
          taxaConversao,
          adesaoMedia,
        })
      } catch (error) {
        console.error('Erro ao buscar dados de KPI:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchKPIData()
  }, [])

  const isRecepcao = userRole === 'recepcao'

  const formatValue = (value: number, isPercentage = false) => {
    if (isRecepcao) return '--'
    if (isPercentage) {
      return `${value.toFixed(1)}%`
    }
    return value.toLocaleString('pt-BR')
  }

  const kpiCards = [
    {
      title: 'Total de Pacientes',
      value: formatValue(kpiData.totalPacientes),
      icon: Users,
      color: 'bg-primary-600',
      iconColor: 'text-primary-600',
    },
    {
      title: 'Leads para Converter',
      value: formatValue(kpiData.leadsParaConverter),
      icon: UserPlus,
      color: 'bg-warning-600',
      iconColor: 'text-warning-600',
    },
    {
      title: 'Exames Realizados',
      value: formatValue(kpiData.examesRealizados),
      icon: FileText,
      color: 'bg-secondary-600',
      iconColor: 'text-secondary-600',
    },
    {
      title: 'Taxa de Conversão',
      value: formatValue(kpiData.taxaConversao, true),
      icon: TrendingUp,
      color: 'bg-success-600',
      iconColor: 'text-success-600',
    },
    {
      title: 'Adesão Média',
      value: formatValue(kpiData.adesaoMedia, true),
      icon: Calendar,
      color: 'bg-primary-500',
      iconColor: 'text-primary-500',
    },
  ]

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
      {kpiCards.map((card, index) => {
        const Icon = card.icon
        return (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">{card.title}</h3>
              <div className={`p-2 rounded-lg ${card.color} bg-opacity-10`}>
                <Icon className={`h-5 w-5 ${card.iconColor}`} />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{card.value}</p>
          </div>
        )
      })}
    </div>
  )
}

