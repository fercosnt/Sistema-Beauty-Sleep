import { DashboardAdminTemplate, SettingsTemplate, Input, Label } from '@beautysmile/design-system'
import { auth } from '../lib/auth'

interface SettingsPageProps {
  onLogout: () => void
}

export default function SettingsPage({ onLogout }: SettingsPageProps) {
  const user = auth.getCurrentUser()

  return (
    <DashboardAdminTemplate
      title="Configurações"
      userName={user?.name || 'Usuário'}
      navItems={[
        { label: 'Dashboard', onClick: () => window.location.href = '/dashboard' },
        { label: 'Usuários', onClick: () => {} },
        { label: 'Relatórios', onClick: () => {} },
        { label: 'Configurações', isActive: true, onClick: () => {} },
      ]}
      onLogout={onLogout}
    >
      <SettingsTemplate
        title="Configurações do Sistema"
        description="Gerencie as configurações da sua conta e preferências"
        layout="stacked"
        sections={[
          {
            id: 'general',
            title: 'Geral',
            description: 'Configurações gerais do sistema',
            content: (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="site-name">Nome do Site</Label>
                  <Input
                    id="site-name"
                    defaultValue="Beauty Smile Admin"
                    placeholder="Nome do seu site"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="site-url">URL do Site</Label>
                  <Input
                    id="site-url"
                    type="url"
                    defaultValue="https://beautysmile.com"
                    placeholder="https://exemplo.com"
                  />
                </div>
              </div>
            ),
          },
          {
            id: 'notifications',
            title: 'Notificações',
            description: 'Configure suas preferências de notificação',
            content: (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-neutral-900">Notificações por Email</p>
                    <p className="text-sm text-neutral-500">Receba atualizações por email</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-neutral-900">Notificações Push</p>
                    <p className="text-sm text-neutral-500">Receba notificações no navegador</p>
                  </div>
                  <input type="checkbox" className="w-4 h-4" />
                </div>
              </div>
            ),
          },
          {
            id: 'security',
            title: 'Segurança',
            description: 'Configurações de segurança da conta',
            content: (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Senha Atual</Label>
                  <Input id="current-password" type="password" placeholder="••••••••" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">Nova Senha</Label>
                  <Input id="new-password" type="password" placeholder="••••••••" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
                  <Input id="confirm-password" type="password" placeholder="••••••••" />
                </div>
              </div>
            ),
          },
        ]}
        onSave={() => {
          alert('Configurações salvas com sucesso!')
        }}
      />
    </DashboardAdminTemplate>
  )
}
