'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { FileText } from 'lucide-react'
import { showSuccess, showError } from '@/components/ui/Toast'
import { Button } from '@/components/ui/Button'
import { Label } from '@/components/ui/Label'
import { Textarea } from '@/components/ui/Textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/Dialog'

interface ModalNovaNotaProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
  pacienteId: string
}

export default function ModalNovaNota({
  isOpen,
  onClose,
  onSuccess,
  pacienteId,
}: ModalNovaNotaProps) {
  const [conteudo, setConteudo] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const fetchUserId = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (user?.email) {
        const { data: userData } = await supabase
          .from('users')
          .select('id')
          .eq('email', user.email)
          .single()

        if (userData) {
          setUserId(userData.id)
        }
      }
    }

    if (isOpen) {
      fetchUserId()
      setConteudo('')
    }
  }, [isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!userId) {
      showError('Erro: usuário não identificado')
      return
    }

    if (!conteudo.trim()) {
      showError('O conteúdo da nota é obrigatório')
      return
    }

    setIsSubmitting(true)

    try {
      const supabase = createClient()

      const { error } = await supabase.from('notas').insert({
        paciente_id: pacienteId,
        user_id: userId,
        conteudo: conteudo.trim(),
      })

      if (error) {
        console.error('Erro ao criar nota:', error)
        showError('Erro ao criar nota. Tente novamente.')
        return
      }

      showSuccess('Nota criada com sucesso!')
      onSuccess?.()
      onClose()
      setConteudo('')
    } catch (error) {
      console.error('Erro inesperado:', error)
      showError('Erro inesperado ao criar nota')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nova Nota</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="conteudo">
              Conteúdo <span className="text-danger-600">*</span>
            </Label>
            <div className="relative mt-1">
              <FileText className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Textarea
                id="conteudo"
                value={conteudo}
                onChange={(e) => setConteudo(e.target.value)}
                className="pl-10 min-h-[150px]"
                placeholder="Digite a nota clínica..."
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" isLoading={isSubmitting} disabled={isSubmitting || !conteudo.trim()}>
              Criar Nota
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

