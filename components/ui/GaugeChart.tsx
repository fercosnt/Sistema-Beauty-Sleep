'use client'

import { useMemo } from 'react'

interface GaugeChartProps {
  value: number
  max: number
  label: string
  unit?: string
  color?: 'green' | 'yellow' | 'orange' | 'red'
  size?: 'sm' | 'md' | 'lg'
  showValue?: boolean
}

/**
 * Componente de Gauge Circular
 * Usado para exibir métricas como IDO, SpO2<90%, intensidade de ronco
 */
export default function GaugeChart({
  value,
  max,
  label,
  unit = '',
  color = 'green',
  size = 'md',
  showValue = true,
}: GaugeChartProps) {
  const percentage = useMemo(() => {
    if (max === 0) return 0
    return Math.min((value / max) * 100, 100)
  }, [value, max])

  const sizeClasses = {
    sm: 'w-24 h-24',
    md: 'w-32 h-32',
    lg: 'w-40 h-40',
  }

  const strokeWidth = {
    sm: 8,
    md: 10,
    lg: 12,
  }

  const colorClasses = {
    green: 'stroke-green-500',
    yellow: 'stroke-yellow-500',
    orange: 'stroke-orange-500',
    red: 'stroke-red-500',
  }

  const radius = size === 'sm' ? 36 : size === 'md' ? 48 : 60
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percentage / 100) * circumference

  return (
    <div className="flex flex-col items-center">
      <div className={`relative ${sizeClasses[size]}`}>
        {/* Background circle */}
        <svg className="transform -rotate-90" width={size === 'sm' ? 96 : size === 'md' ? 128 : 160} height={size === 'sm' ? 96 : size === 'md' ? 128 : 160}>
          <circle
            cx={size === 'sm' ? 48 : size === 'md' ? 64 : 80}
            cy={size === 'sm' ? 48 : size === 'md' ? 64 : 80}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth[size]}
            fill="none"
            className="text-gray-200"
          />
          {/* Progress circle */}
          <circle
            cx={size === 'sm' ? 48 : size === 'md' ? 64 : 80}
            cy={size === 'sm' ? 48 : size === 'md' ? 64 : 80}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth[size]}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className={`transition-all duration-500 ${colorClasses[color]}`}
          />
        </svg>
        {/* Value text */}
        {showValue && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`font-bold ${size === 'sm' ? 'text-lg' : size === 'md' ? 'text-xl' : 'text-2xl'} text-gray-900`}>
              {value.toFixed(1)}
            </span>
            {unit && (
              <span className={`text-gray-500 ${size === 'sm' ? 'text-xs' : 'text-sm'}`}>
                {unit}
              </span>
            )}
          </div>
        )}
      </div>
      {/* Label */}
      <p className={`mt-2 text-center text-gray-600 ${size === 'sm' ? 'text-xs' : 'text-sm'}`}>
        {label}
      </p>
    </div>
  )
}

