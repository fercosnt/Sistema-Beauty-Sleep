'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { LayoutDashboard, Users, UserCog, FileText, LogOut, ChevronLeft, ChevronRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { cn } from '@/utils/cn'
import { useSidebar } from '@/components/providers/SidebarProvider'

interface SidebarProps {
  userRole?: string | null
  isMobileOpen?: boolean
  onMobileClose?: () => void
}

export default function Sidebar({ userRole, isMobileOpen = false, onMobileClose }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [currentRole, setCurrentRole] = useState<string | null>(userRole || null)
  const [userData, setUserData] = useState<any>(null)
  const [user, setUser] = useState<any>(null)
  const { isCollapsed, toggleCollapsed } = useSidebar()

  // Close mobile menu when route changes
  useEffect(() => {
    if (isMobileOpen && onMobileClose) {
      onMobileClose()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(() => {
    const fetchUserData = async () => {
      const supabase = createClient()
      const { data: { user: authUser } } = await supabase.auth.getUser()
      
      if (authUser?.email) {
        setUser(authUser)
        const { data: userDataFromDb } = await supabase
          .from('users')
          .select('*')
          .eq('email', authUser.email)
          .single()
        
        if (userDataFromDb) {
          setUserData(userDataFromDb)
          if (!currentRole) {
            setCurrentRole(userDataFromDb.role)
          }
        }
      }
    }
    fetchUserData()
  }, [currentRole])

  const handleSignOut = async () => {
    try {
      const supabase = createClient()
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        console.error('Erro ao fazer logout:', error)
      }
      
      // Force clear any cached data and redirect to login with cache bust
      window.location.href = '/login?logout=true'
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
      // Even if there's an error, redirect to login
      window.location.href = '/login?logout=true'
    }
  }

  const isAdmin = currentRole === 'admin'
  const userName = userData?.nome || user?.email || 'Usuário'
  const userInitials = userData?.nome
    ? userData.nome
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : user?.email?.[0].toUpperCase() || 'U'

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Pacientes', href: '/pacientes', icon: Users },
    ...(isAdmin ? [
      { name: 'Usuários', href: '/usuarios', icon: UserCog },
      { name: 'Logs', href: '/logs', icon: FileText },
    ] : []),
  ]

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onMobileClose}
        />
      )}
      {/* Sidebar - Dark Design from DashboardAdminTemplate with Collapsed Support */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-[60]',
          'bg-primary-900 text-white flex flex-col',
          'transform transition-all duration-300 ease-in-out',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
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
            onClick={toggleCollapsed}
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
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
            return (
              <Link
                key={item.name}
                href={item.href}
                title={isCollapsed ? item.name : undefined}
                className={cn(
                  'flex items-center rounded-lg transition-colors',
                  isCollapsed 
                    ? 'justify-center px-2 py-3' 
                    : 'gap-3 px-4 py-3 w-full',
                  isActive
                    ? 'bg-primary-700 text-white'
                    : 'text-white/70 hover:bg-white/5 hover:text-white'
                )}
              >
                <item.icon className={cn(
                  'flex-shrink-0',
                  isCollapsed ? 'h-5 w-5' : 'h-5 w-5'
                )} />
                {!isCollapsed && (
                  <span className="font-medium whitespace-nowrap">{item.name}</span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* User Section */}
        <div className={cn(
          'border-t border-white/10',
          isCollapsed ? 'p-2' : 'p-4'
        )}>
          {!isCollapsed ? (
            <>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-primary-700 flex items-center justify-center flex-shrink-0">
                  <span className="text-lg font-semibold">{userInitials}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{userName}</p>
                </div>
              </div>
              <button
                onClick={handleSignOut}
                className="w-full px-4 py-2 text-sm bg-white/10 hover:bg-white/20 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Sair
              </button>
            </>
          ) : (
            <>
              <div className="flex flex-col items-center gap-2 mb-2">
                <div className="w-10 h-10 rounded-full bg-primary-700 flex items-center justify-center">
                  <span className="text-lg font-semibold">{userInitials}</span>
                </div>
              </div>
              <button
                onClick={handleSignOut}
                title="Sair"
                className="w-full px-2 py-2 text-sm bg-white/10 hover:bg-white/20 rounded-lg transition-colors flex items-center justify-center"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      </aside>
    </>
  )
}

