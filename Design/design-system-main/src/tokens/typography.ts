/**
 * Design Tokens - Typography
 * Beauty Smile Design System
 *
 * Font families, sizes, weights, line heights, and heading styles
 */

// ============================================================================
// FONT FAMILIES
// ============================================================================

/**
 * Font family definitions
 * Primary: Inter - Modern, clean, highly legible (UI elements, body text)
 * Heading: Montserrat - Strong, professional (headings, titles)
 * Mono: JetBrains Mono - Code, technical content
 */
export const fontFamily = {
  sans: [
    'Inter',
    '-apple-system',
    'BlinkMacSystemFont',
    'Segoe UI',
    'Roboto',
    'Helvetica Neue',
    'Arial',
    'sans-serif',
  ].join(', '),
  heading: [
    'Montserrat',
    'Inter',
    '-apple-system',
    'BlinkMacSystemFont',
    'Segoe UI',
    'sans-serif',
  ].join(', '),
  mono: [
    'JetBrains Mono',
    'Menlo',
    'Monaco',
    'Courier New',
    'monospace',
  ].join(', '),
} as const

// ============================================================================
// FONT SIZES
// ============================================================================

/**
 * Font size scale (xs to 7xl)
 * Based on modular scale with consistent ratios
 */
export const fontSize = {
  xs: ['0.75rem', { lineHeight: '1rem' }], // 12px / 16px
  sm: ['0.875rem', { lineHeight: '1.25rem' }], // 14px / 20px
  base: ['1rem', { lineHeight: '1.5rem' }], // 16px / 24px
  lg: ['1.125rem', { lineHeight: '1.75rem' }], // 18px / 28px
  xl: ['1.25rem', { lineHeight: '1.75rem' }], // 20px / 28px
  '2xl': ['1.5rem', { lineHeight: '2rem' }], // 24px / 32px
  '3xl': ['1.875rem', { lineHeight: '2.25rem' }], // 30px / 36px
  '4xl': ['2.25rem', { lineHeight: '2.5rem' }], // 36px / 40px
  '5xl': ['3rem', { lineHeight: '1' }], // 48px
  '6xl': ['3.75rem', { lineHeight: '1' }], // 60px
  '7xl': ['4.5rem', { lineHeight: '1' }], // 72px
} as const

// ============================================================================
// FONT WEIGHTS
// ============================================================================

/**
 * Font weight scale
 * Covers the full range from thin to black
 */
export const fontWeight = {
  thin: '100',
  extralight: '200',
  light: '300',
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
  black: '900',
} as const

// ============================================================================
// LINE HEIGHTS
// ============================================================================

/**
 * Line height scale
 * Used for controlling vertical spacing in text blocks
 */
export const lineHeight = {
  none: '1',
  tight: '1.25',
  snug: '1.375',
  normal: '1.5',
  relaxed: '1.625',
  loose: '2',
  '3': '.75rem', // 12px
  '4': '1rem', // 16px
  '5': '1.25rem', // 20px
  '6': '1.5rem', // 24px
  '7': '1.75rem', // 28px
  '8': '2rem', // 32px
  '9': '2.25rem', // 36px
  '10': '2.5rem', // 40px
} as const

// ============================================================================
// LETTER SPACING
// ============================================================================

/**
 * Letter spacing scale
 * Used for controlling horizontal spacing between characters
 */
export const letterSpacing = {
  tighter: '-0.05em',
  tight: '-0.025em',
  normal: '0',
  wide: '0.025em',
  wider: '0.05em',
  widest: '0.1em',
} as const

// ============================================================================
// HEADING STYLES
// ============================================================================

/**
 * Predefined heading styles (h1-h6)
 * Consistent typography for all heading levels
 */
