/**
 * Background Images - Index
 * Beauty Smile Design System
 *
 * Exports all background images for use in applications
 */

// Background gradient images
import backgroundGradient1 from './background-gradient-1.png'
import backgroundGradient2 from './background-gradient-2.png'

/**
 * Background image paths
 *
 * @example
 * ```tsx
 * import { backgrounds } from '@beautysmile/design-system/assets'
 *
 * <div style={{ backgroundImage: `url(${backgrounds.gradient1})` }}>
 *   Content
 * </div>
 * ```
 */
export const backgrounds = {
  gradient1: backgroundGradient1,
  gradient2: backgroundGradient2,
} as const

export default backgrounds
