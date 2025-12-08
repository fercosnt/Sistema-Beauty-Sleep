/**
 * Glass Panel Component
 * Beauty Smile Design System
 *
 * Full-screen or large panel with glass morphism effect
 */

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils/cn'
import { Glass } from './Glass'

const glassPanelVariants = cva('', {
  variants: {
    size: {
      sm: 'max-w-sm',
      md: 'max-w-md',
      lg: 'max-w-lg',
      xl: 'max-w-xl',
      '2xl': 'max-w-2xl',
      full: 'w-full',
    },
    padding: {
      none: 'p-0',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
      xl: 'p-12',
    },
  },
  defaultVariants: {
    size: 'lg',
    padding: 'lg',
  },
})

export interface GlassPanelProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof glassPanelVariants> {
  /**
   * Glass variant (light or dark)
   */
  variant?: 'light' | 'dark'
  /**
   * Blur intensity
   */
  blur?: 'sm' | 'md' | 'lg' | 'xl'
  /**
   * Border radius
   */
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'
}

/**
 * Glass Panel component for larger content areas
 *
 * @example
 * ```tsx
 * <div className="min-h-screen bg-gradient-to-br from-accent to-primary flex items-center justify-center p-8">
 *   <GlassPanel variant="light" size="xl" padding="xl" rounded="2xl">
 *     <h1 className="text-white text-4xl font-bold mb-4">Welcome</h1>
 *     <p className="text-white/80 text-lg">
 *       This is a large glass panel perfect for hero sections.
 *     </p>
 *   </GlassPanel>
 * </div>
 * ```
 */
const GlassPanel = React.forwardRef<HTMLDivElement, GlassPanelProps>(
  (
    {
      className,
      variant = 'light',
      blur = 'md',
      size,
      padding,
      rounded = 'xl',
      children,
      ...props
    },
    ref
  ) => {
    const roundedClass = {
      none: '',
      sm: 'rounded-sm',
      md: 'rounded-md',
      lg: 'rounded-lg',
      xl: 'rounded-xl',
      '2xl': 'rounded-2xl',
      '3xl': 'rounded-3xl',
    }[rounded]

    return (
      <Glass
        ref={ref}
        variant={variant}
        blur={blur}
        className={cn(
          glassPanelVariants({ size, padding }),
          roundedClass,
          className
        )}
        {...props}
      >
        {children}
      </Glass>
    )
  }
)

GlassPanel.displayName = 'GlassPanel'

export { GlassPanel, glassPanelVariants }
