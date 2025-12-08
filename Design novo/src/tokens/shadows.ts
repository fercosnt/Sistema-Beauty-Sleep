/**
 * Design Tokens - Shadows
 * Beauty Smile Design System
 *
 * Shadow scale with 5 levels for depth and elevation
 * Used for: cards, modals, dropdowns, elevated UI elements
 */

// ============================================================================
// BOX SHADOW SCALE
// ============================================================================

/**
 * Box shadow scale (sm, DEFAULT, md, lg, xl)
 * Creates depth and elevation with consistent shadow styles
 *
 * Design Philosophy:
 * - Shadows use neutral-900 (#2D2E30) at varying opacities
 * - Each level has multiple layers for realistic depth
 * - Larger shadows have more blur and vertical offset
 */
export const boxShadow = {
  /**
   * Small shadow - Minimal elevation
   * Used for: Subtle depth on cards, inputs
   */
  sm: '0 1px 2px 0 rgba(45, 46, 48, 0.05)',

  /**
   * Default shadow - Standard elevation
   * Used for: Cards, buttons (hover), dropdowns
   */
  DEFAULT:
    '0 1px 3px 0 rgba(45, 46, 48, 0.1), 0 1px 2px -1px rgba(45, 46, 48, 0.1)',

  /**
   * Medium shadow - Moderate elevation
   * Used for: Floating panels, tooltips, popovers
   */
  md: '0 4px 6px -1px rgba(45, 46, 48, 0.1), 0 2px 4px -2px rgba(45, 46, 48, 0.1)',

  /**
   * Large shadow - High elevation
   * Used for: Modals, dialogs, important overlays
   */
  lg: '0 10px 15px -3px rgba(45, 46, 48, 0.1), 0 4px 6px -4px rgba(45, 46, 48, 0.1)',

  /**
   * Extra large shadow - Maximum elevation
   * Used for: Full-screen overlays, critical modals
   */
  xl: '0 20px 25px -5px rgba(45, 46, 48, 0.1), 0 8px 10px -6px rgba(45, 46, 48, 0.1)',

  /**
   * 2X large shadow - Dramatic elevation
   * Used for: Major UI changes, important announcements
   */
  '2xl': '0 25px 50px -12px rgba(45, 46, 48, 0.25)',

  /**
   * Inner shadow - Inset depth
   * Used for: Pressed states, input fields (focus)
   */
  inner: 'inset 0 2px 4px 0 rgba(45, 46, 48, 0.05)',

  /**
   * No shadow
   */
  none: '0 0 #0000',
} as const

// ============================================================================
// DROP SHADOW (for filters)
// ============================================================================

/**
 * Drop shadow for use with CSS filter property
 * Used for: SVG elements, images, non-box elements
 */
export const dropShadow = {
  sm: 'drop-shadow(0 1px 1px rgba(45, 46, 48, 0.05))',
  DEFAULT:
    'drop-shadow(0 1px 2px rgba(45, 46, 48, 0.1)) drop-shadow(0 1px 1px rgba(45, 46, 48, 0.06))',
  md: 'drop-shadow(0 4px 3px rgba(45, 46, 48, 0.07)) drop-shadow(0 2px 2px rgba(45, 46, 48, 0.06))',
  lg: 'drop-shadow(0 10px 8px rgba(45, 46, 48, 0.04)) drop-shadow(0 4px 3px rgba(45, 46, 48, 0.1))',
  xl: 'drop-shadow(0 20px 13px rgba(45, 46, 48, 0.03)) drop-shadow(0 8px 5px rgba(45, 46, 48, 0.08))',
  '2xl': 'drop-shadow(0 25px 25px rgba(45, 46, 48, 0.15))',
  none: 'drop-shadow(0 0 #0000)',
} as const

// ============================================================================
// THEME-SPECIFIC SHADOWS
// ============================================================================

/**
 * Glass morphism shadow
 * Used for: Glass cards on gradient backgrounds
 * Combines shadow with backdrop blur for frosted glass effect
 */
