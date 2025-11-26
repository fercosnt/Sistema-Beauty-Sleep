import { getUserRole } from '@/lib/utils/get-user-role'
import { redirect } from 'next/navigation'

export default async function UsuariosPage() {
  const userRole = await getUserRole()
  
  // Apenas admin pode acessar
  if (userRole !== 'admin') {
    redirect('/dashboard')
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Usuários</h1>
        <p className="mt-2 text-gray-600">Gerencie usuários do sistema (apenas Admin)</p>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500">Lista de usuários será implementada na Fase 7</p>
      </div>
    </div>
  )
}

