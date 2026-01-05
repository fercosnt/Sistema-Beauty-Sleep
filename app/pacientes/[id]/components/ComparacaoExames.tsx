'use client'

import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import {
  calcularComparacaoMetricas,
  obterPrimeiroUltimoExame,
  obterPiorMelhorExame,
  type ExameComparacao,
} from '@/lib/utils/comparacao-exames'

interface ComparacaoExamesProps {
  exames: ExameComparacao[]
}

export default function ComparacaoExames({ exames }: ComparacaoExamesProps) {
  if (exames.length < 2) {
    return null
  }

  // Primeiro vs Último
  const { primeiro, ultimo } = obterPrimeiroUltimoExame(exames)
  const comparacaoPrimeiroUltimo = calcularComparacaoMetricas(primeiro, ultimo)

  // Pior vs Melhor
  const { pior, melhor } = obterPiorMelhorExame(exames)
  const comparacaoPiorMelhor = calcularComparacaoMetricas(pior, melhor)

  // Função para obter cor do indicador
  const getCorIndicador = (melhoraPercentual: number | null): string => {
    if (melhoraPercentual === null) return 'text-gray-500'
    if (melhoraPercentual > 0) return 'text-success-600'
    if (melhoraPercentual === 0) return 'text-warning-600'
    return 'text-danger-600'
  }

  // Função para obter cor de fundo do badge
  const getCorBadge = (melhoraPercentual: number | null): string => {
    if (melhoraPercentual === null) return 'bg-gray-100 text-gray-800 border-gray-200'
    if (melhoraPercentual > 0) return 'bg-success-100 text-success-800 border-success-200'
    if (melhoraPercentual === 0) return 'bg-warning-100 text-warning-800 border-warning-200'
    return 'bg-danger-100 text-danger-800 border-danger-200'
  }

  // Função para obter ícone
  const getIcone = (melhoraPercentual: number | null, melhorou: boolean) => {
    if (melhoraPercentual === null) return <Minus className="h-4 w-4" />
    if (melhoraPercentual > 0) return <TrendingDown className="h-4 w-4" />
    if (melhoraPercentual < 0) return <TrendingUp className="h-4 w-4" />
    return <Minus className="h-4 w-4" />
  }

  // Função para formatar valor
  const formatarValor = (valor: number | null, unidade: string = ''): string => {
    if (valor === null) return '-'
    // Se a unidade for %, não adicionar espaço antes
    const separador = unidade === '%' ? '' : unidade ? ' ' : ''
    return `${valor.toFixed(2)}${separador}${unidade}`
  }

  // Função para formatar porcentagem
  const formatarPorcentagem = (valor: number | null): string => {
    if (valor === null) return '-'
    const sinal = valor > 0 ? '+' : valor < 0 ? '-' : ''
    return `${sinal}${sinal ? ' ' : ''}${Math.abs(valor).toFixed(1)}%`
  }

  return (
    <div className="space-y-6">
      {/* Tabela: Primeiro vs Último */}
      {comparacaoPrimeiroUltimo.length > 0 && primeiro && ultimo && (
        <Card>
          <CardHeader>
            <CardTitle>Comparação: Primeiro vs Último Exame</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Métrica</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-900">
                      Primeiro Exame
                      <div className="text-xs font-normal text-gray-500 mt-1">
                        {new Date(primeiro.data_exame).toLocaleDateString('pt-BR')}
                      </div>
                    </th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-900">
                      Último Exame
                      <div className="text-xs font-normal text-gray-500 mt-1">
                        {new Date(ultimo.data_exame).toLocaleDateString('pt-BR')}
                      </div>
                    </th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-900">Variação</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-900">% Melhora</th>
                  </tr>
                </thead>
                <tbody>
                  {comparacaoPrimeiroUltimo.map((comp, index) => {
                    const unidade = comp.metrica.includes('SpO2') ? '%' : comp.metrica.includes('Carga') ? '%.min/h' : comp.metrica.includes('Tempo') ? '%' : ''
                    return (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium text-gray-900">{comp.metrica}</td>
                        <td className="py-3 px-4 text-right text-gray-700">
                          {formatarValor(comp.valorInicial, unidade)}
                        </td>
                        <td className="py-3 px-4 text-right text-gray-700">
                          {formatarValor(comp.valorFinal, unidade)}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <span
                            className={`font-semibold ${
                              comp.melhorou ? 'text-success-600' : 'text-danger-600'
                            }`}
                          >
                            {comp.variacao !== null
                              ? `${comp.variacao > 0 ? '+' : comp.variacao < 0 ? '-' : ''}${comp.variacao !== 0 ? ' ' : ''}${formatarValor(Math.abs(comp.variacao), unidade)}`
                              : '-'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm font-medium border ${getCorBadge(
                              comp.melhoraPercentual
                            )}`}
                          >
                            {getIcone(comp.melhoraPercentual, comp.melhorou)}
                            {formatarPorcentagem(comp.melhoraPercentual)}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabela: Pior vs Melhor */}
      {comparacaoPiorMelhor.length > 0 && pior && melhor && (
        <Card>
          <CardHeader>
            <CardTitle>Comparação: Pior vs Melhor Exame (baseado em IDO)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Métrica</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-900">
                      Pior Exame
                      <div className="text-xs font-normal text-gray-500 mt-1">
                        {new Date(pior.data_exame).toLocaleDateString('pt-BR')}
                      </div>
                    </th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-900">
                      Melhor Exame
                      <div className="text-xs font-normal text-gray-500 mt-1">
                        {new Date(melhor.data_exame).toLocaleDateString('pt-BR')}
                      </div>
                    </th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-900">Variação</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-900">% Melhora</th>
                  </tr>
                </thead>
                <tbody>
                  {comparacaoPiorMelhor.map((comp, index) => {
                    const unidade = comp.metrica.includes('SpO2') ? '%' : comp.metrica.includes('Carga') ? '%.min/h' : comp.metrica.includes('Tempo') ? '%' : ''
                    return (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium text-gray-900">{comp.metrica}</td>
                        <td className="py-3 px-4 text-right text-gray-700">
                          {formatarValor(comp.valorInicial, unidade)}
                        </td>
                        <td className="py-3 px-4 text-right text-gray-700">
                          {formatarValor(comp.valorFinal, unidade)}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <span
                            className={`font-semibold ${
                              comp.melhorou ? 'text-success-600' : 'text-danger-600'
                            }`}
                          >
                            {comp.variacao !== null
                              ? `${comp.variacao > 0 ? '+' : comp.variacao < 0 ? '-' : ''}${comp.variacao !== 0 ? ' ' : ''}${formatarValor(Math.abs(comp.variacao), unidade)}`
                              : '-'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm font-medium border ${getCorBadge(
                              comp.melhoraPercentual
                            )}`}
                          >
                            {getIcone(comp.melhoraPercentual, comp.melhorou)}
                            {formatarPorcentagem(comp.melhoraPercentual)}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

