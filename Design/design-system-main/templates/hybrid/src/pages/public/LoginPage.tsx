import { useState } from 'react'
import { LoginPublicTemplate } from '@beautysmile/design-system'
import { auth } from '../lib/auth'

interface LoginPageProps {
  onLogin: () => void
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [mode, setMode] = useState<'login' | 'signup'>('login')

  const handleSubmit = async (data: Record<string, any>) => {
    setIsLoading(true)

    try {
      await auth.login(data.email, data.password)
      onLogin()
    } catch (err) {
      console.error('Login error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <LoginPublicTemplate
      mode={mode}
      onSubmit={handleSubmit}
      onToggleMode={() => setMode(mode === 'login' ? 'signup' : 'login')}
      isLoading={isLoading}
    />
  )
}
