'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Activity, TrendingUp, AlertCircle } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import CasosCriticosRonco from './CasosCriticosRonco'

interface DashboardRoncoProps {
  userRole: string | null
}

interface KPIData {
  scoreMedioRonco: number
  pacientesRoncoAlto: number
}

interface DistribuicaoRonco {
  name: string
  value: number
  color: string
  [key: string]: string | number // Index signature para compatibilidade com Recharts
}

interface TendenciaData {
  mes: string
  scoreMedio: number
}

interface MelhoriaPaciente {
  paciente_nome: string
  primeiroScore: number
  ultimoScore: number
  melhoria: number
  melhoriaPercentual: number
}

export default function DashboardRonco({ userRole }: DashboardRoncoProps) {
  const [kpiData, setKpiData] = useState<KPIData>({
    scoreMedioRonco: 0,
    pacientesRoncoAlto: 0,
  })
  const [distribuicao, setDistribuicao] = useState<DistribuicaoRonco[]>([])
  const [tendencia, setTendencia] = useState<TendenciaData[]>([])
  const [melhorias, setMelhorias] = useState<MelhoriaPaciente[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [dateRange, setDateRange] = useState<'7' | '30' | '60' | '90' | '180' | '365' | 'all'>('90')

  useEffect(() => {
    const fetchRoncoData = async () => {
      try {
        const supabase = createClient()

        // Calcular data inicial baseada no range selecionado
        const hoje = new Date()
        const dataInicial = new Date()
        
        if (dateRange === '7') {
          dataInicial.setDate(hoje.getDate() - 7)
        } else if (dateRange === '30') {
          dataInicial.setDate(hoje.getDate() - 30)
        } else if (dateRange === '60') {
          dataInicial.setDate(hoje.getDate() - 60)
        } else if (dateRange === '90') {
          dataInicial.setDate(hoje.getDate() - 90)
        } else if (dateRange === '180') {
          dataInicial.setMonth(hoje.getMonth() - 6)
        } else if (dateRange === '365') {
          dataInicial.setFullYear(hoje.getFullYear() - 1)
        } else if (dateRange === 'all') {
          dataInicial.setFullYear(2000) // Data muito antiga para pegar tudo
        } else {
          // Fallback para 90 dias
          dataInicial.setDate(hoje.getDate() - 90)
        }

        // Buscar exames de ronco (tipo = 0) no período
        const { data: exames } = await supabase
          .from('exames')
          .select('id, paciente_id, data_exame, score_ronco, pacientes!inner(nome)')
          .eq('tipo', 0)
          .gte('data_exame', dataInicial.toISOString().split('T')[0])
          .not('score_ronco', 'is', null)
          .order('data_exame', { ascending: true })

        if (!exames || exames.length === 0) {
          setIsLoading(false)
          return
        }

        // KPI: Score Médio de Ronco
        const scores = exames.map((e: any) => parseFloat(e.score_ronco)).filter((s: number) => !isNaN(s))
        const scoreMedio = scores.length > 0 ? scores.reduce((a: number, b: number) => a + b, 0) / scores.length : 0

        // KPI: Pacientes com Ronco Alto (score > 2)
        const pacientesComRoncoAlto = new Set(
          exames
            .filter((e: any) => parseFloat(e.score_ronco) > 2)
            .map((e: any) => e.paciente_id)
        ).size

        setKpiData({
          scoreMedioRonco: scoreMedio,
          pacientesRoncoAlto: pacientesComRoncoAlto,
        })

        // Distribuição de Ronco (Baixo <= 1, Médio 1-2, Alto > 2)
        const distribuicaoData: DistribuicaoRonco[] = [
          { name: 'Baixo (≤1)', value: 0, color: '#22c55e' }, // success-500
          { name: 'Médio (1-2)', value: 0, color: '#f59e0b' }, // warning-500
          { name: 'Alto (>2)', value: 0, color: '#ef4444' }, // danger-500
        ]

        exames.forEach((exame: any) => {
          const score = parseFloat(exame.score_ronco)
          if (score <= 1) {
            distribuicaoData[0].value++
          } else if (score <= 2) {
            distribuicaoData[1].value++
          } else {
            distribuicaoData[2].value++
          }
        })

        setDistribuicao(distribuicaoData)

        // Tendência: Score médio por mês
        const examesPorMes: Record<string, number[]> = {}
        exames.forEach((exame: any) => {
          const data = new Date(exame.data_exame)
          const mesAno = `${data.getMonth() + 1}/${data.getFullYear()}`
          if (!examesPorMes[mesAno]) {
            examesPorMes[mesAno] = []
          }
          examesPorMes[mesAno].push(parseFloat(exame.score_ronco))
        })

        const tendenciaData: TendenciaData[] = Object.entries(examesPorMes)
          .map(([mes, scores]) => ({
            mes,
            scoreMedio: scores.reduce((a, b) => a + b, 0) / scores.length,
          }))
          .sort((a, b) => {
            const [mesA, anoA] = a.mes.split('/').map(Number)
            const [mesB, anoB] = b.mes.split('/').map(Number)
            if (anoA !== anoB) return anoA - anoB
            return mesA - mesB
          })

        setTendencia(tendenciaData)

        // Top 10 Melhorias: Comparar primeiro vs último exame de cada paciente
        const examesPorPaciente: Record<string, any[]> = {}
        exames.forEach((exame: any) => {
          if (!examesPorPaciente[exame.paciente_id]) {
            examesPorPaciente[exame.paciente_id] = []
          }
          examesPorPaciente[exame.paciente_id].push(exame)
        })

        const melhoriasData: MelhoriaPaciente[] = Object.entries(examesPorPaciente)
          .map(([pacienteId, examesPaciente]) => {
            const examesOrdenados = examesPaciente.sort(
              (a, b) => new Date(a.data_exame).getTime() - new Date(b.data_exame).getTime()
            )
            const primeiro = examesOrdenados[0]
            const ultimo = examesOrdenados[examesOrdenados.length - 1]

            const primeiroScore = parseFloat(primeiro.score_ronco)
            const ultimoScore = parseFloat(ultimo.score_ronco)
            const melhoria = primeiroScore - ultimoScore
            const melhoriaPercentual = primeiroScore > 0 ? (melhoria / primeiroScore) * 100 : 0

            return {
              paciente_nome: primeiro.pacientes?.nome || 'N/A',
              primeiroScore,
              ultimoScore,
              melhoria,
              melhoriaPercentual,
            }
          })
          .filter((m) => m.melhoria > 0) // Apenas melhorias
          .sort((a, b) => b.melhoriaPercentual - a.melhoriaPercentual)
          .slice(0, 10)

        setMelhorias(melhoriasData)
      } catch (error) {
        console.error('Erro ao buscar dados de ronco:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRoncoData()
  }, [dateRange])

  const isRecepcao = userRole === 'recepcao'

  const formatValue = (value: number, isPercentage = false, isInteger = false) => {
    if (isRecepcao) return '--'
    if (isPercentage) {
      return `${value.toFixed(1)}%`
    }
    if (isInteger) {
      return Math.round(value).toString()
    }
    return value.toFixed(2)
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filtro de Período */}
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg shadow-lg p-4">
        <label className="text-sm font-medium text-white drop-shadow mr-4">Período:</label>
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value as any)}
          className="bg-white/10 border border-white/30 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/50"
        >
          <option value="7" className="bg-primary-900 text-white">Últimos 7 dias</option>
          <option value="30" className="bg-primary-900 text-white">Últimos 30 dias</option>
          <option value="60" className="bg-primary-900 text-white">Últimos 60 dias</option>
          <option value="90" className="bg-primary-900 text-white">Últimos 90 dias</option>
          <option value="180" className="bg-primary-900 text-white">Últimos 6 meses</option>
          <option value="365" className="bg-primary-900 text-white">Último ano</option>
          <option value="all" className="bg-primary-900 text-white">Todo o período</option>
        </select>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">
              Score Médio de Ronco
            </h3>
            <div className="p-2 rounded-lg bg-primary-600 bg-opacity-10">
              <Activity className="h-5 w-5 text-primary-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{formatValue(kpiData.scoreMedioRonco)}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">
              Total de Pacientes com Ronco Alto
            </h3>
            <div className="p-2 rounded-lg bg-danger-600 bg-opacity-10">
              <AlertCircle className="h-5 w-5 text-danger-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {formatValue(kpiData.pacientesRoncoAlto, false, true)}
          </p>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribuição de Ronco */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribuição de Ronco</h3>
          {distribuicao.some((d) => d.value > 0) ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={distribuicao}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {distribuicao.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-center py-8">Sem dados para exibir</p>
          )}
        </div>

        {/* Tendência de Ronco */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tendência de Score de Ronco</h3>
          {tendencia.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={tendencia}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip
                  formatter={(value: number, name: string) => {
                    if (name === 'Score Médio') {
                      return [value.toFixed(2), name]
                    }
                    return [value, name]
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="scoreMedio" stroke="#0284c7" name="Score Médio" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-center py-8">Sem dados para exibir</p>
          )}
        </div>
      </div>

      {/* Casos Críticos */}
      <CasosCriticosRonco dateRange={dateRange} userRole={userRole} />

      {/* Top 10 Melhorias */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-5 w-5 text-success-600" />
          <h3 className="text-lg font-semibold text-gray-900">Top 10 Melhorias</h3>
        </div>
        {melhorias.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Paciente</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Primeiro Score</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Último Score</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Melhoria</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">% Melhoria</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {melhorias.map((melhoria, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {melhoria.paciente_nome}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatValue(melhoria.primeiroScore)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatValue(melhoria.ultimoScore)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-success-600 font-semibold">
                      -{formatValue(melhoria.melhoria)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-success-600 font-semibold">
                      {formatValue(melhoria.melhoriaPercentual, true)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">Nenhuma melhoria encontrada no período</p>
        )}
      </div>
    </div>
  )
}

