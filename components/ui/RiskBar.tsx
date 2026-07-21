'use client'

interface RiskBarProps {
  value: number
  maxValue?: number
  thresholds?: {
    low: number
    medium: number
    high: number
  }
  title?: string
  unit?: string
  showLabels?: boolean
}

export function RiskBar({
  value,
  maxValue = 500,
  thresholds = { low: 100, medium: 200, high: 300 },
  title,
  unit = '%.min/hora',
  showLabels = true,
}: RiskBarProps) {
  const percentage = Math.min((value / maxValue) * 100, 100)

  const getColor = () => {
    if (value >= thresholds.high) return '#EF4444' // red
    if (value >= thresholds.medium) return '#F97316' // orange
    if (value >= thresholds.low) return '#F59E0B' // amber
    return '#10B981' // green
  }

  const getRiskLabel = () => {
    if (value >= thresholds.high) return 'Risco Alto'
    if (value >= thresholds.medium) return 'Risco Moderado'
    if (value >= thresholds.low) return 'Risco Leve'
    return 'Risco Baixo'
  }

  return (
    <div className="space-y-2">
      {title && (
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-gray-700">{title}</h4>
          <span className="text-sm font-semibold" style={{ color: getColor() }}>
            {getRiskLabel()}
          </span>
        </div>
      )}

      {/* Value display */}
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold text-gray-900">
          {value.toFixed(1)}
        </span>
        <span className="text-sm text-gray-500">{unit}</span>
      </div>

      {/* Progress bar */}
      <div className="relative">
        <div className="w-full h-4 bg-gradient-to-r from-green-100 via-amber-100 to-red-100 rounded-full overflow-hidden">
          {/* Marker for current value */}
          <div
            className="absolute top-0 h-4 w-1 bg-gray-900 rounded-full transition-all duration-500 ease-out"
            style={{ left: `calc(${percentage}% - 2px)` }}
          />
        </div>

        {/* Background gradient bar */}
        <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden absolute top-0 -z-10">
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${percentage}%`,
              backgroundColor: getColor(),
            }}
          />
        </div>
      </div>

      {/* Labels */}
      {showLabels && (
        <div className="flex justify-between text-xs text-gray-500">
          <span>0</span>
          <span>{thresholds.low}</span>
          <span>{thresholds.medium}</span>
          <span>{thresholds.high}+</span>
        </div>
      )}

      {/* Risk scale labels */}
      {showLabels && (
        <div className="flex justify-between text-xs">
          <span className="text-green-600">Risco menor</span>
          <span className="text-red-600">Risco maior</span>
        </div>
      )}
    </div>
  )
}

interface CardiovascularRiskBarProps {
  hypoxicBurden: number
}

export function CardiovascularRiskBar({ hypoxicBurden }: CardiovascularRiskBarProps) {
  return (
    <RiskBar
      value={hypoxicBurden}
      maxValue={500}
      thresholds={{ low: 100, medium: 200, high: 300 }}
      title="Carga Hipóxica - Risco Cardiovascular"
      unit="%.min/hora"
    />
  )
}
