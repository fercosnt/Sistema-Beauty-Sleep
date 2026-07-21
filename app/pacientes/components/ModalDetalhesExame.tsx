'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import {
  Download,
  Calendar,
  Scale,
  Ruler,
  Activity,
  Heart,
  FileText,
  Clock,
  Moon,
  Pill,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  User,
} from 'lucide-react'
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
import { GaugeChart, GaugeGrid } from '@/components/ui/GaugeChart'
import { HistogramChart } from '@/components/ui/HistogramChart'
import { CardiovascularRiskBar } from '@/components/ui/RiskBar'

interface Exame {
  id: string
  paciente_id: string
  tipo: number | null
  status: number | null
  data_exame: string
  biologix_exam_key: string | null

  // Basic info
  peso_kg: number | null
  altura_cm: number | null
  imc: number | null

  // Time fields
  hora_inicio: string | null
  duracao_total_secs: number | null
  duracao_valida_secs: number | null

  // Conditions and treatments (JSONB arrays)
  condicoes: string[] | null
  tratamentos: string[] | null
  sintomas: string[] | null
  doencas: string[] | null
  medicamentos: string[] | null

  // Snoring fields
  score_ronco: number | null
  tempo_ronco_secs: number | null
  silencio_percent: number | null
  ronco_baixo_percent: number | null
  ronco_medio_percent: number | null
  ronco_alto_percent: number | null

  // Oximetry fields
  ido: number | null
  ido_categoria: number | null
  ido_sono: number | null
  spo2_min: number | null
  spo2_avg: number | null
  spo2_max: number | null
  tempo_spo2_90_secs: number | null
  tempo_spo2_80_secs: number | null
  num_dessaturacoes: number | null
  carga_hipoxica: number | null

  // Heart rate
  bpm_min: number | null
  bpm_medio: number | null
  bpm_max: number | null

  // Sleep estimation
  tempo_sono_secs: number | null
  tempo_dormir_secs: number | null
  tempo_acordado_secs: number | null
  eficiencia_sono: number | null

  // Cardiology
  fibrilacao_atrial: number | null

  // Hypoxemia
  num_eventos_hipoxemia: number | null
  tempo_hipoxemia_secs: number | null
}

interface ModalDetalhesExameProps {
  isOpen: boolean
  onClose: () => void
  exameId: string
  canDownloadPDF?: boolean
}

// Condition mappings from Biologix API
const CONDITION_LABELS: Record<string, string> = {
  alcohol: 'Consumo de álcool',
  nasal_congestion: 'Congestão nasal',
  sedatives: 'Sedativos',
  bruxism_plate: 'Placa de bruxismo',
  pacemaker: 'Marcapasso',
}

// Treatment mappings from Biologix API
const TREATMENT_LABELS: Record<string, string> = {
  cpap: 'CPAP',
  mandibular_advancement: 'Aparelho de avanço mandibular',
  positional_therapy: 'Terapia posicional',
  oxygen: 'Oxigênio',
  ventilatory_support: 'Suporte ventilatório',
}

