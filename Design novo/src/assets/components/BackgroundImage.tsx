/**
 * Background Image Component
 * Beauty Smile Design System
 *
 * Full-screen background image with optional overlay
 */

import * as React from 'react'
import { cn } from '../../utils/cn'
import { backgrounds } from '../backgrounds'

export interface BackgroundImageProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Background image to display
   * Use keys from backgrounds object: 'darkBlue', 'darkBlue2'
   */
  background: keyof typeof backgrounds | string
  /**
   * Overlay color (CSS color value)
   */
  overlayColor?: string
  /**
   * Overlay opacity (0 to 1)
   */
  overlayOpacity?: number
  /**
   * Background size CSS property
   */
  backgroundSize?: 'cover' | 'contain' | 'auto'
  /**
   * Background position CSS property
   */
  backgroundPosition?: string
  /**
   * Background repeat CSS property
   */
  backgroundRepeat?: 'repeat' | 'no-repeat' | 'repeat-x' | 'repeat-y'
  /**
   * Whether to use lazy loading
   */
  lazy?: boolean
  /**
   * Children to render on top of background
   */
  children?: React.ReactNode
}

/**
 * Background Image component with overlay support
 *
 * @example
 * ```tsx
 * import { backgrounds } from '@beautysmile/design-system/assets'
 *
 * // Using predefined background
 * <BackgroundImage
 *   background="darkBlue"
 *   overlayColor="#000000"
 *   overlayOpacity={0.3}
 * >
 *   <h1>Content on top of background</h1>
 * </BackgroundImage>
 *
 * // Using custom background URL
 * <BackgroundImage
 *   background="/path/to/image.jpg"
 *   backgroundSize="cover"
 * >
 *   Content
 * </BackgroundImage>
 * ```
 */
export const BackgroundImage = React.forwardRef<
  HTMLDivElement,
  BackgroundImageProps
>(
  (
    {
      background,
      overlayColor,
      overlayOpacity = 0.15,
      backgroundSize = 'cover',
      backgroundPosition = 'center',
      backgroundRepeat = 'no-repeat',
      lazy = true,
      children,
      className,
      style,
      ...props
    },
    ref
  ) => {
    // Resolve background image URL
    const backgroundUrl =
      background in backgrounds
        ? backgrounds[background as keyof typeof backgrounds]
        : background

    // Build overlay style
    const overlayStyle = overlayColor
      ? {
          backgroundColor: overlayColor,
          opacity: overlayOpacity,
        }
      : undefined

    return (
      <div
        ref={ref}
        className={cn('relative min-h-screen w-full', className)}
        style={{
          backgroundImage: `url(${backgroundUrl})`,
          backgroundSize,
          backgroundPosition,
          backgroundRepeat,
          ...style,
        }}
        {...props}
      >
        {/* Overlay */}
        {overlayColor && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={overlayStyle}
            aria-hidden="true"
          />
        )}

        {/* Content */}
        {children && (
          <div className="relative z-10 w-full h-full">{children}</div>
        )}
      </div>
    )
  }
)

BackgroundImage.displayName = 'BackgroundImage'
