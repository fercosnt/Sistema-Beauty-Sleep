'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { History, User, Calendar, ArrowRight, UserPlus, CheckCircle, XCircle, Ban, Filter, Search, BarChart3 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { AlertCircle } from 'lucide-react'

interface HistoricoStatus {
  id: string
  status_anterior: string | null
  status_novo: string
  motivo: string | null
  user_id: string | null
  created_at: string
  users: {
    nome: string
  } | null
}

interface TabHistoricoStatusProps {
  pacienteId: string
}

export default function TabHistoricoStatus({ pacienteId }: TabHistoricoStatusProps) {
  const [historico, setHistorico] = useState<HistoricoStatus[]>([])
  const [historicoFiltrado, setHistoricoFiltrado] = useState<HistoricoStatus[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filtroStatus, setFiltroStatus] = useState<string | null>(null)
  const [filtroDataInicio, setFiltroDataInicio] = useState('')
  const [filtroDataFim, setFiltroDataFim] = useState('')
  const [buscaUsuario, setBuscaUsuario] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    fetchHistorico()
  }, [pacienteId])

  const fetchHistorico = async () => {
    try {
      setIsLoading(true)
      const supabase = createClient()

      // Buscar histórico sem join para evitar erro PGRST201
      const { data: historicoData, error } = await supabase
        .from('historico_status')
        .select('id, status_anterior, status_novo, motivo, user_id, created_at')
        .eq('paciente_id', pacienteId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Erro ao buscar histórico:', error)
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
      setHistoricoFiltrado(historicoComUsuarios)
    } catch (error) {
      console.error('Erro inesperado:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Aplicar filtros
  useEffect(() => {
    let filtrado = [...historico]

    // Filtro por status
    if (filtroStatus) {
      filtrado = filtrado.filter(
        (item) => item.status_anterior === filtroStatus || item.status_novo === filtroStatus
      )
    }

    // Filtro por data
    if (filtroDataInicio) {
      filtrado = filtrado.filter((item) => {
        const itemDate = new Date(item.created_at).toISOString().split('T')[0]
        return itemDate >= filtroDataInicio
      })
    }
    if (filtroDataFim) {
      filtrado = filtrado.filter((item) => {
        const itemDate = new Date(item.created_at).toISOString().split('T')[0]
        return itemDate <= filtroDataFim
      })
    }

    // Busca por usuário
    if (buscaUsuario.trim()) {
      const buscaLower = buscaUsuario.toLowerCase()
      filtrado = filtrado.filter((item) =>
        item.users?.nome.toLowerCase().includes(buscaLower)
      )
    }

    setHistoricoFiltrado(filtrado)
  }, [historico, filtroStatus, filtroDataInicio, filtroDataFim, buscaUsuario])

  // Calcular métricas
  const calcularMetricas = () => {
    if (historico.length === 0) return null

    const metricas = {
      totalMudancas: historico.length,
      mudancasPorStatus: {
        lead: 0,
        ativo: 0,
        finalizado: 0,
        inativo: 0,
      },
      diasEmCadaStatus: {} as Record<string, number>,
    }

    // Contar mudanças por status novo
    historico.forEach((item) => {
      if (item.status_novo in metricas.mudancasPorStatus) {
        metricas.mudancasPorStatus[item.status_novo as keyof typeof metricas.mudancasPorStatus]++
      }
    })

    // Calcular dias em cada status (aproximado)
    const statusAtual = historico[0]?.status_novo || null
    if (statusAtual && historico.length > 0) {
      const primeiraMudanca = new Date(historico[historico.length - 1].created_at)
      const hoje = new Date()
      const diasNoStatusAtual = Math.floor(
        (hoje.getTime() - primeiraMudanca.getTime()) / (1000 * 60 * 60 * 24)
      )
      metricas.diasEmCadaStatus[statusAtual] = diasNoStatusAtual
    }

    return metricas
  }

  const metricas = calcularMetricas()

  const limparFiltros = () => {
    setFiltroStatus(null)
    setFiltroDataInicio('')
    setFiltroDataFim('')
    setBuscaUsuario('')
  }

  const temFiltrosAtivos =
    filtroStatus !== null || filtroDataInicio || filtroDataFim || buscaUsuario.trim()

  // Função para obter cor do status (retorna nome da cor para compatibilidade)
  const getStatusColor = (status: string | null): string => {
    if (!status) return 'neutral'
    switch (status) {
      case 'lead':
        return 'info' // Azul do Design System
      case 'ativo':
        return 'success' // Verde do Design System
      case 'finalizado':
        return 'secondary' // Roxo/Dourado do Design System
      case 'inativo':
        return 'neutral' // Cinza do Design System
      default:
        return 'neutral'
    }
  }

  // Função para obter classe CSS do status usando tokens do Design System
  const getStatusBadgeClass = (status: string | null): string => {
    if (!status) return 'bg-neutral-100 text-neutral-700 border border-neutral-200'
    switch (status) {
      case 'lead':
        return 'bg-info-50 text-info-800 border border-info-200' // Lead: info (azul)
      case 'ativo':
        return 'bg-success-50 text-success-800 border border-success-200' // Ativo: success (verde)
      case 'finalizado':
        return 'bg-secondary-50 text-secondary-800 border border-secondary-200' // Finalizado: secondary (roxo/dourado)
      case 'inativo':
        return 'bg-neutral-200 text-neutral-700 border border-neutral-300' // Inativo: neutral (cinza)
      default:
        return 'bg-neutral-100 text-neutral-700 border border-neutral-200'
    }
  }

  // Função para obter label do status
  const getStatusLabel = (status: string | null): string => {
    if (!status) return '-'
    switch (status) {
      case 'lead':
        return 'Lead'
      case 'ativo':
        return 'Ativo'
      case 'finalizado':
        return 'Finalizado'
      case 'inativo':
        return 'Inativo'
      default:
        return status
    }
  }

  // Função para obter ícone do status
  const getStatusIcon = (status: string | null) => {
    if (!status) return User
    switch (status) {
      case 'lead':
        return UserPlus
      case 'ativo':
        return CheckCircle
      case 'finalizado':
        return CheckCircle
      case 'inativo':
        return Ban
      default:
        return History
    }
  }

  // Função para formatar data/hora
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

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8">
          <p className="text-center text-gray-600">Carregando histórico de status...</p>
        </CardContent>
      </Card>
    )
  }

  if (historico.length === 0) {
    return (
      <Card>
        <CardContent className="pt-16 pb-8">
          <div className="text-center">
            <History className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">Nenhum histórico encontrado</h3>
            <p className="mt-1 text-sm text-gray-500">
              Não há mudanças de status registradas para este paciente.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Métricas e Estatísticas */}
      {metricas && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary-600" />
              Estatísticas do Histórico
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-500 mb-1">Total de Mudanças</p>
                <p className="text-2xl font-bold text-gray-900">{metricas.totalMudancas}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-500 mb-1">Mudanças para Lead</p>
                <p className="text-2xl font-bold text-gray-900">{metricas.mudancasPorStatus.lead}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-500 mb-1">Mudanças para Ativo</p>
                <p className="text-2xl font-bold text-gray-900">{metricas.mudancasPorStatus.ativo}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-500 mb-1">Mudanças para Inativo</p>
                <p className="text-2xl font-bold text-gray-900">{metricas.mudancasPorStatus.inativo}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filtros */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-primary-600" />
              Filtros
            </CardTitle>
            <div className="flex items-center gap-2">
              {temFiltrosAtivos && (
                <Button variant="outline" size="sm" onClick={limparFiltros}>
                  Limpar Filtros
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                {showFilters ? 'Ocultar' : 'Mostrar'} Filtros
              </Button>
            </div>
          </div>
        </CardHeader>
        {showFilters && (
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Busca por Usuário */}
              <div>
                <Label htmlFor="buscaUsuario">Buscar por Usuário</Label>
                <div className="relative mt-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="buscaUsuario"
                    type="text"
                    value={buscaUsuario}
                    onChange={(e) => setBuscaUsuario(e.target.value)}
                    className="pl-10"
                    placeholder="Nome do usuário..."
                  />
                </div>
              </div>

              {/* Filtro por Status */}
              <div>
                <Label>Filtrar por Status</Label>
                <div className="flex gap-2 mt-2 flex-wrap">
                  <Button
                    variant={filtroStatus === null ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setFiltroStatus(null)}
                  >
                    Todos
                  </Button>
                  <Button
                    variant={filtroStatus === 'lead' ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setFiltroStatus('lead')}
                  >
                    Lead
                  </Button>
                  <Button
                    variant={filtroStatus === 'ativo' ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setFiltroStatus('ativo')}
                  >
                    Ativo
                  </Button>
                  <Button
                    variant={filtroStatus === 'finalizado' ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setFiltroStatus('finalizado')}
                  >
                    Finalizado
                  </Button>
                  <Button
                    variant={filtroStatus === 'inativo' ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setFiltroStatus('inativo')}
                  >
                    Inativo
                  </Button>
                </div>
              </div>

              {/* Filtro por Data */}
              <div>
                <Label>Período</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div>
                    <Label htmlFor="dataInicio" className="text-xs">De</Label>
                    <Input
                      id="dataInicio"
                      type="date"
                      value={filtroDataInicio}
                      onChange={(e) => setFiltroDataInicio(e.target.value)}
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <Label htmlFor="dataFim" className="text-xs">Até</Label>
                    <Input
                      id="dataFim"
                      type="date"
                      value={filtroDataFim}
                      onChange={(e) => setFiltroDataFim(e.target.value)}
                      className="text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Lista de Histórico */}
      <div className="space-y-0">
      {historicoFiltrado.length === 0 ? (
        <Card>
          <CardContent className="py-8">
            <div className="text-center">
              <Filter className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">Nenhum resultado encontrado</h3>
              <p className="mt-1 text-sm text-gray-500">
                Tente ajustar os filtros para ver mais resultados.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        historicoFiltrado.map((item, index) => {
        const StatusIconAnterior = getStatusIcon(item.status_anterior)
        const StatusIconNovo = getStatusIcon(item.status_novo)
        const isInativo = item.status_novo === 'inativo'

        return (
          <div key={item.id} className="relative pl-12 pb-4">
            {/* Linha vertical da timeline */}
            {index < historico.length - 1 && (
              <div className="absolute left-5 top-12 bottom-0 w-0.5 bg-gray-200" />
            )}

            {/* Ícone circular do status novo */}
            <div className="absolute left-0 top-2 z-10">
              <div
                className={`h-10 w-10 rounded-full flex items-center justify-center border-2 border-white shadow ${
                  getStatusColor(item.status_novo) === 'info'
                    ? 'bg-info-100'
                    : getStatusColor(item.status_novo) === 'success'
                      ? 'bg-success-100'
                      : getStatusColor(item.status_novo) === 'neutral'
                        ? 'bg-neutral-200'
                        : 'bg-secondary-100'
                }`}
              >
                <StatusIconNovo
                  className={`h-5 w-5 ${
                    getStatusColor(item.status_novo) === 'info'
                      ? 'text-info-600'
                      : getStatusColor(item.status_novo) === 'success'
                        ? 'text-success-600'
                        : getStatusColor(item.status_novo) === 'neutral'
                          ? 'text-neutral-600'
                          : 'text-secondary-600'
                  }`}
                />
              </div>
            </div>

            {/* Card com conteúdo */}
            <Card className="shadow-sm border border-gray-200">
              <CardContent className="p-4 pt-5">
                {/* Data/Hora e Usuário na mesma linha */}
                <div className="flex items-center gap-4 mb-3">
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

                {/* Mudança de Status - linha horizontal */}
                <div className="flex items-center gap-2">
                  {/* Status Anterior */}
                  {item.status_anterior && (
                    <>
                      <div className="flex items-center gap-1.5">
                        <StatusIconAnterior
                          className={`h-4 w-4 ${
                            getStatusColor(item.status_anterior) === 'info'
                              ? 'text-info-600'
                              : getStatusColor(item.status_anterior) === 'success'
                                ? 'text-success-600'
                                : getStatusColor(item.status_anterior) === 'neutral'
                                  ? 'text-neutral-600'
                                  : 'text-secondary-600'
                          }`}
                        />
                        <span
                          className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${getStatusBadgeClass(
                            item.status_anterior
                          )}`}
                        >
                          {getStatusLabel(item.status_anterior)}
                        </span>
                      </div>

                      {/* Seta */}
                      <ArrowRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    </>
                  )}

                  {/* Status Novo */}
                  <div className="flex items-center gap-1.5">
                    <StatusIconNovo
                      className={`h-4 w-4 flex-shrink-0 ${
                        getStatusColor(item.status_novo) === 'info'
                          ? 'text-info-600'
                          : getStatusColor(item.status_novo) === 'success'
                            ? 'text-success-600'
                            : getStatusColor(item.status_novo) === 'neutral'
                              ? 'text-neutral-600'
                              : 'text-secondary-600'
                      }`}
                    />
                    <span
                      className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${getStatusBadgeClass(
                        item.status_novo
                      )}`}
                    >
                      {getStatusLabel(item.status_novo)}
                    </span>
                  </div>
                </div>

                {/* Motivo (se inativo) */}
                {isInativo && item.motivo && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="p-3 bg-error-50 border border-error-200 rounded-lg">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 text-danger-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-xs font-medium text-danger-900 mb-1">Motivo da Inativação</p>
                          <p className="text-sm text-danger-700 whitespace-pre-wrap">{item.motivo}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )
        })
      )}
      </div>
    </div>
  )
}

