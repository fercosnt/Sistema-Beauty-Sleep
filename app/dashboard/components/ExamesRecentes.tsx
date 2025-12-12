'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { createClient } from '@/lib/supabase/client'
import { FileText, Eye } from 'lucide-react'

interface Exame {
  id: string
  paciente_id: string
  paciente_nome: string
  data_exame: string
  tipo: number | null
  ido: number | null
  ido_categoria: number | null
  score_ronco: number | null
}

export default function ExamesRecentes() {
  const [exames, setExames] = useState<Exame[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedExame, setSelectedExame] = useState<Exame | null>(null)

  useEffect(() => {
    const fetchExamesRecentes = async () => {
      try {
        const supabase = createClient()

        const { data, error } = await supabase
          .from('exames')
          .select(`
            id,
            paciente_id,
            data_exame,
            tipo,
            ido,
            ido_categoria,
            score_ronco,
            pacientes!inner(nome)
          `)
          .order('data_exame', { ascending: false })
          .limit(10)

        if (error) {
          console.error('Erro ao buscar exames:', error)
          return
        }

        const examesFormatados = data?.map((exame: any) => ({
          id: exame.id,
          paciente_id: exame.paciente_id,
          paciente_nome: exame.pacientes?.nome || 'N/A',
          data_exame: exame.data_exame,
          tipo: exame.tipo,
          ido: exame.ido,
          ido_categoria: exame.ido_categoria,
          score_ronco: exame.score_ronco,
        })) || []

        setExames(examesFormatados)
      } catch (error) {
        console.error('Erro inesperado ao buscar exames:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchExamesRecentes()
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR')
  }

  const getTipoExame = (tipo: number | null) => {
    if (tipo === null) return 'N/A'
    return tipo === 0 ? 'Ronco' : tipo === 1 ? 'Sono' : 'Desconhecido'
  }

  const getIDOCategoria = (categoria: number | null) => {
    if (categoria === null) return { label: 'N/A', color: 'bg-gray-100 text-gray-800' }
    
    const categorias: Record<number, { label: string; color: string }> = {
      0: { label: 'Normal', color: 'bg-success-100 text-success-800' },
      1: { label: 'Leve', color: 'bg-warning-100 text-warning-800' },
      2: { label: 'Moderado', color: 'bg-warning-200 text-warning-900' },
      3: { label: 'Acentuado', color: 'bg-danger-100 text-danger-800' },
    }

    return categorias[categoria] || { label: 'N/A', color: 'bg-gray-100 text-gray-800' }
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Exames Recentes</h2>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    )
  }

  if (exames.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Exames Recentes</h2>
        <p className="text-gray-500 text-center py-8">Nenhum exame encontrado</p>
      </div>
    )
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Exames Recentes</h2>
          <FileText className="h-5 w-5 text-gray-400" />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Paciente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  IDO
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Score Ronco
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {exames.map((exame) => {
                const idoCategoria = getIDOCategoria(exame.ido_categoria)
                return (
                  <tr key={exame.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{exame.paciente_nome}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{formatDate(exame.data_exame)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{getTipoExame(exame.tipo)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-900">
                          {exame.ido !== null ? exame.ido.toFixed(2) : 'N/A'}
                        </span>
                        {exame.ido_categoria !== null && (
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${idoCategoria.color}`}
                          >
                            {idoCategoria.label}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {exame.score_ronco !== null ? exame.score_ronco.toFixed(2) : 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => setSelectedExame(exame)}
                        className="text-primary-600 hover:text-primary-900 flex items-center gap-1"
                      >
                        <Eye className="h-4 w-4" />
                        Ver Detalhes
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Detalhes do Exame */}
      {selectedExame && typeof window !== 'undefined' && createPortal(
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex items-center justify-center p-6 md:p-8">
          <div className="bg-white rounded-lg shadow-xl w-[90vw] max-w-[600px] h-[85vh] max-h-[600px] overflow-y-auto z-[10000] relative">
            <div className="p-6 md:p-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900">Detalhes do Exame</h3>
                <button
                  onClick={() => setSelectedExame(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Paciente</label>
                  <p className="text-gray-900">{selectedExame.paciente_nome}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Data do Exame</label>
                  <p className="text-gray-900">{formatDate(selectedExame.data_exame)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Tipo</label>
                  <p className="text-gray-900">{getTipoExame(selectedExame.tipo)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">IDO</label>
                  <p className="text-gray-900">
                    {selectedExame.ido !== null ? selectedExame.ido.toFixed(2) : 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Categoria IDO</label>
                  <p className="text-gray-900">
                    {getIDOCategoria(selectedExame.ido_categoria).label}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Score de Ronco</label>
                  <p className="text-gray-900">
                    {selectedExame.score_ronco !== null
                      ? selectedExame.score_ronco.toFixed(2)
                      : 'N/A'}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => setSelectedExame(null)}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}

