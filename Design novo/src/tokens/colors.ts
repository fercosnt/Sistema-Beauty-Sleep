/**
 * Design Tokens - Colors
 * Beauty Smile Design System
 *
 * Color palette for admin (dark blue) and public (turquoise) themes
 */

// ============================================================================
// BRAND COLORS
// ============================================================================

/**
 * Primary brand color - Deep Blue
 * Used for: Admin theme, primary CTAs, headers, navigation
 */
export const primary = {
  DEFAULT: '#00109E',
  hover: '#000C7A',
  active: '#000958',
} as const

/**
 * Secondary brand color - Gold
 * Used for: Premium accents, special highlights (use sparingly)
 */
export const secondary = {
  DEFAULT: '#BB965B',
  hover: '#A68350',
  active: '#917045',
} as const

/**
 * Accent color - Turquoise
 * Used for: Public theme, interactive elements, modern tech feel
 */
export const accent = {
  DEFAULT: '#35BFAD',
  hover: '#2DA89A',
  active: '#259187',
} as const

// ============================================================================
// NEUTRAL COLORS
// ============================================================================

/**
 * Neutral color scale - Grays from white to black
 * Used for: Text, backgrounds, borders, dividers
 */
export const neutral = {
  white: '#FFFFFF',
  50: '#F8F9F9',
  100: '#F1F2F2',
  200: '#E8E9E8',
  300: '#D6D7D5',
  400: '#BFC0BE',
  500: '#A5A7A9',
  600: '#86898C',
  700: '#6B6D70',
  800: '#4A4C4E',
  900: '#2D2E30',
  black: '#000000',
} as const

// ============================================================================
// SEMANTIC COLORS
// ============================================================================

/**
 * Success color - Green
 * Used for: Success messages, confirmations, positive states
 */
export const success = {
  DEFAULT: '#10B981',
  700: '#047857',
} as const

/**
 * Warning color - Orange/Amber
 * Used for: Warnings, alerts, attention states
 */
export const warning = {
  DEFAULT: '#F59E0B',
  700: '#D97706',
} as const

/**
 * Error color - Red
 * Used for: Errors, destructive actions, critical states
 */
export const error = {
  DEFAULT: '#EF4444',
  700: '#DC2626',
} as const

/**
 * Info color - Turquoise (same as accent)
 * Used for: Information messages, tips, neutral notifications
 */
export const info = {
  DEFAULT: '#35BFAD',
} as const

// ============================================================================
// CHART COLORS
// ============================================================================

/**
 * Chart color palette
 * Used for: Data visualization, graphs, charts
 */
export const chart = {
  1: '#00109E', // Primary (Deep Blue)
  2: '#35BFAD', // Accent (Turquoise)
  3: '#BB965B', // Secondary (Gold)
  4: '#10B981', // Success (Green)
  5: '#F59E0B', // Warning (Orange)
} as const

// ============================================================================
// THEME-SPECIFIC COLORS
// ============================================================================

/**
 * Admin theme colors (Dark Blue)
 * Used for: HR/Admin dashboards, internal tools
 */
export const adminTheme = {
  primary: primary.DEFAULT,
  background: '#00109E', // darkBlue background
  sidebar: '#2D2E30', // Dark gray/black sidebar
  sidebarForeground: '#FFFFFF',
  sidebarAccent: '#4A4C4E',
  sidebarBorder: '#6B6D70',
  sidebarRing: accent.DEFAULT, // Turquoise focus ring
} as const

/**
 * Public theme colors (Turquoise)
 * Used for: Public platforms, candidate areas, landing pages
 */
export const publicTheme = {
  primary: accent.DEFAULT,
  background: 'linear-gradient(135deg, #35BFAD 0%, #00109E 100%)', // Gradient background
  overlay: 'rgba(0, 0, 0, 0.15)', // Black overlay 15%
} as const

// ============================================================================
// GLASS MORPHISM COLORS
// ============================================================================

/**
 * Glass morphism effect colors
 * Used for: Glass cards, transparent overlays
 */
export const glass = {
  background: {
    white: 'rgba(255, 255, 255, 0.15)', // 15% white
    whiteHover: 'rgba(255, 255, 255, 0.25)', // 25% white (hover - darker for better contrast)
    dark: 'rgba(0, 0, 0, 0.30)', // 30% black (dark variant)
  },
} as const

// ============================================================================
// EXPORTS
// ============================================================================

/**
 * All colors exported as a single object
 */
export const colors = {
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
} as const

export default colors
