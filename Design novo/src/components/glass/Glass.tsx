/**
 * Glass Component (Base)
 * Beauty Smile Design System
 *
 * Base component for glass morphism effect
 * Should only be used on gradient or image backgrounds
 */

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../utils/cn'

const glassVariants = cva(
  'backdrop-blur-md border transition-all',
  {
    variants: {
      variant: {
        light: [
          'bg-glass-white',
          'border-white/20',
          'hover:bg-glass-white-hover',
        ],
        dark: [
          'bg-glass-dark',
          'border-white/10',
          'hover:bg-black/40',
        ],
      },
      blur: {
        sm: 'backdrop-blur-sm', // 4px
        md: 'backdrop-blur-md', // 12px
        lg: 'backdrop-blur-lg', // 16px
        xl: 'backdrop-blur-xl', // 24px
      },
      shadow: {
        none: 'shadow-none',
        sm: 'shadow-glass-sm',
        md: 'shadow-glass',
        lg: 'shadow-glass-lg',
      },
    },
    defaultVariants: {
      variant: 'light',
      blur: 'md',
      shadow: 'md',
    },
  }
)

export interface GlassProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof glassVariants> {
  /**
   * If true, the glass element will be rendered as a child within a Slot component
   */
  asChild?: boolean
}

/**
 * Glass morphism base component
 *
 * @example
 * ```tsx
 * <div style={{ background: 'linear-gradient(135deg, #35BFAD 0%, #00109E 100%)' }}>
 *   <Glass variant="light" blur="md" className="p-6 rounded-lg">
 *     <h2 className="text-white">Glass Content</h2>
 *   </Glass>
 * </div>
 * ```
 */
const Glass = React.forwardRef<HTMLDivElement, GlassProps>(
  ({ className, variant, blur, shadow, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(glassVariants({ variant, blur, shadow }), className)}
        {...props}
      />
    )
  }
)

Glass.displayName = 'Glass'

export { Glass, glassVariants }
