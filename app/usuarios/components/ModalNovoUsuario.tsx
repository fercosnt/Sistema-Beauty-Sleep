'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { UserPlus } from 'lucide-react'
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
import { showSuccess, showError, showInfo } from '@/components/ui/Toast'
import { cn } from '@/lib/utils'

interface ModalNovoUsuarioProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

const ROLE_OPTIONS = [
  { value: 'admin', label: 'Administrador' },
  { value: 'equipe', label: 'Equipe' },
  { value: 'recepcao', label: 'Recepção' },
]

export default function ModalNovoUsuario({ isOpen, onClose, onSuccess }: ModalNovoUsuarioProps) {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<'admin' | 'equipe' | 'recepcao'>('equipe')
  const [senha, setSenha] = useState('')
  const [senhaConfirmacao, setSenhaConfirmacao] = useState('')
  const [autoGeneratePassword, setAutoGeneratePassword] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string | undefined>>({})

  const generatePassword = () => {
    // Gerar senha aleatória de 12 caracteres
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*'
    let password = ''
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return password
  }

  const handleAutoGenerateToggle = () => {
    setAutoGeneratePassword(!autoGeneratePassword)
    if (!autoGeneratePassword) {
      // Se está ativando auto-geração, gerar senha
      const newPassword = generatePassword()
      setSenha(newPassword)
      setSenhaConfirmacao(newPassword)
    } else {
      // Se está desativando, limpar campos
      setSenha('')
      setSenhaConfirmacao('')
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!nome.trim()) {
      newErrors.nome = 'Nome é obrigatório'
    }

    if (!email.trim()) {
      newErrors.email = 'Email é obrigatório'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Email inválido'
    }

    if (!autoGeneratePassword) {
      if (!senha) {
        newErrors.senha = 'Senha é obrigatória'
      } else if (senha.length < 8) {
        newErrors.senha = 'Senha deve ter pelo menos 8 caracteres'
      }

      if (!senhaConfirmacao) {
        newErrors.senhaConfirmacao = 'Confirmação de senha é obrigatória'
      } else if (senha !== senhaConfirmacao) {
        newErrors.senhaConfirmacao = 'Senhas não coincidem'
      }
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
      // Chamar API route para criar usuário
      const response = await fetch('/api/usuarios/criar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome: nome.trim(),
          email: email.trim(),
          role,
          senha: autoGeneratePassword ? generatePassword() : senha,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        showError(data.error || 'Erro ao criar usuário')
        return
      }

      if (data.emailSent) {
        showSuccess('Usuário criado com sucesso! Email de convite enviado. Verifique a caixa de entrada.')
      } else {
        showSuccess('Usuário criado com sucesso!')
        if (data.warning) {
          setTimeout(() => {
            showError(data.warning)
          }, 2000)
        }
        if (data.resetLink) {
          console.log('Link de reset manual (copie e envie ao usuário):', data.resetLink)
          setTimeout(() => {
            showInfo(`Link de reset gerado. Verifique o console do navegador (F12) para copiar o link manual.`)
          }, 3000)
        }
      }

      // Limpar formulário
      setNome('')
      setEmail('')
      setRole('equipe')
      setSenha('')
      setSenhaConfirmacao('')
      setAutoGeneratePassword(true)
      setErrors({})

      onSuccess?.()
      onClose()
    } catch (error) {
      console.error('Erro inesperado ao criar usuário:', error)
      showError('Erro inesperado ao criar usuário')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-primary-600" />
            Novo Usuário
          </DialogTitle>
          <DialogDescription>
            Crie um novo usuário no sistema. O usuário receberá um email para definir sua senha.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
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

          {/* Email */}
          <div>
            <Label htmlFor="email">
              Email <span className="text-danger-600">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setErrors((prev) => {
                  const { email: _, ...rest } = prev
                  return rest
                })
              }}
              placeholder="usuario@exemplo.com"
              className={errors.email ? 'border-danger-500' : ''}
              disabled={isSubmitting}
              required
            />
            {errors.email && <p className="mt-1 text-sm text-danger-600">{errors.email}</p>}
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
              className={cn(
                'flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
              )}
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

          {/* Opção de senha */}
          <div className="space-y-4 border-t border-gray-200 pt-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="autoGeneratePassword"
                checked={autoGeneratePassword}
                onChange={handleAutoGenerateToggle}
                disabled={isSubmitting}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <Label htmlFor="autoGeneratePassword" className="cursor-pointer">
                Auto-gerar senha e enviar email de redefinição
              </Label>
            </div>

            {autoGeneratePassword ? (
              <div className="bg-primary-50 border border-primary-200 rounded-lg p-3">
                <p className="text-sm text-primary-800">
                  <strong>Opção selecionada:</strong> Uma senha será gerada automaticamente e o usuário receberá um email para definir sua própria senha.
                </p>
              </div>
            ) : (
              <>
                <div>
                  <Label htmlFor="senha">
                    Senha <span className="text-danger-600">*</span>
                  </Label>
                  <Input
                    id="senha"
                    type="password"
                    value={senha}
                    onChange={(e) => {
                      setSenha(e.target.value)
                      setErrors((prev) => {
                        const { senha: _, ...rest } = prev
                        return rest
                      })
                    }}
                    placeholder="Mínimo 8 caracteres"
                    className={errors.senha ? 'border-danger-500' : ''}
                    disabled={isSubmitting}
                    minLength={8}
                    required={!autoGeneratePassword}
                  />
                  {errors.senha && <p className="mt-1 text-sm text-danger-600">{errors.senha}</p>}
                </div>

                <div>
                  <Label htmlFor="senhaConfirmacao">
                    Confirmar Senha <span className="text-danger-600">*</span>
                  </Label>
                  <Input
                    id="senhaConfirmacao"
                    type="password"
                    value={senhaConfirmacao}
                    onChange={(e) => {
                      setSenhaConfirmacao(e.target.value)
                      setErrors((prev) => {
                        const { senhaConfirmacao: _, ...rest } = prev
                        return rest
                      })
                    }}
                    placeholder="Digite a senha novamente"
                    className={errors.senhaConfirmacao ? 'border-danger-500' : ''}
                    disabled={isSubmitting}
                    required={!autoGeneratePassword}
                  />
                  {errors.senhaConfirmacao && (
                    <p className="mt-1 text-sm text-danger-600">{errors.senhaConfirmacao}</p>
                  )}
                </div>
              </>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" isLoading={isSubmitting} disabled={isSubmitting}>
              Criar Usuário
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

