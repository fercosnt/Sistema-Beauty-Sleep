'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { X } from 'lucide-react'
import { showSuccess, showError } from '@/components/ui/Toast'

interface ModalNovoPacienteProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

interface FormData {
  idPaciente: string // ID do Paciente (biologix_id) - OBRIGATÓRIO (chave única)
  cpf: string // CPF - OPCIONAL (usado apenas para validação e busca)
  nome: string
  email: string
  telefone: string
  dataNascimento: string
  genero: 'M' | 'F' | 'Outro' | ''
  status: 'lead' | 'ativo'
  sessoesCompradas: number
}

export default function ModalNovoPaciente({ isOpen, onClose, onSuccess }: ModalNovoPacienteProps) {
  const [formData, setFormData] = useState<FormData>({
    idPaciente: '',
    cpf: '',
    nome: '',
    email: '',
    telefone: '',
    dataNascimento: '',
    genero: '',
    status: 'lead',
    sessoesCompradas: 0,
  })
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [cpfValidating, setCpfValidating] = useState(false)
  const [cpfExists, setCpfExists] = useState(false)
  const [existingPaciente, setExistingPaciente] = useState<{ id: string; nome: string } | null>(null)
  const [idPacienteValidating, setIdPacienteValidating] = useState(false)
  const [idPacienteExists, setIdPacienteExists] = useState(false)
  const [existingPacienteById, setExistingPacienteById] = useState<{ id: string; nome: string } | null>(null)

  useEffect(() => {
    if (!isOpen) {
      // Reset form when modal closes
      setFormData({
        idPaciente: '',
        cpf: '',
        nome: '',
        email: '',
        telefone: '',
        dataNascimento: '',
        genero: '',
        status: 'lead',
        sessoesCompradas: 0,
      })
      setErrors({})
      setCpfExists(false)
      setExistingPaciente(null)
      setIdPacienteExists(false)
      setExistingPacienteById(null)
    }
  }, [isOpen])

  const formatCPF = (value: string): string => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, '')

    // Limita a 11 dígitos
    const limited = numbers.slice(0, 11)

    // Aplica máscara 000.000.000-00
    if (limited.length <= 3) {
      return limited
    } else if (limited.length <= 6) {
      return `${limited.slice(0, 3)}.${limited.slice(3)}`
    } else if (limited.length <= 9) {
      return `${limited.slice(0, 3)}.${limited.slice(3, 6)}.${limited.slice(6)}`
    } else {
      return `${limited.slice(0, 3)}.${limited.slice(3, 6)}.${limited.slice(6, 9)}-${limited.slice(9, 11)}`
    }
  }

  const formatTelefone = (value: string): string => {
    const numbers = value.replace(/\D/g, '')
    const limited = numbers.slice(0, 11)

    if (limited.length <= 2) {
      return limited.length > 0 ? `(${limited}` : ''
    } else if (limited.length <= 7) {
      return `(${limited.slice(0, 2)}) ${limited.slice(2)}`
    } else {
      return `(${limited.slice(0, 2)}) ${limited.slice(2, 7)}-${limited.slice(7)}`
    }
  }

  const validateCPF = async (cpf: string) => {
    const cpfLimpo = cpf.replace(/\D/g, '')

    if (cpfLimpo.length !== 11) {
      return false
    }

    // Validação básica de CPF (mesmo algoritmo da função do banco)
    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(cpfLimpo)) {
      return false
    }

    // Calcula primeiro dígito verificador
    let soma = 0
    for (let i = 0; i < 9; i++) {
      soma += parseInt(cpfLimpo.charAt(i)) * (10 - i)
    }
    let resto = (soma * 10) % 11
    if (resto === 10 || resto === 11) resto = 0
    if (resto !== parseInt(cpfLimpo.charAt(9))) {
      return false
    }

    // Calcula segundo dígito verificador
    soma = 0
    for (let i = 0; i < 10; i++) {
      soma += parseInt(cpfLimpo.charAt(i)) * (11 - i)
    }
    resto = (soma * 10) % 11
    if (resto === 10 || resto === 11) resto = 0
    if (resto !== parseInt(cpfLimpo.charAt(10))) {
      return false
    }

    return true
  }

  const checkCPFExists = async (cpf: string) => {
    const cpfLimpo = cpf.replace(/\D/g, '')
    if (cpfLimpo.length !== 11) {
      return null
    }

    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('pacientes')
        .select('id, nome')
        .eq('cpf', cpfLimpo)
        .single()

      if (error && error.code !== 'PGRST116') {
        // PGRST116 = no rows returned
        console.error('Erro ao verificar CPF:', error)
        return null
      }

      return data || null
    } catch (error) {
      console.error('Erro inesperado ao verificar CPF:', error)
      return null
    }
  }

  const checkIdPacienteExists = async (idPaciente: string) => {
    if (!idPaciente || idPaciente.trim() === '') {
      return null
    }

    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('pacientes')
        .select('id, nome')
        .eq('biologix_id', idPaciente.trim())
        .single()

      if (error && error.code !== 'PGRST116') {
        // PGRST116 = no rows returned
        console.error('Erro ao verificar ID do Paciente:', error)
        return null
      }

      return data || null
    } catch (error) {
      console.error('Erro inesperado ao verificar ID do Paciente:', error)
      return null
    }
  }

  const handleCPFBlur = async () => {
    const cpfLimpo = formData.cpf.replace(/\D/g, '')
    if (cpfLimpo.length === 0) {
      setErrors({ ...errors, cpf: undefined })
      setCpfExists(false)
      setExistingPaciente(null)
      return
    }

    if (cpfLimpo.length !== 11) {
      setErrors({ ...errors, cpf: 'CPF deve ter 11 dígitos' })
      setCpfExists(false)
      setExistingPaciente(null)
      return
    }

    setCpfValidating(true)

    // Validar CPF
    const isValid = await validateCPF(formData.cpf)
    if (!isValid) {
      setErrors({ ...errors, cpf: 'CPF inválido' })
      setCpfValidating(false)
      setCpfExists(false)
      setExistingPaciente(null)
      return
    }

    // Verificar se CPF já existe
    const existing = await checkCPFExists(formData.cpf)
    if (existing) {
      setCpfExists(true)
      setExistingPaciente(existing)
      setErrors({ ...errors, cpf: `CPF já cadastrado para: ${existing.nome}` })
    } else {
      setCpfExists(false)
      setExistingPaciente(null)
      setErrors({ ...errors, cpf: undefined })
    }

    setCpfValidating(false)
  }

  const handleIdPacienteBlur = async () => {
    const idPaciente = formData.idPaciente.trim()
    
    if (!idPaciente) {
      setErrors({ ...errors, idPaciente: 'ID do Paciente é obrigatório' })
      setIdPacienteExists(false)
      setExistingPacienteById(null)
      return
    }

    setIdPacienteValidating(true)

    // Verificar se ID do Paciente já existe
    const existing = await checkIdPacienteExists(idPaciente)
    if (existing) {
      setIdPacienteExists(true)
      setExistingPacienteById(existing)
      setErrors({ ...errors, idPaciente: `ID do Paciente já cadastrado para: ${existing.nome}` })
    } else {
      setIdPacienteExists(false)
      setExistingPacienteById(null)
      setErrors({ ...errors, idPaciente: undefined })
    }

    setIdPacienteValidating(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validação básica
    const newErrors: Partial<Record<keyof FormData, string>> = {}

    // ID do Paciente é OBRIGATÓRIO (chave única)
    if (!formData.idPaciente || formData.idPaciente.trim() === '') {
      newErrors.idPaciente = 'ID do Paciente é obrigatório'
    }

    // CPF agora é OPCIONAL (apenas para validação e busca)
    if (formData.cpf && formData.cpf.replace(/\D/g, '').length !== 11) {
      newErrors.cpf = 'CPF deve ter 11 dígitos'
    }

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório'
    }

    if (formData.status === 'ativo' && formData.sessoesCompradas < 0) {
      newErrors.sessoesCompradas = 'Sessões compradas deve ser um número positivo'
    }

    // Verificar duplicatas
    if (idPacienteExists) {
      newErrors.idPaciente = 'ID do Paciente já cadastrado. Por favor, verifique o paciente existente.'
    }

    if (cpfExists) {
      newErrors.cpf = 'CPF já cadastrado. Por favor, verifique o paciente existente.'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsSubmitting(true)

    try {
      const supabase = createClient()
      const cpfLimpo = formData.cpf ? formData.cpf.replace(/\D/g, '') : ''

      const pacienteData: any = {
        biologix_id: formData.idPaciente.trim(), // Chave única
        nome: formData.nome.trim(),
        status: formData.status,
        sessoes_compradas: formData.status === 'ativo' ? formData.sessoesCompradas : 0,
      }

      // CPF é opcional - só adicionar se válido e fornecido
      if (cpfLimpo && cpfLimpo.length === 11) {
        pacienteData.cpf = cpfLimpo
      }
      // Se CPF não for fornecido ou for inválido, não incluir no objeto (será NULL no banco)

      // Campos opcionais
      if (formData.email.trim()) {
        pacienteData.email = formData.email.trim()
      }
      if (formData.telefone.replace(/\D/g, '')) {
        pacienteData.telefone = formData.telefone.replace(/\D/g, '')
      }
      if (formData.dataNascimento) {
        pacienteData.data_nascimento = formData.dataNascimento
      }
      if (formData.genero) {
        pacienteData.genero = formData.genero
      }

      // Usar UPSERT com biologix_id como chave única
      const { data, error } = await supabase
        .from('pacientes')
        .upsert(pacienteData, {
          onConflict: 'biologix_id',
          ignoreDuplicates: false
        })
        .select()
        .single()

      if (error) {
        console.error('Erro ao criar/atualizar paciente:', error)
        if (error.code === '23505') {
          // Unique constraint violation
          showError('ID do Paciente já cadastrado no sistema')
        } else {
          showError('Erro ao criar paciente. Tente novamente.')
        }
        setIsSubmitting(false)
        return
      }

      showSuccess('Paciente criado com sucesso!')
      setIsSubmitting(false)
      onSuccess?.()
      onClose()
    } catch (error) {
      console.error('Erro inesperado ao criar paciente:', error)
      showError('Erro inesperado ao criar paciente')
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Novo Paciente</h2>
          <button
            onClick={onClose}
            className="text-black opacity-50 hover:opacity-100 transition-opacity"
            disabled={isSubmitting}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* ID do Paciente - OBRIGATÓRIO (chave única) */}
          <div>
            <label htmlFor="idPaciente" className="block text-sm font-medium text-black mb-2">
              ID do Paciente <span className="text-danger-600">*</span>
              <span className="text-xs text-gray-500 ml-2">(Identificador único do Biologix)</span>
            </label>
            <input
              id="idPaciente"
              type="text"
              value={formData.idPaciente}
              onChange={(e) => {
                setFormData({ ...formData, idPaciente: e.target.value.trim() })
                if (errors.idPaciente) {
                  setErrors({ ...errors, idPaciente: undefined })
                }
                if (idPacienteExists) {
                  setIdPacienteExists(false)
                  setExistingPacienteById(null)
                }
              }}
              onBlur={handleIdPacienteBlur}
              placeholder="PAC-1234567890"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                errors.idPaciente ? 'border-danger-500' : 'border-gray-300'
              }`}
              disabled={isSubmitting || idPacienteValidating}
            />
            {idPacienteValidating && <p className="mt-1 text-sm text-black">Verificando ID do Paciente...</p>}
            {errors.idPaciente && <p className="mt-1 text-sm text-danger-600">{errors.idPaciente}</p>}
            {idPacienteExists && existingPacienteById && (
              <div className="mt-2 p-3 bg-warning-50 border border-warning-200 rounded-lg">
                <p className="text-sm text-warning-800">
                  <strong>Paciente já existe:</strong> {existingPacienteById.nome}
                </p>
                <p className="text-xs text-warning-600 mt-1">
                  Considere buscar este paciente na lista ao invés de criar um novo.
                </p>
              </div>
            )}
          </div>

          {/* CPF - OPCIONAL */}
          <div>
            <label htmlFor="cpf" className="block text-sm font-medium text-black mb-2">
              CPF <span className="text-xs text-gray-500">(Opcional - usado apenas para validação e busca)</span>
            </label>
            <input
              id="cpf"
              type="text"
              value={formData.cpf}
              onChange={(e) => {
                const formatted = formatCPF(e.target.value)
                setFormData({ ...formData, cpf: formatted })
                if (errors.cpf) {
                  setErrors({ ...errors, cpf: undefined })
                }
              }}
              onBlur={handleCPFBlur}
              placeholder="000.000.000-00"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                errors.cpf ? 'border-danger-500' : 'border-gray-300'
              }`}
              disabled={isSubmitting || cpfValidating}
            />
            {cpfValidating && <p className="mt-1 text-sm text-black">Validando CPF...</p>}
            {errors.cpf && <p className="mt-1 text-sm text-danger-600">{errors.cpf}</p>}
            {cpfExists && existingPaciente && (
              <div className="mt-2 p-3 bg-warning-50 border border-warning-200 rounded-lg">
                <p className="text-sm text-warning-800">
                  <strong>Paciente já existe:</strong> {existingPaciente.nome}
                </p>
                <p className="text-xs text-warning-600 mt-1">
                  Considere buscar este paciente na lista ao invés de criar um novo.
                </p>
              </div>
            )}
          </div>

          {/* Nome */}
          <div>
            <label htmlFor="nome" className="block text-sm font-medium text-black mb-2">
              Nome <span className="text-danger-600">*</span>
            </label>
            <input
              id="nome"
              type="text"
              value={formData.nome}
              onChange={(e) => {
                setFormData({ ...formData, nome: e.target.value })
                if (errors.nome) {
                  setErrors({ ...errors, nome: undefined })
                }
              }}
              placeholder="Nome completo"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                errors.nome ? 'border-danger-500' : 'border-gray-300'
              }`}
              disabled={isSubmitting}
            />
            {errors.nome && <p className="mt-1 text-sm text-danger-600">{errors.nome}</p>}
          </div>

          {/* Email e Telefone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-black mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="email@exemplo.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label htmlFor="telefone" className="block text-sm font-medium text-black mb-2">
                Telefone
              </label>
              <input
                id="telefone"
                type="text"
                value={formData.telefone}
                onChange={(e) => {
                  const formatted = formatTelefone(e.target.value)
                  setFormData({ ...formData, telefone: formatted })
                }}
                placeholder="(00) 00000-0000"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Data Nascimento e Gênero */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="dataNascimento" className="block text-sm font-medium text-black mb-2">
                Data de Nascimento
              </label>
              <input
                id="dataNascimento"
                type="date"
                value={formData.dataNascimento}
                onChange={(e) => setFormData({ ...formData, dataNascimento: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label htmlFor="genero" className="block text-sm font-medium text-black mb-2">
                Gênero
              </label>
              <select
                id="genero"
                value={formData.genero}
                onChange={(e) => setFormData({ ...formData, genero: e.target.value as 'M' | 'F' | 'Outro' | '' })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                disabled={isSubmitting}
              >
                <option value="">Selecione...</option>
                <option value="M">Masculino</option>
                <option value="F">Feminino</option>
                <option value="Outro">Outro</option>
              </select>
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Status <span className="text-danger-600">*</span>
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="lead"
                  checked={formData.status === 'lead'}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as 'lead' | 'ativo' })}
                  className="text-primary-600 focus:ring-primary-500"
                  disabled={isSubmitting}
                />
                <span className="text-sm text-black">Lead</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="ativo"
                  checked={formData.status === 'ativo'}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as 'lead' | 'ativo' })}
                  className="text-primary-600 focus:ring-primary-500"
                  disabled={isSubmitting}
                />
                <span className="text-sm text-black">Paciente</span>
              </label>
            </div>
          </div>

          {/* Sessões Compradas (apenas se status = ativo) */}
          {formData.status === 'ativo' && (
            <div>
              <label htmlFor="sessoesCompradas" className="block text-sm font-medium text-black mb-2">
                Sessões Compradas
              </label>
              <input
                id="sessoesCompradas"
                type="number"
                min="0"
                value={formData.sessoesCompradas || ''}
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 0
                  setFormData({ ...formData, sessoesCompradas: value })
                  if (errors.sessoesCompradas) {
                    setErrors({ ...errors, sessoesCompradas: undefined })
                  }
                }}
                placeholder="0"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  errors.sessoesCompradas ? 'border-danger-500' : 'border-gray-300'
                }`}
                disabled={isSubmitting}
              />
              {errors.sessoesCompradas && (
                <p className="mt-1 text-sm text-danger-600">{errors.sessoesCompradas}</p>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-black hover:bg-gray-50 transition-colors"
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting || cpfExists || idPacienteExists}
            >
              {isSubmitting ? 'Salvando...' : 'Salvar Paciente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

