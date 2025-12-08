import { DashboardAdminTemplate } from '@beautysmile/design-system'
import { auth } from '../lib/auth'
import { Card, CardContent, CardHeader, CardTitle } from '@beautysmile/design-system'

interface DashboardPageProps {
  onLogout: () => void
}

export default function DashboardPage({ onLogout }: DashboardPageProps) {
  const user = auth.getCurrentUser()

  return (
    <DashboardAdminTemplate
      title="Dashboard Principal"
      userName={user?.name || 'Usuário'}
      metrics={[
        {
          title: 'Total de Usuários',
          value: '1,234',
          subtitle: 'Últimos 30 dias',
          trend: { value: 12, isPositive: true },
        },
        {
          title: 'Vendas Hoje',
          value: 'R$ 45.678',
          subtitle: 'Atualizado agora',
          trend: { value: 8, isPositive: true },
        },
        {
          title: 'Tickets Abertos',
          value: '23',
          subtitle: '5 urgentes',
          trend: { value: 3, isPositive: false },
        },
        {
          title: 'Taxa de Conversão',
          value: '68%',
          subtitle: 'Meta: 70%',
          trend: { value: 5, isPositive: true },
        },
      ]}
      navItems={[
        { label: 'Dashboard', isActive: true, onClick: () => {} },
        { label: 'Usuários', onClick: () => {} },
        { label: 'Relatórios', onClick: () => {} },
        { label: 'Configurações', onClick: () => window.location.href = '/settings' },
      ]}
      onLogout={onLogout}
    >
      {/* Example content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Atividade Recente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg">
                <div className="w-2 h-2 bg-success-500 rounded-full" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-neutral-900">Novo usuário cadastrado</p>
                  <p className="text-xs text-neutral-500">Há 5 minutos</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg">
                <div className="w-2 h-2 bg-info-500 rounded-full" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-neutral-900">Relatório mensal gerado</p>
                  <p className="text-xs text-neutral-500">Há 1 hora</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg">
                <div className="w-2 h-2 bg-warning-500 rounded-full" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-neutral-900">Sistema atualizado</p>
                  <p className="text-xs text-neutral-500">Há 2 horas</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Estatísticas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-neutral-600">Progresso mensal</span>
                  <span className="text-sm font-medium text-neutral-900">75%</span>
                </div>
                <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
                  <div className="h-full bg-primary-600 rounded-full" style={{ width: '75%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-neutral-600">Satisfação do cliente</span>
                  <span className="text-sm font-medium text-neutral-900">92%</span>
                </div>
                <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
                  <div className="h-full bg-success-600 rounded-full" style={{ width: '92%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-neutral-600">Performance do sistema</span>
                  <span className="text-sm font-medium text-neutral-900">88%</span>
                </div>
                <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
                  <div className="h-full bg-info-600 rounded-full" style={{ width: '88%' }} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardAdminTemplate>
  )
}
