import { useState } from 'react'
import { LoginAdminTemplate } from '@beautysmile/design-system'
import { auth } from '../lib/auth'

interface LoginPageProps {
  onLogin: () => void
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true)
    setError(null)

    try {
      await auth.login(email, password)
      onLogin()
    } catch (err) {
      setError('Falha ao fazer login. Por favor, tente novamente.')
      console.error('Login error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <LoginAdminTemplate
        title="Beauty Smile Admin"
        subtitle="Faça login para acessar o painel administrativo"
        onLogin={handleLogin}
        isLoading={isLoading}
      />
      {error && (
        <div className="fixed bottom-4 right-4 bg-error-600 text-white px-6 py-3 rounded-lg shadow-lg">
          {error}
        </div>
      )}
    </div>
  )
}
