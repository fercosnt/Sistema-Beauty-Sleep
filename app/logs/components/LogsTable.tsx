'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Filter, Search, Calendar, User, FileText, RefreshCw, Eye } from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select'
import { showError } from '@/components/ui/Toast'
// Using native Date formatting instead of date-fns

interface AuditLog {
  id: string
  user_id: string | null
  acao: 'INSERT' | 'UPDATE' | 'DELETE'
  entidade: string
  entidade_id: string | null
  detalhes: any
  created_at: string
  users?: {
    nome: string
    email: string
  } | null
}

interface FilterState {
  usuario: string
  entidade: string
  acao: string
  dataInicio: string
  dataFim: string
  search: string
}

const ENTIDADES = [
  { value: 'all', label: 'Todas as Entidades' },
  { value: 'pacientes', label: 'Pacientes' },
  { value: 'sessoes', label: 'Sessões' },
  { value: 'users', label: 'Usuários' },
  { value: 'tags', label: 'Tags' },
  { value: 'exames', label: 'Exames' },
]

const ACOES = [
  { value: 'all', label: 'Todas as Ações' },
  { value: 'INSERT', label: 'Criar' },
  { value: 'UPDATE', label: 'Atualizar' },
  { value: 'DELETE', label: 'Deletar' },
]

