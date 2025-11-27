'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { User, Mail, Phone, Calendar } from 'lucide-react'
import { showSuccess, showError } from '@/components/ui/Toast'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/Dialog'

interface Paciente {
  id: string
  nome: string
  cpf: string | null
  email: string | null
  telefone: string | null
  data_nascimento: string | null
  genero: string | null
  status: string
  sessoes_compradas: number
}

interface ModalEditarPacienteProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
  pacienteId: string
}

export default function ModalEditarPaciente({
  isOpen,
  onClose,
  onSuccess,
  pacienteId,
}: ModalEditarPacienteProps) {
  const [paciente, setPaciente] = useState<Paciente | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    data_nascimento: '',
    genero: '',
  })

  useEffect(() => {
    const fetchPaciente = async () => {
      if (!isOpen || !pacienteId) return

      setIsLoading(true)
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('pacientes')
          .select('*')
          .eq('id', pacienteId)
          .single()

        if (error) {
          console.error('Erro ao buscar paciente:', error)
          showError('Erro ao carregar dados do paciente')
          return
        }

        if (data) {
          setPaciente(data)
          setFormData({
            nome: data.nome || '',
            email: data.email || '',
            telefone: data.telefone || '',
            data_nascimento: data.data_nascimento
              ? new Date(data.data_nascimento).toISOString().split('T')[0]
              : '',
            genero: data.genero || '',
          })
        }
      } catch (error) {
        console.error('Erro inesperado:', error)
        showError('Erro inesperado ao carregar paciente')
      } finally {
        setIsLoading(false)
      }
    }

    fetchPaciente()
  }, [isOpen, pacienteId])

  const formatTelefone = (value: string) => {
    const cleaned = value.replace(/\D/g, '')
    if (cleaned.length <= 10) {
      return cleaned.replace(/(\d{2})(\d{4})(\d{0,4})/, (match, p1, p2, p3) => {
        if (p3) return `(${p1}) ${p2}-${p3}`
        if (p2) return `(${p1}) ${p2}`
        if (p1) return `(${p1}`
        return cleaned
      })
    } else {
      return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
    }
  }

  const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatTelefone(e.target.value)
    setFormData({ ...formData, telefone: formatted })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.nome.trim()) {
      showError('Nome é obrigatório')
      return
    }

    setIsSubmitting(true)

    try {
      const supabase = createClient()

      const updateData: any = {
        nome: formData.nome.trim(),
        email: formData.email.trim() || null,
        telefone: formData.telefone.replace(/\D/g, '') || null,
        data_nascimento: formData.data_nascimento || null,
        genero: formData.genero || null,
      }

      const { error } = await supabase
        .from('pacientes')
        .update(updateData)
        .eq('id', pacienteId)

      if (error) {
        console.error('Erro ao atualizar paciente:', error)
        showError('Erro ao atualizar paciente. Tente novamente.')
        return
      }

      showSuccess('Paciente atualizado com sucesso!')
      onSuccess?.()
      onClose()
    } catch (error) {
      console.error('Erro inesperado:', error)
      showError('Erro inesperado ao atualizar paciente')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Paciente</DialogTitle>
          </DialogHeader>
          <div className="py-8 text-center">
            <p className="text-gray-600">Carregando dados do paciente...</p>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Paciente</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nome */}
          <div>
            <Label htmlFor="nome">
              Nome <span className="text-danger-600">*</span>
            </Label>
            <div className="relative mt-1">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                id="nome"
                type="text"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                className="pl-10"
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="email">Email</Label>
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="pl-10"
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Telefone */}
          <div>
            <Label htmlFor="telefone">Telefone</Label>
            <div className="relative mt-1">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                id="telefone"
                type="text"
                value={formData.telefone}
                onChange={handleTelefoneChange}
                className="pl-10"
                placeholder="(00) 00000-0000"
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Data de Nascimento */}
          <div>
            <Label htmlFor="data_nascimento">Data de Nascimento</Label>
            <div className="relative mt-1">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                id="data_nascimento"
                type="date"
                value={formData.data_nascimento}
                onChange={(e) => setFormData({ ...formData, data_nascimento: e.target.value })}
                className="pl-10"
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Gênero */}
          <div>
            <Label htmlFor="genero">Gênero</Label>
            <select
              id="genero"
              value={formData.genero}
              onChange={(e) => setFormData({ ...formData, genero: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              <option value="">Selecione...</option>
              <option value="M">Masculino</option>
              <option value="F">Feminino</option>
              <option value="O">Outro</option>
            </select>
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

