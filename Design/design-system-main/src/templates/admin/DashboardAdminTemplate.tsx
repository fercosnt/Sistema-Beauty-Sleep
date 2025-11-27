/**
 * Dashboard Admin Template
 * Beauty Smile Design System
 *
 * Template for admin dashboard with sidebar, metrics grid, and charts area
 */

import * as React from 'react'
import { BeautySmileLogo } from '@/assets/components/BeautySmileLogo'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { cn } from '@/utils/cn'

export interface MetricCardData {
  /**
   * Metric title
   */
  title: string
  /**
   * Metric value
   */
  value: string | number
  /**
   * Optional subtitle/description
   */
  subtitle?: string
  /**
   * Optional icon (React element)
   */
  icon?: React.ReactNode
  /**
   * Optional trend indicator
   */
  trend?: {
    value: number
    isPositive: boolean
  }
}

export interface SidebarNavItem {
  /**
   * Navigation item label
   */
  label: string
  /**
   * Navigation item icon
   */
  icon?: React.ReactNode
  /**
   * Whether this item is active
   */
  isActive?: boolean
  /**
   * Click handler
   */
  onClick?: () => void
}

export interface DashboardAdminTemplateProps {
  /**
   * Page title
   * @default 'Dashboard'
   */
  title?: string
  /**
   * User name to display in topbar
   */
  userName?: string
  /**
   * User avatar URL
   */
  userAvatar?: string
  /**
   * Metric cards to display
   */
  metrics?: MetricCardData[]
  /**
   * Sidebar navigation items
   */
  navItems?: SidebarNavItem[]
  /**
   * Main content area (charts, tables, etc.)
   */
  children?: React.ReactNode
  /**
   * Callback when user menu is clicked
   */
  onUserMenuClick?: () => void
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
 * Dashboard Admin Template
 *
 * Pre-built dashboard template for admin area with dark sidebar, metrics grid, and content area.
 *
 * @example
 * ```tsx
 * <DashboardAdminTemplate
 *   title="Dashboard Principal"
 *   userName="João Silva"
 *   metrics={[
 *     { title: 'Total de Usuários', value: '1,234', trend: { value: 12, isPositive: true } },
 *     { title: 'Vendas Hoje', value: 'R$ 45.678', trend: { value: 8, isPositive: true } },
 *   ]}
 *   navItems={[
 *     { label: 'Dashboard', isActive: true, onClick: () => {} },
 *     { label: 'Usuários', onClick: () => {} },
 *     { label: 'Configurações', onClick: () => {} },
 *   ]}
 * >
 *   <div>Seu conteúdo aqui (gráficos, tabelas, etc.)</div>
 * </DashboardAdminTemplate>
 * ```
 */
export const DashboardAdminTemplate: React.FC<DashboardAdminTemplateProps> = ({
  title = 'Dashboard',
  userName,
  userAvatar,
  metrics = [],
  navItems = [],
  children,
  onUserMenuClick,
  onLogout,
  className,
}) => {
  return (
    <div className={cn('flex h-screen bg-neutral-100', className)}>
      {/* Sidebar */}
      <aside className="w-64 bg-primary-900 text-white flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <BeautySmileLogo type="horizontal" size="md" />
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item, index) => (
            <button
              key={index}
              onClick={item.onClick}
              className={cn(
                'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left',
                item.isActive
                  ? 'bg-primary-700 text-white'
                  : 'text-white/70 hover:bg-white/5 hover:text-white'
              )}
            >
              {item.icon && <span className="text-lg">{item.icon}</span>}
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* User Section */}
        {userName && (
          <div className="p-4 border-t border-white/10">
            <div className="flex items-center gap-3">
              {userAvatar ? (
                <img
                  src={userAvatar}
                  alt={userName}
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-primary-700 flex items-center justify-center">
                  <span className="text-lg font-semibold">
                    {userName.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{userName}</p>
                {onUserMenuClick && (
                  <button
                    onClick={onUserMenuClick}
                    className="text-xs text-white/60 hover:text-white transition-colors"
                  >
                    Ver perfil
                  </button>
                )}
              </div>
            </div>
            {onLogout && (
              <button
                onClick={onLogout}
                className="mt-3 w-full px-4 py-2 text-sm bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
              >
                Sair
              </button>
            )}
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-neutral-200 flex items-center justify-between px-6">
          <h1 className="text-2xl font-bold text-neutral-900">{title}</h1>
          <div className="flex items-center gap-4">
            {/* Additional topbar content can go here */}
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-6">
          {/* Metrics Grid */}
          {metrics.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              {metrics.map((metric, index) => (
                <Card key={index}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium text-neutral-600">
                        {metric.title}
                      </CardTitle>
                      {metric.icon && (
                        <span className="text-neutral-400">{metric.icon}</span>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-baseline justify-between">
                      <p className="text-2xl font-bold text-neutral-900">
                        {metric.value}
                      </p>
                      {metric.trend && (
                        <span
                          className={cn(
                            'text-sm font-medium',
                            metric.trend.isPositive
                              ? 'text-success-600'
                              : 'text-error-600'
                          )}
                        >
                          {metric.trend.isPositive ? '+' : '-'}
                          {Math.abs(metric.trend.value)}%
                        </span>
                      )}
                    </div>
                    {metric.subtitle && (
                      <p className="text-xs text-neutral-500 mt-1">
                        {metric.subtitle}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Main Content Area (Charts, Tables, etc.) */}
          {children && <div className="space-y-6">{children}</div>}
        </div>
      </main>
    </div>
  )
}

DashboardAdminTemplate.displayName = 'DashboardAdminTemplate'
