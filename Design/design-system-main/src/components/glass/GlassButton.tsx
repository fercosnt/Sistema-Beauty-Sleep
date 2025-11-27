/**
 * Glass Button Component
 * Beauty Smile Design System
 *
 * Button with glass morphism effect
 */

import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils/cn'

const glassButtonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 backdrop-blur-md border',
  {
    variants: {
      variant: {
        light: [
          'bg-white/15',
          'border-white/20',
          'text-white',
          'hover:bg-white/25',
          'active:bg-white/30',
        ],
        dark: [
          'bg-black/30',
          'border-white/10',
          'text-white',
          'hover:bg-black/40',
          'active:bg-black/50',
        ],
        accent: [
          'bg-accent/20',
          'border-accent/30',
          'text-white',
          'hover:bg-accent/30',
          'active:bg-accent/40',
        ],
        primary: [
          'bg-primary/20',
          'border-primary/30',
          'text-white',
          'hover:bg-primary/30',
          'active:bg-primary/40',
        ],
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-4 py-2',
        lg: 'h-12 px-6 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'light',
      size: 'md',
    },
  }
)

export interface GlassButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof glassButtonVariants> {
  /**
   * If true, the button will be rendered as a child within a Slot component
   */
  asChild?: boolean
  /**
   * Icon to display on the left side of the button
   */
  leftIcon?: React.ReactNode
  /**
   * Icon to display on the right side of the button
   */
  rightIcon?: React.ReactNode
  /**
   * Loading state - shows spinner and disables button
   */
  isLoading?: boolean
}

/**
 * Glass Button component with glass morphism effect
 *
 * @example
 * ```tsx
 * <div className="bg-gradient-to-br from-accent to-primary p-8">
 *   <GlassButton variant="light" size="lg">
 *     Click Me
 *   </GlassButton>
 * </div>
 * ```
 */
const GlassButton = React.forwardRef<HTMLButtonElement, GlassButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      leftIcon,
      rightIcon,
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button'

    return (
      <Comp
        className={cn(glassButtonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <svg
            className="h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {!isLoading && leftIcon && <span>{leftIcon}</span>}
        {children}
        {!isLoading && rightIcon && <span>{rightIcon}</span>}
      </Comp>
    )
  }
)

GlassButton.displayName = 'GlassButton'

export { GlassButton, glassButtonVariants }
