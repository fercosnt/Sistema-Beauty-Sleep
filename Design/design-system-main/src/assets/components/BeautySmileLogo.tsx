/**
 * Beauty Smile Logo Component
 * Beauty Smile Design System
 *
 * Displays Beauty Smile logo in different formats and sizes
 */

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils/cn'

// Import logo SVGs
import iconLogo from '../logos/beauty-smile-icon.svg'
import horizontalLogo from '../logos/beauty-smile-horizontal.svg'
import verticalLogo from '../logos/beauty-smile-vertical.svg'

const logoVariants = cva('', {
  variants: {
    type: {
      icon: 'aspect-square',
      horizontal: 'aspect-[3/1]',
      vertical: 'aspect-[1/3]',
    },
    size: {
      xs: 'h-6',
      sm: 'h-8',
      md: 'h-12',
      lg: 'h-16',
      xl: 'h-24',
      '2xl': 'h-32',
      full: 'h-full w-full',
    },
  },
  defaultVariants: {
    type: 'horizontal',
    size: 'md',
  },
})

export interface BeautySmileLogoProps
  extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt'>,
    VariantProps<typeof logoVariants> {
  /**
   * Logo type to display
   * - icon: Square logo (icon only)
   * - horizontal: Horizontal layout (logo + text side by side)
   * - vertical: Vertical layout (logo + text stacked)
   */
  type?: 'icon' | 'horizontal' | 'vertical'
  /**
   * Logo size
   */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
  /**
   * Alternative text for accessibility
   */
  alt?: string
}

/**
 * Beauty Smile Logo component
 *
 * @example
 * ```tsx
 * // Icon logo (square)
 * <BeautySmileLogo type="icon" size="md" />
 *
 * // Horizontal logo (default)
 * <BeautySmileLogo type="horizontal" size="lg" />
 *
 * // Vertical logo
 * <BeautySmileLogo type="vertical" size="xl" />
 *
 * // Custom size with className
 * <BeautySmileLogo type="horizontal" className="w-48" />
 * ```
 */
export const BeautySmileLogo = React.forwardRef<
  HTMLImageElement,
  BeautySmileLogoProps
>(
  (
    {
      type = 'horizontal',
      size = 'md',
      alt = 'Beauty Smile',
      className,
      ...props
    },
    ref
  ) => {
    const logoSrc = {
      icon: iconLogo,
      horizontal: horizontalLogo,
      vertical: verticalLogo,
    }[type]

    return (
      <img
        ref={ref}
        src={logoSrc}
        alt={alt}
        className={cn(logoVariants({ type, size }), className)}
        {...props}
      />
    )
  }
)

BeautySmileLogo.displayName = 'BeautySmileLogo'
