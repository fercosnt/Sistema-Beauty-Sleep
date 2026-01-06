import PacientesTable from './components/PacientesTable'
import ContentContainer from '@/components/ui/ContentContainer'

// Force dynamic rendering to avoid prerendering issues with ContentContainer
export const dynamic = 'force-dynamic'

export default function PacientesPage() {
  return (
    <ContentContainer>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white font-heading">Pacientes</h1>
        <p className="mt-2 text-white">Gerencie todos os pacientes do sistema</p>
      </div>
      <PacientesTable />
    </ContentContainer>
  )
}

