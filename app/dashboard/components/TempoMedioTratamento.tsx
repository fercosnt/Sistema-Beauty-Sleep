'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Clock } from 'lucide-react'
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts'

interface TempoMedioTratamentoProps {
  userRole: string | null
}

interface SegmentoData {
  categoria: string
  tempoMedio: number
  quantidade: number
  color: string
}

export default function TempoMedioTratamento({ userRole }: TempoMedioTratamentoProps) {
  const [segmentos, setSegmentos] = useState<SegmentoData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchTempoMedio = async () => {
      try {
        const supabase = createClient()

        // Buscar pacientes finalizados com seus exames
        const { data: pacientesFinalizados } = await supabase
          .from('pacientes')
          .select('id, status')
          .eq('status', 'finalizado')

        if (!pacientesFinalizados || pacientesFinalizados.length === 0) {
          setIsLoading(false)
          return
        }

        const pacientesIds = pacientesFinalizados.map((p) => p.id)

        // Buscar primeiro e último exame de cada paciente finalizado
        const pacientesComExames = await Promise.all(
          pacientesIds.map(async (pacienteId) => {
            const { data: exames } = await supabase
              .from('exames')
              .select('id, data_exame, ido_categoria')
              .eq('paciente_id', pacienteId)
              .order('data_exame', { ascending: true })

            if (!exames || exames.length === 0) return null

            const primeiroExame = exames[0]
            const ultimoExame = exames[exames.length - 1]

            // Buscar data de finalização (última sessão ou updated_at quando status mudou para finalizado)
            const { data: ultimaSessao } = await supabase
              .from('sessoes')
              .select('data_sessao')
              .eq('paciente_id', pacienteId)
              .order('data_sessao', { ascending: false })
              .limit(1)
              .single()

            const dataFinalizacao = ultimaSessao?.data_sessao || null

            if (!dataFinalizacao) return null

            const dataPrimeiroExame = new Date(primeiroExame.data_exame)
            const dataFinal = new Date(dataFinalizacao)
            const diffTime = Math.abs(dataFinal.getTime() - dataPrimeiroExame.getTime())
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

            return {
              idoInicial: primeiroExame.ido_categoria,
              tempoDias: diffDays,
            }
          })
        )

        // Filtrar nulls e agrupar por categoria IDO inicial
        const dadosValidos = pacientesComExames.filter((d): d is { idoInicial: number; tempoDias: number } => d !== null)

        const categorias: Record<number, { tempos: number[]; nome: string; color: string }> = {
          0: { tempos: [], nome: 'Normal', color: '#22c55e' }, // success-500
          1: { tempos: [], nome: 'Leve', color: '#f59e0b' }, // warning-500
          2: { tempos: [], nome: 'Moderado', color: '#f97316' }, // orange-500
          3: { tempos: [], nome: 'Acentuado', color: '#ef4444' }, // danger-500
        }

        dadosValidos.forEach((dado) => {
          const categoria = dado.idoInicial
          if (categoria !== null && categoria >= 0 && categoria <= 3) {
            categorias[categoria].tempos.push(dado.tempoDias)
          }
        })

        // Calcular tempo médio por segmento
        const segmentosData: SegmentoData[] = Object.entries(categorias)
          .map(([categoria, dados]) => {
            const categoriaNum = parseInt(categoria)
            if (dados.tempos.length === 0) return null

            const tempoMedio = dados.tempos.reduce((a, b) => a + b, 0) / dados.tempos.length

            return {
              categoria: dados.nome,
              tempoMedio: Math.round(tempoMedio),
              quantidade: dados.tempos.length,
              color: dados.color,
            }
          })
          .filter((s): s is SegmentoData => s !== null)

        setSegmentos(segmentosData)
      } catch (error) {
        console.error('Erro ao buscar tempo médio de tratamento:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTempoMedio()
  }, [])

  const isRecepcao = userRole === 'recepcao'

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="h-5 w-5 text-black" />
          <h3 className="text-lg font-semibold text-black">Tempo Médio de Tratamento</h3>
        </div>
        <div className="animate-pulse">
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (segmentos.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="h-5 w-5 text-black" />
          <h3 className="text-lg font-semibold text-black">Tempo Médio de Tratamento</h3>
        </div>
        <p className="text-black text-center py-8">
          Dados insuficientes para calcular tempo médio de tratamento
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="h-5 w-5 text-primary-600" />
        <h3 className="text-lg font-semibold text-black">Tempo Médio de Tratamento</h3>
      </div>
      <p className="text-sm text-black mb-6">
        Tempo médio entre o primeiro exame e a finalização do tratamento, segmentado por categoria IDO inicial
      </p>

      {isRecepcao ? (
        <p className="text-black text-center py-8">--</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={segmentos}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="categoria" />
            <YAxis label={{ value: 'Dias', angle: -90, position: 'insideLeft' }} />
            <Tooltip
              formatter={(value: number, name: string, props: any) => [
                `${value} dias`,
                `Pacientes: ${props.payload.quantidade}`,
              ]}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
              }}
            />
            <Bar dataKey="tempoMedio" name="Tempo Médio (dias)">
              {segmentos.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}

      {/* Legenda com quantidade de pacientes */}
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
        {segmentos.map((segmento, index) => (
          <div key={index} className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: segmento.color }}></div>
              <span className="text-sm font-medium text-black">{segmento.categoria}</span>
            </div>
            {isRecepcao ? (
              <p className="text-xs text-black">--</p>
            ) : (
              <>
                <p className="text-lg font-bold text-black">{segmento.tempoMedio} dias</p>
                <p className="text-xs text-black">{segmento.quantidade} pacientes</p>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

