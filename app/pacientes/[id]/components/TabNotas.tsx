'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { StickyNote, Plus, Trash2, User, Calendar } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Textarea'
import { showSuccess, showError } from '@/components/ui/Toast'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/Dialog'

interface Nota {
  id: string
  conteudo: string
  created_at: string
  user_id: string
  users: {
    nome: string
  } | null
}

interface TabNotasProps {
  pacienteId: string
}

export default function TabNotas({ pacienteId }: TabNotasProps) {
  const [notas, setNotas] = useState<Nota[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [showNewNoteForm, setShowNewNoteForm] = useState(false)
  const [newNoteContent, setNewNoteContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [notaToDelete, setNotaToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    fetchNotas()
    fetchUserData()
  }, [pacienteId])

  const fetchNotas = async () => {
    try {
      setIsLoading(true)
      const supabase = createClient()

      // Buscar notas sem join para evitar erro PGRST201
      const { data: notasData, error } = await supabase
        .from('notas')
        .select('id, conteudo, created_at, user_id')
        .eq('paciente_id', pacienteId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Erro ao buscar notas:', error)
        return
      }

      if (!notasData || notasData.length === 0) {
        setNotas([])
        return
      }

      // Buscar nomes dos usuários separadamente
      const userIds = [...new Set(notasData.map((n) => n.user_id).filter(Boolean))]
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
      const notasComUsuarios = notasData.map((nota) => ({
        ...nota,
        users: nota.user_id ? usersMap[nota.user_id] || null : null,
      }))

      setNotas(notasComUsuarios)
    } catch (error) {
      console.error('Erro inesperado:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchUserData = async () => {
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (user?.email) {
        const { data: userData } = await supabase
          .from('users')
          .select('id, role')
          .eq('email', user.email)
          .single()

        if (userData) {
          setUserRole(userData.role)
          setUserId(userData.id)
        }
      }
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error)
    }
  }

  const handleSaveNote = async () => {
    if (!userId) {
      showError('Erro: usuário não identificado')
      return
    }

    if (!newNoteContent.trim()) {
      showError('O conteúdo da nota é obrigatório')
      return
    }

    setIsSubmitting(true)

    try {
      const supabase = createClient()

      const { error } = await supabase.from('notas').insert({
        paciente_id: pacienteId,
        user_id: userId,
        conteudo: newNoteContent.trim(),
      })

      if (error) {
        console.error('Erro ao criar nota:', error)
        showError('Erro ao criar nota. Tente novamente.')
        return
      }

      showSuccess('Nota criada com sucesso!')
      setNewNoteContent('')
      setShowNewNoteForm(false)
      fetchNotas()
    } catch (error) {
      console.error('Erro inesperado:', error)
      showError('Erro inesperado ao criar nota')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteNote = async () => {
    if (!notaToDelete) return

    setIsDeleting(true)

    try {
      const supabase = createClient()

      const { error } = await supabase.from('notas').delete().eq('id', notaToDelete)

      if (error) {
        console.error('Erro ao deletar nota:', error)
        showError('Erro ao deletar nota. Tente novamente.')
        return
      }

      showSuccess('Nota deletada com sucesso!')
      setNotaToDelete(null)
      fetchNotas()
    } catch (error) {
      console.error('Erro inesperado:', error)
      showError('Erro inesperado ao deletar nota')
    } finally {
      setIsDeleting(false)
    }
  }

  const canCreateNote = userRole === 'admin' || userRole === 'equipe'
  const canDeleteNote = (nota: Nota) => {
    if (userRole === 'admin') return true
    if (userRole === 'equipe' && nota.user_id === userId) return true
    return false
  }

  // Função para obter iniciais do nome
  const getInitials = (nome: string | null): string => {
    if (!nome) return '?'
    const parts = nome.trim().split(' ')
    if (parts.length === 1) return parts[0][0].toUpperCase()
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
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
          <p className="text-center text-gray-600">Carregando notas...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header com botão Nova Nota */}
      {canCreateNote && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <StickyNote className="h-5 w-5 text-primary-600" />
                Notas Clínicas
              </CardTitle>
              {!showNewNoteForm && (
                <Button onClick={() => setShowNewNoteForm(true)} leftIcon={<Plus className="h-4 w-4" />}>
                  Nova Nota
                </Button>
              )}
            </div>
          </CardHeader>
          {showNewNoteForm && (
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Conteúdo <span className="text-danger-600">*</span>
                  </label>
                  <Textarea
                    value={newNoteContent}
                    onChange={(e) => setNewNoteContent(e.target.value)}
                    className="min-h-[150px]"
                    placeholder="Digite a nota clínica..."
                    disabled={isSubmitting}
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowNewNoteForm(false)
                      setNewNoteContent('')
                    }}
                    disabled={isSubmitting}
                  >
                    Cancelar
                  </Button>
                  <Button onClick={handleSaveNote} isLoading={isSubmitting} disabled={isSubmitting || !newNoteContent.trim()}>
                    Salvar Nota
                  </Button>
                </div>
              </div>
            </CardContent>
          )}
        </Card>
      )}

      {/* Lista de Notas */}
      {notas.length === 0 ? (
        <Card>
          <CardContent className="flex items-center justify-center min-h-[200px] py-8">
            <div className="flex flex-col items-center justify-center text-center w-full">
              <div className="flex items-center justify-center mb-4">
                <StickyNote className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">Nenhuma nota encontrada</h3>
              <p className="mt-1 text-sm text-gray-500">
                {canCreateNote
                  ? 'Comece adicionando uma nova nota clínica.'
                  : 'Não há notas clínicas registradas para este paciente.'}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {notas.map((nota) => (
            <Card key={nota.id}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  {/* Avatar do Autor */}
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                      <span className="text-sm font-semibold text-primary-700">
                        {getInitials(nota.users?.nome || null)}
                      </span>
                    </div>
                  </div>

                  {/* Conteúdo da Nota */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-gray-900">
                          {nota.users?.nome || 'Usuário desconhecido'}
                        </p>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3 w-3 text-gray-400" />
                          <p className="text-xs text-gray-500">{formatDateTime(nota.created_at)}</p>
                        </div>
                      </div>
                      {canDeleteNote(nota) && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setNotaToDelete(nota.id)}
                          className="text-danger-600 hover:text-danger-800 hover:bg-danger-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <div className="mt-3">
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">{nota.conteudo}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Modal de Confirmação de Exclusão */}
      <Dialog open={notaToDelete !== null} onOpenChange={(open) => !open && setNotaToDelete(null)}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja deletar esta nota? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNotaToDelete(null)} disabled={isDeleting}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteNote}
              isLoading={isDeleting}
              disabled={isDeleting}
            >
              Deletar Nota
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

