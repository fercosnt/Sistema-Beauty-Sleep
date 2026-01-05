'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { RefreshCw, CheckSquare, Square } from 'lucide-react'
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
  pacientes?: PacienteInfo | null
}

export default function AlertasList() {
  const [alertas, setAlertas] = useState<Alerta[]>([])
  const [filteredAlertas, setFilteredAlertas] = useState<Alerta[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const itemsPerPage = 20

  const [filters, setFilters] = useState<AlertasFiltersState>({
    tipo: [],
    urgencia: [],
    status: [],
  })

  // Buscar alertas
  useEffect(() => {
    fetchAlertas()
  }, [])

  // Aplicar filtros
  useEffect(() => {
    applyFilters()
  }, [alertas, filters])

  const fetchAlertas = async () => {
    try {
      setIsLoading(true)
      const supabase = createClient()

      const { data, error } = await supabase
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
          pacientes(id, nome)
        `)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Erro ao buscar alertas:', error)
        showError('Erro ao carregar alertas')
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
    const pendentesIds = paginatedAlertas
      .filter((a) => a.status === 'pendente')
      .map((a) => a.id)
    
    if (pendentesIds.every((id) => selectedIds.has(id))) {
      // Desmarcar todos
      const newSelected = new Set(selectedIds)
      pendentesIds.forEach((id) => newSelected.delete(id))
      setSelectedIds(newSelected)
    } else {
      // Marcar todos
      const newSelected = new Set(selectedIds)
      pendentesIds.forEach((id) => newSelected.add(id))
      setSelectedIds(newSelected)
    }
  }

  // Marcar como resolvido
  const handleMarkAsResolved = async (id: string) => {
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        showError('Usuário não autenticado')
        return
      }

      const { error } = await supabase
        .from('alertas')
        .update({
          status: 'resolvido',
          resolvido_por: user.id,
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
      }
    } catch (error) {
      console.error('Erro ao marcar alerta como resolvido:', error)
      showError('Erro ao marcar alerta como resolvido')
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
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        showError('Usuário não autenticado')
        return
      }

      const { error } = await supabase
        .from('alertas')
        .update({
          status: 'resolvido',
          resolvido_por: user.id,
          resolvido_em: new Date().toISOString(),
        })
        .in('id', Array.from(selectedIds))

      if (error) {
        console.error('Erro ao resolver alertas selecionados:', error)
        showError('Erro ao resolver alertas selecionados')
      } else {
        showSuccess(`${selectedIds.size} alerta(s) marcado(s) como resolvido(s)`)
        setSelectedIds(new Set())
        fetchAlertas()
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

  const pendentesNaPagina = paginatedAlertas.filter((a) => a.status === 'pendente')
  const todosSelecionados = pendentesNaPagina.length > 0 && pendentesNaPagina.every((a) => selectedIds.has(a.id))

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <AlertasFilters filters={filters} onFiltersChange={setFilters} />

      {/* Ações em lote */}
      {selectedIds.size > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">
                {selectedIds.size} alerta(s) selecionado(s)
              </span>
              <Button
                variant="primary"
                onClick={handleResolveSelected}
                className="flex items-center gap-2"
              >
                <CheckSquare className="h-4 w-4" />
                Resolver Selecionados
              </Button>
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
              className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900"
              type="button"
            >
              {todosSelecionados ? (
                <CheckSquare className="h-5 w-5 text-primary-600" />
              ) : (
                <Square className="h-5 w-5 text-gray-400" />
              )}
              <span>Selecionar todos os pendentes</span>
            </button>
            <span className="text-sm text-gray-500">
              {filteredAlertas.length} {filteredAlertas.length === 1 ? 'alerta' : 'alertas'}
            </span>
          </div>
        )}

        {/* Cards de alertas */}
        {filteredAlertas.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-gray-500">Nenhum alerta encontrado</p>
            </CardContent>
          </Card>
        ) : (
          <>
            {paginatedAlertas.map((alerta) => (
              <AlertaCard
                key={alerta.id}
                alerta={alerta}
                isSelected={selectedIds.has(alerta.id)}
                onSelect={handleSelect}
                onMarkAsResolved={handleMarkAsResolved}
              />
            ))}

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

