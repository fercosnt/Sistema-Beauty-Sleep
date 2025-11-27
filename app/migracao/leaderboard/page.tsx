'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Trophy, Medal, Award, TrendingUp, Calendar, Users } from 'lucide-react'
import DailyUpdate from '../components/DailyUpdate'
import MilestoneCelebration from '../components/MilestoneCelebration'

interface LeaderboardEntry {
  user_id: string
  nome: string
  sessoes_hoje: number
  sessoes_total: number
  posicao: number
}

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({
    totalHoje: 0,
    totalGeral: 0,
    totalEsperado: 0,
    percentualCompleto: 0,
  })

  useEffect(() => {
    fetchLeaderboard()
    const interval = setInterval(fetchLeaderboard, 60000) // Atualizar a cada minuto
    return () => clearInterval(interval)
  }, [])

  const fetchLeaderboard = async () => {
    try {
      const supabase = createClient()
      const hoje = new Date().toISOString().split('T')[0]

      // Buscar sessões de hoje agrupadas por usuário
      const { data: sessoesHoje, error: errorHoje } = await supabase
        .from('sessoes')
        .select('user_id, created_at')
        .gte('created_at', `${hoje}T00:00:00`)
        .lt('created_at', `${hoje}T23:59:59`)

      if (errorHoje) {
        console.error('Erro ao buscar sessões de hoje:', errorHoje)
        return
      }

      // Buscar todas as sessões agrupadas por usuário
      const { data: sessoesTotal, error: errorTotal } = await supabase
        .from('sessoes')
        .select('user_id')

      if (errorTotal) {
        console.error('Erro ao buscar total de sessões:', errorTotal)
        return
      }

      // Contar sessões por usuário (hoje)
      const contagemHoje: Record<string, number> = {}
      sessoesHoje?.forEach((s) => {
        if (s.user_id) {
          contagemHoje[s.user_id] = (contagemHoje[s.user_id] || 0) + 1
        }
      })

      // Contar sessões por usuário (total)
      const contagemTotal: Record<string, number> = {}
      sessoesTotal?.forEach((s) => {
        if (s.user_id) {
          contagemTotal[s.user_id] = (contagemTotal[s.user_id] || 0) + 1
        }
      })

      // Buscar nomes dos usuários
      const userIds = Array.from(
        new Set([...Object.keys(contagemHoje), ...Object.keys(contagemTotal)])
      )

      if (userIds.length === 0) {
        setLeaderboard([])
        setIsLoading(false)
        return
      }

      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('id, nome')
        .in('id', userIds)

      if (usersError) {
        console.error('Erro ao buscar usuários:', usersError)
        return
      }

      // Criar leaderboard
      const entries: LeaderboardEntry[] = usersData
        ?.map((user) => ({
          user_id: user.id,
          nome: user.nome || 'Usuário',
          sessoes_hoje: contagemHoje[user.id] || 0,
          sessoes_total: contagemTotal[user.id] || 0,
          posicao: 0, // Será calculado depois
        }))
        .sort((a, b) => b.sessoes_hoje - a.sessoes_hoje) || []

      // Atribuir posições
      entries.forEach((entry, index) => {
        entry.posicao = index + 1
      })

      setLeaderboard(entries)

      // Calcular estatísticas
      const totalHoje = sessoesHoje?.length || 0
      const totalGeral = sessoesTotal?.length || 0

      // Buscar total esperado
      const { data: pacientesData } = await supabase
        .from('pacientes')
        .select('sessoes_compradas')
        .in('status', ['ativo', 'finalizado'])

      const totalEsperado =
        pacientesData?.reduce((sum, p) => sum + (p.sessoes_compradas || 0), 0) || 0
      const percentualCompleto =
        totalEsperado > 0 ? (totalGeral / totalEsperado) * 100 : 0

      setStats({
        totalHoje,
        totalGeral,
        totalEsperado,
        percentualCompleto,
      })
    } catch (error) {
      console.error('Erro inesperado:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getMedalIcon = (posicao: number) => {
    if (posicao === 1) return <Trophy className="h-6 w-6 text-yellow-500" />
    if (posicao === 2) return <Medal className="h-6 w-6 text-gray-400" />
    if (posicao === 3) return <Award className="h-6 w-6 text-orange-500" />
    return null
  }

  const getMedalColor = (posicao: number) => {
    if (posicao === 1) return 'bg-yellow-50 border-yellow-200'
    if (posicao === 2) return 'bg-gray-50 border-gray-200'
    if (posicao === 3) return 'bg-orange-50 border-orange-200'
    return 'bg-white border-gray-200'
  }

  const getMilestoneMessage = () => {
    const percentual = stats.percentualCompleto
    if (percentual >= 100) return { message: '🎉 100% CONCLUÍDO! MIGRAÇÃO COMPLETA! 🎉', color: 'text-success-600' }
    if (percentual >= 90) return { message: '🎊 90% Concluído! Quase lá! 🎊', color: 'text-success-600' }
    if (percentual >= 75) return { message: '🎉 75% Concluído! Excelente progresso! 🎉', color: 'text-success-600' }
    if (percentual >= 50) return { message: '🎉 50% Concluído! Metade do caminho! 🎉', color: 'text-primary-600' }
    if (percentual >= 25) return { message: '📈 25% Concluído! Continue assim! 📈', color: 'text-primary-600' }
    return null
  }

  const milestone = getMilestoneMessage()

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-gray-900">Carregando leaderboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <Trophy className="h-8 w-8 text-yellow-500" />
          Leaderboard de Migração
        </h1>
        <p className="mt-2 text-gray-600">Quem registrou mais sessões hoje?</p>
      </div>

      {/* Estatísticas Gerais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Sessões Hoje</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalHoje}</p>
              </div>
              <Calendar className="h-8 w-8 text-primary-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Registrado</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalGeral}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-success-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Esperado</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalEsperado}</p>
              </div>
              <Users className="h-8 w-8 text-primary-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">% Completo</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.percentualCompleto.toFixed(1)}%
                </p>
              </div>
              <Trophy className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Atualização Diária */}
      <DailyUpdate
        onUpdate={(update) => {
          // Atualizar stats quando daily update mudar
          setStats((prev) => ({
            ...prev,
            totalHoje: update.sessoesHoje,
            percentualCompleto: update.percentualCompleto,
          }))
        }}
      />

      {/* Mensagem de Marco */}
      {milestone && (
        <Card className={`mb-6 border-2 ${milestone.color.replace('text-', 'border-')}`}>
          <CardContent className="p-6 text-center">
            <p className={`text-2xl font-bold ${milestone.color}`}>{milestone.message}</p>
            {stats.percentualCompleto >= 100 && (
              <p className="mt-2 text-lg text-gray-600">
                Parabéns a toda a equipe pelo trabalho incrível! 🎊🎉🎊
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Celebração de Marcos */}
      <MilestoneCelebration percentualCompleto={stats.percentualCompleto} />

      {/* Leaderboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Ranking de Hoje ({new Date().toLocaleDateString('pt-BR')})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {leaderboard.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Nenhuma sessão registrada hoje ainda.</p>
              <p className="text-sm text-gray-500 mt-2">Comece a registrar sessões para aparecer no leaderboard!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {leaderboard.map((entry) => (
                <div
                  key={entry.user_id}
                  className={`flex items-center justify-between p-4 rounded-lg border-2 ${getMedalColor(
                    entry.posicao
                  )}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary-100">
                      {getMedalIcon(entry.posicao) || (
                        <span className="text-lg font-bold text-gray-700">#{entry.posicao}</span>
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{entry.nome}</p>
                      <p className="text-sm text-gray-600">
                        {entry.sessoes_total} sessões no total
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary-600">{entry.sessoes_hoje}</p>
                    <p className="text-xs text-gray-500">sessões hoje</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Informações Adicionais */}
      <Card className="mt-6">
        <CardContent className="p-4">
          <p className="text-sm text-gray-600 text-center">
            💡 <strong>Dica:</strong> O leaderboard é atualizado automaticamente a cada minuto.
            Continue registrando sessões para subir no ranking!
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

