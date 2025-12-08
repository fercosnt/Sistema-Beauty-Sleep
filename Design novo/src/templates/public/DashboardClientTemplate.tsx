/**
 * Dashboard Client Template
 * Beauty Smile Design System
 *
 * Template for client/user dashboard with turquoise theme
 */

import * as React from 'react'
import { BeautySmileLogo } from '@/assets/components/BeautySmileLogo'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { cn } from '@/utils/cn'

export interface ClientMetric {
  title: string
  value: string | number
  icon?: React.ReactNode
  variant?: 'default' | 'success' | 'warning' | 'info'
}

export interface ClientDashboardTemplateProps {
  /**
   * User's name
   */
  userName: string
  /**
   * Welcome message
   */
  welcomeMessage?: string
  /**
   * Metrics to display
   */
  metrics?: ClientMetric[]
  /**
   * Main content sections
   */
  children?: React.ReactNode
  /**
   * Callback when logout is clicked
   */
  onLogout?: () => void
  /**
   * Additional class name
   */
  className?: string
}

/**
 * Dashboard Client Template
 *
 * Pre-built dashboard template for end users/clients with turquoise theme.
 *
 * @example
 * ```tsx
 * <DashboardClientTemplate
 *   userName="João Silva"
 *   welcomeMessage="Aqui está seu progresso"
 *   metrics={[
 *     { title: 'Testes Completados', value: 5, variant: 'success' },
 *     { title: 'Pendentes', value: 2, variant: 'warning' },
 *   ]}
 * >
 *   <div>Content here...</div>
 * </DashboardClientTemplate>
 * ```
 */
export const DashboardClientTemplate: React.FC<ClientDashboardTemplateProps> = ({
  userName,
  welcomeMessage = 'Bem-vindo de volta',
  metrics = [],
  children,
  onLogout,
  className,
}) => {
  const variantColors = {
    default: 'bg-neutral-50 text-neutral-900',
    success: 'bg-success-50 text-success-900',
    warning: 'bg-warning-50 text-warning-900',
    info: 'bg-info-50 text-info-900',
  }

  return (
    <div className={cn('min-h-screen bg-neutral-50', className)}>
      {/* Header */}
      <header className="bg-white border-b border-neutral-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <BeautySmileLogo type="horizontal" size="md" />
            {onLogout && (
              <Button variant="outline" size="sm" onClick={onLogout}>
                Sair
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            Olá, {userName}!
          </h1>
          <p className="text-lg text-neutral-600">{welcomeMessage}</p>
        </div>

        {/* Metrics */}
        {metrics.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {metrics.map((metric, index) => (
              <Card
                key={index}
                className={cn(variantColors[metric.variant || 'default'])}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">
                      {metric.title}
                    </CardTitle>
                    {metric.icon && <span>{metric.icon}</span>}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{metric.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Content Area */}
        {children && <div className="space-y-6">{children}</div>}
      </main>
    </div>
  )
}

DashboardClientTemplate.displayName = 'DashboardClientTemplate'
