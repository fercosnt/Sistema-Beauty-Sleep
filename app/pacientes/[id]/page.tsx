'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft } from 'lucide-react'
import { showError } from '@/components/ui/Toast'
import { useSidebar } from '@/components/providers/SidebarProvider'
import { cn } from '@/utils/cn'
import HeaderPerfil from './components/HeaderPerfil'
import ResumoTratamento from './components/ResumoTratamento'
import PacienteTabs from './components/PacienteTabs'
import TabExames from './components/TabExames'
import TabSessoes from './components/TabSessoes'
import TabEvolucao from './components/TabEvolucao'
import TabPeso from './components/TabPeso'
import TabNotas from './components/TabNotas'
import TabHistoricoStatus from './components/TabHistoricoStatus'

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
  proxima_manutencao: string | null
  created_at: string
  paciente_tags?: PacienteTag[]
}

export default function PacienteDetailPage() {
  const params = useParams()
  const router = useRouter()
  const pacienteId = params.id as string
  const { isCollapsed } = useSidebar()

  const [paciente, setPaciente] = useState<Paciente | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)
  const [activeTab, setActiveTab] = useState('exames')

  const fetchPaciente = async () => {
    try {
      setIsLoading(true)
      const supabase = createClient()
      
      // Buscar paciente primeiro
      const { data: pacienteData, error: pacienteError } = await supabase
        .from('pacientes')
        .select('*')
        .eq('id', pacienteId)
        .single()

      if (pacienteError) {
        throw pacienteError
      }

      // Buscar tags separadamente para evitar erro 406
      const { data: tagsData, error: tagsError } = await supabase
        .from('paciente_tags')
        .select(`
          tag_id,
          tags (
            id,
            nome,
            cor
          )
        `)
        .eq('paciente_id', pacienteId)

      // Se houver erro ao buscar tags, apenas logar mas continuar (tags são opcionais)
      if (tagsError) {
        console.warn('Erro ao buscar tags do paciente:', tagsError)
      }

      // Combinar dados
      const data = {
        ...pacienteData,
        paciente_tags: tagsData || []
      }

      setPaciente(data as Paciente)
    } catch (error) {
      console.error('Erro inesperado:', error)
      showError('Erro inesperado ao carregar paciente')
      router.push('/pacientes')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (pacienteId) {
      fetchPaciente()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pacienteId, refreshKey])

  if (isLoading) {
    return (
      <div className={cn(
        "p-4 md:py-6",
        isCollapsed ? "md:pl-3 md:pr-6" : "md:pl-5 md:pr-6"
      )}>
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-black">Carregando dados do paciente...</p>
        </div>
      </div>
    )
  }

  if (!paciente) {
    return (
      <div className={cn(
        "p-4 md:py-6",
        isCollapsed ? "md:pl-3 md:pr-6" : "md:pl-5 md:pr-6"
      )}>
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-black">Paciente não encontrado</p>
        </div>
      </div>
    )
  }


  return (
    <div className={cn(
      "p-4 md:py-6",
      isCollapsed ? "md:pl-3 md:pr-6" : "md:pl-5 md:pr-6"
    )}>
      {/* Botão Voltar */}
      <button
        onClick={() => router.push('/pacientes')}
        className="flex items-center gap-2 mb-6 text-black hover:text-primary-600 transition-colors"
      >
        <ArrowLeft className="h-5 w-5" />
        Voltar para Lista
      </button>

      {/* Header do Paciente */}
      <div className="mb-6">
        <HeaderPerfil
          paciente={paciente}
          onPacienteUpdate={() => {
            setRefreshKey((prev) => prev + 1)
          }}
        />
      </div>

      {/* Resumo de Tratamento */}
      <div className="mb-6">
        <ResumoTratamento
          paciente={paciente}
          onPacienteUpdate={() => {
            setRefreshKey((prev) => prev + 1)
          }}
        />
      </div>

      {/* Tabs */}
      <PacienteTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Conteúdo das Tabs */}
      <div className="mt-6">
        {activeTab === 'exames' && <TabExames pacienteId={paciente.id} />}
        {activeTab === 'sessoes' && <TabSessoes pacienteId={paciente.id} onSessionUpdate={() => setRefreshKey(prev => prev + 1)} />}
        {activeTab === 'evolucao' && <TabEvolucao pacienteId={paciente.id} />}
        {activeTab === 'peso' && <TabPeso pacienteId={paciente.id} />}
      {activeTab === 'notas' && <TabNotas pacienteId={paciente.id} />}
      {activeTab === 'historico' && <TabHistoricoStatus pacienteId={paciente.id} />}
      </div>
    </div>
  )
}

