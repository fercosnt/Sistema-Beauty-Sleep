import { Button } from '@/components/ui/Button'
import { Home, Search } from 'lucide-react'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 text-center">
        <div>
          <h1 className="text-9xl font-bold text-primary-600">404</h1>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
            Página não encontrada
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            A página que você está procurando não existe ou foi movida.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <Link href="/dashboard">
            <Button className="w-full">
              <Home className="mr-2 h-4 w-4" />
              Voltar ao Dashboard
            </Button>
          </Link>
          <Link href="/pacientes">
            <Button variant="outline" className="w-full">
              <Search className="mr-2 h-4 w-4" />
              Ir para Pacientes
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

