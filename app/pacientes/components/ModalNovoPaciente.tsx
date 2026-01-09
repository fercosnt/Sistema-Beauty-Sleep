'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { X } from 'lucide-react'
import { showSuccess, showError } from '@/components/ui/Toast'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { DateInput } from '@/components/ui/DateInput'
import { Label } from '@/components/ui/Label'
import { cn } from '@/utils/cn'

interface ModalNovoPacienteProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

interface FormData {
  idPaciente: string // ID do Paciente (biologix_id) - OBRIGATÓRIO (chave única)
  cpf: string // CPF - OBRIGATÓRIO (ou documento estrangeiro)
  documentoEstrangeiro: string // Documento para pacientes estrangeiros (passaporte, etc) - aceita números e letras
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
    documentoEstrangeiro: '',
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
  const [semBiologix, setSemBiologix] = useState(false)
  const [buscandoBiologix, setBuscandoBiologix] = useState(false)

  useEffect(() => {
    if (!isOpen) {
      // Reset form when modal closes
      setFormData({
        idPaciente: '',
        cpf: '',
        documentoEstrangeiro: '',
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
      setSemBiologix(false)
      setBuscandoBiologix(false)
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
        .maybeSingle()

      if (error) {
        // Ignora erros de "no rows" mas loga outros erros
        if (error.code !== 'PGRST116') {
          console.error('Erro ao verificar CPF:', error)
        }
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
        .maybeSingle()

      if (error) {
        // Ignora erros de "no rows" mas loga outros erros
        if (error.code !== 'PGRST116') {
          console.error('Erro ao verificar ID do Paciente:', error)
        }
        return null
      }

      return data || null
    } catch (error) {
      console.error('Erro inesperado ao verificar ID do Paciente:', error)
      return null
    }
  }

  const buscarPacientePorCPF = async (cpf: string) => {
    const cpfLimpo = cpf.replace(/\D/g, '')
    if (cpfLimpo.length !== 11) {
      return null
    }

    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('pacientes')
        .select('id, nome, biologix_id')
        .eq('cpf', cpfLimpo)
        .maybeSingle()

      if (error) {
        if (error.code !== 'PGRST116') {
          console.error('Erro ao buscar paciente por CPF:', error)
        }
        return null
      }

      return data || null
    } catch (error) {
      console.error('Erro inesperado ao buscar paciente por CPF:', error)
      return null
    }
  }

  const buscarPacientePorTelefone = async (telefone: string) => {
    const telefoneLimpo = telefone.replace(/\D/g, '')
    if (telefoneLimpo.length < 10) {
      return null
    }

    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('pacientes')
        .select('id, nome, biologix_id')
        .eq('telefone', telefoneLimpo)
        .maybeSingle()

      if (error) {
        if (error.code !== 'PGRST116') {
          console.error('Erro ao buscar paciente por telefone:', error)
        }
        return null
      }

      return data || null
    } catch (error) {
      console.error('Erro inesperado ao buscar paciente por telefone:', error)
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

    // Se não tem ID do Paciente preenchido, buscar automaticamente
    if (!formData.idPaciente.trim() && !semBiologix) {
      // Primeiro tentar buscar por CPF
      const pacienteEncontrado = await buscarPacientePorCPF(formData.cpf)
      if (pacienteEncontrado && pacienteEncontrado.biologix_id) {
        setFormData({ ...formData, idPaciente: pacienteEncontrado.biologix_id })
        showSuccess(`ID do Paciente encontrado automaticamente: ${pacienteEncontrado.biologix_id}`)
      } else if (formData.telefone && formData.telefone.replace(/\D/g, '').length >= 10) {
        // Se não encontrou por CPF, tentar por telefone
        const pacientePorTelefone = await buscarPacientePorTelefone(formData.telefone)
        if (pacientePorTelefone && pacientePorTelefone.biologix_id) {
          setFormData({ ...formData, idPaciente: pacientePorTelefone.biologix_id })
          showSuccess(`ID do Paciente encontrado automaticamente pelo telefone: ${pacientePorTelefone.biologix_id}`)
        }
      }
    }

    setCpfValidating(false)
  }

  const handleIdPacienteBlur = async () => {
    const idPaciente = formData.idPaciente.trim()
    
    // Se está marcado como "sem Biologix", não validar
    if (semBiologix) {
      setErrors({ ...errors, idPaciente: undefined })
      setIdPacienteExists(false)
      setExistingPacienteById(null)
      return
    }
    
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
      setErrors({ ...errors, idPaciente: `ID do Paciente "${idPaciente}" já cadastrado para: ${existing.nome}. Verifique o paciente existente na lista.` })
    } else {
      setIdPacienteExists(false)
      setExistingPacienteById(null)
      setErrors({ ...errors, idPaciente: undefined })
    }

    setIdPacienteValidating(false)
  }

  const handleBuscarBiologix = async () => {
    const cpfLimpo = formData.cpf.replace(/\D/g, '')
    
    if (cpfLimpo.length !== 11) {
      showError('Por favor, preencha um CPF válido antes de buscar na API Biologix')
      return
    }

    setBuscandoBiologix(true)
    
    try {
      // Chamar API route para buscar na API Biologix
      const response = await fetch('/api/biologix/buscar-paciente', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cpf: cpfLimpo }),
      })

      const data = await response.json()

      if (response.ok && data.biologixId) {
        setFormData({ ...formData, idPaciente: data.biologixId })
        setSemBiologix(false)
        showSuccess(`Paciente encontrado na API Biologix! ID: ${data.biologixId}`)
      } else {
        // Paciente não encontrado na API Biologix
        setSemBiologix(true)
        setFormData({ ...formData, idPaciente: '' })
        showError('Paciente não encontrado na API Biologix. Você pode criar sem ID do Paciente.')
      }
    } catch (error) {
      console.error('Erro ao buscar na API Biologix:', error)
      showError('Erro ao buscar na API Biologix. Você pode criar sem ID do Paciente.')
      setSemBiologix(true)
      setFormData({ ...formData, idPaciente: '' })
    } finally {
      setBuscandoBiologix(false)
    }
  }

  const validateDate = (dateString: string): boolean => {
    if (!dateString) return true // Data é opcional
    
    const date = new Date(dateString)
    const today = new Date()
    const minDate = new Date('1900-01-01')
    
    // Verificar se é uma data válida
    if (isNaN(date.getTime())) {
      return false
    }
    
    // Verificar se não é data futura
    if (date > today) {
      return false
    }
    
    // Verificar se não é muito antiga (antes de 1900)
    if (date < minDate) {
      return false
    }
    
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validação básica
    const newErrors: Partial<Record<keyof FormData, string>> = {}

    // ID do Paciente é OBRIGATÓRIO apenas se não estiver marcado como "sem Biologix"
    if (!semBiologix && (!formData.idPaciente || formData.idPaciente.trim() === '')) {
      newErrors.idPaciente = 'ID do Paciente é obrigatório'
    }

    // CPF OU Documento Estrangeiro é OBRIGATÓRIO
    const cpfLimpo = formData.cpf ? formData.cpf.replace(/\D/g, '') : ''
    const documentoEstrangeiroLimpo = formData.documentoEstrangeiro ? formData.documentoEstrangeiro.trim() : ''
    
    if (!cpfLimpo && !documentoEstrangeiroLimpo) {
      newErrors.cpf = 'CPF ou Documento Estrangeiro é obrigatório'
    }
    
    // Se CPF foi preenchido, validar
    if (cpfLimpo) {
      if (cpfLimpo.length !== 11) {
        newErrors.cpf = 'CPF deve ter 11 dígitos'
      } else {
        // Validar CPF se foi preenchido
        const isValid = await validateCPF(formData.cpf)
        if (!isValid) {
          newErrors.cpf = 'CPF inválido'
        }
      }
    }
    
    // Se documento estrangeiro foi preenchido, validar (mínimo 3 caracteres)
    if (documentoEstrangeiroLimpo && documentoEstrangeiroLimpo.length < 3) {
      newErrors.documentoEstrangeiro = 'Documento estrangeiro deve ter pelo menos 3 caracteres'
    }

    // Nome é OBRIGATÓRIO
    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório'
    }

    // Validar data de nascimento
    if (formData.dataNascimento && !validateDate(formData.dataNascimento)) {
      newErrors.dataNascimento = 'Data de nascimento inválida. Verifique se não é uma data futura ou muito antiga.'
    }

    if (formData.sessoesCompradas < 0) {
      newErrors.sessoesCompradas = 'Sessões compradas deve ser um número positivo'
    }

    // Verificar duplicatas
    if (idPacienteExists) {
      newErrors.idPaciente = 'ID do Paciente já cadastrado. Por favor, verifique o paciente existente.'
    }

    // Verificar duplicação de CPF no submit também
    if (cpfLimpo && cpfLimpo.length === 11) {
      const existing = await checkCPFExists(formData.cpf)
      if (existing) {
        setCpfExists(true)
        setExistingPaciente(existing)
        newErrors.cpf = `CPF já cadastrado para: ${existing.nome}`
      } else {
        setCpfExists(false)
        setExistingPaciente(null)
      }
    }

    // Se houver erro de CPF inválido, bloquear submit
    if (errors.cpf && (errors.cpf.includes('inválido') || errors.cpf.includes('já cadastrado'))) {
      newErrors.cpf = errors.cpf
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
        nome: formData.nome.trim(),
        status: formData.status,
        sessoes_compradas: formData.sessoesCompradas || 0,
      }

      // Adicionar biologix_id apenas se não estiver marcado como "sem Biologix" e tiver valor
      if (!semBiologix && formData.idPaciente && formData.idPaciente.trim()) {
        pacienteData.biologix_id = formData.idPaciente.trim()
      }

      // CPF é obrigatório se não houver documento estrangeiro
      if (cpfLimpo && cpfLimpo.length === 11) {
        // Validar CPF novamente antes de salvar
        const isValid = await validateCPF(formData.cpf)
        if (!isValid) {
          showError('CPF inválido. Não é possível criar o paciente.')
          setIsSubmitting(false)
          return
        }
        
        // Verificar duplicação uma última vez antes de salvar
        const existing = await checkCPFExists(formData.cpf)
        if (existing) {
          setCpfExists(true)
          setExistingPaciente(existing)
          showError(`CPF já cadastrado para: ${existing.nome}`)
          setIsSubmitting(false)
          return
        }
        
        pacienteData.cpf = cpfLimpo
      } else if (documentoEstrangeiroLimpo) {
        // Se não tem CPF mas tem documento estrangeiro, salvar documento estrangeiro
        // Nota: pode precisar adicionar campo documento_estrangeiro na tabela pacientes
        // Por enquanto, vamos salvar no campo observacoes_gerais como fallback
        pacienteData.observacoes_gerais = `Documento Estrangeiro: ${documentoEstrangeiroLimpo}`
      } else {
        // Se não tem nem CPF nem documento estrangeiro, não pode criar
        showError('CPF ou Documento Estrangeiro é obrigatório.')
        setIsSubmitting(false)
        return
      }

      // Campos opcionais
      if (formData.email.trim()) {
        pacienteData.email = formData.email.trim()
      }
      if (formData.telefone.replace(/\D/g, '')) {
        pacienteData.telefone = formData.telefone.replace(/\D/g, '')
      }
      if (formData.dataNascimento && validateDate(formData.dataNascimento)) {
        pacienteData.data_nascimento = formData.dataNascimento
      }
      if (formData.genero) {
        pacienteData.genero = formData.genero
      }

      // Usar INSERT ou UPSERT dependendo se tem biologix_id
      let data, error
      
      if (pacienteData.biologix_id) {
        // Se tem biologix_id, usar UPSERT com onConflict
        const result = await supabase
          .from('pacientes')
          .upsert(pacienteData, {
            onConflict: 'biologix_id',
            ignoreDuplicates: false
          })
          .select()
          .single()
        data = result.data
        error = result.error
      } else {
        // Se não tem biologix_id, usar INSERT simples
        const result = await supabase
          .from('pacientes')
          .insert(pacienteData)
          .select()
          .single()
        data = result.data
        error = result.error
      }

      if (error) {
        console.error('Erro ao criar/atualizar paciente:', error)
        if (error.code === '23505') {
          // Unique constraint violation - Mensagem padronizada e clara
          if (error.message.includes('biologix_id')) {
            showError(`ID do Paciente "${formData.idPaciente.trim()}" já está cadastrado. Verifique o paciente existente na lista.`)
          } else {
            showError('Dados duplicados detectados. Verifique os campos e tente novamente.')
          }
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
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-2xl max-h-[90vh] flex flex-col bg-white rounded-lg border border-gray-200 shadow-xl">
        {/* Header fixo */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-xl font-semibold text-gray-900">Novo Paciente</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-900 transition-colors p-1 rounded-md hover:bg-gray-100"
            disabled={isSubmitting}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Conteúdo com scroll */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
        {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
          {/* ID do Paciente - OBRIGATÓRIO apenas se não estiver marcado como "sem Biologix" */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="idPaciente">
                ID do Paciente {!semBiologix && <span className="text-error-600">*</span>}
                <span className="text-xs text-gray-500 ml-2 font-normal">(Identificador único do Biologix)</span>
              </Label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={semBiologix}
                  onChange={(e) => {
                    setSemBiologix(e.target.checked)
                    if (e.target.checked) {
                      setFormData({ ...formData, idPaciente: '' })
                      setErrors({ ...errors, idPaciente: undefined })
                      setIdPacienteExists(false)
                      setExistingPacienteById(null)
                    }
                  }}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  disabled={isSubmitting}
                />
                <span className="text-sm text-gray-700">Paciente sem Biologix</span>
              </label>
            </div>
            <div className="flex gap-2">
              <Input
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
                  if (e.target.value.trim()) {
                    setSemBiologix(false)
                  }
                }}
                onBlur={handleIdPacienteBlur}
                placeholder="PAC-1234567890"
                className={cn(errors.idPaciente && 'border-error-600 focus:ring-error-600', 'flex-1')}
                disabled={isSubmitting || idPacienteValidating || semBiologix}
              />
              {!semBiologix && formData.cpf && formData.cpf.replace(/\D/g, '').length === 11 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBuscarBiologix}
                  disabled={isSubmitting || buscandoBiologix}
                  className="whitespace-nowrap"
                >
                  {buscandoBiologix ? 'Buscando...' : 'Buscar na API Biologix'}
                </Button>
              )}
            </div>
            {idPacienteValidating && <p className="mt-1 text-sm text-gray-600 flex items-center gap-2">
              <span className="animate-spin">⏳</span> Verificando ID do Paciente...
            </p>}
            {errors.idPaciente && (
              <p className="text-sm text-error-600">{errors.idPaciente}</p>
            )}
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
            {semBiologix && (
              <p className="text-sm text-gray-600 mt-1">
                Este paciente não possui ID do Biologix. O cadastro será criado sem esse identificador.
              </p>
            )}
          </div>

          {/* CPF e Documento Estrangeiro - OBRIGATÓRIO (um ou outro) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cpf">
                CPF <span className="text-error-600">*</span>
              </Label>
              <Input
                id="cpf"
                type="text"
                value={formData.cpf}
                onChange={(e) => {
                  const formatted = formatCPF(e.target.value)
                  setFormData({ ...formData, cpf: formatted, documentoEstrangeiro: '' })
                  if (errors.cpf) {
                    setErrors({ ...errors, cpf: undefined })
                  }
                }}
                onBlur={handleCPFBlur}
                placeholder="000.000.000-00"
                className={cn(errors.cpf && 'border-error-600 focus:ring-error-600')}
                disabled={isSubmitting || cpfValidating || !!formData.documentoEstrangeiro}
              />
              {cpfValidating && <p className="mt-1 text-sm text-gray-600 flex items-center gap-2">
                <span className="animate-spin">⏳</span> Validando CPF...
              </p>}
              {errors.cpf && (
                <p className="text-sm text-error-600">{errors.cpf}</p>
              )}
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

            <div className="space-y-2">
              <Label htmlFor="documentoEstrangeiro">
                Documento Estrangeiro <span className="text-error-600">*</span>
                <span className="text-xs text-gray-500 ml-2 font-normal">(Passaporte, etc - aceita números e letras)</span>
              </Label>
              <Input
                id="documentoEstrangeiro"
                type="text"
                value={formData.documentoEstrangeiro}
                onChange={(e) => {
                  // Aceita números, letras e alguns caracteres especiais comuns em passaportes
                  const value = e.target.value.replace(/[^a-zA-Z0-9\-_]/g, '')
                  setFormData({ ...formData, documentoEstrangeiro: value, cpf: '' })
                  if (errors.documentoEstrangeiro) {
                    setErrors({ ...errors, documentoEstrangeiro: undefined })
                  }
                  if (errors.cpf) {
                    setErrors({ ...errors, cpf: undefined })
                  }
                }}
                placeholder="ABC123456 ou P1234567"
                className={cn(errors.documentoEstrangeiro && 'border-error-600 focus:ring-error-600')}
                disabled={isSubmitting || !!formData.cpf}
              />
              {errors.documentoEstrangeiro && <p className="text-sm text-error-600">{errors.documentoEstrangeiro}</p>}
              <p className="mt-1 text-xs text-gray-500">
                Preencha CPF ou Documento Estrangeiro (não ambos)
              </p>
            </div>
          </div>

          {/* Nome */}
          <div className="space-y-2">
            <Label htmlFor="nome">
              Nome <span className="text-error-600">*</span>
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
              placeholder="Nome completo"
              className={cn(errors.nome && 'border-error-600 focus:ring-error-600')}
              disabled={isSubmitting}
            />
            {errors.nome && <p className="text-sm text-error-600">{errors.nome}</p>}
          </div>

          {/* Email e Telefone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="email@exemplo.com"
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                id="telefone"
                type="text"
                value={formData.telefone}
                onChange={(e) => {
                  const formatted = formatTelefone(e.target.value)
                  setFormData({ ...formData, telefone: formatted })
                }}
                onBlur={async () => {
                  // Se não tem ID do Paciente preenchido e não está marcado como "sem Biologix", buscar automaticamente
                  if (!formData.idPaciente.trim() && !semBiologix && formData.telefone) {
                    const telefoneLimpo = formData.telefone.replace(/\D/g, '')
                    if (telefoneLimpo.length >= 10) {
                      // Primeiro tentar por CPF se tiver
                      if (formData.cpf && formData.cpf.replace(/\D/g, '').length === 11) {
                        const pacientePorCpf = await buscarPacientePorCPF(formData.cpf)
                        if (pacientePorCpf && pacientePorCpf.biologix_id) {
                          setFormData({ ...formData, idPaciente: pacientePorCpf.biologix_id })
                          showSuccess(`ID do Paciente encontrado automaticamente: ${pacientePorCpf.biologix_id}`)
                          return
                        }
                      }
                      // Se não encontrou por CPF, buscar por telefone
                      const pacientePorTelefone = await buscarPacientePorTelefone(formData.telefone)
                      if (pacientePorTelefone && pacientePorTelefone.biologix_id) {
                        setFormData({ ...formData, idPaciente: pacientePorTelefone.biologix_id })
                        showSuccess(`ID do Paciente encontrado automaticamente pelo telefone: ${pacientePorTelefone.biologix_id}`)
                      }
                    }
                  }
                }}
                placeholder="(00) 00000-0000"
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Data Nascimento e Gênero */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dataNascimento">Data de Nascimento</Label>
              <DateInput
                id="dataNascimento"
                value={formData.dataNascimento}
                onChange={(value) => {
                  setFormData({ ...formData, dataNascimento: value })
                  if (errors.dataNascimento) {
                    setErrors({ ...errors, dataNascimento: undefined })
                  }
                }}
                displayFormat="DD/MM/YYYY"
                placeholder="DD/MM/AAAA"
                className={cn(errors.dataNascimento && 'border-error-600 focus:ring-error-600')}
                disabled={isSubmitting}
              />
              {errors.dataNascimento && <p className="text-sm text-error-600">{errors.dataNascimento}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="genero">Gênero</Label>
              <select
                id="genero"
                value={formData.genero}
                onChange={(e) => setFormData({ ...formData, genero: e.target.value as 'M' | 'F' | 'Outro' | '' })}
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:cursor-not-allowed disabled:opacity-50"
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
          <div className="space-y-2">
            <Label>
              Status <span className="text-error-600">*</span>
            </Label>
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
                <span className="text-sm text-gray-900">Lead</span>
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
                <span className="text-sm text-gray-900">Paciente</span>
              </label>
            </div>
          </div>

          {/* Sessões Compradas */}
          <div className="space-y-2">
            <Label htmlFor="sessoesCompradas">Sessões Compradas</Label>
            <Input
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
              className={cn(errors.sessoesCompradas && 'border-error-600 focus:ring-error-600')}
              disabled={isSubmitting}
            />
            {errors.sessoesCompradas && (
              <p className="text-sm text-error-600">{errors.sessoesCompradas}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-6 border-t">
            <div></div>
            <div className="flex gap-3">
              <Button
              type="button"
                variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancelar
              </Button>
              <Button
              type="submit"
                variant="primary"
                isLoading={isSubmitting}
              disabled={(() => {
                const hasCpfError = errors.cpf ? (errors.cpf.includes('inválido') || errors.cpf.includes('já cadastrado')) : false
                return Boolean(isSubmitting || cpfExists || idPacienteExists || hasCpfError)
              })()}
            >
                Salvar Paciente
              </Button>
            </div>
          </div>
        </form>
        </div>
      </div>
    </div>
  )
}

