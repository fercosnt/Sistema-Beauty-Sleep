'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { AlertCircle, ExternalLink } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useRouter } from 'next/navigation'

interface CasoCritico {
  paciente_id: string
  paciente_nome: string
  score_ronco: number
  data_ultimo_exame: string
}

interface CasosCriticosRoncoProps {
  dateRange: string
  userRole: string | null
}

export default function CasosCriticosRonco({ dateRange, userRole }: CasosCriticosRoncoProps) {
  const [casos, setCasos] = useState<CasoCritico[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchCasosCriticos()
  }, [dateRange])

  const fetchCasosCriticos = async () => {
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

      // Buscar exames de ronco (tipo = 0) com score > 2 no período
      const { data: exames, error } = await supabase
        .from('exames')
        .select('id, paciente_id, data_exame, score_ronco, pacientes!inner(id, nome)')
        .eq('tipo', 0)
        .gt('score_ronco', 2)
        .gte('data_exame', dataInicial.toISOString().split('T')[0])
        .not('score_ronco', 'is', null)
        .order('score_ronco', { ascending: false })
        .order('data_exame', { ascending: false })

      if (error) {
        console.error('Erro ao buscar casos críticos:', error)
        setCasos([])
        return
      }

      if (!exames || exames.length === 0) {
        setCasos([])
        return
      }

      // Agrupar por paciente e pegar o último exame de cada um
      const casosPorPaciente = new Map<string, CasoCritico>()

      exames.forEach((exame: any) => {
        const pacienteId = exame.paciente_id
        const score = parseFloat(exame.score_ronco)

        // Se já existe um caso para este paciente, verificar se este é mais recente ou tem score maior
        const casoExistente = casosPorPaciente.get(pacienteId)
        
        if (!casoExistente) {
          // Primeiro caso deste paciente
          casosPorPaciente.set(pacienteId, {
            paciente_id: pacienteId,
            paciente_nome: exame.pacientes?.nome || 'N/A',
            score_ronco: score,
            data_ultimo_exame: exame.data_exame,
          })
        } else {
          // Verificar se este exame é mais recente
          const dataExistente = new Date(casoExistente.data_ultimo_exame)
          const dataAtual = new Date(exame.data_exame)
          
          if (dataAtual > dataExistente) {
            // Atualizar com exame mais recente
            casosPorPaciente.set(pacienteId, {
              ...casoExistente,
              score_ronco: score,
              data_ultimo_exame: exame.data_exame,
            })
          }
        }
      })

      // Converter para array e ordenar por score decrescente
      const casosArray = Array.from(casosPorPaciente.values())
        .sort((a, b) => b.score_ronco - a.score_ronco)

      setCasos(casosArray)
    } catch (error) {
      console.error('Erro inesperado ao buscar casos críticos:', error)
      setCasos([])
    } finally {
      setIsLoading(false)
    }
  }

  const isRecepcao = userRole === 'recepcao'

  const handleVerPaciente = (pacienteId: string) => {
    router.push(`/pacientes/${pacienteId}`)
  }

  if (isRecepcao) {
    return null // Recepção não vê casos críticos
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-danger-600" />
          Casos Críticos (Score Ronco {'>'} 2)
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="py-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <p className="mt-4 text-sm text-gray-600">Carregando casos críticos...</p>
          </div>
        ) : casos.length === 0 ? (
          <div className="py-8 text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">Nenhum caso crítico encontrado</h3>
            <p className="mt-1 text-sm text-gray-500">
              Não há pacientes com score de ronco maior que 2 no período selecionado.
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
                    Score Ronco
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Último Exame
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ação
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {casos.map((caso) => (
                  <tr key={caso.paciente_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{caso.paciente_nome}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-danger-100 text-danger-800">
                        {caso.score_ronco.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(caso.data_ultimo_exame).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleVerPaciente(caso.paciente_id)}
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

