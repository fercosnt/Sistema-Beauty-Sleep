'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { X } from 'lucide-react'
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

interface Tag {
  id: string
  nome: string
  cor: string
  tipo: string | null
}

interface ModalNovaTagProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
  editingTag?: Tag | null
}

interface FormData {
  nome: string
  cor: string
  tipo: string
}

const CORES_PREDEFINIDAS = [
  '#FF5733', // Vermelho
  '#33FF57', // Verde
  '#3357FF', // Azul
  '#FF33F5', // Rosa
  '#F5FF33', // Amarelo
  '#33FFF5', // Ciano
  '#FF8C33', // Laranja
  '#8C33FF', // Roxo
  '#33FF8C', // Verde claro
  '#FF338C', // Rosa escuro
  '#00109E', // Azul Beauty Smile (primary)
  '#35BFAD', // Turquesa Beauty Smile (accent)
]

export default function ModalNovaTag({
  isOpen,
  onClose,
  onSuccess,
  editingTag,
}: ModalNovaTagProps) {
  const [formData, setFormData] = useState<FormData>({
    nome: '',
    cor: '#00109E',
    tipo: '',
  })
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (isOpen) {
      if (editingTag) {
        setFormData({
          nome: editingTag.nome,
          cor: editingTag.cor,
          tipo: editingTag.tipo || '',
        })
      } else {
        setFormData({
          nome: '',
          cor: '#00109E',
          tipo: '',
        })
      }
      setErrors({})
    }
  }, [isOpen, editingTag])

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {}

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório'
    } else if (formData.nome.trim().length < 2) {
      newErrors.nome = 'Nome deve ter pelo menos 2 caracteres'
    }

    if (!formData.cor || !/^#[0-9A-F]{6}$/i.test(formData.cor)) {
      newErrors.cor = 'Cor deve ser um código hexadecimal válido (ex: #FF5733)'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      const supabase = createClient()

      const tagData: any = {
        nome: formData.nome.trim(),
        cor: formData.cor.toUpperCase(),
        tipo: formData.tipo.trim() || null,
      }

      if (editingTag) {
        const { error } = await supabase
          .from('tags')
          .update(tagData)
          .eq('id', editingTag.id)

        if (error) {
          console.error('Erro ao atualizar tag:', error)
          if (error.code === '23505') {
            showError('Já existe uma tag com este nome')
          } else {
            showError('Erro ao atualizar tag. Tente novamente.')
          }
          setIsSubmitting(false)
          return
        }

        showSuccess('Tag atualizada com sucesso!')
      } else {
        const { error } = await supabase.from('tags').insert(tagData)

        if (error) {
          console.error('Erro ao criar tag:', error)
          if (error.code === '23505') {
            showError('Já existe uma tag com este nome')
          } else {
            showError('Erro ao criar tag. Tente novamente.')
          }
          setIsSubmitting(false)
          return
        }

        showSuccess('Tag criada com sucesso!')
      }

      setIsSubmitting(false)
      onSuccess?.()
      onClose()
    } catch (error) {
      console.error('Erro inesperado:', error)
      showError('Erro inesperado ao salvar tag')
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{editingTag ? 'Editar Tag' : 'Nova Tag'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nome */}
          <div className="space-y-2">
            <Label htmlFor="nome">
              Nome <span className="text-danger-600">*</span>
            </Label>
            <Input
              id="nome"
              type="text"
              value={formData.nome}
              onChange={(e) => {
                setFormData({ ...formData, nome: e.target.value })
                if (errors.nome) {
                  setErrors({ ...errors, nome: undefined })
                }
              }}
              placeholder="Ex: Protocolo Nasal"
              className={errors.nome ? 'border-danger-500' : ''}
              disabled={isSubmitting}
            />
            {errors.nome && <p className="text-sm text-danger-600">{errors.nome}</p>}
          </div>

          {/* Cor */}
          <div className="space-y-2">
            <Label htmlFor="cor">
              Cor <span className="text-danger-600">*</span>
            </Label>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <input
                  id="cor"
                  type="color"
                  value={formData.cor}
                  onChange={(e) => {
                    setFormData({ ...formData, cor: e.target.value })
                    if (errors.cor) {
                      setErrors({ ...errors, cor: undefined })
                    }
                  }}
                  className="h-10 w-20 rounded border border-gray-300 cursor-pointer"
                  disabled={isSubmitting}
                />
                <Input
                  type="text"
                  value={formData.cor}
                  onChange={(e) => {
                    const value = e.target.value.toUpperCase()
                    if (/^#[0-9A-F]{0,6}$/i.test(value)) {
                      setFormData({ ...formData, cor: value })
                      if (errors.cor) {
                        setErrors({ ...errors, cor: undefined })
                      }
                    }
                  }}
                  placeholder="#00109E"
                  className={errors.cor ? 'border-danger-500' : ''}
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-2">Cores predefinidas:</p>
                <div className="flex flex-wrap gap-2">
                  {CORES_PREDEFINIDAS.map((cor) => (
                    <button
                      key={cor}
                      type="button"
                      onClick={() => {
                        setFormData({ ...formData, cor })
                        if (errors.cor) {
                          setErrors({ ...errors, cor: undefined })
                        }
                      }}
                      className={`w-8 h-8 rounded border-2 transition-all ${
                        formData.cor.toUpperCase() === cor.toUpperCase()
                          ? 'border-gray-900 scale-110'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      style={{ backgroundColor: cor }}
                      disabled={isSubmitting}
                      title={cor}
                    />
                  ))}
                </div>
              </div>
            </div>
            {errors.cor && <p className="text-sm text-danger-600">{errors.cor}</p>}
          </div>

          {/* Tipo */}
          <div className="space-y-2">
            <Label htmlFor="tipo">Tipo (opcional)</Label>
            <Input
              id="tipo"
              type="text"
              value={formData.tipo}
              onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
              placeholder="Ex: protocolo, observacao"
              disabled={isSubmitting}
            />
            <p className="text-xs text-gray-500">
              Categoria opcional para organizar as tags (ex: protocolo, observação)
            </p>
          </div>

          {/* Preview */}
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-xs text-gray-600 mb-2">Preview:</p>
            <div className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-full border border-gray-300"
                style={{ backgroundColor: formData.cor }}
              />
              <span
                className="px-3 py-1 rounded-lg text-sm font-medium text-white"
                style={{ backgroundColor: formData.cor }}
              >
                {formData.nome || 'Nome da Tag'}
              </span>
            </div>
          </div>

          {/* Actions */}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" isLoading={isSubmitting}>
              {editingTag ? 'Salvar Alterações' : 'Criar Tag'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
