/**
 * Design Tokens - Animations
 * Beauty Smile Design System
 *
 * Animation keyframes, durations, timing functions, and delays
 * Used for: transitions, micro-interactions, loading states
 */

// ============================================================================
// KEYFRAMES
// ============================================================================

/**
 * Animation keyframes for common UI interactions
 * Each keyframe can be used with CSS animations or React Spring
 */
export const keyframes = {
  /**
   * Fade animations - Opacity transitions
   */
  fadeIn: {
    from: { opacity: '0' },
    to: { opacity: '1' },
  },
  fadeOut: {
    from: { opacity: '1' },
    to: { opacity: '0' },
  },

  /**
   * Slide animations - Position transitions
   */
  slideInUp: {
    from: { transform: 'translateY(100%)', opacity: '0' },
    to: { transform: 'translateY(0)', opacity: '1' },
  },
  slideInDown: {
    from: { transform: 'translateY(-100%)', opacity: '0' },
    to: { transform: 'translateY(0)', opacity: '1' },
  },
  slideInLeft: {
    from: { transform: 'translateX(-100%)', opacity: '0' },
    to: { transform: 'translateX(0)', opacity: '1' },
  },
  slideInRight: {
    from: { transform: 'translateX(100%)', opacity: '0' },
    to: { transform: 'translateX(0)', opacity: '1' },
  },
  slideOutUp: {
    from: { transform: 'translateY(0)', opacity: '1' },
    to: { transform: 'translateY(-100%)', opacity: '0' },
  },
  slideOutDown: {
    from: { transform: 'translateY(0)', opacity: '1' },
    to: { transform: 'translateY(100%)', opacity: '0' },
  },
  slideOutLeft: {
    from: { transform: 'translateX(0)', opacity: '1' },
    to: { transform: 'translateX(-100%)', opacity: '0' },
  },
  slideOutRight: {
    from: { transform: 'translateX(0)', opacity: '1' },
    to: { transform: 'translateX(100%)', opacity: '0' },
  },

  /**
   * Scale animations - Size transitions
   */
  scaleIn: {
    from: { transform: 'scale(0.9)', opacity: '0' },
    to: { transform: 'scale(1)', opacity: '1' },
  },
  scaleOut: {
    from: { transform: 'scale(1)', opacity: '1' },
    to: { transform: 'scale(0.9)', opacity: '0' },
  },
  zoomIn: {
    from: { transform: 'scale(0)' },
    to: { transform: 'scale(1)' },
  },
  zoomOut: {
    from: { transform: 'scale(1)' },
    to: { transform: 'scale(0)' },
  },

  /**
   * Pulse animation - Attention grabber
   */
  pulse: {
    '0%, 100%': { opacity: '1' },
    '50%': { opacity: '0.5' },
  },

  /**
   * Ping animation - Notification indicator
   */
  ping: {
    '75%, 100%': {
      transform: 'scale(2)',
      opacity: '0',
    },
  },

  /**
   * Bounce animation - Playful feedback
   */
  bounce: {
    '0%, 100%': {
      transform: 'translateY(-25%)',
      animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)',
    },
    '50%': {
      transform: 'translateY(0)',
      animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)',
    },
  },

  /**
   * Spin animation - Loading indicators
   */
  spin: {
    from: { transform: 'rotate(0deg)' },
    to: { transform: 'rotate(360deg)' },
  },

  /**
   * Shimmer animation - Loading skeleton
   */
  shimmer: {
    '0%': { backgroundPosition: '-1000px 0' },
    '100%': { backgroundPosition: '1000px 0' },
  },

  /**
   * Shake animation - Error feedback
   */
  shake: {
    '0%, 100%': { transform: 'translateX(0)' },
    '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-10px)' },
    '20%, 40%, 60%, 80%': { transform: 'translateX(10px)' },
  },

  /**
   * Wiggle animation - Playful attention
   */
  wiggle: {
    '0%, 100%': { transform: 'rotate(0deg)' },
    '25%': { transform: 'rotate(-5deg)' },
    '75%': { transform: 'rotate(5deg)' },
  },

  /**
   * Progress animation - Linear loading bar
   */
  progress: {
    '0%': { transform: 'translateX(-100%)' },
    '100%': { transform: 'translateX(100%)' },
  },

  /**
   * Accordion animations - Expand/collapse
   */
  accordionDown: {
    from: { height: '0', opacity: '0' },
    to: { height: 'var(--radix-accordion-content-height)', opacity: '1' },
  },
  accordionUp: {
    from: { height: 'var(--radix-accordion-content-height)', opacity: '1' },
    to: { height: '0', opacity: '0' },
  },

  /**
   * Dialog animations - Modal enter/exit
   */
  dialogOverlayShow: {
    from: { opacity: '0' },
    to: { opacity: '1' },
  },
  dialogContentShow: {
    from: { opacity: '0', transform: 'translate(-50%, -48%) scale(0.96)' },
    to: { opacity: '1', transform: 'translate(-50%, -50%) scale(1)' },
  },

  /**
   * Dropdown animations - Menu enter/exit
   */
  dropdownSlideDown: {
    from: { opacity: '0', transform: 'translateY(-10px)' },
    to: { opacity: '1', transform: 'translateY(0)' },
  },
  dropdownSlideUp: {
    from: { opacity: '0', transform: 'translateY(10px)' },
    to: { opacity: '1', transform: 'translateY(0)' },
  },
} as const

