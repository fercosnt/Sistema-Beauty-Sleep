'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Edit2, Trash2, Tag } from 'lucide-react'
import ModalNovaTag from '@/components/ModalNovaTag'
import { showSuccess, showError } from '@/components/ui/Toast'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import ContentContainer from '@/components/ui/ContentContainer'

// Force dynamic rendering to avoid prerendering issues with ContentContainer
export const dynamic = 'force-dynamic'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table'

interface TagWithCount {
  id: string
  nome: string
  cor: string
  tipo: string | null
  created_at: string
  paciente_count: number
}

export default function TagsPage() {
  const [tags, setTags] = useState<TagWithCount[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTag, setEditingTag] = useState<TagWithCount | null>(null)

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

  // Buscar tags com contagem de pacientes
  const fetchTags = async () => {
    try {
      setIsLoading(true)
      const supabase = createClient()

      // Buscar todas as tags
      const { data: tagsData, error: tagsError } = await supabase
        .from('tags')
        .select('id, nome, cor, tipo, created_at')
        .order('nome')

      if (tagsError) {
        console.error('Erro ao buscar tags:', tagsError)
        showError('Erro ao carregar tags')
        return
      }

      // Para cada tag, contar quantos pacientes a usam
      const tagsWithCount: TagWithCount[] = await Promise.all(
        (tagsData || []).map(async (tag) => {
          const { count, error: countError } = await supabase
            .from('paciente_tags')
            .select('*', { count: 'exact', head: true })
            .eq('tag_id', tag.id)

          if (countError) {
            console.error(`Erro ao contar pacientes para tag ${tag.id}:`, countError)
            return { ...tag, paciente_count: 0 }
          }

          return {
            ...tag,
            paciente_count: count || 0,
          }
        })
      )

      setTags(tagsWithCount)
    } catch (error) {
      console.error('Erro inesperado ao buscar tags:', error)
      showError('Erro inesperado ao carregar tags')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTags()
  }, [])

  const handleCreateTag = () => {
    setEditingTag(null)
    setIsModalOpen(true)
  }

  const handleEditTag = (tag: TagWithCount) => {
    setEditingTag(tag)
    setIsModalOpen(true)
  }

  const handleDeleteTag = async (tag: TagWithCount) => {
    if (userRole !== 'admin') {
      showError('Apenas administradores podem deletar tags')
      return
    }

    if (tag.paciente_count > 0) {
      const confirmDelete = window.confirm(
        `Esta tag está sendo usada por ${tag.paciente_count} paciente(s). Ao deletar, a tag será removida de todos os pacientes. Deseja continuar?`
      )
      if (!confirmDelete) {
        return
      }
    } else {
      const confirmDelete = window.confirm(
        `Tem certeza que deseja deletar a tag "${tag.nome}"?`
      )
      if (!confirmDelete) {
        return
      }
    }

    try {
      const supabase = createClient()

      // Deletar tag (cascade vai remover paciente_tags automaticamente)
      const { error } = await supabase.from('tags').delete().eq('id', tag.id)

      if (error) {
        console.error('Erro ao deletar tag:', error)
        showError('Erro ao deletar tag')
        return
      }

      showSuccess('Tag deletada com sucesso!')
      fetchTags()
    } catch (error) {
      console.error('Erro inesperado ao deletar tag:', error)
      showError('Erro inesperado ao deletar tag')
    }
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setEditingTag(null)
  }

  const handleModalSuccess = () => {
    fetchTags()
    handleModalClose()
  }

  const canCreateEdit = userRole === 'admin' || userRole === 'equipe'
  const canDelete = userRole === 'admin'

  return (
    <ContentContainer>
      <div className="space-y-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Gestão de Tags</h1>
            <p className="mt-2 text-lg text-white/90">
              Gerencie as tags usadas para categorizar pacientes
            </p>
          </div>
          {canCreateEdit && (
            <Button variant="primary" size="lg" onClick={handleCreateTag} leftIcon={<Plus className="h-5 w-5" />}>
              Nova Tag
            </Button>
          )}
        </div>

      {/* Content */}
      {isLoading ? (
        <Card>
          <CardContent className="p-6">
            <p className="text-gray-700">Carregando tags...</p>
          </CardContent>
        </Card>
      ) : tags.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Tag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <CardTitle className="mb-2">Nenhuma tag cadastrada</CardTitle>
            <CardDescription className="mb-6">
              {canCreateEdit
                ? 'Comece criando sua primeira tag'
                : 'Entre em contato com um administrador para criar tags'}
            </CardDescription>
            {canCreateEdit && (
              <Button variant="primary" onClick={handleCreateTag}>
                Criar Primeira Tag
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Tags Cadastradas</CardTitle>
            <CardDescription>
              {tags.length} {tags.length === 1 ? 'tag cadastrada' : 'tags cadastradas'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tag</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Pacientes</TableHead>
                  <TableHead>Data de Criação</TableHead>
                  {canCreateEdit && <TableHead className="text-right">Ações</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {tags.map((tag) => (
                  <TableRow key={tag.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div
                          className="w-4 h-4 rounded-full border border-gray-300"
                          style={{ backgroundColor: tag.cor }}
                        />
                        <span className="font-medium text-gray-900">{tag.nome}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-gray-700">{tag.tipo || '-'}</span>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium text-gray-900">{tag.paciente_count}</span>
                      <span className="text-sm text-gray-500 ml-1">
                        {tag.paciente_count === 1 ? 'paciente' : 'pacientes'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-gray-700">
                        {new Date(tag.created_at).toLocaleDateString('pt-BR')}
                      </span>
                    </TableCell>
                    {canCreateEdit && (
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditTag(tag)}
                            title="Editar tag"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          {canDelete && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteTag(tag)}
                              title="Deletar tag"
                              className="text-danger-600 hover:text-danger-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

        <ModalNovaTag
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onSuccess={handleModalSuccess}
          editingTag={editingTag}
        />
      </div>
    </ContentContainer>
  )
}
