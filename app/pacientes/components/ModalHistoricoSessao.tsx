'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { History, User, Calendar, ArrowRight } from 'lucide-react'
import { showError } from '@/components/ui/Toast'
import { Button } from '@/components/ui/Button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/Dialog'
import { Card, CardContent } from '@/components/ui/Card'

interface HistoricoItem {
  id: string
  campo_alterado: string
  valor_anterior: string | null
  valor_novo: string | null
  user_id: string | null
  created_at: string
  users: {
    nome: string
  } | null
}

interface ModalHistoricoSessaoProps {
  isOpen: boolean
  onClose: () => void
  sessaoId: string
}

export default function ModalHistoricoSessao({
  isOpen,
  onClose,
  sessaoId,
}: ModalHistoricoSessaoProps) {
  const [historico, setHistorico] = useState<HistoricoItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (isOpen && sessaoId) {
      fetchHistorico()
    }
  }, [isOpen, sessaoId])

  const fetchHistorico = async () => {
    try {
      setIsLoading(true)
      const supabase = createClient()

      // Buscar histórico da sessão
      const { data: historicoData, error: historicoError } = await supabase
        .from('sessao_historico')
        .select(`
          id,
          campo_alterado,
          valor_anterior,
          valor_novo,
          user_id,
          created_at
        `)
        .eq('sessao_id', sessaoId)
        .order('created_at', { ascending: false })

      if (historicoError) {
        console.error('Erro ao buscar histórico:', historicoError)
        showError('Erro ao carregar histórico de edições')
        return
      }

      if (!historicoData || historicoData.length === 0) {
        setHistorico([])
        return
      }

      // Buscar nomes dos usuários separadamente
      const userIds = [...new Set(historicoData.map((h) => h.user_id).filter(Boolean))]
      const usersMap: Record<string, { nome: string }> = {}

      if (userIds.length > 0) {
        const { data: usersData, error: usersError } = await supabase
          .from('users')
          .select('id, nome')
          .in('id', userIds)

        if (!usersError && usersData) {
          usersData.forEach((user) => {
            usersMap[user.id] = { nome: user.nome }
          })
        }
      }

      // Combinar dados
      const historicoComUsuarios = historicoData.map((item) => ({
        ...item,
        users: item.user_id ? usersMap[item.user_id] || null : null,
      }))

      setHistorico(historicoComUsuarios)
    } catch (error) {
      console.error('Erro inesperado:', error)
      showError('Erro inesperado ao carregar histórico')
    } finally {
      setIsLoading(false)
    }
  }

  const getCampoLabel = (campo: string) => {
    const labels: Record<string, string> = {
      data_sessao: 'Data da Sessão',
      contador_pulsos_inicial: 'Contador Inicial',
      contador_pulsos_final: 'Contador Final',
      protocolo: 'Protocolo',
      observacoes: 'Observações',
    }
    return labels[campo] || campo
  }

  const formatValue = (value: string | null, campo: string) => {
    if (!value) return '-'
    
    if (campo === 'data_sessao') {
      try {
        // Fix timezone issue: parse date as local date, not UTC
        if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
          const [year, month, day] = value.split('-').map(Number)
          const date = new Date(year, month - 1, day) // month is 0-indexed
          return date.toLocaleDateString('pt-BR')
        } else {
          return new Date(value).toLocaleDateString('pt-BR')
        }
      } catch {
        return value
      }
    }
    
    if (campo === 'protocolo') {
      return value.split(',').join(', ')
    }
    
    return value
  }

  const formatDateTime = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch {
      return dateString
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="h-5 w-5 text-primary-600" />
            Histórico de Edições
          </DialogTitle>
          <DialogDescription>
            Visualize todas as alterações realizadas nesta sessão.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="py-8 text-center">
            <p className="text-gray-600">Carregando histórico...</p>
          </div>
        ) : historico.length === 0 ? (
          <div className="py-8 text-center">
            <History className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">Nenhuma edição encontrada</h3>
            <p className="mt-1 text-sm text-gray-500">
              Esta sessão ainda não foi editada.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {historico.map((item, index) => (
              <Card key={item.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDateTime(item.created_at)}</span>
                        </div>
                        {item.users && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <User className="h-4 w-4" />
                            <span>{item.users.nome}</span>
                          </div>
                        )}
                      </div>
                      <div className="mt-3">
                        <p className="text-sm font-medium text-gray-900 mb-2">
                          Campo alterado: <span className="text-primary-600">{getCampoLabel(item.campo_alterado)}</span>
                        </p>
                        <div className="flex items-center gap-3 text-sm">
                          <div className="flex-1 bg-gray-50 rounded-lg p-2 border border-gray-200">
                            <p className="text-xs text-gray-500 mb-1">Valor Anterior</p>
                            <p className="text-gray-900 font-medium">
                              {formatValue(item.valor_anterior, item.campo_alterado)}
                            </p>
                          </div>
                          <ArrowRight className="h-5 w-5 text-gray-400" />
                          <div className="flex-1 bg-primary-50 rounded-lg p-2 border border-primary-200">
                            <p className="text-xs text-primary-600 mb-1">Valor Novo</p>
                            <p className="text-primary-900 font-medium">
                              {formatValue(item.valor_novo, item.campo_alterado)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="flex justify-end pt-4 border-t border-gray-200">
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