// ============================================================================
// ANIMATION DURATIONS
// ============================================================================

/**
 * Standard animation durations
 * Based on Material Design motion principles
 */
export const duration = {
  fastest: '100ms', // Micro-interactions
  fast: '150ms', // Quick transitions
  normal: '200ms', // Standard transitions
  slow: '300ms', // Deliberate transitions
  slower: '400ms', // Emphasized transitions
  slowest: '500ms', // Major state changes
} as const

// ============================================================================
// TIMING FUNCTIONS (Easing)
// ============================================================================

/**
 * Easing functions for natural motion
 * Based on CSS cubic-bezier timing functions
 */
export const timingFunction = {
  // Standard easing
  linear: 'linear',
  ease: 'ease',
  easeIn: 'ease-in',
  easeOut: 'ease-out',
  easeInOut: 'ease-in-out',

  // Custom cubic-bezier curves
  spring: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)', // Bouncy spring
  smooth: 'cubic-bezier(0.4, 0, 0.2, 1)', // Material Design standard
  swift: 'cubic-bezier(0.4, 0, 0.6, 1)', // Material Design deceleration
  snappy: 'cubic-bezier(0, 0, 0.2, 1)', // Material Design acceleration
  bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)', // Bounce effect
} as const

// ============================================================================
// ANIMATION DELAYS
// ============================================================================

/**
 * Stagger delays for sequential animations
 * Used for list items, cards, etc.
 */
export const delay = {
  none: '0ms',
  xs: '50ms',
  sm: '100ms',
  md: '150ms',
  lg: '200ms',
  xl: '300ms',
} as const

// ============================================================================
// TRANSITION PRESETS
// ============================================================================

/**
 * Pre-configured transition combinations
 * Ready-to-use for common scenarios
 */
export const transition = {
  // All properties
  all: `all ${duration.normal} ${timingFunction.smooth}`,
  allFast: `all ${duration.fast} ${timingFunction.smooth}`,
  allSlow: `all ${duration.slow} ${timingFunction.smooth}`,

  // Specific properties
  opacity: `opacity ${duration.normal} ${timingFunction.smooth}`,
  transform: `transform ${duration.normal} ${timingFunction.smooth}`,
  colors: `background-color ${duration.normal} ${timingFunction.smooth}, color ${duration.normal} ${timingFunction.smooth}, border-color ${duration.normal} ${timingFunction.smooth}`,
  shadow: `box-shadow ${duration.normal} ${timingFunction.smooth}`,

  // Interactive states
  button: `background-color ${duration.fast} ${timingFunction.smooth}, transform ${duration.fast} ${timingFunction.spring}`,
  link: `color ${duration.fast} ${timingFunction.smooth}`,
  input: `border-color ${duration.normal} ${timingFunction.smooth}, box-shadow ${duration.normal} ${timingFunction.smooth}`,

  // Layout changes
  collapse: `height ${duration.slow} ${timingFunction.smooth}, opacity ${duration.slow} ${timingFunction.smooth}`,
  expand: `height ${duration.slow} ${timingFunction.smooth}, opacity ${duration.slow} ${timingFunction.smooth}`,
  slide: `transform ${duration.normal} ${timingFunction.swift}`,
} as const

// ============================================================================
// ANIMATION PRESETS
// ============================================================================

/**
 * Complete animation presets combining keyframes, duration, and timing
 * Can be applied directly via CSS className or inline styles
 */
export const animationPresets = {
  // Fade presets
  fadeIn: `fadeIn ${duration.normal} ${timingFunction.smooth}`,
  fadeOut: `fadeOut ${duration.normal} ${timingFunction.smooth}`,

  // Slide presets
  slideInUp: `slideInUp ${duration.normal} ${timingFunction.swift}`,
  slideInDown: `slideInDown ${duration.normal} ${timingFunction.swift}`,
  slideInLeft: `slideInLeft ${duration.normal} ${timingFunction.swift}`,
  slideInRight: `slideInRight ${duration.normal} ${timingFunction.swift}`,

  // Scale presets
  scaleIn: `scaleIn ${duration.normal} ${timingFunction.spring}`,
  scaleOut: `scaleOut ${duration.normal} ${timingFunction.smooth}`,

  // Loading presets
  spin: `spin ${duration.slowest} ${timingFunction.linear} infinite`,
  pulse: `pulse ${duration.slower} ${timingFunction.smooth} infinite`,
  shimmer: `shimmer 2s ${timingFunction.linear} infinite`,

  // Feedback presets
  shake: `shake ${duration.slower} ${timingFunction.smooth}`,
  bounce: `bounce 1s ${timingFunction.smooth} infinite`,
  wiggle: `wiggle ${duration.slower} ${timingFunction.smooth}`,
} as const

// ============================================================================
// REDUCED MOTION
// ============================================================================

/**
 * Accessible animation alternatives for users who prefer reduced motion
 * Apply these when prefers-reduced-motion media query is active
 */
export const reducedMotion = {
  transition: 'none',
  animation: 'none',
  duration: '0ms',
} as const

// ============================================================================
// EXPORTS
// ============================================================================

/**
 * All animation tokens exported as a single object
 */
export const animations = {
  keyframes,
  duration,
  timingFunction,
  delay,
  transition,
  animationPresets,
  reducedMotion,
} as const

export default animations
