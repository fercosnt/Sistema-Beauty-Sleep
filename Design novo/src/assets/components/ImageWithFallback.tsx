/**
 * Image With Fallback Component
 * Beauty Smile Design System
 *
 * Image component with fallback support and loading states
 */

import * as React from 'react'
import { cn } from '@/utils/cn'

export interface ImageWithFallbackProps
  extends React.ImgHTMLAttributes<HTMLImageElement> {
  /**
   * Primary image source
   */
  src: string
  /**
   * Fallback image source (shown if primary fails to load)
   */
  fallbackSrc?: string
  /**
   * Alt text for accessibility
   */
  alt: string
  /**
   * Show loading spinner while image loads
   */
  showLoading?: boolean
  /**
   * Callback when image loads successfully
   */
  onLoad?: () => void
  /**
   * Callback when image fails to load
   */
  onError?: () => void
}

/**
 * Image component with fallback and loading states
 *
 * @example
 * ```tsx
 * <ImageWithFallback
 *   src="/path/to/image.jpg"
 *   fallbackSrc="/path/to/placeholder.jpg"
 *   alt="Description"
 *   showLoading
 *   className="w-full h-64 object-cover"
 * />
 * ```
 */
export const ImageWithFallback = React.forwardRef<
  HTMLImageElement,
  ImageWithFallbackProps
>(
  (
    {
      src,
      fallbackSrc,
      alt,
      showLoading = false,
      onLoad: onLoadProp,
      onError: onErrorProp,
      className,
      ...props
    },
    ref
  ) => {
    const [imgSrc, setImgSrc] = React.useState(src)
    const [isLoading, setIsLoading] = React.useState(true)
    const [hasError, setHasError] = React.useState(false)

    // Reset states when src changes
    React.useEffect(() => {
      setImgSrc(src)
      setIsLoading(true)
      setHasError(false)
    }, [src])

    const handleLoad = () => {
      setIsLoading(false)
      setHasError(false)
      onLoadProp?.()
    }

    const handleError = () => {
      setIsLoading(false)
      setHasError(true)

      // Try fallback if available and not already using it
      if (fallbackSrc && imgSrc !== fallbackSrc) {
        setImgSrc(fallbackSrc)
        setIsLoading(true)
        setHasError(false)
      }

      onErrorProp?.()
    }

    return (
      <div className={cn('relative', className)}>
        {/* Loading spinner */}
        {showLoading && isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-neutral-100">
            <svg
              className="h-8 w-8 animate-spin text-neutral-400"
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
          </div>
        )}

        {/* Image */}
        <img
          ref={ref}
          src={imgSrc}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          className={cn(
            'w-full h-full object-cover',
            isLoading && showLoading && 'opacity-0',
            hasError && 'opacity-50'
          )}
          {...props}
        />

        {/* Error placeholder */}
        {hasError && !fallbackSrc && (
          <div className="absolute inset-0 flex items-center justify-center bg-neutral-100">
            <div className="text-center text-neutral-500">
              <svg
                className="h-12 w-12 mx-auto mb-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="text-sm">Failed to load image</p>
            </div>
          </div>
        )}
      </div>
    )
  }
)

ImageWithFallback.displayName = 'ImageWithFallback'
