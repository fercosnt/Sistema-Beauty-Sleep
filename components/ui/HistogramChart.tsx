'use client'

interface HistogramBar {
  label: string
  value: number
  color: string
}

interface HistogramChartProps {
  data: HistogramBar[]
  maxValue?: number
  height?: number
  showValues?: boolean
}

/**
 * Componente de Histograma Horizontal
 * Usado para exibir distribuição de SpO2 e frequência cardíaca por faixas
 */
export default function HistogramChart({
  data,
  maxValue,
  height = 200,
  showValues = true,
}: HistogramChartProps) {
  // Calcular valor máximo se não fornecido
  const calculatedMax = maxValue || Math.max(...data.map(d => d.value), 1)

  return (
    <div className="w-full">
      <div className="space-y-2" style={{ height: `${height}px` }}>
        {data.map((bar, index) => {
          const widthPercent = calculatedMax > 0 ? (bar.value / calculatedMax) * 100 : 0
          
          return (
            <div key={index} className="flex items-center gap-3">
              {/* Label */}
              <div className="w-24 text-right">
                <span className="text-xs text-gray-600">{bar.label}</span>
              </div>
              
              {/* Bar */}
              <div className="flex-1 relative">
                <div className="h-6 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${bar.color}`}
                    style={{ width: `${widthPercent}%` }}
                  />
                </div>
                {/* Value overlay */}
                {showValues && bar.value > 0 && (
                  <div className="absolute inset-0 flex items-center px-2">
                    <span className="text-xs font-medium text-gray-700">
                      {bar.value.toFixed(1)}%
                    </span>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

