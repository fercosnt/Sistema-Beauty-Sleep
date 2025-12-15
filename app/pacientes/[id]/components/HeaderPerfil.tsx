'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { User, Mail, Phone, Calendar, MessageSquare, ChevronDown, Plus, X } from 'lucide-react'
import { showSuccess, showError } from '@/components/ui/Toast'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/Dialog'
import { Textarea } from '@/components/ui/Textarea'
import { Label } from '@/components/ui/Label'
import QuickActions from './QuickActions'

interface Tag {
  id: string
  nome: string
  cor: string
}

interface PacienteTag {
  tag_id: string
  tags: Tag
}

interface Paciente {
  id: string
  nome: string
  cpf: string | null
  email: string | null
  telefone: string | null
  data_nascimento: string | null
  genero: string | null
  status: string
  observacoes_gerais: string | null
  paciente_tags?: PacienteTag[]
}

interface HeaderPerfilProps {
  paciente: Paciente
  onPacienteUpdate?: () => void
}

const STATUS_OPTIONS = [
  { value: 'lead', label: 'Lead' },
  { value: 'ativo', label: 'Ativo' },
  { value: 'finalizado', label: 'Finalizado' },
  { value: 'inativo', label: 'Inativo' },
]

export default function HeaderPerfil({ paciente, onPacienteUpdate }: HeaderPerfilProps) {
  const [userRole, setUserRole] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)
  const [isUpdatingObservacoes, setIsUpdatingObservacoes] = useState(false)
  const [showMotivoModal, setShowMotivoModal] = useState(false)
  const [newStatus, setNewStatus] = useState<string | null>(null)
  const [motivo, setMotivo] = useState('')
  const [observacoesGerais, setObservacoesGerais] = useState(paciente.observacoes_gerais || '')
  const [availableTags, setAvailableTags] = useState<Tag[]>([])
  const [showTagDropdown, setShowTagDropdown] = useState(false)
  const [isAddingTag, setIsAddingTag] = useState(false)
  const [isRemovingTag, setIsRemovingTag] = useState<string | null>(null)

  // Buscar role e ID do usuário
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user?.email) {
          return
        }

        const { data: userData } = await supabase
          .from('users')
          .select('id, role')
          .eq('email', user.email)
          .single()

        if (userData) {
          setUserRole(userData.role)
          setUserId(userData.id)
        }
      } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error)
      }
    }

    fetchUserData()
  }, [])

  // Buscar tags disponíveis
  useEffect(() => {
    const fetchAvailableTags = async () => {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('tags')
          .select('id, nome, cor')
          .order('nome')

        if (error) {
          console.error('Erro ao buscar tags:', error)
          return
        }

        setAvailableTags(data || [])
      } catch (error) {
        console.error('Erro inesperado ao buscar tags:', error)
      }
    }

    fetchAvailableTags()
  }, [])

  // Atualizar observacoes quando paciente mudar
  useEffect(() => {
    setObservacoesGerais(paciente.observacoes_gerais || '')
  }, [paciente.observacoes_gerais])

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

  const formatTelefone = (telefone: string | null) => {
    if (!telefone) return 'N/A'
    const cleaned = telefone.replace(/\D/g, '')
    if (cleaned.length === 11) {
      return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
    } else if (cleaned.length === 10) {
      return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
    }
    return telefone
  }

  const calcularIdade = (dataNascimento: string | null) => {
    if (!dataNascimento) return null
    const hoje = new Date()
    const nascimento = new Date(dataNascimento)
    let idade = hoje.getFullYear() - nascimento.getFullYear()
    const mes = hoje.getMonth() - nascimento.getMonth()
    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
      idade--
    }
    return idade
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

  const canChangeStatus = userRole === 'admin' || userRole === 'equipe'
  const canManageTags = userRole === 'admin' || userRole === 'equipe'

  // Obter tags já atribuídas ao paciente
  const currentTagIds = paciente.paciente_tags?.map((pt) => pt.tag_id) || []
  const tagsDisponiveis = availableTags.filter((tag) => !currentTagIds.includes(tag.id))

  const handleAddTag = async (tagId: string) => {
    if (!canManageTags) {
      showError('Você não tem permissão para adicionar tags')
      return
    }

    setIsAddingTag(true)
    try {
      const supabase = createClient()

      const { error } = await supabase.from('paciente_tags').insert({
        paciente_id: paciente.id,
        tag_id: tagId,
      })

      if (error) {
        console.error('Erro ao adicionar tag:', error)
        showError('Erro ao adicionar tag. Tente novamente.')
        return
      }

      showSuccess('Tag adicionada com sucesso!')
      setShowTagDropdown(false)
      onPacienteUpdate?.()
    } catch (error) {
      console.error('Erro inesperado ao adicionar tag:', error)
      showError('Erro inesperado ao adicionar tag')
    } finally {
      setIsAddingTag(false)
    }
  }

  const handleRemoveTag = async (tagId: string) => {
    if (!canManageTags) {
      showError('Você não tem permissão para remover tags')
      return
    }

    setIsRemovingTag(tagId)
    try {
      const supabase = createClient()

      const { error } = await supabase
        .from('paciente_tags')
        .delete()
        .eq('paciente_id', paciente.id)
        .eq('tag_id', tagId)

      if (error) {
        console.error('Erro ao remover tag:', error)
        showError('Erro ao remover tag. Tente novamente.')
        return
      }

      showSuccess('Tag removida com sucesso!')
      onPacienteUpdate?.()
    } catch (error) {
      console.error('Erro inesperado ao remover tag:', error)
      showError('Erro inesperado ao remover tag')
    } finally {
      setIsRemovingTag(null)
    }
  }

  const handleStatusChange = async (newStatusValue: string) => {
    if (!canChangeStatus) {
      showError('Você não tem permissão para alterar o status')
      return
    }

    if (newStatusValue === paciente.status) {
      return
    }

    // Se mudando para inativo, mostrar modal para pedir motivo
    if (newStatusValue === 'inativo') {
      setNewStatus(newStatusValue)
      setShowMotivoModal(true)
      return
    }

    // Para outros status, atualizar diretamente
    await updateStatus(newStatusValue, null)
  }

  const updateStatus = async (statusValue: string, motivoValue: string | null) => {
    if (!userId) {
      showError('Erro: usuário não identificado')
      return
    }

    setIsUpdatingStatus(true)

    try {
      const supabase = createClient()

      // Atualizar status do paciente
      const { error: updateError } = await supabase
        .from('pacientes')
        .update({ status: statusValue })
        .eq('id', paciente.id)

      if (updateError) {
        console.error('Erro ao atualizar status:', updateError)
        showError('Erro ao atualizar status do paciente')
        setIsUpdatingStatus(false)
        return
      }

      // Atualizar histórico manualmente com user_id (o trigger não passa user_id)
      const { error: historicoError } = await supabase
        .from('historico_status')
        .insert({
          paciente_id: paciente.id,
          status_anterior: paciente.status,
          status_novo: statusValue,
          motivo: motivoValue,
          user_id: userId,
        })

      if (historicoError) {
        console.error('Erro ao registrar histórico:', historicoError)
        // Não mostrar erro ao usuário, pois o status já foi atualizado
      }

      showSuccess('Status atualizado com sucesso!')
      setShowMotivoModal(false)
      setMotivo('')
      setNewStatus(null)
      onPacienteUpdate?.()
    } catch (error) {
      console.error('Erro inesperado ao atualizar status:', error)
      showError('Erro inesperado ao atualizar status')
    } finally {
      setIsUpdatingStatus(false)
    }
  }

  const handleConfirmMotivo = async () => {
    if (!motivo.trim()) {
      showError('Por favor, informe o motivo para inativar o paciente')
      return
    }

    if (newStatus) {
      await updateStatus(newStatus, motivo.trim())
    }
  }

  const handleObservacoesBlur = async () => {
    // Só salvar se o valor mudou
    if (observacoesGerais === (paciente.observacoes_gerais || '')) {
      return
    }

    setIsUpdatingObservacoes(true)

    try {
      const supabase = createClient()

      const { error } = await supabase
        .from('pacientes')
        .update({ observacoes_gerais: observacoesGerais.trim() || null })
        .eq('id', paciente.id)

      if (error) {
        console.error('Erro ao salvar observações:', error)
        showError('Erro ao salvar observações')
        // Reverter para o valor original
        setObservacoesGerais(paciente.observacoes_gerais || '')
        return
      }

      showSuccess('Observações salvas com sucesso!')
      onPacienteUpdate?.()
    } catch (error) {
      console.error('Erro inesperado ao salvar observações:', error)
      showError('Erro inesperado ao salvar observações')
      // Reverter para o valor original
      setObservacoesGerais(paciente.observacoes_gerais || '')
    } finally {
      setIsUpdatingObservacoes(false)
    }
  }

  const idade = calcularIdade(paciente.data_nascimento)
  const telefoneLimpo = paciente.telefone ? paciente.telefone.replace(/\D/g, '') : null
  const whatsappLink = telefoneLimpo ? `https://wa.me/55${telefoneLimpo}` : null

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-2">
                <CardTitle className="text-3xl font-bold text-gray-900 font-heading">{paciente.nome}</CardTitle>
                {canChangeStatus ? (
                  <div className="relative inline-block">
                    <select
                      value={paciente.status}
                      onChange={(e) => handleStatusChange(e.target.value)}
                      disabled={isUpdatingStatus}
                      className={`appearance-none px-4 py-2 pr-10 rounded-full text-sm font-medium capitalize cursor-pointer transition-colors border-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                        getStatusColor(paciente.status)
                      } ${isUpdatingStatus ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {STATUS_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none text-gray-600" />
                  </div>
                ) : (
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(
                      paciente.status
                    )}`}
                  >
                    {paciente.status}
                  </span>
                )}
              </div>
              {idade && (
                <p className="text-gray-600 text-sm">
                  {idade} anos
                  {paciente.genero &&
                    ` • ${paciente.genero === 'M' ? 'Masculino' : paciente.genero === 'F' ? 'Feminino' : 'Outro'}`}
                </p>
              )}
            </div>
            <div className="flex-shrink-0">
              <QuickActions pacienteId={paciente.id} onUpdate={onPacienteUpdate} />
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Tags */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-gray-500">Tags</p>
              {canManageTags && (
                <div className="relative">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowTagDropdown(!showTagDropdown)}
                    disabled={isAddingTag || tagsDisponiveis.length === 0}
                    leftIcon={<Plus className="h-4 w-4" />}
                  >
                    Adicionar Tag
                  </Button>
                  {showTagDropdown && tagsDisponiveis.length > 0 && (
                    <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
                      <div className="p-2">
                        {tagsDisponiveis.map((tag) => (
                          <button
                            key={tag.id}
                            onClick={() => handleAddTag(tag.id)}
                            disabled={isAddingTag}
                            className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-50 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <div
                              className="w-4 h-4 rounded-full border border-gray-300"
                              style={{ backgroundColor: tag.cor }}
                            />
                            <span className="text-sm text-gray-900">{tag.nome}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            {paciente.paciente_tags && paciente.paciente_tags.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {paciente.paciente_tags.map((pt) => (
                  <span
                    key={pt.tag_id}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium text-white"
                    style={{ backgroundColor: pt.tags.cor }}
                  >
                    {pt.tags.nome}
                    {canManageTags && (
                      <button
                        onClick={() => handleRemoveTag(pt.tag_id)}
                        disabled={isRemovingTag === pt.tag_id}
                        className="hover:bg-black/20 rounded-full p-0.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Remover tag"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 italic">Nenhuma tag atribuída</p>
            )}
          </div>

          {/* Informações de Contato */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">CPF</p>
                <p className="text-sm font-medium text-gray-900">{formatCPF(paciente.cpf)}</p>
              </div>
            </div>

            {paciente.email && (
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <a
                    href={`mailto:${paciente.email}`}
                    className="text-sm font-medium text-primary-600 hover:text-primary-800 transition-colors"
                  >
                    {paciente.email}
                  </a>
                </div>
              </div>
            )}

            {paciente.telefone && (
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-gray-400" />
                <div className="flex-1">
                  <p className="text-xs text-gray-500">Telefone</p>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-900">
                      {formatTelefone(paciente.telefone)}
                    </p>
                    {whatsappLink && (
                      <a
                        href={whatsappLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-success-600 hover:text-success-800 transition-colors"
                        title="Abrir WhatsApp"
                      >
                        <MessageSquare className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}

            {paciente.data_nascimento && (
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Data de Nascimento</p>
                  <p className="text-sm font-medium text-gray-900">
                    {formatDate(paciente.data_nascimento)}
                  </p>
                  {idade !== null && (
                    <p className="text-xs text-gray-600 mt-0.5">
                      Idade: <span className="font-medium">{idade} anos</span>
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Observações Gerais */}
          <div className="pt-6 border-t border-gray-200">
            <Label htmlFor="observacoes" className="text-sm font-medium text-gray-900 mb-2 block">
              Observações Gerais
            </Label>
            <Textarea
              id="observacoes"
              value={observacoesGerais}
              onChange={(e) => setObservacoesGerais(e.target.value)}
              onBlur={handleObservacoesBlur}
              placeholder="Adicione observações gerais sobre o paciente..."
              className="min-h-[100px] resize-none"
              disabled={isUpdatingObservacoes}
            />
            {isUpdatingObservacoes && (
              <p className="text-xs text-gray-500 mt-1">Salvando...</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Fechar dropdown quando clicar fora */}
      {showTagDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowTagDropdown(false)}
        />
      )}

      {/* Modal para motivo de inativação */}
      <Dialog open={showMotivoModal} onOpenChange={setShowMotivoModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Motivo da Inativação</DialogTitle>
            <DialogDescription>
              Por favor, informe o motivo para inativar este paciente.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Por favor, informe o motivo para inativar o paciente <strong>{paciente.nome}</strong>:
            </p>
            <div className="space-y-2">
              <Label htmlFor="motivo">
                Motivo <span className="text-danger-600">*</span>
              </Label>
              <Textarea
                id="motivo"
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                placeholder="Ex: Desistiu do tratamento, Mudou de cidade, etc."
                className="min-h-[100px] resize-none"
                disabled={isUpdatingStatus}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowMotivoModal(false)
                setMotivo('')
                setNewStatus(null)
              }}
              disabled={isUpdatingStatus}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={handleConfirmMotivo}
              isLoading={isUpdatingStatus}
              disabled={isUpdatingStatus || !motivo.trim()}
            >
              Confirmar Inativação
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

