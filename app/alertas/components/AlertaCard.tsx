'use client'

import { AlertCircle, Wrench, UserCheck, Check, Eye, Clock, User, RotateCcw, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/utils/cn'
import Link from 'next/link'

interface PacienteInfo {
  id: string
  nome: string
}

interface Alerta {
  id: string
  tipo: 'critico' | 'manutencao' | 'followup'
  urgencia: 'alta' | 'media' | 'baixa'
  titulo: string
  mensagem: string
  status: 'pendente' | 'resolvido' | 'ignorado'
  paciente_id: string | null
  exame_id: string | null
  created_at: string
  resolvido_em?: string | null
  pacientes?: PacienteInfo | null
}

interface AlertaCardProps {
  alerta: Alerta
  isSelected: boolean
  onSelect: (id: string) => void
  onMarkAsResolved: (id: string) => void
  onReopen?: (id: string) => void
  onDelete?: (id: string) => void
}

export default function AlertaCard({ alerta, isSelected, onSelect, onMarkAsResolved, onReopen, onDelete }: AlertaCardProps) {
  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'critico':
        return <AlertCircle className="h-5 w-5 text-error-600" />
      case 'manutencao':
        return <Wrench className="h-5 w-5 text-warning-600" />
      case 'followup':
        return <UserCheck className="h-5 w-5 text-primary-600" />
      default:
        return <AlertCircle className="h-5 w-5 text-gray-600" />
    }
  }

  const getTipoLabel = (tipo: string) => {
    switch (tipo) {
      case 'critico':
        return 'Crítico'
      case 'manutencao':
        return 'Manutenção'
      case 'followup':
        return 'Follow-up'
      default:
        return tipo
    }
  }

  const getUrgenciaColor = (urgencia: string) => {
    switch (urgencia) {
      case 'alta':
        return 'border-l-error-500 bg-error-50/50'
      case 'media':
        return 'border-l-warning-500 bg-warning-50/50'
      case 'baixa':
        return 'border-l-success-500 bg-success-50/50'
      default:
        return 'border-l-gray-500 bg-gray-50/50'
    }
  }

  const getUrgenciaLabel = (urgencia: string) => {
    switch (urgencia) {
      case 'alta':
        return 'Alta'
      case 'media':
        return 'Média'
      case 'baixa':
        return 'Baixa'
      default:
        return urgencia
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendente':
        return 'bg-warning-100 text-warning-800'
      case 'resolvido':
        return 'bg-success-100 text-success-800'
      case 'ignorado':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatTimeAgo = (dateString: string): string => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return 'agora'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}min atrás`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h atrás`
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d atrás`
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
  }

  const getDeletionDate = (resolvidoEm: string | null): { date: Date | null; text: string } => {
    if (!resolvidoEm) return { date: null, text: '' }
    
    const resolvidoDate = new Date(resolvidoEm)
    const deletionDate = new Date(resolvidoDate)
    deletionDate.setDate(deletionDate.getDate() + 3) // Adiciona 3 dias
    
    const now = new Date()
    const diffInMs = deletionDate.getTime() - now.getTime()
    const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24))
    
    if (diffInDays < 0) {
      return { date: deletionDate, text: 'Será deletado em breve' }
    } else if (diffInDays === 0) {
      return { date: deletionDate, text: 'Será deletado hoje' }
    } else if (diffInDays === 1) {
      return { date: deletionDate, text: 'Será deletado amanhã' }
    } else {
      const formattedDate = deletionDate.toLocaleDateString('pt-BR', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric' 
      })
      return { date: deletionDate, text: `Será deletado em ${formattedDate} (${diffInDays} dias)` }
    }
  }

  return (
    <div
      className={cn(
        'group relative rounded-xl border-2 bg-white shadow-md transition-all duration-200 hover:shadow-lg overflow-hidden',
        isSelected && 'ring-2 ring-primary-500 border-primary-300 shadow-lg',
        alerta.status === 'resolvido' && 'opacity-75',
        !isSelected && 'border-gray-200 hover:border-gray-300'
      )}
    >
      {/* Borda lateral colorida por urgência - mais espessa e visível */}
      <div className={cn(
        'absolute left-0 top-0 bottom-0 w-2 rounded-l-xl',
        alerta.urgencia === 'alta' && 'bg-error-500',
        alerta.urgencia === 'media' && 'bg-warning-500',
        alerta.urgencia === 'baixa' && 'bg-success-500'
      )} />

      <div className="p-6 pl-8">
        <div className="flex items-start gap-4">
          {/* Checkbox para seleção */}
          <div className="flex-shrink-0 pt-0.5">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => onSelect(alerta.id)}
              className="h-5 w-5 rounded-md border-2 border-gray-300 text-primary-600 focus:ring-2 focus:ring-primary-500 focus:ring-offset-1 focus:border-primary-500 cursor-pointer transition-all hover:border-primary-400 checked:bg-primary-600 checked:border-primary-600"
            />
          </div>

          {/* Ícone do tipo com fundo - mais destacado */}
          <div className={cn(
            'flex-shrink-0 p-3 rounded-xl shadow-sm border-2',
            alerta.tipo === 'critico' && 'bg-error-50 border-error-200',
            alerta.tipo === 'manutencao' && 'bg-warning-50 border-warning-200',
            alerta.tipo === 'followup' && 'bg-primary-50 border-primary-200'
          )}>
            {getTipoIcon(alerta.tipo)}
          </div>

          {/* Conteúdo */}
          <div className="flex-1 min-w-0">
            {/* Header com título e status */}
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-bold text-gray-900">{alerta.titulo}</h3>
                  <span className={cn(
                    'px-3 py-1 rounded-full text-xs font-bold shadow-sm border',
                    getStatusColor(alerta.status),
                    alerta.status === 'pendente' && 'border-warning-300',
                    alerta.status === 'resolvido' && 'border-success-300',
                    alerta.status === 'ignorado' && 'border-gray-300'
                  )}>
                    {alerta.status === 'pendente' ? 'Pendente' : alerta.status === 'resolvido' ? 'Resolvido' : 'Ignorado'}
                  </span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed font-medium">{alerta.mensagem}</p>
              </div>
            </div>

            {/* Metadados em grid - mais destacado */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200" data-tour="alerta-metadados">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-gray-600 whitespace-nowrap">Tipo:</span>
                  <span className={cn(
                    'text-xs font-bold whitespace-nowrap',
                    alerta.tipo === 'critico' && 'text-error-700',
                    alerta.tipo === 'manutencao' && 'text-warning-700',
                    alerta.tipo === 'followup' && 'text-primary-700'
                  )}>
                    {getTipoLabel(alerta.tipo)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-gray-600 whitespace-nowrap">Urgência:</span>
                  <span className={cn(
                    'px-2.5 py-1 rounded-md text-xs font-bold whitespace-nowrap shadow-sm',
                    alerta.urgencia === 'alta' && 'bg-error-100 text-error-800 border border-error-300',
                    alerta.urgencia === 'media' && 'bg-warning-100 text-warning-800 border border-warning-300',
                    alerta.urgencia === 'baixa' && 'bg-success-100 text-success-800 border border-success-300'
                  )}>
                    {getUrgenciaLabel(alerta.urgencia)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500 flex-shrink-0" />
                  <span className="text-xs text-gray-700 font-medium whitespace-nowrap">{formatTimeAgo(alerta.created_at)}</span>
                </div>
                {alerta.pacientes && (
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500 flex-shrink-0" />
                    <span className="text-xs text-gray-700 font-medium truncate">{alerta.pacientes.nome}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Prazo de deleção (apenas para alertas resolvidos) */}
            {alerta.status === 'resolvido' && alerta.resolvido_em && (
              <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500 flex-shrink-0" />
                  <span className="text-xs text-gray-600">
                    {getDeletionDate(alerta.resolvido_em).text}
                  </span>
                </div>
              </div>
            )}

            {/* Ações */}
            <div className="mt-5 relative" data-tour="alerta-acoes">
              <div className="flex items-center gap-2">
                {alerta.paciente_id && (
                  <Link href={`/pacientes/${alerta.paciente_id}`}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1.5 text-gray-700 hover:text-gray-900 border-gray-300 hover:border-gray-400"
                    >
                      <Eye className="h-4 w-4" />
                      Ver Paciente
                    </Button>
                  </Link>
                )}
                {alerta.status === 'pendente' && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => onMarkAsResolved(alerta.id)}
                    className="flex items-center gap-1.5"
                  >
                    <Check className="h-4 w-4" />
                    Marcar como Resolvido
                  </Button>
                )}
                {alerta.status === 'resolvido' && (
                  <div className="flex items-center gap-2">
                    {onReopen && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onReopen(alerta.id)}
                        className="flex items-center gap-1.5 text-warning-700 hover:text-warning-800 border-warning-300 hover:border-warning-400 bg-warning-50 hover:bg-warning-100"
                      >
                        <RotateCcw className="h-4 w-4" />
                        Reabrir Alerta
                      </Button>
                    )}
                    {onDelete && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDelete(alerta.id)}
                        className="flex items-center gap-1.5 text-error-700 hover:text-error-800 border-error-300 hover:border-error-400 bg-error-50 hover:bg-error-100"
                      >
                        <Trash2 className="h-4 w-4" />
                        Deletar
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

