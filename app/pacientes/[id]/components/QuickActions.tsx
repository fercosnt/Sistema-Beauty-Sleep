'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, FileText, Edit } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import ModalNovaSessao from '../../components/ModalNovaSessao'
import ModalNovaNota from '../../components/ModalNovaNota'
import ModalEditarPaciente from '../../components/ModalEditarPaciente'

interface QuickActionsProps {
  pacienteId: string
  onUpdate?: () => void
}

export default function QuickActions({ pacienteId, onUpdate }: QuickActionsProps) {
  const [userRole, setUserRole] = useState<string | null>(null)
  const [showNovaSessao, setShowNovaSessao] = useState(false)
  const [showNovaNota, setShowNovaNota] = useState(false)
  const [showEditarPaciente, setShowEditarPaciente] = useState(false)

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user?.email) {
          return
        }

        const { data: userData } = await supabase
          .from('users')
          .select('role')
          .eq('email', user.email)
          .single()

        if (userData) {
          setUserRole(userData.role)
        }
      } catch (error) {
        console.error('Erro ao buscar role do usuário:', error)
      }
    }

    fetchUserRole()
  }, [])

  // Recepção não pode usar essas ações
  if (userRole === 'recepcao') {
    return null
  }

  const handleNovaSessaoSuccess = () => {
    setShowNovaSessao(false)
    onUpdate?.()
  }

  const handleNovaNotaSuccess = () => {
    setShowNovaNota(false)
    onUpdate?.()
  }

  const handleEditarPacienteSuccess = () => {
    setShowEditarPaciente(false)
    onUpdate?.()
  }

  return (
    <>
      <div className="flex flex-wrap gap-3">
        <Button
          variant="primary"
          leftIcon={<Plus className="h-4 w-4" />}
          onClick={() => setShowNovaSessao(true)}
        >
          Nova Sessão
        </Button>

        <Button
          variant="outline"
          leftIcon={<FileText className="h-4 w-4" />}
          onClick={() => setShowNovaNota(true)}
        >
          Adicionar Nota
        </Button>

        <Button
          variant="outline"
          leftIcon={<Edit className="h-4 w-4" />}
          onClick={() => setShowEditarPaciente(true)}
        >
          Editar Paciente
        </Button>
      </div>

      {/* Modais */}
      <ModalNovaSessao
        isOpen={showNovaSessao}
        onClose={() => setShowNovaSessao(false)}
        onSuccess={handleNovaSessaoSuccess}
        pacienteId={pacienteId}
      />

      <ModalNovaNota
        isOpen={showNovaNota}
        onClose={() => setShowNovaNota(false)}
        onSuccess={handleNovaNotaSuccess}
        pacienteId={pacienteId}
      />

      <ModalEditarPaciente
        isOpen={showEditarPaciente}
        onClose={() => setShowEditarPaciente(false)}
        onSuccess={handleEditarPacienteSuccess}
        pacienteId={pacienteId}
      />
    </>
  )
}