export default function LogsTable() {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [filteredLogs, setFilteredLogs] = useState<AuditLog[]>([])
  const [users, setUsers] = useState<Array<{ id: string; nome: string; email: string }>>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const logsPerPage = 100

  const [filters, setFilters] = useState<FilterState>({
    usuario: 'all',
    entidade: 'all',
    acao: 'all',
    dataInicio: '',
    dataFim: '',
    search: '',
  })

  useEffect(() => {
    fetchUsers()
    fetchLogs()
  }, [])

  useEffect(() => {
    applyFilters()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [logs, filters])

  const fetchUsers = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('users')
        .select('id, nome, email')
        .order('nome', { ascending: true })

      if (error) {
        console.error('Erro ao buscar usuários:', error)
        return
      }

      setUsers(data || [])
    } catch (error) {
      console.error('Erro inesperado ao buscar usuários:', error)
    }
  }

  const fetchLogs = async () => {
    try {
      setIsLoading(true)
      const supabase = createClient()

      const { data, error } = await supabase
        .from('audit_logs')
        .select('id, user_id, acao, entidade, entidade_id, detalhes, created_at')
        .order('created_at', { ascending: false })
        .limit(1000) // Buscar mais para permitir filtros

      if (error) {
        console.error('Erro ao buscar logs:', error)
        showError('Erro ao carregar logs')
        return
      }

      if (!data || data.length === 0) {
        setLogs([])
        setIsLoading(false)
        return
      }

      // Buscar nomes dos usuários separadamente para evitar problemas de RLS
      const userIds = [...new Set(data.map((log) => log.user_id).filter(Boolean))]
      const usersMap: Record<string, { nome: string; email: string }> = {}

      if (userIds.length > 0) {
        const { data: usersData, error: usersError } = await supabase
          .from('users')
          .select('id, nome, email')
          .in('id', userIds)

        if (!usersError && usersData) {
          usersData.forEach((user) => {
            usersMap[user.id] = { nome: user.nome, email: user.email }
          })
        }
      }

      const logsComUsuarios = data.map((log) => ({
        ...log,
        users: log.user_id ? usersMap[log.user_id] || null : null,
      }))

      setLogs(logsComUsuarios)
    } catch (error) {
      console.error('Erro inesperado:', error)
      showError('Erro inesperado ao carregar logs')
    } finally {
      setIsLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...logs]

    // Filtro por usuário
    if (filters.usuario !== 'all') {
      filtered = filtered.filter((log) => log.user_id === filters.usuario)
    }

    // Filtro por entidade
    if (filters.entidade !== 'all') {
      filtered = filtered.filter((log) => log.entidade === filters.entidade)
    }

    // Filtro por ação
    if (filters.acao !== 'all') {
      filtered = filtered.filter((log) => log.acao === filters.acao)
    }

    // Filtro por data
    if (filters.dataInicio) {
      const startDate = new Date(filters.dataInicio)
      startDate.setHours(0, 0, 0, 0)
      filtered = filtered.filter((log) => {
        const logDate = new Date(log.created_at)
        return logDate >= startDate
      })
    }

    if (filters.dataFim) {
      const endDate = new Date(filters.dataFim)
      endDate.setHours(23, 59, 59, 999)
      filtered = filtered.filter((log) => {
        const logDate = new Date(log.created_at)
        return logDate <= endDate
      })
    }

    // Filtro por busca (full-text search em detalhes)
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter((log) => {
        const detalhesStr = JSON.stringify(log.detalhes).toLowerCase()
        return (
          detalhesStr.includes(searchLower) ||
          log.entidade.toLowerCase().includes(searchLower) ||
          (log.users?.nome?.toLowerCase().includes(searchLower) ?? false) ||
          (log.users?.email?.toLowerCase().includes(searchLower) ?? false)
        )
      })
    }

    setFilteredLogs(filtered)
    setCurrentPage(1) // Reset to first page when filters change
  }

  const clearFilters = () => {
    setFilters({
      usuario: 'all',
      entidade: 'all',
      acao: 'all',
      dataInicio: '',
      dataFim: '',
      search: '',
    })
  }

  const formatDateTime = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleString('pt-BR', {
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

  const formatAction = (acao: string) => {
    const actions: Record<string, string> = {
      INSERT: 'Criar',
      UPDATE: 'Atualizar',
      DELETE: 'Deletar',
    }
    return actions[acao] || acao
  }

  const getActionColor = (acao: string) => {
    const colors: Record<string, string> = {
      INSERT: 'bg-success-100 text-success-800 border-success-200',
      UPDATE: 'bg-warning-100 text-warning-800 border-warning-200',
      DELETE: 'bg-danger-100 text-danger-800 border-danger-200',
    }
    return colors[acao] || 'bg-gray-100 text-gray-800 border-gray-200'
  }

  const formatDetalhes = (detalhes: any) => {
    if (!detalhes) return '-'
    
    try {
      // Se detalhes é um objeto com 'old' e 'new', mostrar resumo
      if (detalhes.old && detalhes.new) {
        const oldKeys = Object.keys(detalhes.old)
        const newKeys = Object.keys(detalhes.new)
        const changedKeys = oldKeys.filter((key) => detalhes.old[key] !== detalhes.new[key])
        return `${changedKeys.length} campo(s) alterado(s)`
      }
      
      // Se é um objeto simples, mostrar número de campos
      if (typeof detalhes === 'object') {
        const keys = Object.keys(detalhes)
        return `${keys.length} campo(s)`
      }
      
      return JSON.stringify(detalhes).substring(0, 50) + '...'
    } catch {
      return '-'
    }
  }

  const getActiveFiltersCount = () => {
    let count = 0
    if (filters.usuario !== 'all') count++
    if (filters.entidade !== 'all') count++
    if (filters.acao !== 'all') count++
    if (filters.dataInicio) count++
    if (filters.dataFim) count++
    if (filters.search) count++
    return count
  }

  // Pagination
  const totalPages = Math.ceil(filteredLogs.length / logsPerPage)
  const startIndex = (currentPage - 1) * logsPerPage
  const endIndex = startIndex + logsPerPage
  const paginatedLogs = filteredLogs.slice(startIndex, endIndex)

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="h-6 w-6 animate-spin text-primary-600 mr-2" />
            <p className="text-gray-900">Carregando logs...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Filter className="h-5 w-5 text-primary-600" />
            Filtros
            {getActiveFiltersCount() > 0 && (
              <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-primary-600 rounded-full">
                {getActiveFiltersCount()}
              </span>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            {getActiveFiltersCount() > 0 && (
              <Button variant="outline" size="sm" onClick={clearFilters}>
                Limpar Filtros
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={() => setShowFilters(!showFilters)}>
              {showFilters ? 'Ocultar' : 'Mostrar'} Filtros
            </Button>
          </div>
        </CardHeader>
        {showFilters && (
          <CardContent className="pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Busca */}
              <div className="lg:col-span-3">
                <Label htmlFor="search">Buscar nos detalhes</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="search"
                    placeholder="Buscar por texto nos detalhes, entidade, usuário..."
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Filtro por Usuário */}
              <div>
                <Label htmlFor="usuario">Usuário</Label>
                <Select value={filters.usuario} onValueChange={(value) => setFilters({ ...filters, usuario: value })}>
                  <SelectTrigger id="usuario">
                    <SelectValue placeholder="Todos os usuários" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os usuários</SelectItem>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.nome} ({user.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Filtro por Entidade */}
              <div>
                <Label htmlFor="entidade">Entidade</Label>
                <Select value={filters.entidade} onValueChange={(value) => setFilters({ ...filters, entidade: value })}>
                  <SelectTrigger id="entidade">
                    <SelectValue placeholder="Todas as entidades" />
                  </SelectTrigger>
                  <SelectContent>
                    {ENTIDADES.map((entidade) => (
                      <SelectItem key={entidade.value} value={entidade.value}>
                        {entidade.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Filtro por Ação */}
              <div>
                <Label htmlFor="acao">Ação</Label>
                <Select value={filters.acao} onValueChange={(value) => setFilters({ ...filters, acao: value })}>
                  <SelectTrigger id="acao">
                    <SelectValue placeholder="Todas as ações" />
                  </SelectTrigger>
                  <SelectContent>
                    {ACOES.map((acao) => (
                      <SelectItem key={acao.value} value={acao.value}>
                        {acao.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Filtro por Data Início */}
              <div>
                <Label htmlFor="dataInicio">Data Início</Label>
                <Input
                  id="dataInicio"
                  type="date"
                  value={filters.dataInicio}
                  onChange={(e) => setFilters({ ...filters, dataInicio: e.target.value })}
                />
              </div>

              {/* Filtro por Data Fim */}
              <div>
                <Label htmlFor="dataFim">Data Fim</Label>
                <Input
                  id="dataFim"
                  type="date"
                  value={filters.dataFim}
                  onChange={(e) => setFilters({ ...filters, dataFim: e.target.value })}
                />
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              Logs de Auditoria
              <span className="ml-2 text-sm font-normal text-gray-500">
                ({filteredLogs.length} registro{filteredLogs.length !== 1 ? 's' : ''})
              </span>
            </CardTitle>
            <Button variant="outline" size="sm" onClick={fetchLogs} leftIcon={<RefreshCw className="h-4 w-4" />}>
              Atualizar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {filteredLogs.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">Nenhum log encontrado</h3>
              <p className="mt-1 text-sm text-gray-500">
                {getActiveFiltersCount() > 0
                  ? 'Tente ajustar os filtros para ver mais resultados.'
                  : 'Não há logs de auditoria registrados ainda.'}
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data/Hora</TableHead>
                      <TableHead>Usuário</TableHead>
                      <TableHead>Ação</TableHead>
                      <TableHead>Entidade</TableHead>
                      <TableHead>ID Entidade</TableHead>
                      <TableHead>Detalhes</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>
                          <div className="flex items-center gap-2 text-sm text-gray-900">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            {formatDateTime(log.created_at)}
                          </div>
                        </TableCell>
                        <TableCell>
                          {log.users ? (
                            <div className="text-sm">
                              <p className="font-medium text-gray-900">{log.users.nome}</p>
                              <p className="text-xs text-gray-500">{log.users.email}</p>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-500">Sistema</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getActionColor(
                              log.acao
                            )}`}
                          >
                            {formatAction(log.acao)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-gray-900 font-medium">{log.entidade}</span>
                        </TableCell>
                        <TableCell>
                          {log.entidade_id ? (
                            <span className="text-xs text-gray-500 font-mono">
                              {log.entidade_id.substring(0, 8)}...
                            </span>
                          ) : (
                            <span className="text-sm text-gray-400">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <span className="text-xs text-gray-600">{formatDetalhes(log.detalhes)}</span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Link href={`/logs/${log.id}`}>
                            <Button
                              variant="ghost"
                              size="sm"
                              leftIcon={<Eye className="h-4 w-4" />}
                              className="text-primary-600 hover:text-primary-800"
                            >
                              Ver Detalhes
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    Mostrando {startIndex + 1} a {Math.min(endIndex, filteredLogs.length)} de {filteredLogs.length} registros
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                    >
                      Anterior
                    </Button>
                    <span className="text-sm text-gray-600">
                      Página {currentPage} de {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Próxima
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

