'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { TrendingUp, TrendingDown, CheckCircle, XCircle, Calendar, Filter, AlertCircle, BarChart3 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Label } from '@/components/ui/Label'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts'
import ComparacaoExames from './ComparacaoExames'

interface Exame {
  id: string
  data_exame: string
  tipo: number | null
  ido: number | null
  score_ronco: number | null
  spo2_avg: number | null
  spo2_min: number | null
  spo2_max: number | null
  tempo_spo2_90_seg?: number | null
  num_dessaturacoes?: number | null
  num_eventos_hipoxemia?: number | null
  tempo_hipoxemia_seg?: number | null
  carga_hipoxica?: number | null
  bpm_min?: number | null
  bpm_medio?: number | null
  bpm_max?: number | null
  duracao_total_seg?: number | null
  [key: string]: any // Permitir campos adicionais do banco
}

interface Sessao {
  id: string
  data_sessao: string
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

type MetricKey = 
  | 'score_ronco'
  | 'ido'
  | 'tempo_spo2_90'
  | 'spo2_min'
  | 'spo2_avg'
  | 'spo2_max'
  | 'num_dessaturacoes'
  | 'num_eventos_hipoxemia'
  | 'tempo_hipoxemia'
  | 'carga_hipoxica'
  | 'bpm_min'
  | 'bpm_medio'
  | 'bpm_max'

interface MetricConfig {
  key: MetricKey
  label: string
  unit: string
  color: string
  dataKey: string
  filterType?: number // 0 = Ronco, 1 = Sono, undefined = ambos
  menorMelhor?: boolean // Para cálculo de melhora
}

const METRICS: MetricConfig[] = [
  { key: 'score_ronco', label: 'Score de Ronco', unit: 'pontos', color: '#35BFAD', dataKey: 'scoreRonco', filterType: 0, menorMelhor: true },
  { key: 'ido', label: 'IDO', unit: '/hora', color: '#00109E', dataKey: 'ido', filterType: 1, menorMelhor: true },
  { key: 'tempo_spo2_90', label: 'Tempo com SpO2 < 90%', unit: '%', color: '#EF4444', dataKey: 'tempoSpo2_90', filterType: 1, menorMelhor: true },
  { key: 'spo2_min', label: 'SpO2 Mínima', unit: '%', color: '#F59E0B', dataKey: 'spo2Min', filterType: 1, menorMelhor: false },
  { key: 'spo2_avg', label: 'SpO2 Média', unit: '%', color: '#10B981', dataKey: 'spo2Medio', filterType: 1, menorMelhor: false },
  { key: 'spo2_max', label: 'SpO2 Máxima', unit: '%', color: '#3B82F6', dataKey: 'spo2Max', filterType: 1, menorMelhor: false },
  { key: 'num_dessaturacoes', label: 'Número de Dessaturações', unit: '#', color: '#8B5CF6', dataKey: 'numDessaturacoes', filterType: 1, menorMelhor: true },
  { key: 'num_eventos_hipoxemia', label: 'Número de Eventos de Hipoxemia', unit: '#', color: '#EC4899', dataKey: 'numEventosHipoxemia', filterType: 1, menorMelhor: true },
  { key: 'tempo_hipoxemia', label: 'Tempo Total em Hipoxemia', unit: 'min', color: '#F97316', dataKey: 'tempoHipoxemia', filterType: 1, menorMelhor: true },
  { key: 'carga_hipoxica', label: 'Carga Hipóxica', unit: '%.min/hora', color: '#DC2626', dataKey: 'cargaHipoxica', filterType: 1, menorMelhor: true },
  { key: 'bpm_min', label: 'Frequência Cardíaca Mínima', unit: 'bpm', color: '#6366F1', dataKey: 'bpmMin', filterType: 1, menorMelhor: false },
  { key: 'bpm_medio', label: 'Frequência Cardíaca Média', unit: 'bpm', color: '#14B8A6', dataKey: 'bpmMedio', filterType: 1, menorMelhor: false },
  { key: 'bpm_max', label: 'Frequência Cardíaca Máxima', unit: 'bpm', color: '#06B6D4', dataKey: 'bpmMax', filterType: 1, menorMelhor: false },
]

export default function TabEvolucao({ pacienteId }: TabEvolucaoProps) {
  const [exames, setExames] = useState<Exame[]>([])
  const [sessoes, setSessoes] = useState<Sessao[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [dateRange, setDateRange] = useState<'all' | '6' | '12'>('all')
  const [selectedMetric, setSelectedMetric] = useState<MetricKey>('ido')
  const [sessoesCount, setSessoesCount] = useState(0)

  useEffect(() => {
    fetchExames()
    fetchSessoes()
    fetchSessoesCount()
  }, [pacienteId, dateRange])

  const fetchExames = async () => {
    try {
      setIsLoading(true)
      const supabase = createClient()

      // Buscar todos os campos primeiro (como TabExames faz)
      let query = supabase
        .from('exames')
        .select('*')
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
        console.error('Detalhes do erro:', JSON.stringify(error, null, 2))
        setExames([])
        return
      }

      console.log('Exames encontrados:', data?.length || 0, 'exames')
      if (data && data.length > 0) {
        console.log('Primeiro exame:', data[0])
      }
      
      setExames(data || [])
    } catch (error) {
      console.error('Erro inesperado:', error)
      setExames([])
    } finally {
      setIsLoading(false)
    }
  }

  const fetchSessoes = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('sessoes')
        .select('id, data_sessao')
        .eq('paciente_id', pacienteId)
        .order('data_sessao', { ascending: true })

      if (error) {
        console.error('Erro ao buscar sessões:', error)
        return
      }

      setSessoes(data || [])
    } catch (error) {
      console.error('Erro ao buscar sessões:', error)
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
  const prepareChartData = () => {
    return exames.map((exame) => {
      const dataExame = new Date(exame.data_exame)
      const dataFormatada = dataExame.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
      })

      // Calcular % de tempo com SpO2 < 90%
      const tempoSpo2_90Pct = exame.duracao_total_seg && exame.tempo_spo2_90_seg
        ? (exame.tempo_spo2_90_seg / exame.duracao_total_seg) * 100
        : null

      // Converter tempo de hipoxemia de segundos para minutos
      const tempoHipoxemiaMin = exame.tempo_hipoxemia_seg
        ? exame.tempo_hipoxemia_seg / 60
        : null

      return {
        data: dataFormatada,
        dataFull: exame.data_exame,
        dataTimestamp: dataExame.getTime(),
        tipo: exame.tipo,
        ido: exame.ido,
        scoreRonco: exame.score_ronco,
        spo2Medio: exame.spo2_avg,
        spo2Min: exame.spo2_min,
        spo2Max: exame.spo2_max,
        tempoSpo2_90: tempoSpo2_90Pct,
        numDessaturacoes: exame.num_dessaturacoes,
        numEventosHipoxemia: exame.num_eventos_hipoxemia,
        tempoHipoxemia: tempoHipoxemiaMin,
        cargaHipoxica: exame.carga_hipoxica,
        bpmMin: exame.bpm_min,
        bpmMedio: exame.bpm_medio,
        bpmMax: exame.bpm_max,
      }
    })
  }

  const chartData = prepareChartData()

  // Obter métrica selecionada
  const selectedMetricConfig = METRICS.find(m => m.key === selectedMetric) || METRICS[1]

  // Filtrar dados para a métrica selecionada
  const filteredChartData = chartData.filter((d) => {
    const value = d[selectedMetricConfig.dataKey as keyof typeof d]
    if (value === null || value === undefined) return false
    
    // Filtrar por tipo de exame se necessário
    if (selectedMetricConfig.filterType !== undefined) {
      return d.tipo === selectedMetricConfig.filterType
    }
    
    return true
  })

  // Preparar marcadores de sessões (formato de data para corresponder ao XAxis)
  const sessionMarkers = sessoes.map((sessao) => {
    const dataSessao = new Date(sessao.data_sessao)
    return dataSessao.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
    })
  })

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
        <CardContent className="pt-16 pb-8">
          <div className="text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">Dados insuficientes</h3>
            <p className="mt-1 text-sm text-gray-500">
              É necessário pelo menos 2 exames para análise de evolução.
            </p>
            {/* Debug temporário - remover depois */}
            <p className="mt-2 text-xs text-gray-400">
              Exames encontrados: {exames.length} | Paciente ID: {pacienteId}
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Filtrar métricas disponíveis baseado nos tipos de exames disponíveis
  const availableMetrics = METRICS.filter((metric) => {
    if (metric.filterType === undefined) return true
    return exames.some((e) => e.tipo === metric.filterType)
  })

  // Se a métrica selecionada não está disponível, selecionar a primeira disponível
  if (!availableMetrics.find(m => m.key === selectedMetric)) {
    if (availableMetrics.length > 0 && selectedMetric !== availableMetrics[0].key) {
      setSelectedMetric(availableMetrics[0].key as MetricKey)
    }
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

      {/* Seletor de Métrica */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary-600" />
            Selecionar Métrica
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {availableMetrics.map((metric) => (
              <Button
                key={metric.key}
                variant={selectedMetric === metric.key ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setSelectedMetric(metric.key)}
                className="justify-start text-left h-auto py-2 px-3"
              >
                <div className="flex flex-col items-start">
                  <span className="text-sm font-medium">{metric.label}</span>
                  <span className="text-xs text-gray-500">{metric.unit}</span>
                </div>
              </Button>
            ))}
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

      {/* Gráfico da Métrica Selecionada */}
      {filteredChartData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>
              Evolução: {selectedMetricConfig.label} ({selectedMetricConfig.unit})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={filteredChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="data" 
                  stroke="#6b7280"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                  formatter={(value: any) => {
                    if (value === null || value === undefined) return '-'
                    return `${Number(value).toFixed(2)} ${selectedMetricConfig.unit}`
                  }}
                />
                <Legend />
                {/* Marcadores de sessões */}
                {sessionMarkers.map((markerDate, index) => {
                  // Verificar se há um ponto de dados próximo a esta data de sessão
                  // (dentro do range de dados do gráfico)
                  const markerTimestamp = new Date(sessoes[index].data_sessao).getTime()
                  const chartStart = filteredChartData[0]?.dataTimestamp || 0
                  const chartEnd = filteredChartData[filteredChartData.length - 1]?.dataTimestamp || 0
                  
                  // Só mostrar marcador se estiver dentro do range do gráfico
                  if (markerTimestamp < chartStart || markerTimestamp > chartEnd) return null
                  
                  return (
                    <ReferenceLine
                      key={index}
                      x={markerDate}
                      stroke="#10B981"
                      strokeDasharray="5 5"
                      strokeWidth={2}
                      label={{ value: 'Sessão', position: 'top', fill: '#10B981', fontSize: 10 }}
                    />
                  )
                })}
                <Line
                  type="monotone"
                  dataKey={selectedMetricConfig.dataKey}
                  stroke={selectedMetricConfig.color}
                  strokeWidth={2}
                  dot={{ fill: selectedMetricConfig.color, r: 5 }}
                  name={`${selectedMetricConfig.label} (${selectedMetricConfig.unit})`}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {filteredChartData.length === 0 && (
        <Card>
          <CardContent className="pt-16 pb-8">
            <div className="text-center">
              <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">Sem dados disponíveis</h3>
              <p className="mt-1 text-sm text-gray-500">
                Não há dados disponíveis para a métrica selecionada no período escolhido.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Componente de Comparação */}
      <ComparacaoExames exames={exames} />

      {/* Espaçamento extra para rodapé */}
      <div className="pb-8" />
    </div>
  )
}
