'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { AlertCircle, Clock, Calendar, CheckCircle } from 'lucide-react'

interface Paciente {
  id: string
  nome: string
  cpf: string | null
  status: string
  created_at?: string
  proxima_manutencao?: string | null
  sessoes_compradas?: number
  sessoes_adicionadas?: number
  sessoes_utilizadas?: number
}

interface AcaoPendente {
  title: string
  count: number
  pacientes: Paciente[]
  icon: typeof AlertCircle
  urgency: 'high' | 'medium' | 'low'
  color: string
}

export default function WidgetAcoesPendentes() {
  const router = useRouter()
  const [acoes, setAcoes] = useState<AcaoPendente[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchAcoesPendentes = async () => {
      try {
        const supabase = createClient()
        const hoje = new Date()
        const seteDiasAtras = new Date(hoje)
        seteDiasAtras.setDate(hoje.getDate() - 7)

        // 1. Leads sem follow-up (status = lead AND created_at < 7 days ago)
        const { data: leadsSemFollowUp } = await supabase
          .from('pacientes')
          .select('id, nome, cpf, status, created_at')
          .eq('status', 'lead')
          .lt('created_at', seteDiasAtras.toISOString())
          .order('created_at', { ascending: true })

        // 2. Pacientes sem sessão (status = ativo AND sessoes_utilizadas = 0)
        const { data: pacientesSemSessao } = await supabase
          .from('pacientes')
          .select('id, nome, cpf, status, sessoes_utilizadas')
          .eq('status', 'ativo')
          .eq('sessoes_utilizadas', 0)
          .order('created_at', { ascending: true })

        // 3. Manutenção atrasada (status = finalizado AND proxima_manutencao < TODAY)
        const { data: manutencaoAtrasada } = await supabase
          .from('pacientes')
          .select('id, nome, cpf, status, proxima_manutencao')
          .eq('status', 'finalizado')
          .lt('proxima_manutencao', hoje.toISOString().split('T')[0])
          .order('proxima_manutencao', { ascending: true })

        // 4. Completando tratamento (sessoes_disponiveis <= 2 AND status = ativo)
        const { data: todosAtivos } = await supabase
          .from('pacientes')
          .select('id, nome, cpf, status, sessoes_compradas, sessoes_adicionadas, sessoes_utilizadas')
          .eq('status', 'ativo')

        const completandoTratamento = todosAtivos
          ?.filter((p) => {
            const total = (p.sessoes_compradas || 0) + (p.sessoes_adicionadas || 0)
            const utilizadas = p.sessoes_utilizadas || 0
            const disponiveis = total - utilizadas
            return disponiveis <= 2 && disponiveis > 0
          })
          .map((p) => ({
            id: p.id,
            nome: p.nome,
            cpf: p.cpf,
            status: p.status,
          })) || []

        const acoesPendentes: AcaoPendente[] = [
          {
            title: 'Leads sem Follow-up',
            count: leadsSemFollowUp?.length || 0,
            pacientes: leadsSemFollowUp || [],
            icon: AlertCircle,
            urgency: 'high',
            color: 'text-danger-600 bg-danger-50',
          },
          {
            title: 'Pacientes sem Sessão',
            count: pacientesSemSessao?.length || 0,
            pacientes: pacientesSemSessao || [],
            icon: Clock,
            urgency: 'high',
            color: 'text-warning-600 bg-warning-50',
          },
          {
            title: 'Manutenção Atrasada',
            count: manutencaoAtrasada?.length || 0,
            pacientes: manutencaoAtrasada || [],
            icon: Calendar,
            urgency: 'medium',
            color: 'text-warning-600 bg-warning-50',
          },
          {
            title: 'Completando Tratamento',
            count: completandoTratamento.length,
            pacientes: completandoTratamento,
            icon: CheckCircle,
            urgency: 'low',
            color: 'text-success-600 bg-success-50',
          },
        ]

        setAcoes(acoesPendentes)
      } catch (error) {
        console.error('Erro ao buscar ações pendentes:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAcoesPendentes()
  }, [])

  const handlePacienteClick = (pacienteId: string) => {
    router.push(`/pacientes/${pacienteId}`)
  }

  const formatCPF = (cpf: string | null) => {
    if (!cpf) return 'N/A'
    const cleaned = cpf.replace(/\D/g, '')
    if (cleaned.length === 11) {
      return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
    }
    return cpf
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Ações Pendentes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const totalAcoes = acoes.reduce((sum, acao) => sum + acao.count, 0)

  if (totalAcoes === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Ações Pendentes</h2>
        <p className="text-gray-500 text-center py-8">Nenhuma ação pendente no momento! 🎉</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Ações Pendentes</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {acoes.map((acao, index) => {
          const Icon = acao.icon
          const badgeColor =
            acao.urgency === 'high'
              ? 'bg-danger-100 text-danger-800'
              : acao.urgency === 'medium'
              ? 'bg-warning-100 text-warning-800'
              : 'bg-success-100 text-success-800'

          return (
            <div
              key={index}
              className={`border rounded-lg p-4 ${acao.count > 0 ? 'border-gray-200' : 'border-gray-100 opacity-50'}`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-lg ${acao.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-medium text-gray-900">{acao.title}</h3>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${badgeColor}`}>
                  {acao.count}
                </span>
              </div>

              {acao.count > 0 && (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {acao.pacientes.slice(0, 5).map((paciente) => (
                    <button
                      key={paciente.id}
                      onClick={() => handlePacienteClick(paciente.id)}
                      className="w-full text-left p-2 rounded hover:bg-gray-50 transition-colors"
                    >
                      <p className="text-sm font-medium text-gray-900">{paciente.nome}</p>
                      <p className="text-xs text-gray-500">CPF: {formatCPF(paciente.cpf)}</p>
                    </button>
                  ))}
                  {acao.pacientes.length > 5 && (
                    <p className="text-xs text-gray-500 text-center pt-2">
                      +{acao.pacientes.length - 5} mais
                    </p>
                  )}
                </div>
              )}

              {acao.count === 0 && (
                <p className="text-sm text-gray-400 text-center py-2">Nenhum paciente</p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

