/**
 * Glass Navbar Component
 * Beauty Smile Design System
 *
 * Navigation bar with glass morphism effect
 */

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils/cn'
import { Glass } from './Glass'

const glassNavbarVariants = cva('sticky top-0 z-sticky w-full', {
  variants: {
    padding: {
      none: 'px-0 py-0',
      sm: 'px-4 py-2',
      md: 'px-6 py-3',
      lg: 'px-8 py-4',
    },
  },
  defaultVariants: {
    padding: 'md',
  },
})

export interface GlassNavbarProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof glassNavbarVariants> {
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
 * Glass Navbar component for navigation with glass morphism effect
 *
 * @example
 * ```tsx
 * <div className="min-h-screen bg-gradient-to-br from-accent to-primary">
 *   <GlassNavbar variant="light" padding="lg">
 *     <div className="container mx-auto flex items-center justify-between">
 *       <h1 className="text-white text-xl font-bold">Brand</h1>
 *       <nav className="flex gap-4">
 *         <a href="#" className="text-white hover:text-white/80">Home</a>
 *         <a href="#" className="text-white hover:text-white/80">About</a>
 *         <a href="#" className="text-white hover:text-white/80">Contact</a>
 *       </nav>
 *     </div>
 *   </GlassNavbar>
 * </div>
 * ```
 */
const GlassNavbar = React.forwardRef<HTMLElement, GlassNavbarProps>(
  (
    {
      className,
      variant = 'light',
      blur = 'md',
      padding,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <nav
        ref={ref}
        className={cn(glassNavbarVariants({ padding }), className)}
        {...props}
      >
        <Glass variant={variant} blur={blur} className="w-full">
          {children}
        </Glass>
      </nav>
    )
  }
)

GlassNavbar.displayName = 'GlassNavbar'

const GlassNavbarBrand = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center gap-2 text-white font-heading', className)}
    {...props}
  />
))
GlassNavbarBrand.displayName = 'GlassNavbarBrand'

const GlassNavbarNav = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center gap-6', className)}
    {...props}
  />
))
GlassNavbarNav.displayName = 'GlassNavbarNav'

const GlassNavbarLink = React.forwardRef<
  HTMLAnchorElement,
  React.AnchorHTMLAttributes<HTMLAnchorElement>
>(({ className, ...props }, ref) => (
  <a
    ref={ref}
    className={cn(
      'text-white/90 hover:text-white transition-colors text-sm font-medium',
      className
    )}
    {...props}
  />
))
GlassNavbarLink.displayName = 'GlassNavbarLink'

export {
  GlassNavbar,
  GlassNavbarBrand,
  GlassNavbarNav,
  GlassNavbarLink,
  glassNavbarVariants,
}