export const headings = {
  h1: {
    fontFamily: fontFamily.heading,
    fontSize: fontSize['5xl'][0], // 48px
    lineHeight: fontSize['5xl'][1].lineHeight, // 1
    fontWeight: fontWeight.bold, // 700
    letterSpacing: letterSpacing.tight, // -0.025em
  },
  h2: {
    fontFamily: fontFamily.heading,
    fontSize: fontSize['4xl'][0], // 36px
    lineHeight: fontSize['4xl'][1].lineHeight, // 2.5rem
    fontWeight: fontWeight.bold, // 700
    letterSpacing: letterSpacing.tight, // -0.025em
  },
  h3: {
    fontFamily: fontFamily.heading,
    fontSize: fontSize['3xl'][0], // 30px
    lineHeight: fontSize['3xl'][1].lineHeight, // 2.25rem
    fontWeight: fontWeight.semibold, // 600
    letterSpacing: letterSpacing.tight, // -0.025em
  },
  h4: {
    fontFamily: fontFamily.heading,
    fontSize: fontSize['2xl'][0], // 24px
    lineHeight: fontSize['2xl'][1].lineHeight, // 2rem
    fontWeight: fontWeight.semibold, // 600
    letterSpacing: letterSpacing.normal, // 0
  },
  h5: {
    fontFamily: fontFamily.heading,
    fontSize: fontSize.xl[0], // 20px
    lineHeight: fontSize.xl[1].lineHeight, // 1.75rem
    fontWeight: fontWeight.medium, // 500
    letterSpacing: letterSpacing.normal, // 0
  },
  h6: {
    fontFamily: fontFamily.heading,
    fontSize: fontSize.lg[0], // 18px
    lineHeight: fontSize.lg[1].lineHeight, // 1.75rem
    fontWeight: fontWeight.medium, // 500
    letterSpacing: letterSpacing.normal, // 0
  },
} as const

// ============================================================================
// TEXT STYLES
// ============================================================================

/**
 * Common text style presets
 * Ready-to-use combinations for common use cases
 */
export const textStyles = {
  body: {
    fontFamily: fontFamily.sans,
    fontSize: fontSize.base[0],
    lineHeight: fontSize.base[1].lineHeight,
    fontWeight: fontWeight.normal,
  },
  bodySmall: {
    fontFamily: fontFamily.sans,
    fontSize: fontSize.sm[0],
    lineHeight: fontSize.sm[1].lineHeight,
    fontWeight: fontWeight.normal,
  },
  bodyLarge: {
    fontFamily: fontFamily.sans,
    fontSize: fontSize.lg[0],
    lineHeight: fontSize.lg[1].lineHeight,
    fontWeight: fontWeight.normal,
  },
  label: {
    fontFamily: fontFamily.sans,
    fontSize: fontSize.sm[0],
    lineHeight: fontSize.sm[1].lineHeight,
    fontWeight: fontWeight.medium,
    letterSpacing: letterSpacing.wide,
  },
  caption: {
    fontFamily: fontFamily.sans,
    fontSize: fontSize.xs[0],
    lineHeight: fontSize.xs[1].lineHeight,
    fontWeight: fontWeight.normal,
  },
  code: {
    fontFamily: fontFamily.mono,
    fontSize: fontSize.sm[0],
    lineHeight: fontSize.sm[1].lineHeight,
    fontWeight: fontWeight.normal,
  },
  button: {
    fontFamily: fontFamily.sans,
    fontSize: fontSize.base[0],
    lineHeight: fontSize.base[1].lineHeight,
    fontWeight: fontWeight.medium,
    letterSpacing: letterSpacing.wide,
  },
  link: {
    fontFamily: fontFamily.sans,
    fontSize: fontSize.base[0],
    lineHeight: fontSize.base[1].lineHeight,
    fontWeight: fontWeight.medium,
    textDecoration: 'underline',
  },
} as const

// ============================================================================
// EXPORTS
// ============================================================================

/**
 * All typography tokens exported as a single object
 */
export const typography = {
  fontFamily,
  fontSize,
  fontWeight,
  lineHeight,
  letterSpacing,
  headings,
  textStyles,
} as const

export default typography
