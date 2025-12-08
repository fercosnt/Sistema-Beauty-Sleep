'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { User, Settings, ChevronDown, Menu, X } from 'lucide-react'
import Link from 'next/link'
import BuscaGlobal from './BuscaGlobal'
import { useSidebar } from '@/components/providers/SidebarProvider'
import { cn } from '@/utils/cn'
import { Glass } from '@beautysmile/components'

interface HeaderProps {
  userRole?: string | null
  onMenuToggle?: () => void
  isMobileMenuOpen?: boolean
}

export default function Header({ userRole, onMenuToggle, isMobileMenuOpen }: HeaderProps) {
  const { isCollapsed } = useSidebar()
  const [user, setUser] = useState<any>(null)
  const [userData, setUserData] = useState<any>(null)
  const [showMenu, setShowMenu] = useState(false)

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient()
      // Force refresh to get latest user data
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()

      if (authError) {
        console.error('Error fetching auth user:', authError)
        return
      }

      if (authUser?.email) {
        setUser(authUser)
        // Fetch user data from users table
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('email', authUser.email)
          .single()

        if (error) {
          console.error('Error fetching user data:', error)
        } else if (data) {
          setUserData(data)
        }
      }
    }
    fetchUser()

    // Listen for auth state changes (e.g., after login/logout)
    const supabase = createClient()
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        fetchUser()
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const userInitials = userData?.nome
    ? userData.nome
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : user?.email?.[0].toUpperCase() || 'U'

  return (
    <header className={cn(
      "h-16 sticky top-0 z-50 w-full px-4 md:px-6"
    )}>
      <Glass variant="light" blur="lg" className="h-full w-full rounded-b-xl border-b border-white/20">
        <div className="flex items-center justify-between px-4 md:px-6 h-full relative">
      {/* Lado esquerdo - botão hamburger (mobile) e logo mobile */}
      <div className="flex items-center gap-4 flex-shrink-0">
        {/* Hamburger menu button - only visible on mobile */}
        <button
          onClick={onMenuToggle}
          className="md:hidden p-2 rounded-lg text-neutral-700 hover:bg-neutral-100 transition-colors"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
        {/* Logo mobile */}
        <img 
          src="/Logo.png" 
          alt="Beauty Sleep Logo" 
          className="h-12 w-auto object-contain md:hidden"
        />
      </div>
      
      {/* Busca Global - hidden on mobile, visible on desktop - centralizada no header */}
      <div className="hidden md:flex flex-1 items-center justify-center absolute left-0 right-0">
        <div className="max-w-md w-full">
          <BuscaGlobal />
        </div>
      </div>
      
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
            <span className="hidden md:block text-white">{userData?.nome || user?.email}</span>
            <ChevronDown className="h-4 w-4 text-white" />
          </button>
          {showMenu && (
            <div className="absolute right-0 top-full mt-2 w-48 rounded-lg border border-neutral-200 bg-white shadow-lg z-[70]">
              <div className="py-1">
                <Link
                  href="/perfil"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 transition-colors"
                  onClick={() => setShowMenu(false)}
                >
                  <User className="h-4 w-4" />
                  Perfil
                </Link>
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
  )
}

