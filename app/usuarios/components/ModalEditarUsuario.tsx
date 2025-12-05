'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Edit2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/Dialog'
import { showSuccess, showError } from '@/components/ui/Toast'

interface User {
  id: string
  nome: string
  email: string
  role: 'admin' | 'equipe' | 'recepcao'
  ativo: boolean
}

interface ModalEditarUsuarioProps {
  isOpen: boolean
  onClose: () => void
  user: User
  onSuccess?: () => void
}

const ROLE_OPTIONS = [
  { value: 'admin', label: 'Administrador' },
  { value: 'equipe', label: 'Equipe' },
  { value: 'recepcao', label: 'Recepção' },
]

export default function ModalEditarUsuario({
  isOpen,
  onClose,
  user,
  onSuccess,
}: ModalEditarUsuarioProps) {
  const [nome, setNome] = useState(user.nome)
  const [role, setRole] = useState<'admin' | 'equipe' | 'recepcao'>(user.role)
  const [ativo, setAtivo] = useState(user.ativo)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string | undefined>>({})

  useEffect(() => {
    if (isOpen) {
      setNome(user.nome)
      setRole(user.role)
      setAtivo(user.ativo)
      setErrors({})
    }
  }, [isOpen, user])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!nome.trim()) {
      newErrors.nome = 'Nome é obrigatório'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      const supabase = createClient()

      const { error } = await supabase
        .from('users')
        .update({
          nome: nome.trim(),
          role,
          ativo,
        })
        .eq('id', user.id)

      if (error) {
        console.error('Erro ao atualizar usuário:', error)
        showError(`Erro ao atualizar usuário: ${error.message}`)
        return
      }

      showSuccess('Usuário atualizado com sucesso!')
      onSuccess?.()
      onClose()
    } catch (error) {
      console.error('Erro inesperado ao atualizar usuário:', error)
      showError('Erro inesperado ao atualizar usuário')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit2 className="h-5 w-5 text-primary-600" />
            Editar Usuário
          </DialogTitle>
          <DialogDescription>
            Atualize as informações do usuário. O email não pode ser alterado.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email (readonly) */}
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={user.email}
              disabled
              className="bg-gray-50 cursor-not-allowed"
            />
            <p className="mt-1 text-xs text-gray-500">O email não pode ser alterado</p>
          </div>

          {/* Nome */}
          <div>
            <Label htmlFor="nome">
              Nome <span className="text-danger-600">*</span>
            </Label>
            <Input
              id="nome"
              type="text"
              value={nome}
              onChange={(e) => {
                setNome(e.target.value)
                setErrors((prev) => {
                  const { nome: _, ...rest } = prev
                  return rest
                })
              }}
              placeholder="Nome completo"
              className={errors.nome ? 'border-danger-500' : ''}
              disabled={isSubmitting}
              required
            />
            {errors.nome && <p className="mt-1 text-sm text-danger-600">{errors.nome}</p>}
          </div>

          {/* Role */}
          <div>
            <Label htmlFor="role">
              Função <span className="text-danger-600">*</span>
            </Label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value as 'admin' | 'equipe' | 'recepcao')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
              required
            >
              {ROLE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Status Ativo */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="ativo"
              checked={ativo}
              onChange={(e) => setAtivo(e.target.checked)}
              disabled={isSubmitting}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <Label htmlFor="ativo" className="cursor-pointer">
              Usuário ativo
            </Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" isLoading={isSubmitting} disabled={isSubmitting}>
              Salvar Alterações
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

