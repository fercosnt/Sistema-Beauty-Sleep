'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Bell, Check, AlertCircle, Wrench, UserCheck, Clock, ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { cn } from '@/utils/cn'
import NotificationBadge from './NotificationBadge'

interface PacienteInfo {
  nome: string
}

interface Alerta {
  id: string
  tipo: 'critico' | 'manutencao' | 'followup'
  urgencia: 'alta' | 'media' | 'baixa'
  titulo: string
  mensagem: string
  paciente_id: string | null
  exame_id: string | null
  created_at: string
  pacientes?: PacienteInfo | null
}

export default function NotificationCenter() {
  const router = useRouter()
  const [alertas, setAlertas] = useState<Alerta[]>([])
  const [totalAlertas, setTotalAlertas] = useState(0)
  const [urgenciaMaxima, setUrgenciaMaxima] = useState<'alta' | 'media' | 'baixa' | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Função para buscar alertas (definida fora do useEffect para poder ser reutilizada)
  const fetchAlertas = async () => {
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        setIsLoading(false)
        return
      }

      // Buscar total de alertas pendentes e urgência máxima (para o badge)
      const { count, error: countError } = await supabase
        .from('alertas')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pendente')

      if (countError) {
        console.error('Erro ao contar alertas:', countError)
      } else {
        setTotalAlertas(count || 0)
      }

      // Buscar urgência máxima entre todos os alertas pendentes
      const { data: allAlertas, error: urgencyError } = await supabase
        .from('alertas')
        .select('urgencia')
        .eq('status', 'pendente')

      if (!urgencyError && allAlertas && allAlertas.length > 0) {
        const prioridades = { alta: 3, media: 2, baixa: 1 }
        const maxUrgencia = allAlertas.reduce((max, alerta) => {
          const prioridadeAtual = prioridades[alerta.urgencia as keyof typeof prioridades] || 0
          const prioridadeMax = prioridades[max as keyof typeof prioridades] || 0
          return prioridadeAtual > prioridadeMax ? alerta.urgencia : max
        }, allAlertas[0].urgencia as 'alta' | 'media' | 'baixa')
        setUrgenciaMaxima(maxUrgencia)
      } else {
        setUrgenciaMaxima(null)
      }

      // Buscar todos os alertas pendentes para exibir no dropdown
      const { data, error } = await supabase
        .from('alertas')
        .select(`
          id,
          tipo,
          urgencia,
          titulo,
          mensagem,
          paciente_id,
          exame_id,
          created_at,
          pacientes(nome)
        `)
        .eq('status', 'pendente')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Erro ao buscar alertas:', error)
        setAlertas([])
      } else {
        // Transformar dados para o formato esperado
        const alertasFormatados = (data || []).map((alerta: any) => ({
          ...alerta,
          pacientes: Array.isArray(alerta.pacientes) && alerta.pacientes.length > 0
            ? alerta.pacientes[0]
            : null
        }))
        setAlertas(alertasFormatados)
      }
    } catch (error) {
      console.error('Erro ao buscar alertas:', error)
      setAlertas([])
    } finally {
      setIsLoading(false)
    }
  }

  // Buscar alertas pendentes
  useEffect(() => {
    fetchAlertas()

    // Atualizar a cada 30 segundos
    const interval = setInterval(fetchAlertas, 30000)

    // Escutar evento quando alerta é resolvido em outra página
    const handleAlertaResolvido = (event: CustomEvent) => {
      const { alertaId } = event.detail
      // Remover alerta da lista local se estiver presente
      setAlertas((prev) => {
        const alertaExiste = prev.some(a => a.id === alertaId)
        if (alertaExiste) {
          return prev.filter((a) => a.id !== alertaId)
        }
        return prev
      })
      // Atualizar contador total
      setTotalAlertas((prev) => Math.max(0, prev - 1))
      // Recarregar dados para garantir sincronização
      fetchAlertas()
    }

    // Escutar evento quando alerta é reaberto em outra página
    const handleAlertaReaberto = async (event: CustomEvent) => {
      const { alertaId } = event.detail
      
      // Buscar dados do alerta reaberto para adicionar à lista
      try {
        const supabase = createClient()
        const { data: alertaReaberto, error } = await supabase
          .from('alertas')
          .select(`
            id,
            tipo,
            urgencia,
            titulo,
            mensagem,
            paciente_id,
            exame_id,
            created_at,
            pacientes(nome)
          `)
          .eq('id', alertaId)
          .eq('status', 'pendente')
          .single()

        if (!error && alertaReaberto) {
          // Transformar dados para o formato esperado
          const alertaFormatado = {
            ...alertaReaberto,
            pacientes: Array.isArray(alertaReaberto.pacientes) && alertaReaberto.pacientes.length > 0
              ? alertaReaberto.pacientes[0]
              : null
          }

          // Adicionar à lista se não estiver presente e se for um dos mais recentes
          setAlertas((prev) => {
            const jaExiste = prev.some(a => a.id === alertaId)
            if (jaExiste) {
              return prev
            }
            // Adicionar no início da lista e manter apenas os 5 mais recentes
            const novaLista = [alertaFormatado, ...prev]
            return novaLista.slice(0, 5)
          })

          // Atualizar contador total
          setTotalAlertas((prev) => prev + 1)

          // Recalcular urgência máxima
          const { data: allAlertas } = await supabase
            .from('alertas')
            .select('urgencia')
            .eq('status', 'pendente')

          if (allAlertas && allAlertas.length > 0) {
            const prioridades = { alta: 3, media: 2, baixa: 1 }
            const maxUrgencia = allAlertas.reduce((max, alerta) => {
              const prioridadeAtual = prioridades[alerta.urgencia as keyof typeof prioridades] || 0
              const prioridadeMax = prioridades[max as keyof typeof prioridades] || 0
              return prioridadeAtual > prioridadeMax ? alerta.urgencia : max
            }, allAlertas[0].urgencia as 'alta' | 'media' | 'baixa')
            setUrgenciaMaxima(maxUrgencia)
          }
        }
      } catch (error) {
        console.error('Erro ao buscar alerta reaberto:', error)
      }

      // Recarregar dados completos para garantir sincronização
      fetchAlertas()
    }

    window.addEventListener('alerta-resolvido', handleAlertaResolvido as EventListener)
    window.addEventListener('alerta-reaberto', handleAlertaReaberto as EventListener)

    return () => {
      clearInterval(interval)
      window.removeEventListener('alerta-resolvido', handleAlertaResolvido as EventListener)
      window.removeEventListener('alerta-reaberto', handleAlertaReaberto as EventListener)
    }
  }, [])

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  // Marcar alerta como resolvido
  const handleMarkAsRead = async (alertaId: string) => {
    try {
      const supabase = createClient()
      const { data: { user: authUser } } = await supabase.auth.getUser()

      if (!authUser) return

      // Buscar o ID do usuário na tabela users usando o email
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('email', authUser.email)
        .single()

      if (userError || !userData) {
        console.error('Erro ao buscar usuário:', userError)
        return
      }

      // Encontrar o alerta antes de removê-lo para verificar urgência
      const alertaRemovido = alertas.find(a => a.id === alertaId)
      const tinhaUrgenciaMaxima = alertaRemovido && alertaRemovido.urgencia === urgenciaMaxima

      // Remover alerta da lista local IMEDIATAMENTE (otimista)
      setAlertas((prev) => prev.filter((a) => a.id !== alertaId))
      // Atualizar contador total IMEDIATAMENTE
      setTotalAlertas((prev) => Math.max(0, prev - 1))

      // Atualizar no banco de dados
      const { error } = await supabase
        .from('alertas')
        .update({
          status: 'resolvido',
          resolvido_por: userData.id,
          resolvido_em: new Date().toISOString(),
        })
        .eq('id', alertaId)

      if (error) {
        console.error('Erro ao marcar alerta como resolvido:', error)
        // Reverter mudanças locais em caso de erro
        // Recarregar dados do servidor
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const { count } = await supabase
            .from('alertas')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'pendente')
          setTotalAlertas(count || 0)
          
          const { data } = await supabase
            .from('alertas')
            .select(`
              id,
              tipo,
              urgencia,
              titulo,
              mensagem,
              paciente_id,
              exame_id,
              created_at,
              pacientes(nome)
            `)
            .eq('status', 'pendente')
            .order('created_at', { ascending: false })
            .limit(5)
          
          if (data) {
            const alertasFormatados = data.map((alerta: any) => ({
              ...alerta,
              pacientes: Array.isArray(alerta.pacientes) && alerta.pacientes.length > 0
                ? alerta.pacientes[0]
                : null
            }))
            setAlertas(alertasFormatados)
          }
        }
        return
      }

      // Se removemos o alerta com urgência máxima, recalcular
      if (tinhaUrgenciaMaxima) {
        const { data: remainingAlertas } = await supabase
          .from('alertas')
          .select('urgencia')
          .eq('status', 'pendente')
        
        if (remainingAlertas && remainingAlertas.length > 0) {
          const prioridades = { alta: 3, media: 2, baixa: 1 }
          const maxUrgencia = remainingAlertas.reduce((max, alerta) => {
            const prioridadeAtual = prioridades[alerta.urgencia as keyof typeof prioridades] || 0
            const prioridadeMax = prioridades[max as keyof typeof prioridades] || 0
            return prioridadeAtual > prioridadeMax ? alerta.urgencia : max
          }, remainingAlertas[0].urgencia as 'alta' | 'media' | 'baixa')
          setUrgenciaMaxima(maxUrgencia)
        } else {
          setUrgenciaMaxima(null)
        }
      }

      // Recarregar lista completa para mostrar todos os alertas pendentes
      // Isso garante que quando um alerta é resolvido, os próximos aparecem
      fetchAlertas()
    } catch (error) {
      console.error('Erro ao marcar alerta como resolvido:', error)
    }
  }

  // Formatar tempo relativo
  const formatTimeAgo = (dateString: string): string => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return 'agora'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}min atrás`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h atrás`
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d atrás`
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
  }

  // Obter ícone por tipo
  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'critico':
        return <AlertCircle className="h-4 w-4 text-error-600" />
      case 'manutencao':
        return <Wrench className="h-4 w-4 text-warning-600" />
      case 'followup':
        return <UserCheck className="h-4 w-4 text-primary-600" />
      default:
        return <Bell className="h-4 w-4 text-gray-600" />
    }
  }

  // Obter cor de urgência
  const getUrgenciaColor = (urgencia: string) => {
    switch (urgencia) {
      case 'alta':
        return 'border-l-error-500'
      case 'media':
        return 'border-l-warning-500'
      case 'baixa':
        return 'border-l-success-500'
      default:
        return 'border-l-gray-500'
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
        aria-label="Notificações"
        type="button"
      >
        <Bell className="h-5 w-5 sm:h-6 sm:w-6" />
        <NotificationBadge count={totalAlertas} urgency={urgenciaMaxima} />
      </button>

      {isOpen && (
        <div
          className="absolute right-0 top-full mt-2 w-80 sm:w-96 rounded-lg border border-neutral-200 bg-white shadow-xl z-[10001] overflow-hidden"
          style={{ pointerEvents: 'auto' }}
        >
          {/* Header */}
          <div className="px-4 py-3 border-b border-neutral-200 bg-neutral-50">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900">Notificações</h3>
              {totalAlertas > 0 && (
                <span className="text-xs text-gray-500">{totalAlertas} {totalAlertas === 1 ? 'alerta' : 'alertas'}</span>
              )}
            </div>
          </div>

          {/* Lista de alertas */}
          <div className="max-h-[600px] overflow-y-auto notification-center-scroll">
            {isLoading ? (
              <div className="px-4 py-8 text-center text-sm text-gray-500">
                Carregando...
              </div>
            ) : alertas.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <Bell className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Nenhuma notificação</p>
              </div>
            ) : (
              <div className="divide-y divide-neutral-100">
                {alertas.map((alerta) => (
                  <div
                    key={alerta.id}
                    className={cn(
                      'px-4 py-3 hover:bg-neutral-50 transition-colors border-l-4',
                      getUrgenciaColor(alerta.urgencia)
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {getTipoIcon(alerta.tipo)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900 line-clamp-1">
                              {alerta.titulo}
                            </p>
                            <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                              {alerta.mensagem}
                            </p>
                            {alerta.pacientes && (
                              <p className="text-xs text-gray-500 mt-1">
                                Paciente: {alerta.pacientes.nome}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Clock className="h-3 w-3" />
                            {formatTimeAgo(alerta.created_at)}
                          </div>
                          <button
                            onClick={() => handleMarkAsRead(alerta.id)}
                            className="flex items-center gap-1 text-xs font-medium text-primary-600 hover:text-primary-700 transition-colors px-2 py-1 rounded hover:bg-primary-50"
                            type="button"
                          >
                            <Check className="h-3 w-3" />
                            Marcar como Resolvido
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {alertas.length > 0 && (
            <div className="px-4 py-3 border-t border-neutral-200 bg-neutral-50">
              <button
                onClick={() => {
                  setIsOpen(false)
                  router.push('/alertas')
                }}
                className="w-full flex items-center justify-center gap-2 text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
                type="button"
              >
                Ver todos os alertas
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

