'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Download, Calendar, Scale, Ruler, Activity, Heart, FileText } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/Dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { showError } from '@/components/ui/Toast'

interface Exame {
  id: string
  tipo: number | null
  status: number | null
  data_exame: string
  duracao_seg: number | null
  peso_kg: number | null
  altura_cm: number | null
  imc: number | null
  score_ronco: number | null
  ronco_silencio_pct: number | null
  ronco_baixo_pct: number | null
  ronco_medio_pct: number | null
  ronco_alto_pct: number | null
  ronco_duracao_seg: number | null
  ido: number | null
  ido_dormindo: number | null
  ido_categoria: number | null
  spo2_min: number | null
  spo2_avg: number | null
  spo2_max: number | null
  tempo_spo2_90_seg: number | null
  tempo_spo2_80_seg: number | null
  bpm_min: number | null
  bpm_medio: number | null
  bpm_max: number | null
  fibrilacao_atrial: number | null
  biologix_exam_key: string | null
}

interface ModalDetalhesExameProps {
  isOpen: boolean
  onClose: () => void
  exameId: string
  canDownloadPDF?: boolean
}

export default function ModalDetalhesExame({
  isOpen,
  onClose,
  exameId,
  canDownloadPDF = true,
}: ModalDetalhesExameProps) {
  const [exame, setExame] = useState<Exame | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (isOpen && exameId) {
      fetchExame()
    }
  }, [isOpen, exameId])

  const fetchExame = async () => {
    setIsLoading(true)
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('exames')
        .select('*')
        .eq('id', exameId)
        .single()

      if (error) {
        console.error('Erro ao buscar exame:', error)
        showError('Erro ao carregar detalhes do exame')
        return
      }

      setExame(data)
    } catch (error) {
      console.error('Erro inesperado:', error)
      showError('Erro inesperado ao carregar exame')
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatDuration = (segundos: number | null) => {
    if (!segundos) return '-'
    const horas = Math.floor(segundos / 3600)
    const minutos = Math.floor((segundos % 3600) / 60)
    return `${horas}h ${minutos}min`
  }

  const getTipoLabel = (tipo: number | null) => {
    if (tipo === 0) return 'Teste do Ronco'
    if (tipo === 1) return 'Exame do Sono'
    return '-'
  }

  const getIDOCategoriaLabel = (categoria: number | null) => {
    if (categoria === 0) return 'Normal'
    if (categoria === 1) return 'Leve'
    if (categoria === 2) return 'Moderado'
    if (categoria === 3) return 'Acentuado'
    return '-'
  }

  const getIDOCategoriaColor = (categoria: number | null) => {
    if (categoria === 0) return 'bg-success-100 text-success-800 border-success-200'
    if (categoria === 1) return 'bg-warning-100 text-warning-800 border-warning-200'
    if (categoria === 2) return 'bg-orange-100 text-orange-800 border-orange-200'
    if (categoria === 3) return 'bg-danger-100 text-danger-800 border-danger-200'
    return 'bg-gray-100 text-gray-800 border-gray-200'
  }

  const getFibrilacaoColor = (valor: number | null) => {
    if (valor === 1) return 'bg-danger-100 text-danger-800 border-danger-200'
    if (valor === 0) return 'bg-success-100 text-success-800 border-success-200'
    if (valor && valor < 0) return 'bg-warning-100 text-warning-800 border-warning-200'
    return 'bg-gray-100 text-gray-800 border-gray-200'
  }

  const getFibrilacaoLabel = (valor: number | null) => {
    if (valor === 0) return 'Negativa'
    if (valor === 1) return 'Positiva'
    if (valor && valor < 0) return 'Inconclusivo'
    return '-'
  }

  const handleBaixarPDF = async () => {
    if (!exame?.biologix_exam_key) {
      showError('Chave do exame não disponível. Este exame pode ter sido migrado do Airtable e não possui chave para download do PDF.')
      return
    }

    // Verificar se o examKey não está vazio
    const examKey = exame.biologix_exam_key.trim()
    if (!examKey) {
      showError('Chave do exame inválida. Este exame pode não ter o PDF disponível.')
      return
    }

    const pdfUrl = `https://api.biologixsleep.com/v2/exams/${examKey}/files/report.pdf`
    
    // Verificar se o exame está completo (status = 6 = DONE)
    if (exame.status !== 6) {
      const confirmOpen = window.confirm(
        `Este exame ainda não está completo (Status: ${exame.status}). O PDF pode não estar disponível. Deseja tentar baixar mesmo assim?`
      )
      if (!confirmOpen) {
        return
      }
    }
    
    // Verificar se o PDF existe antes de abrir
    // Isso evita que o usuário veja o JSON de erro da API
    try {
      // Tentar fazer uma requisição GET para verificar se o PDF existe
      // Usamos GET em vez de HEAD para evitar problemas de CORS
      const response = await fetch(pdfUrl, { 
        method: 'GET',
        headers: {
          'Accept': 'application/pdf'
        }
      })
      
      if (response.status === 404) {
        // PDF não encontrado - redirecionar para página de erro
        const errorUrl = `/erro-pdf?examKey=${encodeURIComponent(examKey)}&exameId=${encodeURIComponent(exame.id)}`
        window.open(errorUrl, '_blank')
        return
      }
      
      // Verificar se a resposta é um PDF válido
      const contentType = response.headers.get('content-type')
      if (contentType && contentType.includes('application/pdf')) {
        // PDF válido encontrado, abrir em nova aba
        const newWindow = window.open(pdfUrl, '_blank')
        if (!newWindow) {
          showError('Não foi possível abrir o PDF. Verifique se os pop-ups estão bloqueados.')
        }
      } else if (contentType && contentType.includes('application/json')) {
        // A API retornou JSON (erro), redirecionar para página de erro
        const errorUrl = `/erro-pdf?examKey=${encodeURIComponent(examKey)}&exameId=${encodeURIComponent(exame.id)}`
        window.open(errorUrl, '_blank')
      } else {
        // Resposta inesperada, tentar abrir mesmo assim
        const newWindow = window.open(pdfUrl, '_blank')
        if (!newWindow) {
          showError('Não foi possível abrir o PDF. Verifique se os pop-ups estão bloqueados.')
        }
      }
    } catch (error) {
      console.error('Erro ao verificar PDF:', error)
      // Em caso de erro de CORS ou rede, tentar abrir mesmo assim
      // Se der erro 404, o usuário verá o JSON de erro, mas pelo menos tentamos
      const newWindow = window.open(pdfUrl, '_blank')
      if (!newWindow) {
        showError('Não foi possível abrir o PDF. Verifique se os pop-ups estão bloqueados.')
      }
    }
  }

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalhes do Exame</DialogTitle>
          </DialogHeader>
          <div className="py-8 text-center">
            <p className="text-gray-600">Carregando detalhes...</p>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  if (!exame) {
    return null
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detalhes do Exame</DialogTitle>
          <DialogDescription>
            Informações completas do exame do paciente.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Dados Básicos */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Dados Básicos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Data</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <p className="text-sm font-medium text-gray-900">{formatDate(exame.data_exame)}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Tipo</p>
                  <p className="text-sm font-medium text-gray-900">{getTipoLabel(exame.tipo)}</p>
                </div>
                {exame.peso_kg !== null && exame.peso_kg !== undefined && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Peso</p>
                    <div className="flex items-center gap-2">
                      <Scale className="h-4 w-4 text-gray-400" />
                      <p className="text-sm font-medium text-gray-900">{Number(exame.peso_kg)} kg</p>
                    </div>
                  </div>
                )}
                {exame.altura_cm !== null && exame.altura_cm !== undefined && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Altura</p>
                    <div className="flex items-center gap-2">
                      <Ruler className="h-4 w-4 text-gray-400" />
                      <p className="text-sm font-medium text-gray-900">{Number(exame.altura_cm)} cm</p>
                    </div>
                  </div>
                )}
                {exame.imc !== null && exame.imc !== undefined && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">IMC</p>
                    <p className="text-sm font-medium text-gray-900">{Number(exame.imc).toFixed(1)}</p>
                  </div>
                )}
                {exame.duracao_seg && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Duração</p>
                    <p className="text-sm font-medium text-gray-900">{formatDuration(exame.duracao_seg)}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Ronco */}
          {exame.tipo === 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Ronco
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {exame.score_ronco !== null && exame.score_ronco !== undefined && (
                    <div className="md:col-span-3">
                      <p className="text-xs text-gray-500 mb-1">Score de Ronco</p>
                      <div className="flex items-baseline gap-2">
                        <p className="text-2xl font-bold text-gray-900">{Number(exame.score_ronco).toFixed(1)}</p>
                        <span className="text-xs text-gray-500">pontos</span>
                      </div>
                    </div>
                  )}
                  {exame.ronco_silencio_pct !== null && exame.ronco_silencio_pct !== undefined && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">% Silêncio</p>
                      <p className="text-sm font-medium text-gray-900">{Number(exame.ronco_silencio_pct).toFixed(1)}%</p>
                    </div>
                  )}
                  {exame.ronco_baixo_pct !== null && exame.ronco_baixo_pct !== undefined && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">% Baixo</p>
                      <p className="text-sm font-medium text-gray-900">{Number(exame.ronco_baixo_pct).toFixed(1)}%</p>
                    </div>
                  )}
                  {exame.ronco_medio_pct !== null && exame.ronco_medio_pct !== undefined && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">% Médio</p>
                      <p className="text-sm font-medium text-gray-900">{Number(exame.ronco_medio_pct).toFixed(1)}%</p>
                    </div>
                  )}
                  {exame.ronco_alto_pct !== null && exame.ronco_alto_pct !== undefined && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">% Alto</p>
                      <p className="text-sm font-medium text-gray-900">{Number(exame.ronco_alto_pct).toFixed(1)}%</p>
                    </div>
                  )}
                  {exame.ronco_duracao_seg && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Duração Total</p>
                      <p className="text-sm font-medium text-gray-900">{formatDuration(exame.ronco_duracao_seg)}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Oximetria */}
          {exame.tipo === 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Oximetria
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {exame.ido !== null && exame.ido !== undefined && (
                      <div className="md:col-span-2">
                        <p className="text-xs text-gray-500 mb-1">IDO (Índice de Dessaturação de Oxigênio)</p>
                        <div className="flex items-baseline gap-2">
                          <p className="text-2xl font-bold text-gray-900">{Number(exame.ido).toFixed(1)}</p>
                          <span className="text-xs text-gray-500">eventos/hora</span>
                        </div>
                      </div>
                    )}
                    {exame.ido_categoria !== null && (
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Categoria IDO</p>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getIDOCategoriaColor(
                            exame.ido_categoria
                          )}`}
                        >
                          {getIDOCategoriaLabel(exame.ido_categoria)}
                        </span>
                      </div>
                    )}
                    {exame.spo2_min !== null && exame.spo2_min !== undefined && (
                      <div>
                        <p className="text-xs text-gray-500 mb-1">SpO2 Mín</p>
                        <p className="text-sm font-medium text-gray-900">{Number(exame.spo2_min)}%</p>
                      </div>
                    )}
                    {exame.spo2_avg !== null && exame.spo2_avg !== undefined && (
                      <div>
                        <p className="text-xs text-gray-500 mb-1">SpO2 Médio</p>
                        <p className="text-sm font-medium text-gray-900">{Number(exame.spo2_avg)}%</p>
                      </div>
                    )}
                    {exame.spo2_max !== null && exame.spo2_max !== undefined && (
                      <div>
                        <p className="text-xs text-gray-500 mb-1">SpO2 Máx</p>
                        <p className="text-sm font-medium text-gray-900">{Number(exame.spo2_max)}%</p>
                      </div>
                    )}
                    {exame.tempo_spo2_90_seg && (
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Tempo SpO2 &lt;90%</p>
                        <p className="text-sm font-medium text-gray-900">{formatDuration(exame.tempo_spo2_90_seg)}</p>
                      </div>
                    )}
                    {exame.tempo_spo2_80_seg && (
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Tempo SpO2 &lt;80%</p>
                        <p className="text-sm font-medium text-gray-900">{formatDuration(exame.tempo_spo2_80_seg)}</p>
                      </div>
                    )}
                    {exame.bpm_min !== null && exame.bpm_min !== undefined && (
                      <div>
                        <p className="text-xs text-gray-500 mb-1">FC Mín</p>
                        <p className="text-sm font-medium text-gray-900">{Number(exame.bpm_min)} bpm</p>
                      </div>
                    )}
                    {exame.bpm_medio !== null && exame.bpm_medio !== undefined && (
                      <div>
                        <p className="text-xs text-gray-500 mb-1">FC Médio</p>
                        <p className="text-sm font-medium text-gray-900">{Number(exame.bpm_medio)} bpm</p>
                      </div>
                    )}
                    {exame.bpm_max !== null && exame.bpm_max !== undefined && (
                      <div>
                        <p className="text-xs text-gray-500 mb-1">FC Máx</p>
                        <p className="text-sm font-medium text-gray-900">{Number(exame.bpm_max)} bpm</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Cardiologia */}
          {exame.fibrilacao_atrial !== null && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Cardiologia
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <p className="text-xs text-gray-500 mb-2">Fibrilação Atrial</p>
                  <span
                    className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium border ${getFibrilacaoColor(
                      exame.fibrilacao_atrial
                    )}`}
                  >
                    {getFibrilacaoLabel(exame.fibrilacao_atrial)}
                  </span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter>
          {canDownloadPDF && exame.biologix_exam_key && exame.biologix_exam_key.trim() ? (
            <Button variant="outline" leftIcon={<Download className="h-4 w-4" />} onClick={handleBaixarPDF}>
              Baixar PDF
            </Button>
          ) : canDownloadPDF && (
            <p className="text-sm text-gray-500 italic">PDF não disponível para este exame</p>
          )}
          <Button variant="primary" onClick={onClose}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

