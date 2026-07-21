'use client'

interface HistogramBar {
  label: string
  value: number
  color?: string
}

interface HistogramChartProps {
  bars: HistogramBar[]
  title?: string
  unit?: string
  showValues?: boolean
  maxValue?: number // If not provided, uses max from data
  height?: 'sm' | 'md' | 'lg'
}

export function HistogramChart({
  bars,
  title,
  unit = '%',
  showValues = true,
  maxValue,
  height = 'md',
}: HistogramChartProps) {
  const heightConfig = {
    sm: 'h-3',
    md: 'h-4',
    lg: 'h-6',
  }

  const max = maxValue || Math.max(...bars.map((b) => b.value), 1)

  const defaultColors = [
    '#10B981', // green
    '#35BFAD', // teal
    '#F59E0B', // amber
    '#EF4444', // red
    '#00109E', // primary blue
    '#6366F1', // indigo
  ]

  return (
    <div className="space-y-2">
      {title && (
        <h4 className="text-sm font-medium text-gray-700">{title}</h4>
      )}
      <div className="space-y-2">
        {bars.map((bar, index) => {
          const percentage = (bar.value / max) * 100
          const barColor = bar.color || defaultColors[index % defaultColors.length]

          return (
            <div key={index} className="flex items-center gap-3">
              <div className="w-24 text-xs text-gray-600 text-right shrink-0">
                {bar.label}
              </div>
              <div className="flex-1 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`${heightConfig[height]} rounded-full transition-all duration-500 ease-out`}
                  style={{
                    width: `${Math.max(percentage, 1)}%`,
                    backgroundColor: barColor,
                  }}
                />
              </div>
              {showValues && (
                <div className="w-16 text-xs text-gray-700 font-medium shrink-0">
                  {bar.value.toFixed(1)}{unit}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

interface SpO2HistogramProps {
  ranges: {
    above95: number
    range93to95: number
    range90to92: number
    range85to89: number
    range80to84: number
    below80: number
  }
}

export function SpO2Histogram({ ranges }: SpO2HistogramProps) {
  const bars: HistogramBar[] = [
    { label: '> 95%', value: ranges.above95, color: '#10B981' },
    { label: '93-95%', value: ranges.range93to95, color: '#35BFAD' },
    { label: '90-92%', value: ranges.range90to92, color: '#F59E0B' },
    { label: '85-89%', value: ranges.range85to89, color: '#F97316' },
    { label: '80-84%', value: ranges.range80to84, color: '#EF4444' },
    { label: '< 80%', value: ranges.below80, color: '#991B1B' },
  ]

  return (
    <HistogramChart
      bars={bars}
      title="Distribuição SpO2"
      unit="%"
      maxValue={100}
    />
  )
}

interface HeartRateHistogramProps {
  ranges: {
    below50: number
    range50to60: number
    range60to70: number
    range70to80: number
    range80to90: number
    range90to100: number
    above100: number
  }
}

export function HeartRateHistogram({ ranges }: HeartRateHistogramProps) {
  const bars: HistogramBar[] = [
    { label: '< 50 bpm', value: ranges.below50, color: '#3B82F6' },
    { label: '50-60', value: ranges.range50to60, color: '#10B981' },
    { label: '60-70', value: ranges.range60to70, color: '#10B981' },
    { label: '70-80', value: ranges.range70to80, color: '#35BFAD' },
    { label: '80-90', value: ranges.range80to90, color: '#F59E0B' },
    { label: '90-100', value: ranges.range90to100, color: '#F97316' },
    { label: '> 100', value: ranges.above100, color: '#EF4444' },
  ]

  return (
    <HistogramChart
      bars={bars}
      title="Distribuição Frequência Cardíaca"
      unit="%"
      maxValue={100}
    />
  )
}
