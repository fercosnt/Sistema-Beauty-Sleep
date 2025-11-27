import { DashboardClientTemplate, Card, CardContent, CardHeader, CardTitle } from '@beautysmile/design-system'
import { auth } from '../lib/auth'

interface DashboardPageProps {
  onLogout: () => void
}

export default function DashboardPage({ onLogout }: DashboardPageProps) {
  const user = auth.getCurrentUser()

  return (
    <DashboardClientTemplate
      userName={user?.name || 'Usuário'}
      welcomeMessage="Aqui está seu progresso e atividades recentes"
      metrics={[
        {
          title: 'Testes Completados',
          value: 5,
          variant: 'success',
          icon: '✓',
        },
        {
          title: 'Testes Pendentes',
          value: 2,
          variant: 'warning',
          icon: '⏱',
        },
        {
          title: 'Processos Ativos',
          value: 3,
          variant: 'info',
          icon: '📋',
        },
        {
          title: 'Convites',
          value: 1,
          variant: 'default',
          icon: '✉',
        },
      ]}
      onLogout={onLogout}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Próximos Testes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-accent-50 rounded-lg">
                <p className="font-medium text-accent-900">Teste DISC</p>
                <p className="text-sm text-accent-600">Prazo: 3 dias</p>
              </div>
              <div className="p-3 bg-accent-50 rounded-lg">
                <p className="font-medium text-accent-900">Teste Big Five</p>
                <p className="text-sm text-accent-600">Prazo: 5 dias</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Conquistas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🏆</span>
                <div>
                  <p className="font-medium text-neutral-900">Primeiro Teste</p>
                  <p className="text-sm text-neutral-500">Completou seu primeiro teste</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl">⭐</span>
                <div>
                  <p className="font-medium text-neutral-900">Sequência de 5 dias</p>
                  <p className="text-sm text-neutral-500">Acessou a plataforma por 5 dias seguidos</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardClientTemplate>
  )
}
