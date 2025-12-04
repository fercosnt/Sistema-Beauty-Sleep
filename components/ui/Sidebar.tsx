'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { LayoutDashboard, Users, UserCog, FileText, LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

interface SidebarProps {
  userRole?: string | null
  isMobileOpen?: boolean
  onMobileClose?: () => void
}

export default function Sidebar({ userRole, isMobileOpen = false, onMobileClose }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [currentRole, setCurrentRole] = useState<string | null>(userRole || null)

  // Close mobile menu when route changes
  useEffect(() => {
    if (isMobileOpen && onMobileClose) {
      onMobileClose()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(() => {
    // Fetch user role if not provided
    if (!currentRole) {
      const fetchRole = async () => {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (user?.email) {
          const { data: userData } = await supabase
            .from('users')
            .select('role')
            .eq('email', user.email)
            .single()
          if (userData) {
            setCurrentRole(userData.role)
          }
        }
      }
      fetchRole()
    }
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
      {/* Sidebar */}
      <div
        className={`
          fixed md:static inset-y-0 left-0 z-50
          flex h-screen w-64 flex-col text-white
          transform transition-transform duration-300 ease-in-out
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          sidebar-background
        `}
      >
        <div className="flex h-20 items-center justify-center border-b border-primary-800 px-4">
          <img 
            src="/Logo.png" 
            alt="Beauty Sleep Logo" 
            className="h-16 w-auto object-contain"
          />
        </div>
      <nav className="flex-1 space-y-1 px-2 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary-800 text-white'
                  : 'text-gray-300 hover:bg-primary-800 hover:text-white'
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>
      <div className="border-t border-primary-800 p-4">
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-primary-800 hover:text-white"
        >
          <LogOut className="h-5 w-5" />
          Sair
        </button>
      </div>
    </div>
    </>
  )
}

