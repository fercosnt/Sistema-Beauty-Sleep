/**
 * Button Component
 * Beauty Smile Design System
 *
 * A versatile button component with multiple variants, sizes, and states
 */

import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils/cn'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary:
          'bg-primary text-white shadow hover:bg-primary-hover active:bg-primary-active focus-visible:ring-accent',
        secondary:
          'bg-secondary text-white shadow hover:bg-secondary-hover active:bg-secondary-active focus-visible:ring-accent',
        accent:
          'bg-accent text-white shadow hover:bg-accent-hover active:bg-accent-active focus-visible:ring-primary',
        destructive:
          'bg-error text-white shadow-sm hover:bg-error-700 focus-visible:ring-error',
        outline:
          'border border-neutral-300 bg-white shadow-sm hover:bg-neutral-50 hover:border-neutral-400 focus-visible:ring-accent text-neutral-900',
        ghost:
          'hover:bg-neutral-100 hover:text-neutral-900 focus-visible:ring-accent text-neutral-700',
        link: 'text-primary underline-offset-4 hover:underline focus-visible:ring-accent',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-4 py-2',
        lg: 'h-12 px-6 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
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
 * Button component with multiple variants and sizes
 *
 * @example
 * ```tsx
 * <Button variant="primary" size="md">
 *   Click me
 * </Button>
 *
 * <Button variant="outline" leftIcon={<Icon />}>
 *   With Icon
 * </Button>
 *
 * <Button isLoading>
 *   Loading...
 * </Button>
 * ```
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
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
        className={cn(buttonVariants({ variant, size, className }))}
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

Button.displayName = 'Button'

export { Button, buttonVariants }
