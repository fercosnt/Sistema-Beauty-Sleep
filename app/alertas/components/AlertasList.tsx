'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { RefreshCw, CheckSquare, Square, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import AlertasFilters, { AlertasFiltersState } from './AlertasFilters'
import AlertaCard from './AlertaCard'
import { showSuccess, showError } from '@/components/ui/Toast'

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

export default function AlertasList() {
  const searchParams = useSearchParams()
  const [alertas, setAlertas] = useState<Alerta[]>([])
  const [filteredAlertas, setFilteredAlertas] = useState<Alerta[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const itemsPerPage = 20
  const [userRole, setUserRole] = useState<string | null>(null)

  const [filters, setFilters] = useState<AlertasFiltersState>({
    tipo: [],
    urgencia: [],
    status: [],
  })

  // Buscar alertas
  useEffect(() => {
    fetchAlertas()
  }, [])

  // Buscar role do usuário
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const { data: profile, error } = await supabase
            .from('users')
            .select('role')
            .eq('id', user.id)
            .single()
          if (!error && profile) {
            setUserRole(profile.role)
          }
        }
      } catch (error) {
        console.error('Erro ao buscar role do usuário:', error)
      }
    }

    fetchUserRole()
  }, [])

  // Iniciar tour específico da página de alertas quando vier de outra página
  useEffect(() => {
    const tourFlow = searchParams.get('tourFlow') as 'admin' | 'equipe' | null
    if (!tourFlow || !userRole) return

    // Aguardar um pouco para garantir que os elementos estejam renderizados
    const timer = setTimeout(() => {
      // Verificar se os elementos existem antes de iniciar o tour
      const cardElement = document.querySelector('[data-tour="alertas-card"]')
      console.log('[AlertasList] Elemento encontrado:', cardElement)
      console.log('[AlertasList] filteredAlertas.length:', filteredAlertas.length)
      
      // Importação dinâmica para evitar problemas de SSR
      import('@/components/OnboardingTour')
        .then(({ startAlertasTour }) => {
          startAlertasTour(userRole as 'admin' | 'equipe' | 'recepcao', tourFlow)
        })
        .catch((error) => {
          console.error('[AlertasList] Erro ao importar OnboardingTour:', error)
        })
    }, 1000)

    return () => clearTimeout(timer)
  }, [searchParams, userRole, filteredAlertas])

  // Aplicar filtros
  useEffect(() => {
    applyFilters()
  }, [alertas, filters])

  const fetchAlertas = async () => {
    try {
      setIsLoading(true)
      const supabase = createClient()

      // Buscar alertas sem join para evitar erro 406
      const { data: alertasData, error: alertasError } = await supabase
        .from('alertas')
        .select(`
          id,
          tipo,
          urgencia,
          titulo,
          mensagem,
          status,
          paciente_id,
          exame_id,
          created_at,
          resolvido_em
        `)
        .order('created_at', { ascending: false })

      if (alertasError) {
        console.error('Erro ao buscar alertas:', alertasError)
        showError('Erro ao carregar alertas')
        setAlertas([])
        return
      }

      // Buscar pacientes separadamente para evitar erro 406
      const pacienteIds = (alertasData || [])
        .map(a => a.paciente_id)
        .filter((id): id is string => id !== null)
      
      let pacientesMap: Record<string, PacienteInfo> = {}
      
      if (pacienteIds.length > 0) {
        const { data: pacientesData, error: pacientesError } = await supabase
          .from('pacientes')
          .select('id, nome')
          .in('id', pacienteIds)

        if (pacientesError) {
          console.error('Erro ao buscar pacientes:', pacientesError)
          // Continuar mesmo se houver erro ao buscar pacientes
        } else {
          pacientesMap = (pacientesData || []).reduce((acc, p) => {
            acc[p.id] = p
            return acc
          }, {} as Record<string, PacienteInfo>)
        }
      }

      // Combinar alertas com pacientes
      const alertasFormatados = (alertasData || []).map((alerta: any) => ({
        ...alerta,
        pacientes: alerta.paciente_id ? pacientesMap[alerta.paciente_id] || null : null
      }))
      
      setAlertas(alertasFormatados)
    } catch (error) {
      console.error('Erro ao buscar alertas:', error)
      showError('Erro ao carregar alertas')
      setAlertas([])
    } finally {
      setIsLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...alertas]

    // Filtro por tipo
    if (filters.tipo.length > 0) {
      filtered = filtered.filter((a) => filters.tipo.includes(a.tipo))
    }

    // Filtro por urgência
    if (filters.urgencia.length > 0) {
      filtered = filtered.filter((a) => filters.urgencia.includes(a.urgencia))
    }

    // Filtro por status
    if (filters.status.length > 0) {
      filtered = filtered.filter((a) => filters.status.includes(a.status))
    }

    setFilteredAlertas(filtered)
    
    // Calcular paginação
    const total = Math.ceil(filtered.length / itemsPerPage)
    setTotalPages(total || 1)
    if (currentPage > total) {
      setCurrentPage(1)
    }
  }

  // Paginação
  const paginatedAlertas = filteredAlertas.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // Seleção
  const handleSelect = (id: string) => {
    const newSelected = new Set(selectedIds)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedIds(newSelected)
  }

  const handleSelectAll = () => {
    // Incluir todos os alertas (pendentes e resolvidos) na seleção
    const todosIds = paginatedAlertas.map((a) => a.id)
    
    if (todosIds.every((id) => selectedIds.has(id))) {
      // Desmarcar todos
      const newSelected = new Set(selectedIds)
      todosIds.forEach((id) => newSelected.delete(id))
      setSelectedIds(newSelected)
    } else {
      // Marcar todos
      const newSelected = new Set(selectedIds)
      todosIds.forEach((id) => newSelected.add(id))
      setSelectedIds(newSelected)
    }
  }

  // Marcar como resolvido
  const handleMarkAsResolved = async (id: string) => {
    try {
      const supabase = createClient()
      const { data: { user: authUser } } = await supabase.auth.getUser()

      if (!authUser) {
        showError('Usuário não autenticado')
        return
      }

      // Buscar o ID do usuário na tabela users usando o email
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('email', authUser.email)
        .single()

      if (userError || !userData) {
        console.error('Erro ao buscar usuário:', userError)
        showError('Erro ao identificar usuário')
        return
      }

      const { error } = await supabase
        .from('alertas')
        .update({
          status: 'resolvido',
          resolvido_por: userData.id,
          resolvido_em: new Date().toISOString(),
        })
        .eq('id', id)

      if (error) {
        console.error('Erro ao marcar alerta como resolvido:', error)
        showError('Erro ao marcar alerta como resolvido')
      } else {
        showSuccess('Alerta marcado como resolvido')
        setSelectedIds((prev) => {
          const newSet = new Set(prev)
          newSet.delete(id)
          return newSet
        })
        fetchAlertas()
        // Disparar evento para atualizar NotificationCenter
        window.dispatchEvent(new CustomEvent('alerta-resolvido', { detail: { alertaId: id } }))
      }
    } catch (error) {
      console.error('Erro ao marcar alerta como resolvido:', error)
      showError('Erro ao marcar alerta como resolvido')
    }
  }

  // Reabrir alerta (voltar de resolvido para pendente)
  const handleReopen = async (id: string) => {
    try {
      const supabase = createClient()

      const { error } = await supabase
        .from('alertas')
        .update({
          status: 'pendente',
          resolvido_por: null,
          resolvido_em: null,
        })
        .eq('id', id)

      if (error) {
        console.error('Erro ao reabrir alerta:', error)
        showError('Erro ao reabrir alerta')
      } else {
        showSuccess('Alerta reaberto com sucesso')
        setSelectedIds((prev) => {
          const newSet = new Set(prev)
          newSet.delete(id)
          return newSet
        })
        fetchAlertas()
        // Disparar evento para atualizar NotificationCenter
        window.dispatchEvent(new CustomEvent('alerta-reaberto', { detail: { alertaId: id } }))
      }
    } catch (error) {
      console.error('Erro ao reabrir alerta:', error)
      showError('Erro ao reabrir alerta')
    }
  }

  // Deletar alerta
  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar este alerta? Esta ação não pode ser desfeita.')) {
      return
    }

    try {
      const supabase = createClient()

      const { error } = await supabase
        .from('alertas')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Erro ao deletar alerta:', error)
        showError('Erro ao deletar alerta')
      } else {
        showSuccess('Alerta deletado com sucesso')
        setSelectedIds((prev) => {
          const newSet = new Set(prev)
          newSet.delete(id)
          return newSet
        })
        fetchAlertas()
      }
    } catch (error) {
      console.error('Erro ao deletar alerta:', error)
      showError('Erro ao deletar alerta')
    }
  }

  // Deletar selecionados
  const handleDeleteSelected = async () => {
    if (selectedIds.size === 0) {
      showError('Selecione pelo menos um alerta')
      return
    }

    if (!confirm(`Tem certeza que deseja deletar ${selectedIds.size} alerta(s)? Esta ação não pode ser desfeita.`)) {
      return
    }

    try {
      const supabase = createClient()

      const { error } = await supabase
        .from('alertas')
        .delete()
        .in('id', Array.from(selectedIds))

      if (error) {
        console.error('Erro ao deletar alertas selecionados:', error)
        showError('Erro ao deletar alertas selecionados')
      } else {
        showSuccess(`${selectedIds.size} alerta(s) deletado(s) com sucesso`)
        setSelectedIds(new Set())
        fetchAlertas()
      }
    } catch (error) {
      console.error('Erro ao deletar alertas selecionados:', error)
      showError('Erro ao deletar alertas selecionados')
    }
  }

  // Resolver selecionados
  const handleResolveSelected = async () => {
    if (selectedIds.size === 0) {
      showError('Selecione pelo menos um alerta')
      return
    }

    try {
      const supabase = createClient()
      const { data: { user: authUser } } = await supabase.auth.getUser()

      if (!authUser) {
        showError('Usuário não autenticado')
        return
      }

      // Buscar o ID do usuário na tabela users usando o email
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('email', authUser.email)
        .single()

      if (userError || !userData) {
        console.error('Erro ao buscar usuário:', userError)
        showError('Erro ao identificar usuário')
        return
      }

      const { error } = await supabase
        .from('alertas')
        .update({
          status: 'resolvido',
          resolvido_por: userData.id,
          resolvido_em: new Date().toISOString(),
        })
        .in('id', Array.from(selectedIds))

      if (error) {
        console.error('Erro ao resolver alertas selecionados:', error)
        showError('Erro ao resolver alertas selecionados')
      } else {
        showSuccess(`${selectedIds.size} alerta(s) marcado(s) como resolvido(s)`)
        const resolvedIds = Array.from(selectedIds)
        setSelectedIds(new Set())
        fetchAlertas()
        // Disparar evento para atualizar NotificationCenter para cada alerta resolvido
        resolvedIds.forEach((alertaId) => {
          window.dispatchEvent(new CustomEvent('alerta-resolvido', { detail: { alertaId } }))
        })
      }
    } catch (error) {
      console.error('Erro ao resolver alertas selecionados:', error)
      showError('Erro ao resolver alertas selecionados')
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="h-6 w-6 animate-spin text-primary-600 mr-2" />
            <p className="text-gray-900">Carregando alertas...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const todosNaPagina = paginatedAlertas
  const todosSelecionados = todosNaPagina.length > 0 && todosNaPagina.every((a) => selectedIds.has(a.id))

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <AlertasFilters filters={filters} onFiltersChange={setFilters} />

      {/* Ações em lote */}
      {selectedIds.size > 0 && (
        <Card>
          <CardContent className="!p-4 !py-4">
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm font-medium text-gray-700">
                {selectedIds.size} alerta(s) selecionado(s)
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="primary"
                  onClick={handleResolveSelected}
                  className="flex items-center justify-center gap-2 shrink-0"
                >
                  <CheckSquare className="h-4 w-4" />
                  Resolver Selecionados
                </Button>
                <Button
                  variant="outline"
                  onClick={handleDeleteSelected}
                  className="flex items-center justify-center gap-2 shrink-0 text-error-700 hover:text-error-800 border-error-300 hover:border-error-400 bg-error-50 hover:bg-error-100"
                >
                  <Trash2 className="h-4 w-4" />
                  Deletar Selecionados
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lista de alertas */}
      <div className="space-y-4">
        {/* Header com seleção */}
        {filteredAlertas.length > 0 && (
          <div className="flex items-center justify-between">
            <button
              onClick={handleSelectAll}
              className="flex items-center gap-2 text-sm font-medium text-white hover:text-primary-200 transition-colors"
              type="button"
            >
              {todosSelecionados ? (
                <CheckSquare className="h-5 w-5 text-primary-300" />
              ) : (
                <Square className="h-5 w-5 text-white/70" />
              )}
              <span className="text-white">Selecionar todos</span>
            </button>
            <span className="text-sm font-medium text-white">
              {filteredAlertas.length} {filteredAlertas.length === 1 ? 'alerta' : 'alertas'}
            </span>
          </div>
        )}

        {/* Cards de alertas */}
        {filteredAlertas.length === 0 ? (
          <div className="flex justify-center w-full">
            <Card className="w-full max-w-2xl">
              <CardContent className="!p-0 flex items-center justify-center min-h-[150px]">
                <p className="text-gray-500">Nenhum alerta encontrado</p>
              </CardContent>
            </Card>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {paginatedAlertas.map((alerta, index) => (
                <AlertaCard
                  key={alerta.id}
                  alerta={alerta}
                  isSelected={selectedIds.has(alerta.id)}
                  onSelect={handleSelect}
                  onMarkAsResolved={handleMarkAsResolved}
                  onReopen={handleReopen}
                  onDelete={handleDelete}
                  dataTour={index === 0 ? 'alertas-card' : undefined}
                />
              ))}
            </div>

            {/* Paginação */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Anterior
                </Button>
                <span className="text-sm text-gray-700">
                  Página {currentPage} de {totalPages}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Próxima
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

