'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { TrendingUp, TrendingDown, CheckCircle, XCircle, Calendar, Filter, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Label } from '@/components/ui/Label'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface Exame {
  id: string
  data_exame: string
  tipo: number | null
  ido: number | null
  score_ronco: number | null
  spo2_avg: number | null
}

interface TabEvolucaoProps {
  pacienteId: string
}

interface ComparacaoMetrica {
  metrica: string
  primeiroValor: number | null
  ultimoValor: number | null
  mudancaAbsoluta: number | null
  mudancaPercentual: number | null
  melhorou: boolean
}

export default function TabEvolucao({ pacienteId }: TabEvolucaoProps) {
  const [exames, setExames] = useState<Exame[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [dateRange, setDateRange] = useState<'all' | '6' | '12'>('all')
  const [sessoesCount, setSessoesCount] = useState(0)

  useEffect(() => {
    fetchExames()
    fetchSessoesCount()
  }, [pacienteId, dateRange])

  const fetchExames = async () => {
    try {
      setIsLoading(true)
      const supabase = createClient()

      let query = supabase
        .from('exames')
        .select('id, data_exame, tipo, ido, score_ronco, spo2_avg')
        .eq('paciente_id', pacienteId)
        .order('data_exame', { ascending: true })

      // Aplicar filtro de data
      if (dateRange !== 'all') {
        const monthsAgo = new Date()
        monthsAgo.setMonth(monthsAgo.getMonth() - parseInt(dateRange))
        query = query.gte('data_exame', monthsAgo.toISOString().split('T')[0])
      }

      const { data, error } = await query

      if (error) {
        console.error('Erro ao buscar exames:', error)
        return
      }

      setExames(data || [])
    } catch (error) {
      console.error('Erro inesperado:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchSessoesCount = async () => {
    try {
      const supabase = createClient()
      const { count, error } = await supabase
        .from('sessoes')
        .select('*', { count: 'exact', head: true })
        .eq('paciente_id', pacienteId)

      if (!error && count !== null) {
        setSessoesCount(count)
      }
    } catch (error) {
      console.error('Erro ao contar sessões:', error)
    }
  }

  // Preparar dados para gráficos
  const chartData = exames.map((exame) => ({
    data: new Date(exame.data_exame).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
    }),
    dataFull: exame.data_exame,
    ido: exame.ido,
    scoreRonco: exame.score_ronco,
    spo2Medio: exame.spo2_avg,
  }))

  // Calcular comparação Primeiro vs Último
  const calcularComparacao = (): ComparacaoMetrica[] => {
    if (exames.length < 2) return []

    const primeiroExame = exames[0]
    const ultimoExame = exames[exames.length - 1]

    const comparacoes: ComparacaoMetrica[] = []

    // IDO (apenas para exames tipo 1 - Sono)
    const primeiroIDO = primeiroExame.tipo === 1 ? primeiroExame.ido : null
    const ultimoIDO = ultimoExame.tipo === 1 ? ultimoExame.ido : null
    if (primeiroIDO !== null && ultimoIDO !== null) {
      const mudancaAbsoluta = ultimoIDO - primeiroIDO
      const mudancaPercentual = primeiroIDO !== 0 ? (mudancaAbsoluta / primeiroIDO) * 100 : 0
      comparacoes.push({
        metrica: 'IDO',
        primeiroValor: primeiroIDO,
        ultimoValor: ultimoIDO,
        mudancaAbsoluta,
        mudancaPercentual,
        melhorou: mudancaAbsoluta < 0, // IDO menor é melhor
      })
    }

    // Score Ronco (apenas para exames tipo 0 - Ronco)
    const primeiroScore = primeiroExame.tipo === 0 ? primeiroExame.score_ronco : null
    const ultimoScore = ultimoExame.tipo === 0 ? ultimoExame.score_ronco : null
    if (primeiroScore !== null && ultimoScore !== null) {
      const mudancaAbsoluta = ultimoScore - primeiroScore
      const mudancaPercentual = primeiroScore !== 0 ? (mudancaAbsoluta / primeiroScore) * 100 : 0
      comparacoes.push({
        metrica: 'Score Ronco',
        primeiroValor: primeiroScore,
        ultimoValor: ultimoScore,
        mudancaAbsoluta,
        mudancaPercentual,
        melhorou: mudancaAbsoluta < 0, // Score menor é melhor
      })
    }

    // SpO2 Médio (apenas para exames tipo 1 - Sono)
    const primeiroSpO2 = primeiroExame.tipo === 1 ? primeiroExame.spo2_avg : null
    const ultimoSpO2 = ultimoExame.tipo === 1 ? ultimoExame.spo2_avg : null
    if (primeiroSpO2 !== null && ultimoSpO2 !== null) {
      const mudancaAbsoluta = ultimoSpO2 - primeiroSpO2
      const mudancaPercentual = primeiroSpO2 !== 0 ? (mudancaAbsoluta / primeiroSpO2) * 100 : 0
      comparacoes.push({
        metrica: 'SpO2 Médio',
        primeiroValor: primeiroSpO2,
        ultimoValor: ultimoSpO2,
        mudancaAbsoluta,
        mudancaPercentual,
        melhorou: mudancaAbsoluta > 0, // SpO2 maior é melhor
      })
    }


    return comparacoes
  }

  const comparacoes = calcularComparacao()

  // Verificar se está respondendo ao tratamento
  const melhoriasSignificativas = comparacoes.filter(
    (c) => c.mudancaPercentual !== null && Math.abs(c.mudancaPercentual) >= 20 && c.melhorou
  )
  const estaRespondendo = melhoriasSignificativas.length > 0

  // Verificar se não está respondendo (melhoria < 20% após 5+ sessões)
  const naoEstaRespondendo =
    sessoesCount >= 5 &&
    comparacoes.length > 0 &&
    comparacoes.every((c) => c.mudancaPercentual === null || Math.abs(c.mudancaPercentual) < 20 || !c.melhorou)

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8">
          <p className="text-center text-gray-600">Carregando dados de evolução...</p>
        </CardContent>
      </Card>
    )
  }

  if (exames.length < 2) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">Dados insuficientes</h3>
            <p className="mt-1 text-sm text-gray-500">
              É necessário pelo menos 2 exames para análise de evolução.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filtro de Período */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-primary-600" />
              Filtro de Período
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Label>Período:</Label>
            <div className="flex gap-2">
              <Button
                variant={dateRange === 'all' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setDateRange('all')}
              >
                Todo o Período
              </Button>
              <Button
                variant={dateRange === '12' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setDateRange('12')}
              >
                Últimos 12 Meses
              </Button>
              <Button
                variant={dateRange === '6' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setDateRange('6')}
              >
                Últimos 6 Meses
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Badges de Resposta ao Tratamento */}
      {(estaRespondendo || naoEstaRespondendo) && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              {estaRespondendo && (
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-success-100 text-success-800 border border-success-200">
                  <CheckCircle className="h-4 w-4" />
                  Respondendo ao tratamento
                </span>
              )}
              {naoEstaRespondendo && (
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-danger-100 text-danger-800 border border-danger-200">
                  <XCircle className="h-4 w-4" />
                  Não respondendo ao tratamento
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Gráfico IDO */}
      {exames.some((e) => e.tipo === 1 && e.ido !== null) && (
        <Card>
          <CardHeader>
            <CardTitle>Evolução do IDO</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData.filter((d) => d.ido !== null && d.ido !== undefined)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="data" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="ido"
                  stroke="#00109E"
                  strokeWidth={2}
                  dot={{ fill: '#00109E', r: 4 }}
                  name="IDO (eventos/hora)"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Gráfico Score Ronco */}
      {exames.some((e) => e.tipo === 0 && e.score_ronco !== null) && (
        <Card>
          <CardHeader>
            <CardTitle>Evolução do Score de Ronco</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={chartData.filter((d) => d.scoreRonco !== null && d.scoreRonco !== undefined)}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="data" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="scoreRonco"
                  stroke="#35BFAD"
                  strokeWidth={2}
                  dot={{ fill: '#35BFAD', r: 4 }}
                  name="Score de Ronco"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Gráfico SpO2 Médio */}
      {exames.some((e) => e.tipo === 1 && e.spo2_avg !== null) && (
        <Card>
          <CardHeader>
            <CardTitle>Evolução do SpO2 Médio</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={chartData.filter((d) => d.spo2Medio !== null && d.spo2Medio !== undefined)}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="data" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="spo2Medio"
                  stroke="#10B981"
                  strokeWidth={2}
                  dot={{ fill: '#10B981', r: 4 }}
                  name="SpO2 Médio (%)"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}


      {/* Card de Comparação */}
      {comparacoes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary-600" />
              Comparação: Primeiro Exame vs Último Exame
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {comparacoes.map((comp, index) => {
                const mudancaPercentualAbs = comp.mudancaPercentual !== null ? Math.abs(comp.mudancaPercentual) : 0
                const corBadge =
                  mudancaPercentualAbs >= 20 && comp.melhorou
                    ? 'bg-success-100 text-success-800 border-success-200'
                    : mudancaPercentualAbs >= 20 && !comp.melhorou
                      ? 'bg-danger-100 text-danger-800 border-danger-200'
                      : 'bg-warning-100 text-warning-800 border-warning-200'

                return (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-lg font-semibold text-gray-900">{comp.metrica}</h4>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${corBadge}`}>
                        {comp.melhorou ? (
                          <TrendingDown className="h-4 w-4 mr-1" />
                        ) : (
                          <TrendingUp className="h-4 w-4 mr-1" />
                        )}
                        {comp.mudancaPercentual !== null && (
                          <>
                            {comp.mudancaPercentual > 0 ? '+' : ''}
                            {comp.mudancaPercentual.toFixed(1)}%
                          </>
                        )}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-500 mb-1">Primeiro Exame</p>
                        <p className="text-lg font-bold text-gray-900">
                          {comp.primeiroValor?.toFixed(1) || '-'}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(exames[0].data_exame).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <div className="bg-primary-50 rounded-lg p-3">
                        <p className="text-xs text-primary-600 mb-1">Último Exame</p>
                        <p className="text-lg font-bold text-primary-900">
                          {comp.ultimoValor?.toFixed(1) || '-'}
                        </p>
                        <p className="text-xs text-primary-600 mt-1">
                          {new Date(exames[exames.length - 1].data_exame).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-sm text-gray-600">
                        Mudança absoluta:{' '}
                        <span
                          className={`font-semibold ${
                            comp.melhorou ? 'text-success-600' : 'text-danger-600'
                          }`}
                        >
                          {comp.mudancaAbsoluta && comp.mudancaAbsoluta > 0 ? '+' : ''}
                          {comp.mudancaAbsoluta?.toFixed(1) || '-'}
                        </span>
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

