import { getUserRole, getUserEmail } from '@/lib/utils/get-user-role'
import DashboardClient from './DashboardClient'
import DashboardContent from './components/DashboardContent'

// Force dynamic rendering to avoid prerendering issues
export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const userRole = await getUserRole()
  const userEmail = await getUserEmail()

  return (
    <>
      <DashboardClient userRole={userRole} userEmail={userEmail} />
      <DashboardContent userRole={userRole} />
    </>
  )
}

