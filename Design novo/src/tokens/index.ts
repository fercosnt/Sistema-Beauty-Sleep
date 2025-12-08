/**
 * Design Tokens - Index
 * Beauty Smile Design System
 *
 * Central export point for all design tokens
 * Import from: import { colors, typography, spacing } from '@beautysmile/design-system/tokens'
 */

// ============================================================================
// RE-EXPORTS
// ============================================================================

// Colors
export {
  primary,
  secondary,
  accent,
  neutral,
  success,
  warning,
  error,
  info,
  chart,
  adminTheme,
  publicTheme,
  glass,
  colors,
  default as colorsDefault,
} from './colors'

// Typography
export {
  fontFamily,
  fontSize,
  fontWeight,
  lineHeight,
  letterSpacing,
  headings,
  textStyles,
  typography,
  default as typographyDefault,
} from './typography'

// Spacing
export {
  spacing,
  semanticSpacing,
  containerWidth,
  borderRadius,
  breakpoints,
  zIndex,
  spacingTokens,
  default as spacingDefault,
} from './spacing'

// Shadows
export {
  boxShadow,
  dropShadow,
  glassShadow,
  coloredShadow,
  semanticShadow,
  elevation,
  shadows,
  default as shadowsDefault,
} from './shadows'

// Animations
export {
  keyframes,
  duration,
  timingFunction,
  delay,
  transition,
  animationPresets,
  reducedMotion,
  animations,
  default as animationsDefault,
} from './animations'

// ============================================================================
// UNIFIED TOKENS OBJECT
// ============================================================================

/**
 * All design tokens in a single object
 * Use this for comprehensive token access
 *
 * @example
 * import { tokens } from '@beautysmile/design-system/tokens'
 * const primaryColor = tokens.colors.primary.DEFAULT
 * const headingFont = tokens.typography.headings.h1
 */
export { default as tokens } from './tokens'

// ============================================================================
// TYPE EXPORTS
// ============================================================================

/**
 * TypeScript types for design tokens
 * Useful for creating typed components and utilities
 */
export type ColorToken = typeof import('./colors').colors
export type TypographyToken = typeof import('./typography').typography
export type SpacingToken = typeof import('./spacing').spacingTokens
export type ShadowToken = typeof import('./shadows').shadows
export type AnimationToken = typeof import('./animations').animations
