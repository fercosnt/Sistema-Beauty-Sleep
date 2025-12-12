import { getUserRole } from '@/lib/utils/get-user-role'
import { redirect } from 'next/navigation'
import LogDetalhesClient from './LogDetalhesClient'

export const metadata = {
  title: 'Detalhes do Log - Beauty Sleep',
  description: 'Visualize os detalhes completos de um log de auditoria',
}

export default async function LogDetalhesPage({ params }: { params: { id: string } }) {
  const userRole = await getUserRole()
  
  // Apenas admin pode acessar
  if (userRole !== 'admin') {
    redirect('/dashboard')
  }

  return <LogDetalhesClient logId={params.id} />
}

