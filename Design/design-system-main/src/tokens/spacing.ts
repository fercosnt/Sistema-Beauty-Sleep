/**
 * Design Tokens - Spacing
 * Beauty Smile Design System
 *
 * Spacing scale based on 4px increments (1-32)
 * Used for: margins, padding, gaps, positioning
 */

// ============================================================================
// SPACING SCALE
// ============================================================================

/**
 * Base spacing unit: 4px
 * All spacing values are multiples of this unit for visual consistency
 */
const BASE_UNIT = 4

/**
 * Spacing scale from 1 to 32
 * Each step is 4px (0.25rem)
 *
 * Usage examples:
 * - spacing[1] = 4px (0.25rem) - Minimal spacing, tight layouts
 * - spacing[2] = 8px (0.5rem) - Small gaps between related items
 * - spacing[4] = 16px (1rem) - Standard spacing for most UI elements
 * - spacing[8] = 32px (2rem) - Medium spacing for section separation
 * - spacing[16] = 64px (4rem) - Large spacing for major sections
 * - spacing[32] = 128px (8rem) - Extra large spacing for page sections
 */
export const spacing = {
  0: '0',
  1: `${BASE_UNIT * 1}px`, // 4px / 0.25rem
  2: `${BASE_UNIT * 2}px`, // 8px / 0.5rem
  3: `${BASE_UNIT * 3}px`, // 12px / 0.75rem
  4: `${BASE_UNIT * 4}px`, // 16px / 1rem
  5: `${BASE_UNIT * 5}px`, // 20px / 1.25rem
  6: `${BASE_UNIT * 6}px`, // 24px / 1.5rem
  7: `${BASE_UNIT * 7}px`, // 28px / 1.75rem
  8: `${BASE_UNIT * 8}px`, // 32px / 2rem
  9: `${BASE_UNIT * 9}px`, // 36px / 2.25rem
  10: `${BASE_UNIT * 10}px`, // 40px / 2.5rem
  11: `${BASE_UNIT * 11}px`, // 44px / 2.75rem
  12: `${BASE_UNIT * 12}px`, // 48px / 3rem
  13: `${BASE_UNIT * 13}px`, // 52px / 3.25rem
  14: `${BASE_UNIT * 14}px`, // 56px / 3.5rem
  15: `${BASE_UNIT * 15}px`, // 60px / 3.75rem
  16: `${BASE_UNIT * 16}px`, // 64px / 4rem
  17: `${BASE_UNIT * 17}px`, // 68px / 4.25rem
  18: `${BASE_UNIT * 18}px`, // 72px / 4.5rem
  19: `${BASE_UNIT * 19}px`, // 76px / 4.75rem
  20: `${BASE_UNIT * 20}px`, // 80px / 5rem
  21: `${BASE_UNIT * 21}px`, // 84px / 5.25rem
  22: `${BASE_UNIT * 22}px`, // 88px / 5.5rem
  23: `${BASE_UNIT * 23}px`, // 92px / 5.75rem
  24: `${BASE_UNIT * 24}px`, // 96px / 6rem
  25: `${BASE_UNIT * 25}px`, // 100px / 6.25rem
  26: `${BASE_UNIT * 26}px`, // 104px / 6.5rem
  27: `${BASE_UNIT * 27}px`, // 108px / 6.75rem
  28: `${BASE_UNIT * 28}px`, // 112px / 7rem
  29: `${BASE_UNIT * 29}px`, // 116px / 7.25rem
  30: `${BASE_UNIT * 30}px`, // 120px / 7.5rem
  31: `${BASE_UNIT * 31}px`, // 124px / 7.75rem
  32: `${BASE_UNIT * 32}px`, // 128px / 8rem
} as const

// ============================================================================
// SEMANTIC SPACING
// ============================================================================

/**
 * Semantic spacing aliases for common use cases
 * These provide context-aware spacing values
 */
export const semanticSpacing = {
  // Component internal spacing
  none: spacing[0],
  xs: spacing[1], // 4px - Extra small (minimal gap)
  sm: spacing[2], // 8px - Small (tight layouts)
  md: spacing[4], // 16px - Medium (default spacing)
  lg: spacing[6], // 24px - Large (comfortable spacing)
  xl: spacing[8], // 32px - Extra large (section spacing)
  '2xl': spacing[12], // 48px - 2X large (major sections)
  '3xl': spacing[16], // 64px - 3X large (page sections)
  '4xl': spacing[24], // 96px - 4X large (hero sections)
  '5xl': spacing[32], // 128px - 5X large (major page divisions)

  // Layout spacing
  gutter: spacing[4], // 16px - Default grid gutter
  container: spacing[6], // 24px - Container padding
  section: spacing[16], // 64px - Section vertical spacing
  page: spacing[24], // 96px - Page top/bottom spacing

  // Component spacing
  buttonPadding: spacing[4], // 16px - Button internal padding
  cardPadding: spacing[6], // 24px - Card internal padding
  inputPadding: spacing[3], // 12px - Input field padding
  iconGap: spacing[2], // 8px - Gap between icon and text

  // Grid & Layout
  gridGap: spacing[4], // 16px - Default grid gap
  columnGap: spacing[6], // 24px - Column gap in multi-column layouts
  rowGap: spacing[4], // 16px - Row gap in multi-row layouts
} as const

// ============================================================================
// CONTAINER WIDTHS
// ============================================================================

/**
 * Standard container max-widths for responsive layouts
 * Based on common breakpoints
 */
export const containerWidth = {
  sm: '640px', // Small screens
  md: '768px', // Medium screens
  lg: '1024px', // Large screens
  xl: '1280px', // Extra large screens
  '2xl': '1536px', // 2X large screens
  full: '100%', // Full width
} as const

// ============================================================================
// BORDER RADIUS
// ============================================================================

/**
 * Border radius scale for rounded corners
 * Based on spacing scale for consistency
 */
export const borderRadius = {
  none: '0',
  sm: spacing[1], // 4px - Subtle rounding
  DEFAULT: spacing[2], // 8px - Standard rounding
  md: spacing[3], // 12px - Medium rounding
  lg: spacing[4], // 16px - Large rounding
  xl: spacing[6], // 24px - Extra large rounding
  '2xl': spacing[8], // 32px - 2X large rounding
  '3xl': spacing[12], // 48px - 3X large rounding
  full: '9999px', // Fully rounded (pills, circles)
} as const

// ============================================================================
// BREAKPOINTS
// ============================================================================

/**
 * Responsive breakpoints for media queries
 * Mobile-first approach
 */
export const breakpoints = {
  xs: '475px', // Extra small devices (large phones)
  sm: '640px', // Small devices (tablets)
  md: '768px', // Medium devices (small laptops)
  lg: '1024px', // Large devices (desktops)
  xl: '1280px', // Extra large devices (large desktops)
  '2xl': '1536px', // 2X large devices (ultra-wide)
} as const

// ============================================================================
// Z-INDEX SCALE
// ============================================================================

/**
 * Z-index scale for layering elements
 * Organized by semantic purpose to avoid conflicts
 */
export const zIndex = {
  base: 0,
  dropdown: 1000,
  sticky: 1100,
  fixed: 1200,
  modalBackdrop: 1300,
  modal: 1400,
  popover: 1500,
  tooltip: 1600,
  notification: 1700,
  top: 9999,
} as const

// ============================================================================
// EXPORTS
// ============================================================================

/**
 * All spacing-related tokens exported as a single object
 */
export const spacingTokens = {
  spacing,
  semanticSpacing,
  containerWidth,
  borderRadius,
  breakpoints,
  zIndex,
} as const

export default spacingTokens
