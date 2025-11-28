'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { User, Settings, ChevronDown, Menu, X } from 'lucide-react'
import Link from 'next/link'
import BuscaGlobal from './BuscaGlobal'

interface HeaderProps {
  userRole?: string | null
  onMenuToggle?: () => void
  isMobileMenuOpen?: boolean
}

export default function Header({ userRole, onMenuToggle, isMobileMenuOpen }: HeaderProps) {
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
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 md:px-6">
      <div className="flex items-center gap-4 flex-1">
        {/* Hamburger menu button - only visible on mobile */}
        <button
          onClick={onMenuToggle}
          className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
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
        {/* Busca Global - hidden on mobile, visible on desktop */}
        <div className="hidden md:block flex-1 max-w-md">
          <BuscaGlobal />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-600 text-white text-xs font-semibold">
              {userInitials}
            </div>
            <span className="hidden md:block">{userData?.nome || user?.email}</span>
            <ChevronDown className="h-4 w-4" />
          </button>
          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 rounded-lg border border-gray-200 bg-white shadow-lg">
              <div className="py-1">
                <Link
                  href="/perfil"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setShowMenu(false)}
                >
                  <User className="h-4 w-4" />
                  Perfil
                </Link>
                <Link
                  href="/configuracoes"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
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
    </header>
  )
}

