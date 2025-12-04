import { getUserRole } from '@/lib/utils/get-user-role'
import { redirect } from 'next/navigation'
import LogsTable from './components/LogsTable'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Logs de Auditoria | Beauty Sleep',
  description: 'Visualize todas as ações realizadas no sistema',
}

export const dynamic = 'force-dynamic'

export default async function LogsPage() {
  try {
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
  } catch (error) {
    console.error('Erro ao carregar página de logs:', error)
    redirect('/dashboard')
  }
}
