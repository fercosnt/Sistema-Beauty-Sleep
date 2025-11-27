'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Calendar, Tag, Hash, FileText } from 'lucide-react'
import { showSuccess, showError } from '@/components/ui/Toast'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Textarea } from '@/components/ui/Textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/Dialog'

interface Tag {
  id: string
  nome: string
  cor: string
}

interface ModalNovaSessaoProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
  pacienteId: string
}

export default function ModalNovaSessao({
  isOpen,
  onClose,
  onSuccess,
  pacienteId,
}: ModalNovaSessaoProps) {
  const [tags, setTags] = useState<Tag[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [formData, setFormData] = useState({
    data_sessao: new Date().toISOString().split('T')[0],
    contador_inicial: '',
    contador_final: '',
    observacoes: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      // Buscar tags
      const supabase = createClient()
      const { data: tagsData, error: tagsError } = await supabase.from('tags').select('*').order('nome')
      if (tagsError) {
        console.error('Erro ao buscar tags:', tagsError)
        showError('Erro ao carregar tags')
      } else if (tagsData) {
        setTags(tagsData)
      }

      // Buscar user ID
      const { data: { user } } = await supabase.auth.getUser()
      if (user?.email) {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('id')
          .eq('email', user.email)
          .single()
        if (userError) {
          console.error('Erro ao buscar usuário:', userError)
          showError('Erro ao identificar usuário')
        } else if (userData) {
          setUserId(userData.id)
        }
      }
    }

    if (isOpen) {
      fetchData()
      // Reset form when opening
      setFormData({
        data_sessao: new Date().toISOString().split('T')[0],
        contador_inicial: '',
        contador_final: '',
        observacoes: '',
      })
      setSelectedTags([])
    }
  }, [isOpen])

  const pulsosUtilizados =
    formData.contador_inicial && formData.contador_final
      ? parseInt(formData.contador_final) - parseInt(formData.contador_inicial)
      : 0

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validações
    if (!userId) {
      showError('Erro: usuário não identificado. Faça login novamente.')
      return
    }

    if (!pacienteId) {
      showError('Erro: paciente não identificado.')
      return
    }

    if (!formData.data_sessao) {
      showError('Data da sessão é obrigatória')
      return
    }

    // Validar se a data não é futura
    const dataSessao = new Date(formData.data_sessao)
    const hoje = new Date()
    hoje.setHours(23, 59, 59, 999) // Fim do dia de hoje
    if (dataSessao > hoje) {
      showError('A data da sessão não pode ser futura')
      return
    }

    if (!formData.contador_inicial || formData.contador_inicial === '') {
      showError('Contador inicial é obrigatório')
      return
    }

    if (!formData.contador_final || formData.contador_final === '') {
      showError('Contador final é obrigatório')
      return
    }

    const contadorInicial = parseInt(formData.contador_inicial)
    const contadorFinal = parseInt(formData.contador_final)

    if (isNaN(contadorInicial) || contadorInicial < 0) {
      showError('Contador inicial deve ser um número válido maior ou igual a zero')
      return
    }

    if (isNaN(contadorFinal) || contadorFinal < 0) {
      showError('Contador final deve ser um número válido maior ou igual a zero')
      return
    }

    if (contadorFinal <= contadorInicial) {
      showError('Contador final deve ser maior que o contador inicial')
      return
    }

    setIsSubmitting(true)

    try {
      const supabase = createClient()

      // Get tag names from IDs
      const protocoloNames = selectedTags.map((tagId) => {
        const tag = tags.find((t) => t.id === tagId)
        return tag?.nome || ''
      }).filter(Boolean)

      // Prepare data for insertion
      const sessaoData: any = {
        paciente_id: pacienteId,
        user_id: userId,
        data_sessao: formData.data_sessao,
        contador_pulsos_inicial: contadorInicial,
        contador_pulsos_final: contadorFinal,
        observacoes: formData.observacoes.trim() || null,
      }

      // Only add protocolo if there are tags selected
      // Supabase expects TEXT[] array format
      if (protocoloNames.length > 0) {
        sessaoData.protocolo = protocoloNames
      }

      // Criar sessão
      const { error } = await supabase.from('sessoes').insert(sessaoData)

      if (error) {
        console.error('Erro ao criar sessão:', error)
        console.error('Dados enviados:', sessaoData)
        console.error('Erro completo:', JSON.stringify(error, null, 2))
        
        // Mensagem de erro mais específica
        let errorMessage = 'Erro ao criar sessão. '
        if (error.code === '42501') {
          errorMessage += 'Você não tem permissão para criar sessões. Verifique seu perfil de usuário.'
        } else if (error.code === '23514') {
          errorMessage += 'Dados inválidos. Verifique os valores informados.'
        } else if (error.message) {
          errorMessage += error.message
        } else {
          errorMessage += 'Tente novamente ou entre em contato com o suporte.'
        }
        
        showError(errorMessage)
        setIsSubmitting(false)
        return
      }

      showSuccess('Sessão criada com sucesso!')
      
      // Reset form before closing
      setFormData({
        data_sessao: new Date().toISOString().split('T')[0],
        contador_inicial: '',
        contador_final: '',
        observacoes: '',
      })
      setSelectedTags([])
      
      // Call onSuccess callback and close modal
      onSuccess?.()
      onClose()
    } catch (error) {
      console.error('Erro inesperado:', error)
      showError('Erro inesperado ao criar sessão')
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleTag = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      setSelectedTags(selectedTags.filter((id) => id !== tagId))
    } else {
      setSelectedTags([...selectedTags, tagId])
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Nova Sessão</DialogTitle>
                  <DialogDescription>
                    Preencha os dados da nova sessão do paciente.
                  </DialogDescription>
                </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Data da Sessão */}
          <div>
            <Label htmlFor="data_sessao">
              Data da Sessão <span className="text-danger-600">*</span>
            </Label>
            <div className="relative mt-1">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                id="data_sessao"
                type="date"
                value={formData.data_sessao}
                onChange={(e) => setFormData({ ...formData, data_sessao: e.target.value })}
                className="pl-10"
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Protocolo (Tags) */}
          <div>
            <Label>Protocolo</Label>
            <div className="mt-2 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => toggleTag(tag.id)}
                  disabled={isSubmitting}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                    selectedTags.includes(tag.id)
                      ? 'text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  style={
                    selectedTags.includes(tag.id)
                      ? { backgroundColor: tag.cor }
                      : undefined
                  }
                >
                  {tag.nome}
                </button>
              ))}
            </div>
            {tags.length === 0 && (
              <p className="text-xs text-gray-500 mt-1">Nenhuma tag disponível</p>
            )}
          </div>

          {/* Contadores */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="contador_inicial">
                Contador Inicial <span className="text-danger-600">*</span>
              </Label>
              <div className="relative mt-1">
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="contador_inicial"
                  type="number"
                  min="0"
                  value={formData.contador_inicial}
                  onChange={(e) => setFormData({ ...formData, contador_inicial: e.target.value })}
                  className="pl-10"
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="contador_final">
                Contador Final <span className="text-danger-600">*</span>
              </Label>
              <div className="relative mt-1">
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="contador_final"
                  type="number"
                  min="0"
                  value={formData.contador_final}
                  onChange={(e) => setFormData({ ...formData, contador_final: e.target.value })}
                  className="pl-10"
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </div>

          {/* Pulsos Utilizados */}
          {formData.contador_inicial && formData.contador_final && pulsosUtilizados > 0 && (
            <div className="bg-primary-50 border border-primary-200 rounded-lg p-3">
              <p className="text-sm font-medium text-primary-900">
                Pulsos Utilizados: <span className="text-lg">{pulsosUtilizados}</span>
              </p>
            </div>
          )}

          {/* Observações */}
          <div>
            <Label htmlFor="observacoes">Observações</Label>
            <div className="relative mt-1">
              <FileText className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Textarea
                id="observacoes"
                value={formData.observacoes}
                onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                className="pl-10 min-h-[100px]"
                placeholder="Adicione observações sobre a sessão..."
                disabled={isSubmitting}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" isLoading={isSubmitting} disabled={isSubmitting}>
              Criar Sessão
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

