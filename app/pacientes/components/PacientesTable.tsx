'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Plus, Search, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/Dialog'
import { Label } from '@/components/ui/Label'
import { showSuccess, showError } from '@/components/ui/Toast'
import FiltrosAvancados, { FiltrosAvancadosState } from './FiltrosAvancados'
import FilterChips from './FilterChips'
import ModalNovoPaciente from './ModalNovoPaciente'

interface Paciente {
  id: string
  nome: string
  cpf: string | null
  status: string
  sessoes_compradas: number
  sessoes_adicionadas: number
  sessoes_utilizadas: number
  created_at: string
  ultimo_exame: string | null
}

interface Tag {
  id: string
  nome: string
  cor: string
}

export default function PacientesTable() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [pacientes, setPacientes] = useState<Paciente[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [tags, setTags] = useState<Tag[]>([])
  const [filtros, setFiltros] = useState<FiltrosAvancadosState>({
    status: [],
    tags: [],
    adesaoMin: 0,
    adesaoMax: 100,
    dataInicio: '',
    dataFim: '',
  })
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [deletingPaciente, setDeletingPaciente] = useState<Paciente | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [confirmDeleteChecked, setConfirmDeleteChecked] = useState(false)
  const itemsPerPage = 20

  // Buscar role do usuário
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user?.email) {
          setUserRole(null)
          return
        }

        const { data: userData } = await supabase
          .from('users')
          .select('role')
          .eq('email', user.email)
          .single()

        setUserRole(userData?.role || null)
      } catch (error) {
        console.error('Erro ao buscar role do usuário:', error)
        setUserRole(null)
      }
    }

    fetchUserRole()
  }, [])

  // Iniciar tour específico da página de pacientes quando vier do dashboard
  useEffect(() => {
    const tourFlow = searchParams.get('tourFlow') as 'admin' | 'equipe' | null
    if (!tourFlow || !userRole) return

    // Importação dinâmica para evitar problemas de SSR
    import('@/components/OnboardingTour').then(({ startPacientesTour }) => {
      startPacientesTour(userRole as 'admin' | 'equipe' | 'recepcao', tourFlow)
    })
  }, [searchParams, userRole])

  // Buscar tags uma vez
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const supabase = createClient()
        const { data, error } = await supabase.from('tags').select('id, nome, cor').order('nome')

        if (error) {
          console.error('Erro ao buscar tags:', error)
          return
        }

        setTags(data || [])
      } catch (error) {
        console.error('Erro inesperado ao buscar tags:', error)
      }
    }

    fetchTags()
  }, [])

  useEffect(() => {
    const fetchPacientes = async () => {
      try {
        setIsLoading(true)
        const supabase = createClient()

        // Se há filtro por tags, primeiro buscar IDs de pacientes que têm essas tags
        let pacienteIdsComTags: string[] | null = null
        if (filtros.tags.length > 0) {
          const { data: pacienteTags } = await supabase
            .from('paciente_tags')
            .select('paciente_id')
            .in('tag_id', filtros.tags)

          if (pacienteTags) {
            // Pegar IDs únicos
            pacienteIdsComTags = [...new Set(pacienteTags.map((pt) => pt.paciente_id))]
          } else {
            // Se não encontrou nenhum paciente com essas tags, retornar vazio
            setPacientes([])
            setTotalPages(1)
            setIsLoading(false)
            return
          }
        }

        // Calcular offset para paginação
        const from = (currentPage - 1) * itemsPerPage
        const to = from + itemsPerPage - 1

        // Query base
        let query = supabase
          .from('pacientes')
          .select('id, nome, cpf, status, sessoes_compradas, sessoes_adicionadas, sessoes_utilizadas, created_at', {
            count: 'exact',
          })

        // Aplicar filtro por tags (via IDs de pacientes)
        if (pacienteIdsComTags !== null) {
          query = query.in('id', pacienteIdsComTags)
        }

        // Aplicar filtro por status
        if (filtros.status.length > 0) {
          query = query.in('status', filtros.status)
        }

        // Aplicar filtro por data de cadastro
        if (filtros.dataInicio) {
          query = query.gte('created_at', filtros.dataInicio)
        }
        if (filtros.dataFim) {
          // Adicionar 1 dia para incluir o dia final completo
          const dataFimPlusOne = new Date(filtros.dataFim)
          dataFimPlusOne.setDate(dataFimPlusOne.getDate() + 1)
          query = query.lt('created_at', dataFimPlusOne.toISOString())
        }

        // Aplicar busca se houver
        if (searchQuery.trim()) {
          const searchTerm = searchQuery.trim()
          // Busca por nome ou CPF
          query = query.or(`nome.ilike.%${searchTerm}%,cpf.ilike.%${searchTerm}%`)
        }

        // Ordenar por nome
        query = query.order('nome', { ascending: true })

        // Aplicar paginação
        const { data, error, count } = await query.range(from, to)

        if (error) {
          console.error('Erro ao buscar pacientes:', error)
          return
        }

        // Buscar último exame de cada paciente e calcular adesão
        const pacientesComUltimoExame = await Promise.all(
          (data || []).map(async (paciente: any) => {
            const { data: ultimoExame } = await supabase
              .from('exames')
              .select('data_exame')
              .eq('paciente_id', paciente.id)
              .order('data_exame', { ascending: false })
              .limit(1)
              .single()

            // Calcular adesão
            const total = (paciente.sessoes_compradas || 0) + (paciente.sessoes_adicionadas || 0)
            const adesao = total > 0 ? ((paciente.sessoes_utilizadas || 0) / total) * 100 : 0

            return {
              ...paciente,
              ultimo_exame: ultimoExame?.data_exame || null,
              adesao,
            }
          })
        )

        // Filtrar por adesão após calcular (não pode ser feito na query SQL diretamente)
        const pacientesFiltradosPorAdesao = pacientesComUltimoExame.filter((paciente: any) => {
          const adesao = paciente.adesao
          return adesao >= filtros.adesaoMin && adesao <= filtros.adesaoMax
        })

        setPacientes(pacientesFiltradosPorAdesao)

        // Para contagem total, precisamos fazer uma query separada sem paginação
        // mas com todos os filtros exceto adesão, depois filtrar por adesão
        let countQuery = supabase.from('pacientes').select('id, sessoes_compradas, sessoes_adicionadas, sessoes_utilizadas', { count: 'exact', head: true })

        if (pacienteIdsComTags !== null) {
          countQuery = countQuery.in('id', pacienteIdsComTags)
        }
        if (filtros.status.length > 0) {
          countQuery = countQuery.in('status', filtros.status)
        }
        if (filtros.dataInicio) {
          countQuery = countQuery.gte('created_at', filtros.dataInicio)
        }
        if (filtros.dataFim) {
          const dataFimPlusOne = new Date(filtros.dataFim)
          dataFimPlusOne.setDate(dataFimPlusOne.getDate() + 1)
          countQuery = countQuery.lt('created_at', dataFimPlusOne.toISOString())
        }
        if (searchQuery.trim()) {
          const searchTerm = searchQuery.trim()
          countQuery = countQuery.or(`nome.ilike.%${searchTerm}%,cpf.ilike.%${searchTerm}%`)
        }

        const { count: totalCount } = await countQuery

        // Ajustar contagem considerando filtro de adesão
        // Como não podemos filtrar adesão na query, vamos usar uma aproximação
        // baseada na proporção de pacientes filtrados na página atual
        const proporcaoFiltrada = data && data.length > 0 ? pacientesFiltradosPorAdesao.length / data.length : 1
        const totalFiltrado = Math.ceil((totalCount || 0) * proporcaoFiltrada)
        setTotalPages(Math.max(1, Math.ceil(totalFiltrado / itemsPerPage)))
      } catch (error) {
        console.error('Erro inesperado ao buscar pacientes:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPacientes()
  }, [currentPage, searchQuery, filtros])

  const calcularAdesao = (paciente: Paciente): number => {
    const total = (paciente.sessoes_compradas || 0) + (paciente.sessoes_adicionadas || 0)
    if (total === 0) return 0
    return ((paciente.sessoes_utilizadas || 0) / total) * 100
  }

  const formatCPF = (cpf: string | null) => {
    if (!cpf) return 'N/A'
    const cleaned = cpf.replace(/\D/g, '')
    if (cleaned.length === 11) {
      return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
    }
    return cpf
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR')
  }

  const isNovo = (createdAt: string) => {
    const created = new Date(createdAt)
    const hoje = new Date()
    const diffTime = Math.abs(hoje.getTime() - created.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= 7
  }

  const getStatusColor = (status: string) => {
    // Usando tokens do Design System
    const colors: Record<string, string> = {
      lead: 'bg-info-50 text-info-800 border border-info-200', // Lead: info (azul)
      ativo: 'bg-success-50 text-success-800 border border-success-200', // Ativo: success (verde)
      finalizado: 'bg-secondary-50 text-secondary-800 border border-secondary-200', // Finalizado: secondary (roxo/dourado)
      inativo: 'bg-neutral-200 text-neutral-700 border border-neutral-300', // Inativo: neutral (cinza)
    }
    return colors[status] || 'bg-neutral-100 text-neutral-700 border border-neutral-200'
  }

  const getAdesaoColor = (adesao: number) => {
    if (adesao >= 80) return 'bg-success-100 text-success-800'
    if (adesao >= 50) return 'bg-warning-100 text-warning-800'
    return 'bg-danger-100 text-danger-800'
  }

  const handleRowClick = (pacienteId: string) => {
    router.push(`/pacientes/${pacienteId}`)
  }

  const handleExcluir = async () => {
    if (!deletingPaciente || !confirmDeleteChecked) {
      showError('Por favor, confirme que você entende que esta ação é permanente')
      return
    }

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/pacientes/deletar?pacienteId=${deletingPaciente.id}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (!response.ok) {
        showError(data.error || 'Erro ao excluir paciente')
        return
      }

      showSuccess('Paciente excluído com sucesso!')
      setDeletingPaciente(null)
      setConfirmDeleteChecked(false)
      // Recarregar lista
      setCurrentPage(1)
      setFiltros({ ...filtros })
    } catch (error) {
      console.error('Erro inesperado ao excluir paciente:', error)
      showError('Erro inesperado ao excluir paciente')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleRemoveFilter = (type: keyof FiltrosAvancadosState, value?: string) => {
    if (type === 'status' && value) {
      setFiltros({ ...filtros, status: filtros.status.filter((s) => s !== value) })
    } else if (type === 'tags' && value) {
      setFiltros({ ...filtros, tags: filtros.tags.filter((t) => t !== value) })
    } else if (type === 'adesaoMin' || type === 'adesaoMax') {
      setFiltros({ ...filtros, adesaoMin: 0, adesaoMax: 100 })
    } else if (type === 'dataInicio') {
      setFiltros({ ...filtros, dataInicio: '' })
    } else if (type === 'dataFim') {
      setFiltros({ ...filtros, dataFim: '' })
    }
  }

  return (
    <div className="space-y-6">
      {/* Header com busca e botão novo */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="relative flex-1 max-w-md" data-tour="pacientes-busca">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nome ou CPF..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setCurrentPage(1) // Reset to first page on search
            }}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 bg-white"
          />
        </div>
        {userRole !== 'recepcao' && (
          <Button
            variant="primary"
            onClick={() => setIsModalOpen(true)}
            leftIcon={<Plus className="h-5 w-5" />}
            className="bg-white/10 hover:bg-white/20 border border-white/30 text-white backdrop-blur-md"
            data-tour="pacientes-novo"
          >
            Novo Paciente
          </Button>
        )}
      </div>

      {/* Filtros Avançados */}
      <FiltrosAvancados filtros={filtros} onFiltrosChange={setFiltros} />

      {/* Chips de Filtros Ativos */}
      <FilterChips filtros={filtros} tags={tags} onRemoveFilter={handleRemoveFilter} />

      {/* Tabela */}
      <div className="bg-white rounded-lg shadow overflow-hidden no-scrollbar" data-tour="pacientes-tabela">
        {isLoading ? (
          <div className="p-8 text-center text-black">Carregando pacientes...</div>
        ) : pacientes.length === 0 ? (
          <div className="p-8 text-center text-black">
            {searchQuery ? 'Nenhum paciente encontrado com essa busca.' : 'Nenhum paciente cadastrado.'}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                      Nome
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                      CPF
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                      Adesão
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                      Último Exame
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pacientes.map((paciente) => {
                    const adesao = calcularAdesao(paciente)
                    return (
                      <tr
                        key={paciente.id}
                        onClick={() => handleRowClick(paciente.id)}
                        className="hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div className="text-sm font-medium text-black">{paciente.nome}</div>
                            {isNovo(paciente.created_at) && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary-100 text-primary-800">
                                Novo
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-black">{formatCPF(paciente.cpf)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(
                              paciente.status
                            )}`}
                          >
                            {paciente.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getAdesaoColor(
                              adesao
                            )}`}
                          >
                            {adesao.toFixed(0)}%
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-black">{formatDate(paciente.ultimo_exame)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleRowClick(paciente.id)
                              }}
                              className="text-primary-600 hover:text-primary-900"
                            >
                              Ver Detalhes
                            </button>
                            {userRole === 'admin' && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setDeletingPaciente(paciente)
                                }}
                                className="text-danger-600 hover:text-danger-900 flex items-center gap-1"
                                title="Excluir paciente permanentemente"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Paginação */}
            {totalPages > 1 && (
              <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
                <div className="text-sm text-black">
                  Página <span className="font-medium">{currentPage}</span> de{' '}
                  <span className="font-medium">{totalPages}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-black hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Anterior
                  </button>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-black hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Próxima
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal Novo Paciente */}
      <ModalNovoPaciente
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          // Refresh the list
          setCurrentPage(1)
          // Trigger re-fetch by updating a dependency
          setFiltros({ ...filtros })
        }}
      />

      {/* Modal Confirmar Exclusão */}
      <Dialog open={!!deletingPaciente} onOpenChange={() => {
        if (!isDeleting) {
          setDeletingPaciente(null)
          setConfirmDeleteChecked(false)
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Esta ação não pode ser desfeita. O paciente será excluído permanentemente do sistema, incluindo todos os exames, sessões e notas relacionados.
            </DialogDescription>
          </DialogHeader>
          {deletingPaciente && (
            <div className="space-y-4">
              <div className="bg-danger-50 border border-danger-200 rounded-lg p-4">
                <p className="text-sm text-danger-800">
                  <strong>Atenção:</strong> Você está prestes a excluir permanentemente o paciente:
                </p>
                <p className="mt-2 font-semibold text-danger-900">{deletingPaciente.nome}</p>
                {deletingPaciente.cpf && (
                  <p className="text-sm text-danger-700">CPF: {formatCPF(deletingPaciente.cpf)}</p>
                )}
              </div>
              <p className="text-sm text-gray-600">
                Todos os dados relacionados a este paciente serão removidos permanentemente:
              </p>
              <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                <li>Exames vinculados</li>
                <li>Sessões registradas</li>
                <li>Notas clínicas</li>
                <li>Histórico de status</li>
                <li>Tags atribuídas</li>
              </ul>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="confirmDeletePaciente"
                  checked={confirmDeleteChecked}
                  onChange={(e) => setConfirmDeleteChecked(e.target.checked)}
                  className="h-4 w-4 text-danger-600 focus:ring-danger-500 border-gray-300 rounded cursor-pointer"
                />
                <Label htmlFor="confirmDeletePaciente" className="cursor-pointer text-sm text-gray-900">
                  Eu entendo que esta ação é permanente e não pode ser desfeita
                </Label>
              </div>
            </div>
          )}
          <DialogFooter className="flex flex-row justify-end gap-2 pt-4 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={() => {
                setDeletingPaciente(null)
                setConfirmDeleteChecked(false)
              }}
              disabled={isDeleting}
            >
              Cancelar
            </Button>
            <button
              onClick={handleExcluir}
              disabled={isDeleting || !confirmDeleteChecked}
              className={`flex items-center justify-center gap-2 px-4 py-2 rounded-md font-medium transition-all ${
                isDeleting || !confirmDeleteChecked
                  ? 'bg-gray-400 text-gray-600 cursor-not-allowed opacity-60'
                  : 'bg-danger-600 hover:bg-danger-700 text-white cursor-pointer'
              }`}
            >
              {isDeleting && (
                <svg
                  className="h-4 w-4 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              )}
              Excluir Permanentemente
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

