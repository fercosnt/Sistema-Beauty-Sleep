/**
 * Dashboard Admin Template
 * Beauty Smile Design System
 *
 * Template for admin dashboard with sidebar, metrics grid, and charts area
 */

import * as React from 'react'
import { useState, useEffect } from 'react'
import { LogOut, User, Settings, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import { cn } from '../../utils/cn'
import { backgrounds } from '../../assets/backgrounds'
import { Glass } from '../../components/glass/Glass'

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
   * Navigation item icon (ReactNode only)
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
   * User email (for fetching user data)
   */
  userEmail?: string
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
   * Search component to display in header (optional)
   */
  searchComponent?: React.ReactNode
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
  userEmail,
  metrics = [],
  navItems = [],
  children,
  onUserMenuClick,
  onLogout,
  searchComponent,
  className,
}) => {
  const [showMenu, setShowMenu] = useState(false)
  const [userData, setUserData] = useState<any>(null)
  const [user, setUser] = useState<any>(null)
  const [isCollapsed, setIsCollapsed] = useState(false)

  useEffect(() => {
    const fetchUser = async () => {
      // Se userEmail não foi passado, tentar buscar do contexto
      if (!userEmail) return
      
      // Aqui você pode adicionar lógica para buscar dados do usuário se necessário
      // Por enquanto, usamos os dados passados via props
    }
    fetchUser()
  }, [userEmail])

  const userInitials = userData?.nome
    ? userData.nome
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : userName
      ? userName
          .split(' ')
          .map((n: string) => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2)
      : 'U'

  return (
    <div 
      className={cn('flex h-screen relative', className)}
      style={{
        backgroundImage: `url(/dashboard-background.jpeg)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Sidebar - igual à página de Pacientes */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-[60]',
          'bg-primary-900 text-white flex flex-col',
          'transform transition-all duration-300 ease-in-out',
          isCollapsed ? 'w-16' : 'w-64'
        )}
      >
        {/* Logo Section */}
        <div className={cn(
          'border-b border-white/10 flex items-center justify-center relative',
          isCollapsed ? 'p-4' : 'p-6'
        )}>
          {!isCollapsed ? (
            <img
              src="/beauty-smile-logo.svg"
              alt="Beauty Smile"
              className="h-12 w-auto filter brightness-0 invert transition-opacity duration-300"
            />
          ) : (
            <div className="w-10 h-10 flex items-center justify-center">
              <img
                src="/beauty-smile-icon.svg"
                alt="Beauty Smile"
                className="w-10 h-10 transition-all duration-300"
                style={{
                  filter: 'brightness(0) saturate(100%) invert(85%) sepia(5%) saturate(10%) hue-rotate(0deg) brightness(110%) contrast(95%)',
                  opacity: 0.95
                }}
              />
            </div>
          )}
          
          {/* Toggle Button - Only on desktop */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={cn(
              'absolute -right-3 top-1/2 -translate-y-1/2',
              'w-6 h-6 rounded-full bg-primary-800 border-2 border-white/20',
              'flex items-center justify-center',
              'text-white hover:bg-primary-700 transition-colors',
              'shadow-lg',
              'hidden md:flex z-[70]'
            )}
            title={isCollapsed ? 'Expandir menu' : 'Colapsar menu'}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className={cn(
          'flex-1 space-y-2',
          isCollapsed ? 'p-2' : 'p-4'
        )}>
          {navItems.map((item, index) => {
            return (
              <button
                key={index}
                onClick={item.onClick}
                title={isCollapsed ? item.label : undefined}
                className={cn(
                  'flex items-center rounded-lg transition-colors',
                  isCollapsed 
                    ? 'justify-center px-2 py-3' 
                    : 'gap-3 px-4 py-3 w-full',
                  item.isActive
                    ? 'bg-primary-700 text-white'
                    : 'text-white/70 hover:bg-white/5 hover:text-white'
                )}
              >
                {item.icon && (
                  <span className="flex-shrink-0">
                    {React.isValidElement(item.icon) ? (
                      React.cloneElement(item.icon as React.ReactElement<any>, {
                        className: cn('h-5 w-5', (item.icon as React.ReactElement<any>)?.props?.className)
                      })
                    ) : (
                      item.icon
                    )}
                  </span>
                )}
                {!isCollapsed && (
                  <span className="font-medium whitespace-nowrap">{item.label}</span>
                )}
              </button>
            )
          })}
        </nav>

        {/* User Section */}
        {userName && (
          <div className={cn(
            'border-t border-white/10',
            isCollapsed ? 'p-2' : 'p-4'
          )}>
            {!isCollapsed ? (
              <>
                <div className="flex items-center gap-3 mb-3">
                  {userAvatar ? (
                    <img
                      src={userAvatar}
                      alt={userName}
                      className="w-10 h-10 rounded-full flex-shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-primary-700 flex items-center justify-center flex-shrink-0">
                      <span className="text-lg font-semibold">
                        {userName
                          .split(' ')
                          .map((n: string) => n[0])
                          .join('')
                          .toUpperCase()
                          .slice(0, 2)}
                      </span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{userName}</p>
                  </div>
                </div>
                {onLogout && (
                  <button
                    onClick={onLogout}
                    className="w-full px-4 py-2 text-sm bg-white/10 hover:bg-white/20 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    Sair
                  </button>
                )}
              </>
            ) : (
              <>
                <div className="flex flex-col items-center gap-2 mb-2">
                  <div className="w-10 h-10 rounded-full bg-primary-700 flex items-center justify-center">
                    <span className="text-lg font-semibold">
                      {userName
                        .split(' ')
                        .map((n: string) => n[0])
                        .join('')
                        .toUpperCase()
                        .slice(0, 2)}
                    </span>
                  </div>
                </div>
                {onLogout && (
                  <button
                    onClick={onLogout}
                    title="Sair"
                    className="w-full px-2 py-2 text-sm bg-white/10 hover:bg-white/20 rounded-lg transition-colors flex items-center justify-center"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                )}
              </>
            )}
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className={cn(
        'flex-1 flex flex-col overflow-hidden relative z-10 transition-all duration-300',
        isCollapsed ? 'ml-16' : 'ml-64'
      )}>
        {/* Top Bar - com arredondamento apenas embaixo e estilo glass */}
        <header className="h-16 sticky top-0 z-50 w-full px-4 md:px-6">
          <Glass variant="light" blur="lg" className="h-full w-full rounded-b-xl border-b border-white/20">
            <div className="flex items-center justify-between px-4 md:px-6 h-full relative">
              {/* Lado esquerdo - título (mobile) */}
              <div className="flex items-center gap-4 flex-shrink-0 md:hidden">
                <h1 className="text-xl font-bold text-neutral-900">{title}</h1>
              </div>
              
              {/* Busca Global - hidden on mobile, visible on desktop - centralizada no header */}
              {searchComponent && (
                <div className="hidden md:flex flex-1 items-center justify-center absolute left-0 right-0">
                  <div className="max-w-md w-full">
                    {searchComponent}
                  </div>
                </div>
              )}
              
              {/* Lado direito - menu do usuário */}
              <div className="flex items-center gap-4 flex-shrink-0 relative z-[60] ml-auto">
                <div className="relative">
                  <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-white hover:bg-white/10 transition-colors relative z-[60]"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white text-xs font-semibold">
                      {userInitials}
                    </div>
                    <span className="hidden md:block text-white">{userName || 'Usuário'}</span>
                    <ChevronDown className="h-4 w-4 text-white" />
                  </button>
                  {showMenu && (
                    <div className="absolute right-0 top-full mt-2 w-48 rounded-lg border border-neutral-200 bg-white shadow-lg z-[70]">
                      <div className="py-1">
                        {onUserMenuClick && (
                          <Link
                            href="/perfil"
                            className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 transition-colors"
                            onClick={() => {
                              setShowMenu(false)
                              onUserMenuClick()
                            }}
                          >
                            <User className="h-4 w-4" />
                            Perfil
                          </Link>
                        )}
                        <Link
                          href="/configuracoes"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 transition-colors"
                          onClick={() => setShowMenu(false)}
                        >
                          <Settings className="h-4 w-4" />
                          Configurações
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Glass>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto pl-8 pr-4 md:pl-12 md:pr-8 pt-8 pb-4 md:pb-8">
          {/* Title and Description */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-white font-heading">{title}</h1>
            <p className="mt-2 text-white">Visão geral do sistema Beauty Sleep</p>
          </div>
          
          {/* Metrics Grid - estilo glass transparente */}
          {metrics.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              {metrics.map((metric, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-lg p-6 rounded-lg border border-white/20">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-white/80">{metric.title}</h3>
                    {metric.icon && (
                      <span className="text-white/60">{metric.icon}</span>
                    )}
                  </div>
                  <div className="flex items-baseline justify-between">
                    <p className="text-2xl font-bold text-white">
                      {metric.value}
                    </p>
                    {metric.trend && (
                      <span
                        className={cn(
                          'text-sm font-medium',
                          metric.trend.isPositive
                            ? 'text-green-400'
                            : 'text-red-400'
                        )}
                      >
                        {metric.trend.isPositive ? '+' : '-'}
                        {Math.abs(metric.trend.value)}%
                      </span>
                    )}
                  </div>
                  {metric.subtitle && (
                    <p className="text-xs text-white/70 mt-2">
                      {metric.subtitle}
                    </p>
                  )}
                </div>
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
