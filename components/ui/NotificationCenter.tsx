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
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Buscar alertas pendentes
  useEffect(() => {
    const fetchAlertas = async () => {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
          setIsLoading(false)
          return
        }

        // Buscar alertas pendentes ordenados por data (mais recentes primeiro)
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
          .limit(5)

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

    fetchAlertas()

    // Atualizar a cada 30 segundos
    const interval = setInterval(fetchAlertas, 30000)

    return () => clearInterval(interval)
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

  // Calcular contagem e urgência máxima
  const totalAlertas = alertas.length
  const urgenciaMaxima = alertas.length > 0
    ? alertas.reduce((max, alerta) => {
        const prioridades = { alta: 3, media: 2, baixa: 1 }
        return prioridades[alerta.urgencia] > prioridades[max] ? alerta.urgencia : max
      }, alertas[0].urgencia as 'alta' | 'media' | 'baixa')
    : null

  // Marcar alerta como resolvido
  const handleMarkAsRead = async (alertaId: string) => {
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) return

      const { error } = await supabase
        .from('alertas')
        .update({
          status: 'resolvido',
          resolvido_por: user.id,
          resolvido_em: new Date().toISOString(),
        })
        .eq('id', alertaId)

      if (error) {
        console.error('Erro ao marcar alerta como resolvido:', error)
      } else {
        // Remover alerta da lista local
        setAlertas((prev) => prev.filter((a) => a.id !== alertaId))
      }
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
          <div className="max-h-96 overflow-y-auto">
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
                            className="flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700 transition-colors"
                            type="button"
                          >
                            <Check className="h-3 w-3" />
                            Marcar como lido
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

