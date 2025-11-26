'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, User, Mail, Phone, Calendar, Ruler, Scale } from 'lucide-react'
import { showError } from '@/components/ui/Toast'

interface Tag {
  id: string
  nome: string
  cor: string
}

interface PacienteTag {
  tag_id: string
  tags: Tag
}

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
  sessoes_adicionadas: number
  sessoes_utilizadas: number
  observacoes_gerais: string | null
  created_at: string
  paciente_tags?: PacienteTag[]
}

export default function PacienteDetailPage() {
  const params = useParams()
  const router = useRouter()
  const pacienteId = params.id as string

  const [paciente, setPaciente] = useState<Paciente | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchPaciente = async () => {
      try {
        const supabase = createClient()
        
        // Buscar paciente com todas as relações
        const { data, error } = await supabase
          .from('pacientes')
          .select(`
            *,
            paciente_tags (
              tag_id,
              tags (
                id,
                nome,
                cor
              )
            )
          `)
          .eq('id', pacienteId)
          .single()

        if (error) {
          console.error('Erro ao buscar paciente:', error)
          showError('Erro ao carregar dados do paciente')
          router.push('/pacientes')
          return
        }

        setPaciente(data)
      } catch (error) {
        console.error('Erro inesperado:', error)
        showError('Erro inesperado ao carregar paciente')
        router.push('/pacientes')
      } finally {
        setIsLoading(false)
      }
    }

    if (pacienteId) {
      fetchPaciente()
    }
  }, [pacienteId, router])

  const formatCPF = (cpf: string | null) => {
    if (!cpf) return 'N/A'
    const cleaned = cpf.replace(/\D/g, '')
    if (cleaned.length === 11) {
      return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
    }
    return cpf
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR')
  }

  const formatTelefone = (telefone: string | null) => {
    if (!telefone) return 'N/A'
    const cleaned = telefone.replace(/\D/g, '')
    if (cleaned.length === 11) {
      return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
    } else if (cleaned.length === 10) {
      return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
    }
    return telefone
  }

  const calcularIdade = (dataNascimento: string | null) => {
    if (!dataNascimento) return null
    const hoje = new Date()
    const nascimento = new Date(dataNascimento)
    let idade = hoje.getFullYear() - nascimento.getFullYear()
    const mes = hoje.getMonth() - nascimento.getMonth()
    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
      idade--
    }
    return idade
  }

  const calcularAdesao = () => {
    if (!paciente) return 0
    const total = (paciente.sessoes_compradas || 0) + (paciente.sessoes_adicionadas || 0)
    if (total === 0) return 0
    return ((paciente.sessoes_utilizadas || 0) / total) * 100
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      lead: 'bg-blue-100 text-blue-800',
      ativo: 'bg-success-100 text-success-800',
      finalizado: 'bg-gray-100 text-gray-800',
      inativo: 'bg-danger-100 text-danger-800',
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const getAdesaoColor = (adesao: number) => {
    if (adesao >= 80) return 'bg-success-100 text-success-800'
    if (adesao >= 50) return 'bg-warning-100 text-warning-800'
    return 'bg-danger-100 text-danger-800'
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-black">Carregando dados do paciente...</p>
        </div>
      </div>
    )
  }

  if (!paciente) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-black">Paciente não encontrado</p>
        </div>
      </div>
    )
  }

  const adesao = calcularAdesao()
  const idade = calcularIdade(paciente.data_nascimento)
  const sessoesDisponiveis =
    (paciente.sessoes_compradas || 0) + (paciente.sessoes_adicionadas || 0) - (paciente.sessoes_utilizadas || 0)

  return (
    <div className="p-6">
      {/* Botão Voltar */}
      <button
        onClick={() => router.push('/pacientes')}
        className="flex items-center gap-2 mb-6 text-black hover:text-primary-600 transition-colors"
      >
        <ArrowLeft className="h-5 w-5" />
        Voltar para Lista
      </button>

      {/* Header do Paciente */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <h1 className="text-3xl font-bold text-black">{paciente.nome}</h1>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(
                  paciente.status
                )}`}
              >
                {paciente.status}
              </span>
            </div>
            {idade && (
              <p className="text-black text-sm">
                {idade} anos {paciente.genero && `• ${paciente.genero === 'M' ? 'Masculino' : paciente.genero === 'F' ? 'Feminino' : 'Outro'}`}
              </p>
            )}
          </div>
        </div>

        {/* Tags */}
        {paciente.paciente_tags && paciente.paciente_tags.length > 0 && (
          <div className="mb-6">
            <p className="text-xs text-black opacity-70 mb-2">Tags</p>
            <div className="flex flex-wrap gap-2">
              {paciente.paciente_tags.map((pt) => (
                <span
                  key={pt.tag_id}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white"
                  style={{ backgroundColor: pt.tags.cor }}
                >
                  {pt.tags.nome}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Informações de Contato */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="flex items-center gap-3">
            <User className="h-5 w-5 text-black opacity-50" />
            <div>
              <p className="text-xs text-black opacity-70">CPF</p>
              <p className="text-sm font-medium text-black">{formatCPF(paciente.cpf)}</p>
            </div>
          </div>

          {paciente.email && (
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-black opacity-50" />
              <div>
                <p className="text-xs text-black opacity-70">Email</p>
                <a
                  href={`mailto:${paciente.email}`}
                  className="text-sm font-medium text-primary-600 hover:text-primary-800"
                >
                  {paciente.email}
                </a>
              </div>
            </div>
          )}

          {paciente.telefone && (
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-black opacity-50" />
              <div>
                <p className="text-xs text-black opacity-70">Telefone</p>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-black">{formatTelefone(paciente.telefone)}</p>
                  <a
                    href={`https://wa.me/55${paciente.telefone.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-800"
                  >
                    <Phone className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          )}

          {paciente.data_nascimento && (
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-black opacity-50" />
              <div>
                <p className="text-xs text-black opacity-70">Data de Nascimento</p>
                <p className="text-sm font-medium text-black">{formatDate(paciente.data_nascimento)}</p>
              </div>
            </div>
          )}
        </div>

        {/* Resumo de Tratamento */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-xs text-black opacity-70 mb-1">Sessões Compradas</p>
            <p className="text-2xl font-bold text-black">{paciente.sessoes_compradas || 0}</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-xs text-black opacity-70 mb-1">Sessões Adicionadas</p>
            <p className="text-2xl font-bold text-black">{paciente.sessoes_adicionadas || 0}</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-xs text-black opacity-70 mb-1">Sessões Utilizadas</p>
            <p className="text-2xl font-bold text-black">{paciente.sessoes_utilizadas || 0}</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-xs text-black opacity-70 mb-1">Sessões Disponíveis</p>
            <p className="text-2xl font-bold text-black">{sessoesDisponiveis}</p>
          </div>
        </div>

        {/* Adesão */}
        <div className="mt-4">
          <p className="text-xs text-black opacity-70 mb-2">Adesão ao Tratamento</p>
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-gray-200 rounded-full h-4">
              <div
                className={`h-4 rounded-full ${adesao >= 80 ? 'bg-success-500' : adesao >= 50 ? 'bg-warning-500' : 'bg-danger-500'}`}
                style={{ width: `${Math.min(adesao, 100)}%` }}
              />
            </div>
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getAdesaoColor(adesao)}`}
            >
              {adesao.toFixed(0)}%
            </span>
          </div>
        </div>

        {/* Observações Gerais */}
        {paciente.observacoes_gerais && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm font-medium text-black mb-2">Observações Gerais</p>
            <p className="text-sm text-black whitespace-pre-wrap">{paciente.observacoes_gerais}</p>
          </div>
        )}
      </div>

      {/* Placeholder para tabs futuras */}
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-black text-center py-8">
          Tabs de Exames, Sessões, Evolução e Notas serão implementadas em breve.
        </p>
      </div>
    </div>
  )
}

