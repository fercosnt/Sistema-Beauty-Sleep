'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Scale, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts'

interface ExamePeso {
  id: string
  data_exame: string
  peso_kg: number | null
  altura_cm: number | null
  imc: number | null
}

interface TabPesoProps {
  pacienteId: string
}

export default function TabPeso({ pacienteId }: TabPesoProps) {
  const [exames, setExames] = useState<ExamePeso[]>([])
  const [alturaPaciente, setAlturaPaciente] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchExames()
    fetchAlturaPaciente()
  }, [pacienteId])

  const fetchExames = async () => {
    try {
      setIsLoading(true)
      const supabase = createClient()

      const { data, error } = await supabase
        .from('exames')
        .select('id, data_exame, peso_kg, altura_cm, imc')
        .eq('paciente_id', pacienteId)
        .not('peso_kg', 'is', null)
        .order('data_exame', { ascending: true })

      if (error) {
        console.error('Erro ao buscar exames:', error)
        return
      }

      setExames(data || [])
    } catch (error) {
      console.error('Erro inesperado:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchAlturaPaciente = async () => {
    try {
      const supabase = createClient()
      // Buscar altura do primeiro exame que tenha altura
      const { data, error } = await supabase
        .from('exames')
        .select('altura_cm')
        .eq('paciente_id', pacienteId)
        .not('altura_cm', 'is', null)
        .order('data_exame', { ascending: true })
        .limit(1)
        .single()

      if (!error && data) {
        setAlturaPaciente(data.altura_cm)
      }
    } catch (error) {
      console.error('Erro ao buscar altura:', error)
    }
  }

  // Preparar dados para gráficos
  const chartData = exames.map((exame) => ({
    data: new Date(exame.data_exame).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
    }),
    dataFull: exame.data_exame,
    peso: exame.peso_kg,
    imc: exame.imc,
  }))

  // Calcular comparação
  const pesoInicial = exames.length > 0 ? exames[0].peso_kg : null
  const pesoAtual = exames.length > 0 ? exames[exames.length - 1].peso_kg : null
  const imcInicial = exames.length > 0 ? exames[0].imc : null
  const imcAtual = exames.length > 0 ? exames[exames.length - 1].imc : null

  const mudancaPeso =
    pesoInicial && pesoAtual ? pesoAtual - pesoInicial : null
  const mudancaPesoPercentual =
    pesoInicial && pesoAtual && pesoInicial !== 0
      ? ((pesoAtual - pesoInicial) / pesoInicial) * 100
      : null

  const mudancaIMC = imcInicial && imcAtual ? imcAtual - imcInicial : null
  const mudancaIMCPercentual =
    imcInicial && imcAtual && imcInicial !== 0
      ? ((imcAtual - imcInicial) / imcInicial) * 100
      : null

  // Função para categorizar IMC
  const categorizarIMC = (imc: number | null): string => {
    if (!imc) return '-'
    if (imc < 18.5) return 'Abaixo do Peso'
    if (imc < 25) return 'Normal'
    if (imc < 30) return 'Sobrepeso'
    return 'Obesidade'
  }

  const getIMCCor = (imc: number | null): string => {
    if (!imc) return 'gray'
    if (imc < 18.5) return 'blue'
    if (imc < 25) return 'green'
    if (imc < 30) return 'yellow'
    return 'red'
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8">
          <p className="text-center text-gray-600">Carregando dados de peso...</p>
        </CardContent>
      </Card>
    )
  }

  if (exames.length === 0) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">Dados insuficientes</h3>
            <p className="mt-1 text-sm text-gray-500">
              Não há dados de peso disponíveis para este paciente.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Gráfico Peso */}
      {exames.some((e) => e.peso_kg !== null) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scale className="h-5 w-5 text-primary-600" />
              Evolução do Peso
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData.filter((d) => d.peso !== null && d.peso !== undefined)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="data" stroke="#6b7280" />
                <YAxis stroke="#6b7280" label={{ value: 'Peso (kg)', angle: -90, position: 'insideLeft' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="peso"
                  stroke="#00109E"
                  strokeWidth={2}
                  dot={{ fill: '#00109E', r: 4 }}
                  name="Peso (kg)"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Gráfico IMC */}
      {exames.some((e) => e.imc !== null) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scale className="h-5 w-5 text-primary-600" />
              Evolução do IMC
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData.filter((d) => d.imc !== null && d.imc !== undefined)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="data" stroke="#6b7280" />
                <YAxis stroke="#6b7280" label={{ value: 'IMC', angle: -90, position: 'insideLeft' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                {/* Linha de referência IMC = 25 (Sobrepeso) */}
                <ReferenceLine
                  y={25}
                  stroke="#F59E0B"
                  strokeDasharray="5 5"
                  label={{ value: 'Sobrepeso (25)', position: 'right' }}
                />
                {/* Linha de referência IMC = 30 (Obesidade) */}
                <ReferenceLine
                  y={30}
                  stroke="#EF4444"
                  strokeDasharray="5 5"
                  label={{ value: 'Obesidade (30)', position: 'right' }}
                />
                <Line
                  type="monotone"
                  dataKey="imc"
                  stroke="#35BFAD"
                  strokeWidth={2}
                  dot={{ fill: '#35BFAD', r: 4 }}
                  name="IMC"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Card de Comparação */}
      {(pesoInicial || imcInicial) && (
        <Card>
          <CardHeader>
            <CardTitle>Comparação: Inicial vs Atual</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Comparação Peso */}
              {pesoInicial && pesoAtual && (
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Peso</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500 mb-1">Peso Inicial</p>
                      <p className="text-lg font-bold text-gray-900">
                        {pesoInicial.toFixed(1)} kg
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(exames[0].data_exame).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <div className="bg-primary-50 rounded-lg p-3">
                      <p className="text-xs text-primary-600 mb-1">Peso Atual</p>
                      <p className="text-lg font-bold text-primary-900">
                        {pesoAtual.toFixed(1)} kg
                      </p>
                      <p className="text-xs text-primary-600 mt-1">
                        {new Date(exames[exames.length - 1].data_exame).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600">Mudança absoluta:</p>
                      <span
                        className={`font-semibold flex items-center gap-1 ${
                          mudancaPeso && mudancaPeso > 0 ? 'text-danger-600' : 'text-success-600'
                        }`}
                      >
                        {mudancaPeso && mudancaPeso > 0 ? (
                          <TrendingUp className="h-4 w-4" />
                        ) : (
                          <TrendingDown className="h-4 w-4" />
                        )}
                        {mudancaPeso && mudancaPeso > 0 ? '+' : ''}
                        {mudancaPeso?.toFixed(1) || '-'} kg
                      </span>
                    </div>
                    {mudancaPesoPercentual !== null && (
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-sm text-gray-600">Mudança percentual:</p>
                        <span
                          className={`font-semibold ${
                            mudancaPesoPercentual > 0 ? 'text-danger-600' : 'text-success-600'
                          }`}
                        >
                          {mudancaPesoPercentual > 0 ? '+' : ''}
                          {mudancaPesoPercentual.toFixed(1)}%
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Comparação IMC */}
              {imcInicial && imcAtual && (
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">IMC</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500 mb-1">IMC Inicial</p>
                      <p className="text-lg font-bold text-gray-900">
                        {imcInicial.toFixed(1)}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {categorizarIMC(imcInicial)}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(exames[0].data_exame).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <div className="bg-primary-50 rounded-lg p-3">
                      <p className="text-xs text-primary-600 mb-1">IMC Atual</p>
                      <p className="text-lg font-bold text-primary-900">
                        {imcAtual.toFixed(1)}
                      </p>
                      <p className="text-xs text-primary-600 mt-1">
                        {categorizarIMC(imcAtual)}
                      </p>
                      <p className="text-xs text-primary-600 mt-1">
                        {new Date(exames[exames.length - 1].data_exame).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600">Mudança absoluta:</p>
                      <span
                        className={`font-semibold flex items-center gap-1 ${
                          mudancaIMC && mudancaIMC > 0 ? 'text-danger-600' : 'text-success-600'
                        }`}
                      >
                        {mudancaIMC && mudancaIMC > 0 ? (
                          <TrendingUp className="h-4 w-4" />
                        ) : (
                          <TrendingDown className="h-4 w-4" />
                        )}
                        {mudancaIMC && mudancaIMC > 0 ? '+' : ''}
                        {mudancaIMC?.toFixed(1) || '-'}
                      </span>
                    </div>
                    {mudancaIMCPercentual !== null && (
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-sm text-gray-600">Mudança percentual:</p>
                        <span
                          className={`font-semibold ${
                            mudancaIMCPercentual > 0 ? 'text-danger-600' : 'text-success-600'
                          }`}
                        >
                          {mudancaIMCPercentual > 0 ? '+' : ''}
                          {mudancaIMCPercentual.toFixed(1)}%
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