export default function ModalDetalhesExame({
  isOpen,
  onClose,
  exameId,
  canDownloadPDF = true,
}: ModalDetalhesExameProps) {
  const [exame, setExame] = useState<Exame | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

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

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  const formatDuration = (segundos: number | null) => {
    if (!segundos) return '-'
    const horas = Math.floor(segundos / 3600)
    const minutos = Math.floor((segundos % 3600) / 60)
    const segs = Math.floor(segundos % 60)
    return `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}:${segs.toString().padStart(2, '0')}`
  }

  const formatDurationMinutes = (segundos: number | null) => {
    if (!segundos) return '-'
    const minutos = Math.floor(segundos / 60)
    return `${minutos} min`
  }

  const formatPercentage = (value: number | null, duracaoTotal: number | null) => {
    if (!value || !duracaoTotal || duracaoTotal === 0) return ''
    const pct = (value / duracaoTotal) * 100
    return ` (${pct.toFixed(1)}%)`
  }

  const getTipoLabel = (tipo: number | null) => {
    if (tipo === 0) return 'Teste do Ronco'
    if (tipo === 1) return 'Exame do Sono (Polissonografia)'
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
    if (valor !== null && valor < 0) return 'bg-warning-100 text-warning-800 border-warning-200'
    return 'bg-gray-100 text-gray-800 border-gray-200'
  }

  const getFibrilacaoLabel = (valor: number | null) => {
    if (valor === 0) return 'Negativa'
    if (valor === 1) return 'Positiva'
    if (valor !== null && valor < 0) return 'Inconclusivo'
    return '-'
  }

  const handleBaixarPDF = async () => {
    if (!exame?.biologix_exam_key) {
      showError('Chave do exame não disponível.')
      return
    }

    const examKey = exame.biologix_exam_key.trim()
    if (!examKey) {
      showError('Chave do exame inválida.')
      return
    }

    const pdfUrl = `https://api.biologixsleep.com/v2/exams/${examKey}/files/report.pdf`

    try {
      const response = await fetch(pdfUrl, {
        method: 'GET',
        headers: { Accept: 'application/pdf' },
      })

      if (response.status === 404) {
        const errorUrl = `/erro-pdf?examKey=${encodeURIComponent(examKey)}&exameId=${encodeURIComponent(exame.id)}`
        window.open(errorUrl, '_blank')
        return
      }

      const contentType = response.headers.get('content-type')
      if (contentType && contentType.includes('application/pdf')) {
        window.open(pdfUrl, '_blank')
      } else {
        const errorUrl = `/erro-pdf?examKey=${encodeURIComponent(examKey)}&exameId=${encodeURIComponent(exame.id)}`
        window.open(errorUrl, '_blank')
      }
    } catch (error) {
      console.error('Erro ao verificar PDF:', error)
      window.open(pdfUrl, '_blank')
    }
  }

  const handleVerPaciente = () => {
    if (exame?.paciente_id) {
      onClose()
      router.push(`/pacientes/${exame.paciente_id}`)
    }
  }

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto custom-scrollbar">
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

  const isPolissonografia = exame.tipo === 1
  const isRonco = exame.tipo === 0

  // Calculate SpO2 < 90% percentage for gauge
  const spo2Under90Pct = exame.tempo_spo2_90_secs && exame.duracao_valida_secs
    ? (exame.tempo_spo2_90_secs / exame.duracao_valida_secs) * 100
    : 0

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] !p-0 overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0 px-6 pt-6 pb-4 border-b border-gray-200">
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {getTipoLabel(exame.tipo)}
          </DialogTitle>
          <DialogDescription>
            Exame realizado em {formatDate(exame.data_exame)}
          </DialogDescription>
        </DialogHeader>

        <div
          className="space-y-4 overflow-y-auto overflow-x-hidden flex-1 min-h-0 px-6 custom-scrollbar"
          style={{
            maxHeight: 'calc(90vh - 200px)',
            scrollbarWidth: 'thin',
            scrollbarColor: '#1e293b transparent',
            paddingRight: '20px',
            paddingTop: '16px',
            paddingBottom: '16px',
          }}
        >
          {/* Seção 1: Cabeçalho do Exame */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Informações do Exame
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Início</p>
                  <p className="text-sm font-medium text-gray-900">
                    {formatDateTime(exame.hora_inicio)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Tempo Total</p>
                  <p className="text-sm font-medium text-gray-900">
                    {formatDuration(exame.duracao_total_secs)}
                    {exame.duracao_total_secs && (
                      <span className="text-xs text-gray-500 ml-1">
                        ({Math.round((exame.duracao_total_secs || 0) / 60)} min)
                      </span>
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Tempo Válido</p>
                  <p className="text-sm font-medium text-gray-900">
                    {formatDuration(exame.duracao_valida_secs)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Tipo</p>
                  <p className="text-sm font-medium text-gray-900">{getTipoLabel(exame.tipo)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Seção 2: Condições na Noite do Exame */}
          {exame.condicoes && exame.condicoes.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Condições na Noite do Exame
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {exame.condicoes.map((condition, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-800 rounded-full text-sm border border-amber-200"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      {CONDITION_LABELS[condition] || condition}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Seção 3: Tratamentos na Noite do Exame */}
          {exame.tratamentos && exame.tratamentos.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Pill className="h-5 w-5" />
                  Tratamentos na Noite do Exame
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {exame.tratamentos.map((treatment, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-800 rounded-full text-sm border border-blue-200"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      {TREATMENT_LABELS[treatment] || treatment}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Seção 4: Ficha Médica */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-5 w-5" />
                Ficha Médica
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {exame.peso_kg !== null && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Peso</p>
                    <div className="flex items-center gap-2">
                      <Scale className="h-4 w-4 text-gray-400" />
                      <p className="text-sm font-medium text-gray-900">{Number(exame.peso_kg)} kg</p>
                    </div>
                  </div>
                )}
                {exame.altura_cm !== null && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Altura</p>
                    <div className="flex items-center gap-2">
                      <Ruler className="h-4 w-4 text-gray-400" />
                      <p className="text-sm font-medium text-gray-900">{Number(exame.altura_cm)} cm</p>
                    </div>
                  </div>
                )}
                {exame.imc !== null && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">IMC</p>
                    <p className="text-sm font-medium text-gray-900">{Number(exame.imc).toFixed(1)}</p>
                  </div>
                )}
              </div>

              {/* Medicamentos */}
              {exame.medicamentos && exame.medicamentos.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs text-gray-500 mb-2">Medicamentos</p>
                  <div className="flex flex-wrap gap-1.5">
                    {exame.medicamentos.map((med, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                      >
                        {med}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Sintomas */}
              {exame.sintomas && exame.sintomas.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs text-gray-500 mb-2">Sintomas</p>
                  <div className="flex flex-wrap gap-1.5">
                    {exame.sintomas.map((sintoma, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-amber-50 text-amber-700 rounded text-xs"
                      >
                        {sintoma}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Doenças */}
              {exame.doencas && exame.doencas.length > 0 && (
                <div>
                  <p className="text-xs text-gray-500 mb-2">Doenças Associadas</p>
                  <div className="flex flex-wrap gap-1.5">
                    {exame.doencas.map((doenca, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-red-50 text-red-700 rounded text-xs"
                      >
                        {doenca}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Seção 5: Resultado Principal (Polissonografia) */}
          {isPolissonografia && (exame.ido !== null || spo2Under90Pct > 0) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Resultado Principal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-8">
                  {/* IDO Gauge */}
                  {exame.ido !== null && (
                    <div className="flex flex-col items-center">
                      <div className="relative">
                        <GaugeChart
                          value={Number(exame.ido)}
                          maxValue={100}
                          label=""
                          unit="/h"
                          size="lg"
                          colorScheme="auto"
                          thresholds={{ warning: 15, danger: 30 }}
                        />
                      </div>
                      <div className="text-center mt-2">
                        <p className="text-sm font-medium text-gray-700">IDO</p>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border mt-1 ${getIDOCategoriaColor(exame.ido_categoria)}`}
                        >
                          {getIDOCategoriaLabel(exame.ido_categoria)}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* SpO2 < 90% Gauge */}
                  {spo2Under90Pct > 0 && (
                    <div className="flex flex-col items-center">
                      <div className="relative">
                        <GaugeChart
                          value={spo2Under90Pct}
                          maxValue={100}
                          label=""
                          unit="%"
                          size="lg"
                          colorScheme="auto"
                          thresholds={{ warning: 10, danger: 30 }}
                        />
                      </div>
                      <div className="text-center mt-2">
                        <p className="text-sm font-medium text-gray-700">Tempo com SpO2 &lt; 90%</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDurationMinutes(exame.tempo_spo2_90_secs)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Seção 6: Oximetria Completa */}
          {isPolissonografia && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Oximetria (SpO2)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {exame.spo2_min !== null && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">SpO2 Mínima</p>
                      <p className="text-lg font-bold text-gray-900">{Number(exame.spo2_min)}%</p>
                    </div>
                  )}
                  {exame.spo2_avg !== null && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">SpO2 Média</p>
                      <p className="text-lg font-bold text-gray-900">{Number(exame.spo2_avg)}%</p>
                    </div>
                  )}
                  {exame.spo2_max !== null && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">SpO2 Máxima</p>
                      <p className="text-lg font-bold text-gray-900">{Number(exame.spo2_max)}%</p>
                    </div>
                  )}
                  {exame.num_dessaturacoes !== null && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Nº Dessaturações</p>
                      <p className="text-lg font-bold text-gray-900">{exame.num_dessaturacoes}</p>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {exame.tempo_spo2_90_secs !== null && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Tempo SpO2 &lt; 90%</p>
                      <p className="text-sm font-medium text-gray-900">
                        {formatDurationMinutes(exame.tempo_spo2_90_secs)}
                        {formatPercentage(exame.tempo_spo2_90_secs, exame.duracao_valida_secs)}
                      </p>
                    </div>
                  )}
                  {exame.tempo_spo2_80_secs !== null && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Tempo SpO2 &lt; 80%</p>
                      <p className="text-sm font-medium text-gray-900">
                        {formatDurationMinutes(exame.tempo_spo2_80_secs)}
                        {formatPercentage(exame.tempo_spo2_80_secs, exame.duracao_valida_secs)}
                      </p>
                    </div>
                  )}
                  {exame.ido !== null && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">IDO (Dessaturação)</p>
                      <p className="text-sm font-medium text-gray-900">{Number(exame.ido).toFixed(1)} /hora</p>
                    </div>
                  )}
                  {exame.ido_sono !== null && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">IDO durante Sono</p>
                      <p className="text-sm font-medium text-gray-900">{Number(exame.ido_sono).toFixed(1)} /hora</p>
                    </div>
                  )}
                </div>

                {/* Hipoxemia */}
                {(exame.num_eventos_hipoxemia !== null || exame.tempo_hipoxemia_secs !== null) && (
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                    {exame.num_eventos_hipoxemia !== null && (
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Eventos de Hipoxemia</p>
                        <p className="text-sm font-medium text-gray-900">{exame.num_eventos_hipoxemia}</p>
                      </div>
                    )}
                    {exame.tempo_hipoxemia_secs !== null && (
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Tempo em Hipoxemia</p>
                        <p className="text-sm font-medium text-gray-900">
                          {formatDurationMinutes(exame.tempo_hipoxemia_secs)}
                          {formatPercentage(exame.tempo_hipoxemia_secs, exame.duracao_valida_secs)}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Seção 7: Carga Hipóxica - Risco Cardiovascular */}
          {isPolissonografia && exame.carga_hipoxica !== null && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Heart className="h-5 w-5 text-danger-600" />
                  Risco Cardiovascular
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardiovascularRiskBar hypoxicBurden={Number(exame.carga_hipoxica)} />
              </CardContent>
            </Card>
          )}

          {/* Seção 8: Frequência Cardíaca */}
          {isPolissonografia && (exame.bpm_min !== null || exame.bpm_medio !== null || exame.bpm_max !== null) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Frequência Cardíaca
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  {exame.bpm_min !== null && (
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <p className="text-xs text-blue-600 mb-1">Mínima</p>
                      <p className="text-2xl font-bold text-blue-900">{exame.bpm_min}</p>
                      <p className="text-xs text-blue-600">bpm</p>
                    </div>
                  )}
                  {exame.bpm_medio !== null && (
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <p className="text-xs text-green-600 mb-1">Média</p>
                      <p className="text-2xl font-bold text-green-900">{exame.bpm_medio}</p>
                      <p className="text-xs text-green-600">bpm</p>
                    </div>
                  )}
                  {exame.bpm_max !== null && (
                    <div className="text-center p-4 bg-red-50 rounded-lg">
                      <p className="text-xs text-red-600 mb-1">Máxima</p>
                      <p className="text-2xl font-bold text-red-900">{exame.bpm_max}</p>
                      <p className="text-xs text-red-600">bpm</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Seção 9: Sono Estimado */}
          {isPolissonografia && (exame.tempo_sono_secs !== null || exame.eficiencia_sono !== null) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Moon className="h-5 w-5" />
                  Sono Estimado
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {exame.tempo_sono_secs !== null && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Tempo Total de Sono</p>
                      <p className="text-lg font-bold text-gray-900">
                        {formatDurationMinutes(exame.tempo_sono_secs)}
                      </p>
                    </div>
                  )}
                  {exame.tempo_dormir_secs !== null && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Tempo para Dormir</p>
                      <p className="text-lg font-bold text-gray-900">
                        {formatDurationMinutes(exame.tempo_dormir_secs)}
                      </p>
                    </div>
                  )}
                  {exame.tempo_acordado_secs !== null && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Tempo Acordado (WASO)</p>
                      <p className="text-lg font-bold text-gray-900">
                        {formatDurationMinutes(exame.tempo_acordado_secs)}
                      </p>
                    </div>
                  )}
                  {exame.eficiencia_sono !== null && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Eficiência do Sono</p>
                      <p className="text-lg font-bold text-gray-900">
                        {Number(exame.eficiencia_sono).toFixed(1)}%
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Seção 10: Análise de Ronco */}
          {(isRonco || (isPolissonografia && exame.score_ronco !== null)) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Análise de Ronco
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Score de Ronco principal */}
                {exame.score_ronco !== null && (
                  <div className="text-center mb-6 p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">Score de Ronco</p>
                    <p className="text-4xl font-bold text-gray-900">{Number(exame.score_ronco).toFixed(1)}</p>
                    <p className="text-sm text-gray-500 mt-1">pontos</p>
                  </div>
                )}

                {/* Tempo de ronco */}
                {exame.tempo_ronco_secs !== null && (
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Tempo de Gravação</p>
                      <p className="text-sm font-medium text-gray-900">
                        {formatDurationMinutes(exame.duracao_valida_secs)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Tempo com Ronco</p>
                      <p className="text-sm font-medium text-gray-900">
                        {formatDurationMinutes(exame.tempo_ronco_secs)}
                        {formatPercentage(exame.tempo_ronco_secs, exame.duracao_valida_secs)}
                      </p>
                    </div>
                  </div>
                )}

                {/* Gauges de intensidade */}
                {(exame.silencio_percent !== null ||
                  exame.ronco_baixo_percent !== null ||
                  exame.ronco_medio_percent !== null ||
                  exame.ronco_alto_percent !== null) && (
                  <div className="grid grid-cols-4 gap-4">
                    {exame.silencio_percent !== null && (
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-200 mb-2">
                          <span className="text-lg font-bold text-gray-700">
                            {Math.round(Number(exame.silencio_percent))}%
                          </span>
                        </div>
                        <p className="text-xs font-medium text-gray-600">Silêncio</p>
                      </div>
                    )}
                    {exame.ronco_baixo_percent !== null && (
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-200 mb-2">
                          <span className="text-lg font-bold text-green-700">
                            {Math.round(Number(exame.ronco_baixo_percent))}%
                          </span>
                        </div>
                        <p className="text-xs font-medium text-green-600">Baixo</p>
                      </div>
                    )}
                    {exame.ronco_medio_percent !== null && (
                      <div className="text-center p-3 bg-amber-50 rounded-lg">
                        <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-200 mb-2">
                          <span className="text-lg font-bold text-amber-700">
                            {Math.round(Number(exame.ronco_medio_percent))}%
                          </span>
                        </div>
                        <p className="text-xs font-medium text-amber-600">Médio</p>
                      </div>
                    )}
                    {exame.ronco_alto_percent !== null && (
                      <div className="text-center p-3 bg-red-50 rounded-lg">
                        <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-200 mb-2">
                          <span className="text-lg font-bold text-red-700">
                            {Math.round(Number(exame.ronco_alto_percent))}%
                          </span>
                        </div>
                        <p className="text-xs font-medium text-red-600">Alto</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Cardiologia - Fibrilação Atrial */}
          {exame.fibrilacao_atrial !== null && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Cardiologia
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-2">Fibrilação Atrial</p>
                    <span
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border ${getFibrilacaoColor(exame.fibrilacao_atrial)}`}
                    >
                      {exame.fibrilacao_atrial === 1 ? (
                        <XCircle className="h-4 w-4" />
                      ) : exame.fibrilacao_atrial === 0 ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        <AlertTriangle className="h-4 w-4" />
                      )}
                      {getFibrilacaoLabel(exame.fibrilacao_atrial)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter className="flex-shrink-0 px-6 pt-4 pb-6 border-t border-gray-200">
          <div className="flex items-center justify-between w-full">
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleVerPaciente}>
                <User className="h-4 w-4 mr-2" />
                Ver Paciente
              </Button>
            </div>
            <div className="flex gap-2">
              {canDownloadPDF && exame.biologix_exam_key && exame.biologix_exam_key.trim() && (
                <Button variant="outline" leftIcon={<Download className="h-4 w-4" />} onClick={handleBaixarPDF}>
                  Baixar PDF
                </Button>
              )}
              <Button variant="primary" onClick={onClose}>
                Fechar
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
