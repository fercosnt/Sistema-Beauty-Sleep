/**
 * Badge Component
 * Beauty Smile Design System
 *
 * Small status indicators and labels
 */

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils/cn'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary text-white hover:bg-primary-hover',
        secondary:
          'border-transparent bg-secondary text-white hover:bg-secondary-hover',
        accent:
          'border-transparent bg-accent text-white hover:bg-accent-hover',
        success:
          'border-transparent bg-success text-white hover:bg-success-700',
        warning:
          'border-transparent bg-warning text-white hover:bg-warning-700',
        error: 'border-transparent bg-error text-white hover:bg-error-700',
        outline: 'border-neutral-300 bg-white text-neutral-900',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
