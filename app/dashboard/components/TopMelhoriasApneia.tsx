'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { TrendingUp, ExternalLink } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useRouter } from 'next/navigation'
import { calcularMelhoraPercentual } from '@/lib/utils/comparacao-exames'

interface MelhoriaPaciente {
  paciente_id: string
  paciente_nome: string
  ido_inicial: number
  ido_final: number
  melhora_percentual: number
  data_primeiro_exame: string
  data_ultimo_exame: string
}

interface TopMelhoriasApneiaProps {
  dateRange: string
  userRole: string | null
}

export default function TopMelhoriasApneia({ dateRange, userRole }: TopMelhoriasApneiaProps) {
  const [melhorias, setMelhorias] = useState<MelhoriaPaciente[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchMelhorias()
  }, [dateRange])

  const fetchMelhorias = async () => {
    try {
      setIsLoading(true)
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

      // Buscar exames de sono (tipo = 1) com IDO no período
      const { data: exames, error } = await supabase
        .from('exames')
        .select('id, paciente_id, data_exame, ido, pacientes!inner(id, nome)')
        .eq('tipo', 1)
        .gte('data_exame', dataInicial.toISOString().split('T')[0])
        .not('ido', 'is', null)
        .order('data_exame', { ascending: true })

      if (error) {
        console.error('Erro ao buscar melhorias:', error)
        setMelhorias([])
        return
      }

      if (!exames || exames.length === 0) {
        setMelhorias([])
        return
      }

      // Agrupar exames por paciente
      const examesPorPaciente = new Map<string, any[]>()

      exames.forEach((exame: any) => {
        const pacienteId = exame.paciente_id
        if (!examesPorPaciente.has(pacienteId)) {
          examesPorPaciente.set(pacienteId, [])
        }
        examesPorPaciente.get(pacienteId)!.push(exame)
      })

      // Calcular melhorias para cada paciente
      const melhoriasData: MelhoriaPaciente[] = []

      examesPorPaciente.forEach((examesPaciente, pacienteId) => {
        // Ordenar exames por data
        const examesOrdenados = examesPaciente.sort(
          (a, b) => new Date(a.data_exame).getTime() - new Date(b.data_exame).getTime()
        )

        // Pegar primeiro e último exame
        const primeiroExame = examesOrdenados[0]
        const ultimoExame = examesOrdenados[examesOrdenados.length - 1]

        // Só calcular se houver pelo menos 2 exames
        if (examesOrdenados.length >= 2 && primeiroExame.ido !== null && ultimoExame.ido !== null) {
          const idoInicial = parseFloat(primeiroExame.ido)
          const idoFinal = parseFloat(ultimoExame.ido)

          // Calcular % de melhora (IDO menor é melhor, então melhora = redução)
          const melhoraPercentual = calcularMelhoraPercentual(idoInicial, idoFinal, true)

          // Só incluir se houver melhora (redução do IDO)
          if (melhoraPercentual !== null && melhoraPercentual > 0) {
            melhoriasData.push({
              paciente_id: pacienteId,
              paciente_nome: primeiroExame.pacientes?.nome || 'N/A',
              ido_inicial: idoInicial,
              ido_final: idoFinal,
              melhora_percentual: melhoraPercentual,
              data_primeiro_exame: primeiroExame.data_exame,
              data_ultimo_exame: ultimoExame.data_exame,
            })
          }
        }
      })

      // Ordenar por % melhora decrescente e limitar a 10
      const melhoriasOrdenadas = melhoriasData
        .sort((a, b) => b.melhora_percentual - a.melhora_percentual)
        .slice(0, 10)

      setMelhorias(melhoriasOrdenadas)
    } catch (error) {
      console.error('Erro inesperado ao buscar melhorias:', error)
      setMelhorias([])
    } finally {
      setIsLoading(false)
    }
  }

  const isRecepcao = userRole === 'recepcao'

  const handleVerPaciente = (pacienteId: string) => {
    router.push(`/pacientes/${pacienteId}`)
  }

  if (isRecepcao) {
    return null // Recepção não vê melhorias
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-success-600" />
          Top 10 Melhorias (IDO)
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="py-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <p className="mt-4 text-sm text-gray-600">Carregando melhorias...</p>
          </div>
        ) : melhorias.length === 0 ? (
          <div className="py-8 text-center">
            <TrendingUp className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">Nenhuma melhoria encontrada</h3>
            <p className="mt-1 text-sm text-gray-500">
              Não há pacientes com melhoria de IDO no período selecionado.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nome
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    IDO Inicial
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    IDO Final
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    % Melhora
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ação
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {melhorias.map((melhoria) => (
                  <tr key={melhoria.paciente_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{melhoria.paciente_nome}</div>
                      <div className="text-xs text-gray-500">
                        {new Date(melhoria.data_primeiro_exame).toLocaleDateString('pt-BR')} →{' '}
                        {new Date(melhoria.data_ultimo_exame).toLocaleDateString('pt-BR')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-700">{melhoria.ido_inicial.toFixed(1)}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-semibold text-success-600">
                        {melhoria.ido_final.toFixed(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-800 border border-success-200">
                        + {melhoria.melhora_percentual.toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleVerPaciente(melhoria.paciente_id)}
                        className="flex items-center gap-1"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Ver Paciente
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