export const glassShadow = {
  sm: '0 2px 4px 0 rgba(0, 0, 0, 0.1)',
  DEFAULT: '0 4px 6px 0 rgba(0, 0, 0, 0.1), 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  md: '0 8px 12px 0 rgba(0, 0, 0, 0.12), 0 4px 6px 0 rgba(0, 0, 0, 0.08)',
  lg: '0 12px 20px 0 rgba(0, 0, 0, 0.15), 0 6px 10px 0 rgba(0, 0, 0, 0.1)',
  xl: '0 20px 30px 0 rgba(0, 0, 0, 0.2), 0 10px 15px 0 rgba(0, 0, 0, 0.12)',
} as const

/**
 * Colored shadows for brand elements
 * Used for: Primary/accent buttons (hover), important CTAs
 */
export const coloredShadow = {
  primary: {
    sm: '0 2px 4px 0 rgba(0, 16, 158, 0.2)', // Deep blue
    DEFAULT: '0 4px 6px 0 rgba(0, 16, 158, 0.3)',
    lg: '0 10px 15px -3px rgba(0, 16, 158, 0.4)',
  },
  accent: {
    sm: '0 2px 4px 0 rgba(53, 191, 173, 0.2)', // Turquoise
    DEFAULT: '0 4px 6px 0 rgba(53, 191, 173, 0.3)',
    lg: '0 10px 15px -3px rgba(53, 191, 173, 0.4)',
  },
  secondary: {
    sm: '0 2px 4px 0 rgba(187, 150, 91, 0.2)', // Gold
    DEFAULT: '0 4px 6px 0 rgba(187, 150, 91, 0.3)',
    lg: '0 10px 15px -3px rgba(187, 150, 91, 0.4)',
  },
} as const

// ============================================================================
// SEMANTIC SHADOWS
// ============================================================================

/**
 * Semantic shadows for interactive states and feedback
 */
export const semanticShadow = {
  /**
   * Focus shadow - Accessibility ring
   * Used for: Keyboard focus indicators
   */
  focus: {
    primary: '0 0 0 3px rgba(0, 16, 158, 0.3)', // Deep blue
    accent: '0 0 0 3px rgba(53, 191, 173, 0.3)', // Turquoise
    error: '0 0 0 3px rgba(239, 68, 68, 0.3)', // Red
    success: '0 0 0 3px rgba(16, 185, 129, 0.3)', // Green
  },

  /**
   * Glow effect - Highlight important elements
   * Used for: Active states, emphasized content
   */
  glow: {
    primary: '0 0 20px rgba(0, 16, 158, 0.5)',
    accent: '0 0 20px rgba(53, 191, 173, 0.5)',
    success: '0 0 20px rgba(16, 185, 129, 0.5)',
    error: '0 0 20px rgba(239, 68, 68, 0.5)',
  },

  /**
   * Outline shadow - Soft border alternative
   * Used for: Inputs, containers
   */
  outline: '0 0 0 1px rgba(45, 46, 48, 0.1)',
  outlineHover: '0 0 0 1px rgba(45, 46, 48, 0.2)',
  outlineFocus: '0 0 0 2px rgba(45, 46, 48, 0.3)',
} as const

// ============================================================================
// ELEVATION SYSTEM
// ============================================================================

/**
 * Semantic elevation system
 * Maps UI hierarchy to shadow levels
 *
 * Usage Guide:
 * - level0: Flat, no shadow (default state)
 * - level1: Slight elevation (cards at rest)
 * - level2: Moderate elevation (hover states, dropdowns)
 * - level3: High elevation (modals, dialogs)
 * - level4: Maximum elevation (critical UI)
 */
export const elevation = {
  level0: boxShadow.none, // Flat
  level1: boxShadow.sm, // Slight elevation
  level2: boxShadow.md, // Moderate elevation
  level3: boxShadow.lg, // High elevation
  level4: boxShadow.xl, // Maximum elevation
} as const

// ============================================================================
// EXPORTS
// ============================================================================

/**
 * All shadow tokens exported as a single object
 */
export const shadows = {
  boxShadow,
  dropShadow,
  glassShadow,
  coloredShadow,
  semanticShadow,
  elevation,
} as const

export default shadows
