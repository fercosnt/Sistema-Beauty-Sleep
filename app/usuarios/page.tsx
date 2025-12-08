import { getUserRole } from '@/lib/utils/get-user-role'
import { redirect } from 'next/navigation'
import UsuariosTable from './components/UsuariosTable'
import ContentContainer from '@/components/ui/ContentContainer'

export default async function UsuariosPage() {
  const userRole = await getUserRole()
  
  // Apenas admin pode acessar
  if (userRole !== 'admin') {
    redirect('/dashboard')
  }

  return (
    <ContentContainer>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 font-heading">Usuários</h1>
        <p className="mt-2 text-gray-600">Gerencie usuários do sistema (apenas Admin)</p>
      </div>
      
      <UsuariosTable />
    </ContentContainer>
  )
}

