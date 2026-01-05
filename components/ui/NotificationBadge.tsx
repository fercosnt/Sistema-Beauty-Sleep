'use client'

import { cn } from '@/utils/cn'

interface NotificationBadgeProps {
  count: number
  urgency?: 'alta' | 'media' | 'baixa' | null
  className?: string
}

export default function NotificationBadge({ count, urgency, className }: NotificationBadgeProps) {
  if (count === 0) return null

  // Determinar cor baseada na urgência máxima
  const getBadgeColor = () => {
    if (!urgency) return 'bg-primary-600'
    
    switch (urgency) {
      case 'alta':
        return 'bg-error-600'
      case 'media':
        return 'bg-warning-500'
      case 'baixa':
        return 'bg-success-600'
      default:
        return 'bg-primary-600'
    }
  }

  return (
    <span
      className={cn(
        'absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full text-xs font-semibold text-white',
        getBadgeColor(),
        className
      )}
    >
      {count > 99 ? '99+' : count}
    </span>
  )
}

