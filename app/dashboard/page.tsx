import { getUserRole, getUserEmail } from '@/lib/utils/get-user-role'
import DashboardClient from './DashboardClient'
import DashboardContent from './components/DashboardContent'

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

