import { getUserRole } from '@/lib/utils/get-user-role'
import { redirect } from 'next/navigation'
import LogsTable from './components/LogsTable'

export default async function LogsPage() {
  const userRole = await getUserRole()
  
  // Apenas admin pode acessar
  if (userRole !== 'admin') {
    redirect('/dashboard')
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Logs de Auditoria</h1>
        <p className="mt-2 text-gray-600">Visualize todas as ações realizadas no sistema (apenas Admin)</p>
      </div>
      
      <LogsTable />
    </div>
  )
}
