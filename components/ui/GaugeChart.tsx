'use client'

import { useMemo } from 'react'

interface GaugeChartProps {
  value: number
  maxValue: number
  label: string
  unit?: string
  size?: 'sm' | 'md' | 'lg'
  colorScheme?: 'default' | 'danger' | 'warning' | 'success' | 'auto'
  thresholds?: { warning: number; danger: number }
  invertColors?: boolean // For metrics where lower is worse (like SpO2)
  showPercentage?: boolean
}

export function GaugeChart({
  value,
  maxValue,
  label,
  unit = '',
  size = 'md',
  colorScheme = 'default',
  thresholds,
  invertColors = false,
  showPercentage = false,
}: GaugeChartProps) {
  const sizeConfig = {
    sm: { width: 80, height: 80, strokeWidth: 6, fontSize: 14, labelSize: 10 },
    md: { width: 120, height: 120, strokeWidth: 8, fontSize: 20, labelSize: 12 },
    lg: { width: 160, height: 160, strokeWidth: 10, fontSize: 28, labelSize: 14 },
  }

  const config = sizeConfig[size]
  const radius = (config.width - config.strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const percentage = Math.min((value / maxValue) * 100, 100)
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  const getColor = useMemo(() => {
    if (colorScheme !== 'auto' || !thresholds) {
      const colors = {
        default: '#00109E',
        danger: '#EF4444',
        warning: '#F59E0B',
        success: '#10B981',
      }
      return colors[colorScheme === 'auto' ? 'default' : colorScheme]
    }

    // Auto color based on thresholds
    if (invertColors) {
      // For metrics where lower is worse (SpO2)
      if (value < thresholds.danger) return '#EF4444'
      if (value < thresholds.warning) return '#F59E0B'
      return '#10B981'
    } else {
      // For metrics where higher is worse (IDO, Score Ronco)
      if (value >= thresholds.danger) return '#EF4444'
      if (value >= thresholds.warning) return '#F59E0B'
      return '#10B981'
    }
  }, [value, colorScheme, thresholds, invertColors])

  const displayValue = showPercentage
    ? `${Math.round(percentage)}%`
    : value % 1 === 0
    ? value.toString()
    : value.toFixed(1)

  return (
    <div className="flex flex-col items-center">
      <svg
        width={config.width}
        height={config.width}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={config.width / 2}
          cy={config.width / 2}
          r={radius}
          fill="none"
          stroke="#E5E7EB"
          strokeWidth={config.strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={config.width / 2}
          cy={config.width / 2}
          r={radius}
          fill="none"
          stroke={getColor}
          strokeWidth={config.strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-500 ease-out"
        />
      </svg>
      {/* Value overlay */}
      <div
        className="absolute flex flex-col items-center justify-center"
        style={{ width: config.width, height: config.width }}
      >
        <span
          className="font-bold text-gray-900"
          style={{ fontSize: config.fontSize }}
        >
          {displayValue}
        </span>
        {unit && (
          <span
            className="text-gray-500"
            style={{ fontSize: config.labelSize }}
          >
            {unit}
          </span>
        )}
      </div>
      {/* Label */}
      <p
        className="mt-2 text-center font-medium text-gray-700"
        style={{ fontSize: config.labelSize }}
      >
        {label}
      </p>
    </div>
  )
}

interface GaugeGridProps {
  children: React.ReactNode
  columns?: 2 | 3 | 4
}

export function GaugeGrid({ children, columns = 4 }: GaugeGridProps) {
  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
  }

  return (
    <div className={`grid ${gridCols[columns]} gap-4 items-center justify-items-center relative`}>
      {children}
    </div>
  )
}
