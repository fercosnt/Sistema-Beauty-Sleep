/**
 * Glass Card Component
 * Beauty Smile Design System
 *
 * Card with glass morphism effect
 */

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils/cn'
import { Glass } from './Glass'

const glassCardVariants = cva('rounded-xl', {
  variants: {
    padding: {
      none: 'p-0',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    },
  },
  defaultVariants: {
    padding: 'md',
  },
})

export interface GlassCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof glassCardVariants> {
  /**
   * Glass variant (light or dark)
   */
  variant?: 'light' | 'dark'
  /**
   * Blur intensity
   */
  blur?: 'sm' | 'md' | 'lg' | 'xl'
}

/**
 * Glass Card component with rounded corners and padding
 *
 * @example
 * ```tsx
 * <div className="bg-gradient-to-br from-accent to-primary p-8">
 *   <GlassCard variant="light" padding="lg">
 *     <h3 className="text-white text-xl font-bold">Glass Card</h3>
 *     <p className="text-white/80">Content with frosted glass effect</p>
 *   </GlassCard>
 * </div>
 * ```
 */
const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  (
    { className, variant = 'light', blur = 'md', padding, children, ...props },
    ref
  ) => {
    return (
      <Glass
        ref={ref}
        variant={variant}
        blur={blur}
        className={cn(glassCardVariants({ padding }), className)}
        {...props}
      >
        {children}
      </Glass>
    )
  }
)

GlassCard.displayName = 'GlassCard'

const GlassCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5', className)}
    {...props}
  />
))
GlassCardHeader.displayName = 'GlassCardHeader'

const GlassCardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      'font-heading text-2xl font-semibold leading-none tracking-tight text-white',
      className
    )}
    {...props}
  />
))
GlassCardTitle.displayName = 'GlassCardTitle'

const GlassCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-white/80', className)}
    {...props}
  />
))
GlassCardDescription.displayName = 'GlassCardDescription'

const GlassCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('pt-4', className)} {...props} />
))
GlassCardContent.displayName = 'GlassCardContent'

const GlassCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center pt-4', className)}
    {...props}
  />
))
GlassCardFooter.displayName = 'GlassCardFooter'

// Compound component pattern
const GlassCardNamespace = Object.assign(GlassCard, {
  Header: GlassCardHeader,
  Title: GlassCardTitle,
  Description: GlassCardDescription,
  Content: GlassCardContent,
  Footer: GlassCardFooter,
})

export {
  GlassCardNamespace as GlassCard,
  GlassCardHeader,
  GlassCardTitle,
  GlassCardDescription,
  GlassCardContent,
  GlassCardFooter,
}
