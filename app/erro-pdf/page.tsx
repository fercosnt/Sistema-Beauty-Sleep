'use client'

import { Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { FileX, ArrowLeft, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'

function ErroPDFPageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const examKey = searchParams.get('examKey')
  const exameId = searchParams.get('exameId')

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-danger-100 rounded-full flex items-center justify-center">
            <FileX className="h-8 w-8 text-danger-600" />
          </div>
          <CardTitle className="text-2xl text-gray-900">PDF Não Encontrado</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-warning-50 border border-warning-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-warning-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-warning-900 mb-1">
                  Este recurso não foi encontrado no sistema.
                </p>
                <p className="text-xs text-warning-700">
                  O PDF do exame pode não estar disponível na API Biologix.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2 text-sm text-gray-600">
            <p><strong>Possíveis causas:</strong></p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Este exame foi migrado do Airtable e não possui chave válida</li>
              <li>O exame ainda não foi processado completamente</li>
              <li>O PDF não está disponível na API Biologix para este exame</li>
              <li>A chave do exame pode estar incorreta ou desatualizada</li>
            </ul>
          </div>

          {examKey && (
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
              <p className="text-xs text-gray-500 mb-1">Chave do Exame:</p>
              <p className="text-xs font-mono text-gray-700 break-all">{examKey}</p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            {exameId && (
              <Button
                variant="primary"
                onClick={() => router.push(`/pacientes/${exameId}`)}
                className="flex-1"
              >
                Voltar para Exame
              </Button>
            )}
            <Button
              variant="outline"
              leftIcon={<ArrowLeft className="h-4 w-4" />}
              onClick={() => router.back()}
              className="flex-1"
            >
              Voltar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function ErroPDFPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-900">Carregando...</div>
      </div>
    }>
      <ErroPDFPageContent />
    </Suspense>
  )
}

