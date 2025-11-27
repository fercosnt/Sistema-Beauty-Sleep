'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Edit2, Ban, Key, UserCheck, UserX, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table'
import { showSuccess, showError } from '@/components/ui/Toast'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/Dialog'
import { Label } from '@/components/ui/Label'
import ModalNovoUsuario from './ModalNovoUsuario'
import ModalEditarUsuario from './ModalEditarUsuario'

interface User {
  id: string
  nome: string
  email: string
  role: 'admin' | 'equipe' | 'recepcao'
  ativo: boolean
  created_at: string
  ultima_atividade?: string
}

export default function UsuariosTable() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showNovoUsuarioModal, setShowNovoUsuarioModal] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [deletingUser, setDeletingUser] = useState<User | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [confirmDeleteChecked, setConfirmDeleteChecked] = useState(false)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setIsLoading(true)
      const supabase = createClient()

      const { data, error } = await supabase
        .from('users')
        .select('id, nome, email, role, ativo, created_at')
        .order('nome', { ascending: true })

      if (error) {
        console.error('Erro ao buscar usuários:', error)
        showError('Erro ao carregar usuários')
        return
      }

      // Buscar última atividade (último login do auth.users)
      // Nota: Isso requer acesso ao auth.users, que pode não estar disponível via RLS
      // Por enquanto, vamos usar created_at como placeholder
      const usersWithActivity = (data || []).map((user) => ({
        ...user,
        ultima_atividade: user.created_at, // Placeholder - idealmente buscar de auth.users
      }))

      setUsers(usersWithActivity)
    } catch (error) {
      console.error('Erro inesperado ao buscar usuários:', error)
      showError('Erro inesperado ao carregar usuários')
    } finally {
      setIsLoading(false)
    }
  }

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      admin: 'Administrador',
      equipe: 'Equipe',
      recepcao: 'Recepção',
    }
    return labels[role] || role
  }

  const getRoleBadgeClass = (role: string) => {
    const classes: Record<string, string> = {
      admin: 'bg-danger-100 text-danger-800',
      equipe: 'bg-primary-100 text-primary-800',
      recepcao: 'bg-success-100 text-success-800',
    }
    return classes[role] || 'bg-gray-100 text-gray-800'
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
    } catch {
      return dateString
    }
  }

  const handleDesativar = async (userId: string, currentStatus: boolean) => {
    if (!confirm(`Tem certeza que deseja ${currentStatus ? 'desativar' : 'ativar'} este usuário?`)) {
      return
    }

    try {
      const supabase = createClient()

      const { error } = await supabase
        .from('users')
        .update({ ativo: !currentStatus })
        .eq('id', userId)

      if (error) {
        console.error('Erro ao atualizar usuário:', error)
        showError('Erro ao atualizar status do usuário')
        return
      }

      showSuccess(`Usuário ${currentStatus ? 'desativado' : 'ativado'} com sucesso!`)
      fetchUsers()
    } catch (error) {
      console.error('Erro inesperado ao atualizar usuário:', error)
      showError('Erro inesperado ao atualizar usuário')
    }
  }

  const handleResetarSenha = async (email: string) => {
    if (!confirm(`Deseja enviar um email de redefinição de senha para ${email}?`)) {
      return
    }

    try {
      const supabase = createClient()

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/login?reset=true`,
      })

      if (error) {
        console.error('Erro ao enviar email de reset:', error)
        showError('Erro ao enviar email de redefinição de senha')
        return
      }

      showSuccess('Email de redefinição de senha enviado com sucesso!')
    } catch (error) {
      console.error('Erro inesperado ao enviar email:', error)
      showError('Erro inesperado ao enviar email')
    }
  }

  const handleExcluir = async () => {
    if (!deletingUser || !confirmDeleteChecked) {
      showError('Por favor, confirme que você entende que esta ação é permanente')
      return
    }

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/usuarios/deletar?userId=${deletingUser.id}&email=${encodeURIComponent(deletingUser.email)}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (!response.ok) {
        showError(data.error || 'Erro ao excluir usuário')
        return
      }

      showSuccess('Usuário excluído com sucesso!')
      setDeletingUser(null)
      fetchUsers()
    } catch (error) {
      console.error('Erro inesperado ao excluir usuário:', error)
      showError('Erro inesperado ao excluir usuário')
    } finally {
      setIsDeleting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-gray-600">Carregando usuários...</p>
      </div>
    )
  }

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Lista de Usuários</h2>
          <p className="mt-1 text-sm text-gray-600">
            Total: {users.length} usuário{users.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => setShowNovoUsuarioModal(true)}
          leftIcon={<Plus className="h-5 w-5" />}
        >
          Novo Usuário
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Última Atividade</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  Nenhum usuário encontrado
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium text-gray-900">{user.nome}</TableCell>
                  <TableCell className="text-gray-600">{user.email}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeClass(
                        user.role
                      )}`}
                    >
                      {getRoleLabel(user.role)}
                    </span>
                  </TableCell>
                  <TableCell>
                    {user.ativo ? (
                      <span className="inline-flex items-center gap-1 text-success-600">
                        <UserCheck className="h-4 w-4" />
                        <span className="text-sm font-medium">Ativo</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-gray-400">
                        <UserX className="h-4 w-4" />
                        <span className="text-sm font-medium">Inativo</span>
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {user.ultima_atividade ? formatDate(user.ultima_atividade) : '-'}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingUser(user)}
                        title="Editar usuário"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDesativar(user.id, user.ativo)}
                        title={user.ativo ? 'Desativar usuário' : 'Ativar usuário'}
                        className={user.ativo ? 'text-danger-600 hover:text-danger-800' : 'text-success-600 hover:text-success-800'}
                      >
                        <Ban className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleResetarSenha(user.email)}
                        title="Resetar senha"
                        className="text-primary-600 hover:text-primary-800"
                      >
                        <Key className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeletingUser(user)}
                        title="Excluir usuário permanentemente"
                        className="text-danger-600 hover:text-danger-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Modal Novo Usuário */}
      <ModalNovoUsuario
        isOpen={showNovoUsuarioModal}
        onClose={() => setShowNovoUsuarioModal(false)}
        onSuccess={() => {
          setShowNovoUsuarioModal(false)
          fetchUsers()
        }}
      />

      {/* Modal Editar Usuário */}
      {editingUser && (
        <ModalEditarUsuario
          isOpen={!!editingUser}
          onClose={() => setEditingUser(null)}
          user={editingUser}
          onSuccess={() => {
            setEditingUser(null)
            fetchUsers()
          }}
        />
      )}

      {/* Modal Confirmar Exclusão */}
      <Dialog open={!!deletingUser} onOpenChange={() => {
        if (!isDeleting) {
          setDeletingUser(null)
          setConfirmDeleteChecked(false)
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Esta ação não pode ser desfeita. O usuário será excluído permanentemente do sistema.
            </DialogDescription>
          </DialogHeader>
          {deletingUser && (
            <div className="space-y-4">
              <div className="bg-danger-50 border border-danger-200 rounded-lg p-4">
                <p className="text-sm text-danger-800">
                  <strong>Atenção:</strong> Você está prestes a excluir permanentemente o usuário:
                </p>
                <p className="mt-2 font-semibold text-danger-900">{deletingUser.nome}</p>
                <p className="text-sm text-danger-700">{deletingUser.email}</p>
              </div>
              <p className="text-sm text-gray-600">
                Todos os dados relacionados a este usuário serão removidos. Esta ação é irreversível.
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="confirmDelete"
                  checked={confirmDeleteChecked}
                  onChange={(e) => setConfirmDeleteChecked(e.target.checked)}
                  className="h-4 w-4 text-danger-600 focus:ring-danger-500 border-gray-300 rounded cursor-pointer"
                />
                <Label htmlFor="confirmDelete" className="cursor-pointer text-sm text-gray-900">
                  Eu entendo que esta ação é permanente e não pode ser desfeita
                </Label>
              </div>
            </div>
          )}
          <DialogFooter className="flex flex-row justify-end gap-2 pt-4 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={() => {
                setDeletingUser(null)
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
    </>
  )
}

