'use client'

interface RiskBarProps {
  value: number // Valor da carga hipóxica (%.min/hora)
  max?: number // Valor máximo (padrão: 300)
  height?: number
  showValue?: boolean
}

/**
 * Componente de Barra de Risco Cardiovascular
 * Usado para exibir carga hipóxica com indicação de risco
 * 
 * Escala de risco:
 * - 0-50: Baixo (verde)
 * - 50-100: Moderado (amarelo)
 * - 100-200: Alto (laranja)
 * - 200+: Muito Alto (vermelho)
 */
export default function RiskBar({
  value,
  max = 300,
  height = 40,
  showValue = true,
}: RiskBarProps) {
  const percentage = Math.min((value / max) * 100, 100)

  // Determinar cor baseada no valor
  const getColor = (val: number) => {
    if (val < 50) return 'bg-green-500'
    if (val < 100) return 'bg-yellow-500'
    if (val < 200) return 'bg-orange-500'
    return 'bg-red-500'
  }

  const getRiskLabel = (val: number) => {
    if (val < 50) return 'Baixo'
    if (val < 100) return 'Moderado'
    if (val < 200) return 'Alto'
    return 'Muito Alto'
  }

  return (
    <div className="w-full">
      {/* Barra de progresso */}
      <div className="relative" style={{ height: `${height}px` }}>
        {/* Background com zonas de risco */}
        <div className="absolute inset-0 flex rounded-lg overflow-hidden">
          <div className="flex-1 bg-green-200" style={{ width: '16.67%' }} />
          <div className="flex-1 bg-yellow-200" style={{ width: '16.67%' }} />
          <div className="flex-1 bg-orange-200" style={{ width: '33.33%' }} />
          <div className="flex-1 bg-red-200" style={{ width: '33.33%' }} />
        </div>
        
        {/* Barra de valor */}
        <div
          className={`absolute top-0 left-0 h-full rounded-lg transition-all duration-500 ${getColor(value)}`}
          style={{ width: `${percentage}%` }}
        />
        
        {/* Valor e label */}
        {showValue && (
          <div className="absolute inset-0 flex items-center justify-between px-4">
            <span className="text-sm font-semibold text-gray-900">
              {value.toFixed(1)} %.min/hora
            </span>
            <span className={`text-sm font-medium px-2 py-1 rounded ${
              value < 50 ? 'bg-green-100 text-green-800' :
              value < 100 ? 'bg-yellow-100 text-yellow-800' :
              value < 200 ? 'bg-orange-100 text-orange-800' :
              'bg-red-100 text-red-800'
            }`}>
              Risco: {getRiskLabel(value)}
            </span>
          </div>
        )}
      </div>
      
      {/* Legenda */}
      <div className="mt-2 flex justify-between text-xs text-gray-500">
        <span>0</span>
        <span>50</span>
        <span>100</span>
        <span>200</span>
        <span>{max}+</span>
      </div>
    </div>
  )
}

