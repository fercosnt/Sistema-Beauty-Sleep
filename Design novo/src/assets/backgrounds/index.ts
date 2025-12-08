/**
 * Background Images - Index
 * Beauty Smile Design System
 *
 * Exports all background images for use in applications
 */

// Background images
import backgroundDarkBlue from './68a4d045b130b34b3614881d.jpeg'
import backgroundDarkBlue2 from './68a4d05373c7b3161e742edd.png'

/**
 * Background image paths
 *
 * @example
 * ```tsx
 * import { backgrounds } from '@beautysmile/design-system/assets'
 *
 * <div style={{ backgroundImage: `url(${backgrounds.darkBlue})` }}>
 *   Content
 * </div>
 * ```
 */
export const backgrounds = {
  darkBlue: backgroundDarkBlue,
  darkBlue2: backgroundDarkBlue2,
} as const

export default backgrounds
