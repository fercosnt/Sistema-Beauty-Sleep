import AlertasList from './components/AlertasList'
import ContentContainer from '@/components/ui/ContentContainer'

// Force dynamic rendering to avoid prerendering issues with ContentContainer
export const dynamic = 'force-dynamic'

export default function AlertasPage() {
  return (
    <ContentContainer>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white font-heading">Alertas</h1>
        <p className="mt-2 text-white">Gerencie todos os alertas do sistema</p>
      </div>
      <AlertasList />
    </ContentContainer>
  )
}

