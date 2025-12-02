'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { AlertCircle, Home } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 text-center">
        <div>
          <AlertCircle className="mx-auto h-12 w-12 text-danger-600" />
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
            Oops! Algo deu errado
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {error.message || 'Ocorreu um erro inesperado'}
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <Button
            onClick={reset}
            className="w-full"
          >
            Tentar novamente
          </Button>
          <Button
            variant="outline"
            onClick={() => window.location.href = '/dashboard'}
            className="w-full"
          >
            <Home className="mr-2 h-4 w-4" />
            Voltar ao Dashboard
          </Button>
        </div>
      </div>
    </div>
  )
}

