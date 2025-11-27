/**
 * Design Tokens - Unified Export
 * Beauty Smile Design System
 *
 * All design tokens combined in a single object
 */

import colors from './colors'
import typography from './typography'
import spacingTokens from './spacing'
import shadows from './shadows'
import animations from './animations'

/**
 * Complete design token system
 * All tokens accessible from a single import
 *
 * @example
 * import tokens from '@beautysmile/design-system/tokens'
 * const primaryColor = tokens.colors.primary.DEFAULT
 * const h1Style = tokens.typography.headings.h1
 * const cardShadow = tokens.shadows.elevation.level1
 */
const tokens = {
  colors,
  typography,
  spacing: spacingTokens,
  shadows,
  animations,
} as const

export default tokens
