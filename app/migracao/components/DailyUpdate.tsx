'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent } from '@/components/ui/Card'
import { Bell, TrendingUp, Calendar, CheckCircle } from 'lucide-react'

interface DailyUpdateProps {
  onUpdate?: (update: DailyStats) => void
}

export interface DailyStats {
  sessoesHoje: number
  sessoesRestantes: number
  percentualCompleto: number
  mensagem: string
}

export default function DailyUpdate({ onUpdate }: DailyUpdateProps) {
  const [stats, setStats] = useState<DailyStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchDailyStats()
    const interval = setInterval(fetchDailyStats, 60000) // Atualizar a cada minuto
    return () => clearInterval(interval)
  }, [])

  const fetchDailyStats = async () => {
    try {
      const supabase = createClient()
      const hoje = new Date().toISOString().split('T')[0]

      // Buscar sessões de hoje
      const { count: sessoesHoje, error: errorHoje } = await supabase
        .from('sessoes')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', `${hoje}T00:00:00`)
        .lt('created_at', `${hoje}T23:59:59`)

      if (errorHoje) {
        console.error('Erro ao buscar sessões de hoje:', errorHoje)
        return
      }

      // Buscar total de sessões registradas
      const { count: totalRegistrado, error: errorTotal } = await supabase
        .from('sessoes')
        .select('*', { count: 'exact', head: true })

      if (errorTotal) {
        console.error('Erro ao buscar total:', errorTotal)
        return
      }

      // Buscar total esperado
      const { data: pacientesData } = await supabase
        .from('pacientes')
        .select('sessoes_compradas')
        .in('status', ['ativo', 'finalizado'])

      const totalEsperado =
        pacientesData?.reduce((sum, p) => sum + (p.sessoes_compradas || 0), 0) || 0
      const sessoesRestantes = Math.max(0, totalEsperado - (totalRegistrado || 0))
      const percentualCompleto =
        totalEsperado > 0 ? ((totalRegistrado || 0) / totalEsperado) * 100 : 0

      const mensagem = generateMessage(sessoesHoje || 0, sessoesRestantes, percentualCompleto)

      const dailyStats: DailyStats = {
        sessoesHoje: sessoesHoje || 0,
        sessoesRestantes,
        percentualCompleto,
        mensagem,
      }

      setStats(dailyStats)
      onUpdate?.(dailyStats)
    } catch (error) {
      console.error('Erro inesperado:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const generateMessage = (
    sessoesHoje: number,
    sessoesRestantes: number,
    percentual: number
  ): string => {
    if (percentual >= 100) {
      return '🎉 Migração 100% completa! Parabéns a toda a equipe! 🎉'
    }

    if (sessoesRestantes === 0) {
      return '✅ Todas as sessões foram registradas!'
    }

    if (sessoesHoje === 0) {
      return `📋 ${sessoesRestantes} sessões restantes para migrar. Vamos começar!`
    }

    if (sessoesHoje >= 20) {
      return `🚀 Excelente! ${sessoesHoje} sessões registradas hoje! ${sessoesRestantes} restantes. Continue assim!`
    }

    if (sessoesHoje >= 10) {
      return `👍 Bom trabalho! ${sessoesHoje} sessões registradas hoje. ${sessoesRestantes} restantes.`
    }

    return `📊 ${sessoesHoje} sessões registradas hoje. ${sessoesRestantes} sessões restantes para migrar.`
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-4">
          <p className="text-gray-600">Carregando atualização...</p>
        </CardContent>
      </Card>
    )
  }

  if (!stats) {
    return null
  }

  return (
    <Card className="border-primary-200 bg-primary-50">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Bell className="h-5 w-5 text-primary-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold text-gray-900 mb-1">Atualização Diária</p>
            <p className="text-sm text-gray-700">{stats.mensagem}</p>
            <div className="mt-3 flex items-center gap-4 text-xs text-gray-600">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Hoje: {stats.sessoesHoje}
              </span>
              <span className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4" />
                Restantes: {stats.sessoesRestantes}
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4" />
                {stats.percentualCompleto.toFixed(1)}% completo
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

