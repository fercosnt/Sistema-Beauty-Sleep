'use client'

import { AlertCircle, Wrench, UserCheck, Check, Eye, Clock, User } from 'lucide-react'
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
  pacientes?: PacienteInfo | null
}

interface AlertaCardProps {
  alerta: Alerta
  isSelected: boolean
  onSelect: (id: string) => void
  onMarkAsResolved: (id: string) => void
}

export default function AlertaCard({ alerta, isSelected, onSelect, onMarkAsResolved }: AlertaCardProps) {
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

  return (
    <div
      className={cn(
        'rounded-lg border border-gray-200 bg-white p-4 transition-all',
        getUrgenciaColor(alerta.urgencia),
        isSelected && 'ring-2 ring-primary-500',
        alerta.status === 'resolvido' && 'opacity-60'
      )}
    >
      <div className="flex items-start gap-4">
        {/* Checkbox para seleção */}
        <div className="flex-shrink-0 pt-1">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onSelect(alerta.id)}
            className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            disabled={alerta.status === 'resolvido'}
          />
        </div>

        {/* Ícone do tipo */}
        <div className="flex-shrink-0 mt-0.5">
          {getTipoIcon(alerta.tipo)}
        </div>

        {/* Conteúdo */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-sm font-semibold text-gray-900">{alerta.titulo}</h3>
                <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', getStatusColor(alerta.status))}>
                  {alerta.status === 'pendente' ? 'Pendente' : alerta.status === 'resolvido' ? 'Resolvido' : 'Ignorado'}
                </span>
              </div>
              <p className="text-sm text-gray-600 line-clamp-2">{alerta.mensagem}</p>
            </div>
          </div>

          {/* Metadados */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 mt-3">
            <div className="flex items-center gap-1">
              <span className="font-medium">Tipo:</span>
              <span>{getTipoLabel(alerta.tipo)}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-medium">Urgência:</span>
              <span className={cn(
                'px-1.5 py-0.5 rounded',
                alerta.urgencia === 'alta' && 'bg-error-100 text-error-700',
                alerta.urgencia === 'media' && 'bg-warning-100 text-warning-700',
                alerta.urgencia === 'baixa' && 'bg-success-100 text-success-700'
              )}>
                {getUrgenciaLabel(alerta.urgencia)}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{formatTimeAgo(alerta.created_at)}</span>
            </div>
            {alerta.pacientes && (
              <div className="flex items-center gap-1">
                <User className="h-3 w-3" />
                <span>{alerta.pacientes.nome}</span>
              </div>
            )}
          </div>

          {/* Ações */}
          <div className="flex items-center gap-2 mt-4">
            {alerta.paciente_id && (
              <Link href={`/pacientes/${alerta.paciente_id}`}>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
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
                className="flex items-center gap-1"
              >
                <Check className="h-4 w-4" />
                Marcar como Resolvido
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

