import { getUserRole } from '@/lib/utils/get-user-role'
import { redirect } from 'next/navigation'
import LogsTable from './components/LogsTable'
import ContentContainer from '@/components/ui/ContentContainer'

export const metadata = {
  title: 'Logs de Auditoria - Beauty Sleep',
  description: 'Visualize todas as ações realizadas no sistema',
}

// Force dynamic rendering to avoid prerendering issues with ContentContainer
export const dynamic = 'force-dynamic'

export default async function LogsPage() {
  const userRole = await getUserRole()
  
  // Apenas admin pode acessar
  if (userRole !== 'admin') {
    redirect('/dashboard')
  }

  return (
    <ContentContainer>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white font-heading">Logs de Auditoria</h1>
        <p className="mt-2 text-white">Visualize todas as ações realizadas no sistema (apenas Admin)</p>
      </div>
      
      <LogsTable />
    </ContentContainer>
  )
}
