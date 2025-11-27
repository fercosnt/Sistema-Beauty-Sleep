/**
 * Tailwind CSS Configuration
 * Beauty Smile Design System
 *
 * Extends Tailwind with custom design tokens
 */

import type { Config } from 'tailwindcss'
import { colors } from './src/tokens/colors'
import { typography } from './src/tokens/typography'
import { spacingTokens } from './src/tokens/spacing'
import { shadows } from './src/tokens/shadows'
import { animations } from './src/tokens/animations'

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './examples/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      // ======================================================================
      // COLORS
      // ======================================================================
      colors: {
        primary: colors.primary,
        secondary: colors.secondary,
        accent: colors.accent,
        neutral: colors.neutral,
        success: colors.success,
        warning: colors.warning,
        error: colors.error,
        info: colors.info,
        chart: colors.chart,
        // Semantic color aliases for Tailwind utilities
        brand: {
          primary: colors.primary.DEFAULT,
          secondary: colors.secondary.DEFAULT,
          accent: colors.accent.DEFAULT,
        },
        // Background colors for themes
        admin: {
          bg: colors.adminTheme.background,
          sidebar: colors.adminTheme.sidebar,
        },
        public: {
          primary: colors.publicTheme.primary,
        },
        // Glass morphism
        glass: {
          white: colors.glass.background.white,
          'white-hover': colors.glass.background.whiteHover,
          dark: colors.glass.background.dark,
        },
      },

      // ======================================================================
      // TYPOGRAPHY
      // ======================================================================
      fontFamily: {
        sans: typography.fontFamily.sans.split(', '),
        heading: typography.fontFamily.heading.split(', '),
        mono: typography.fontFamily.mono.split(', '),
      },
      fontSize: {
        xs: typography.fontSize.xs,
        sm: typography.fontSize.sm,
        base: typography.fontSize.base,
        lg: typography.fontSize.lg,
        xl: typography.fontSize.xl,
        '2xl': typography.fontSize['2xl'],
        '3xl': typography.fontSize['3xl'],
        '4xl': typography.fontSize['4xl'],
        '5xl': typography.fontSize['5xl'],
        '6xl': typography.fontSize['6xl'],
        '7xl': typography.fontSize['7xl'],
      },
      fontWeight: {
        thin: typography.fontWeight.thin,
        extralight: typography.fontWeight.extralight,
        light: typography.fontWeight.light,
        normal: typography.fontWeight.normal,
        medium: typography.fontWeight.medium,
        semibold: typography.fontWeight.semibold,
        bold: typography.fontWeight.bold,
        extrabold: typography.fontWeight.extrabold,
        black: typography.fontWeight.black,
      },
      lineHeight: {
        none: typography.lineHeight.none,
        tight: typography.lineHeight.tight,
        snug: typography.lineHeight.snug,
        normal: typography.lineHeight.normal,
        relaxed: typography.lineHeight.relaxed,
        loose: typography.lineHeight.loose,
        3: typography.lineHeight['3'],
        4: typography.lineHeight['4'],
        5: typography.lineHeight['5'],
        6: typography.lineHeight['6'],
        7: typography.lineHeight['7'],
        8: typography.lineHeight['8'],
        9: typography.lineHeight['9'],
        10: typography.lineHeight['10'],
      },
      letterSpacing: {
        tighter: typography.letterSpacing.tighter,
        tight: typography.letterSpacing.tight,
        normal: typography.letterSpacing.normal,
        wide: typography.letterSpacing.wide,
        wider: typography.letterSpacing.wider,
        widest: typography.letterSpacing.widest,
      },

      // ======================================================================
      // SPACING
      // ======================================================================
      spacing: {
        0: spacingTokens.spacing[0],
        1: spacingTokens.spacing[1],
        2: spacingTokens.spacing[2],
        3: spacingTokens.spacing[3],
        4: spacingTokens.spacing[4],
        5: spacingTokens.spacing[5],
        6: spacingTokens.spacing[6],
        7: spacingTokens.spacing[7],
        8: spacingTokens.spacing[8],
        9: spacingTokens.spacing[9],
        10: spacingTokens.spacing[10],
        11: spacingTokens.spacing[11],
        12: spacingTokens.spacing[12],
        13: spacingTokens.spacing[13],
        14: spacingTokens.spacing[14],
        15: spacingTokens.spacing[15],
        16: spacingTokens.spacing[16],
        17: spacingTokens.spacing[17],
        18: spacingTokens.spacing[18],
        19: spacingTokens.spacing[19],
        20: spacingTokens.spacing[20],
        21: spacingTokens.spacing[21],
        22: spacingTokens.spacing[22],
        23: spacingTokens.spacing[23],
        24: spacingTokens.spacing[24],
        25: spacingTokens.spacing[25],
        26: spacingTokens.spacing[26],
        27: spacingTokens.spacing[27],
        28: spacingTokens.spacing[28],
        29: spacingTokens.spacing[29],
        30: spacingTokens.spacing[30],
        31: spacingTokens.spacing[31],
        32: spacingTokens.spacing[32],
      },
      borderRadius: {
        none: spacingTokens.borderRadius.none,
        sm: spacingTokens.borderRadius.sm,
        DEFAULT: spacingTokens.borderRadius.DEFAULT,
        md: spacingTokens.borderRadius.md,
        lg: spacingTokens.borderRadius.lg,
        xl: spacingTokens.borderRadius.xl,
        '2xl': spacingTokens.borderRadius['2xl'],
        '3xl': spacingTokens.borderRadius['3xl'],
        full: spacingTokens.borderRadius.full,
      },
      maxWidth: {
        sm: spacingTokens.containerWidth.sm,
        md: spacingTokens.containerWidth.md,
        lg: spacingTokens.containerWidth.lg,
        xl: spacingTokens.containerWidth.xl,
        '2xl': spacingTokens.containerWidth['2xl'],
        full: spacingTokens.containerWidth.full,
      },
      zIndex: {
        base: String(spacingTokens.zIndex.base),
        dropdown: String(spacingTokens.zIndex.dropdown),
        sticky: String(spacingTokens.zIndex.sticky),
        fixed: String(spacingTokens.zIndex.fixed),
        'modal-backdrop': String(spacingTokens.zIndex.modalBackdrop),
        modal: String(spacingTokens.zIndex.modal),
        popover: String(spacingTokens.zIndex.popover),
        tooltip: String(spacingTokens.zIndex.tooltip),
        notification: String(spacingTokens.zIndex.notification),
        top: String(spacingTokens.zIndex.top),
      },

      // ======================================================================
      // SHADOWS
      // ======================================================================
      boxShadow: {
        sm: shadows.boxShadow.sm,
        DEFAULT: shadows.boxShadow.DEFAULT,
        md: shadows.boxShadow.md,
        lg: shadows.boxShadow.lg,
        xl: shadows.boxShadow.xl,
        '2xl': shadows.boxShadow['2xl'],
        inner: shadows.boxShadow.inner,
        none: shadows.boxShadow.none,
        // Glass shadows
        'glass-sm': shadows.glassShadow.sm,
        glass: shadows.glassShadow.DEFAULT,
        'glass-md': shadows.glassShadow.md,
        'glass-lg': shadows.glassShadow.lg,
        'glass-xl': shadows.glassShadow.xl,
        // Focus rings
        'focus-primary': shadows.semanticShadow.focus.primary,
        'focus-accent': shadows.semanticShadow.focus.accent,
        'focus-error': shadows.semanticShadow.focus.error,
        'focus-success': shadows.semanticShadow.focus.success,
        // Colored shadows
        'primary-sm': shadows.coloredShadow.primary.sm,
        primary: shadows.coloredShadow.primary.DEFAULT,
        'primary-lg': shadows.coloredShadow.primary.lg,
        'accent-sm': shadows.coloredShadow.accent.sm,
        accent: shadows.coloredShadow.accent.DEFAULT,
        'accent-lg': shadows.coloredShadow.accent.lg,
      },
      dropShadow: {
        sm: shadows.dropShadow.sm,
        DEFAULT: shadows.dropShadow.DEFAULT,
        md: shadows.dropShadow.md,
        lg: shadows.dropShadow.lg,
        xl: shadows.dropShadow.xl,
        '2xl': shadows.dropShadow['2xl'],
        none: shadows.dropShadow.none,
      },

      // ======================================================================
      // ANIMATIONS
      // ======================================================================
      keyframes: {
        fadeIn: animations.keyframes.fadeIn,
        fadeOut: animations.keyframes.fadeOut,
        slideInUp: animations.keyframes.slideInUp,
        slideInDown: animations.keyframes.slideInDown,
        slideInLeft: animations.keyframes.slideInLeft,
        slideInRight: animations.keyframes.slideInRight,
        slideOutUp: animations.keyframes.slideOutUp,
        slideOutDown: animations.keyframes.slideOutDown,
        slideOutLeft: animations.keyframes.slideOutLeft,
        slideOutRight: animations.keyframes.slideOutRight,
        scaleIn: animations.keyframes.scaleIn,
        scaleOut: animations.keyframes.scaleOut,
        zoomIn: animations.keyframes.zoomIn,
        zoomOut: animations.keyframes.zoomOut,
        pulse: animations.keyframes.pulse,
        ping: animations.keyframes.ping,
        bounce: animations.keyframes.bounce,
        spin: animations.keyframes.spin,
        shimmer: animations.keyframes.shimmer,
        shake: animations.keyframes.shake,
        wiggle: animations.keyframes.wiggle,
        progress: animations.keyframes.progress,
        accordionDown: animations.keyframes.accordionDown,
        accordionUp: animations.keyframes.accordionUp,
        dialogOverlayShow: animations.keyframes.dialogOverlayShow,
        dialogContentShow: animations.keyframes.dialogContentShow,
        dropdownSlideDown: animations.keyframes.dropdownSlideDown,
        dropdownSlideUp: animations.keyframes.dropdownSlideUp,
      },
      animation: {
        // Fade
        'fade-in': `fadeIn ${animations.duration.normal} ${animations.timingFunction.smooth}`,
        'fade-out': `fadeOut ${animations.duration.normal} ${animations.timingFunction.smooth}`,
        // Slide
        'slide-in-up': `slideInUp ${animations.duration.normal} ${animations.timingFunction.swift}`,
        'slide-in-down': `slideInDown ${animations.duration.normal} ${animations.timingFunction.swift}`,
        'slide-in-left': `slideInLeft ${animations.duration.normal} ${animations.timingFunction.swift}`,
        'slide-in-right': `slideInRight ${animations.duration.normal} ${animations.timingFunction.swift}`,
        'slide-out-up': `slideOutUp ${animations.duration.normal} ${animations.timingFunction.swift}`,
        'slide-out-down': `slideOutDown ${animations.duration.normal} ${animations.timingFunction.swift}`,
        'slide-out-left': `slideOutLeft ${animations.duration.normal} ${animations.timingFunction.swift}`,
        'slide-out-right': `slideOutRight ${animations.duration.normal} ${animations.timingFunction.swift}`,
        // Scale
        'scale-in': `scaleIn ${animations.duration.normal} ${animations.timingFunction.spring}`,
        'scale-out': `scaleOut ${animations.duration.normal} ${animations.timingFunction.smooth}`,
        'zoom-in': `zoomIn ${animations.duration.normal} ${animations.timingFunction.smooth}`,
        'zoom-out': `zoomOut ${animations.duration.normal} ${animations.timingFunction.smooth}`,
        // Loading
        spin: `spin ${animations.duration.slowest} ${animations.timingFunction.linear} infinite`,
        pulse: `pulse ${animations.duration.slower} ${animations.timingFunction.smooth} infinite`,
        ping: `ping 1s ${animations.timingFunction.smooth} infinite`,
        bounce: `bounce 1s ${animations.timingFunction.smooth} infinite`,
        shimmer: `shimmer 2s ${animations.timingFunction.linear} infinite`,
        // Feedback
        shake: `shake ${animations.duration.slower} ${animations.timingFunction.smooth}`,
        wiggle: `wiggle ${animations.duration.slower} ${animations.timingFunction.smooth}`,
        // Progress
        progress: `progress 1s ${animations.timingFunction.linear} infinite`,
        // Accordion
        'accordion-down': `accordionDown ${animations.duration.slow} ${animations.timingFunction.smooth}`,
        'accordion-up': `accordionUp ${animations.duration.slow} ${animations.timingFunction.smooth}`,
        // Dialog
        'dialog-overlay-show': `dialogOverlayShow ${animations.duration.normal} ${animations.timingFunction.smooth}`,
        'dialog-content-show': `dialogContentShow ${animations.duration.normal} ${animations.timingFunction.smooth}`,
        // Dropdown
        'dropdown-slide-down': `dropdownSlideDown ${animations.duration.normal} ${animations.timingFunction.swift}`,
        'dropdown-slide-up': `dropdownSlideUp ${animations.duration.normal} ${animations.timingFunction.swift}`,
      },
      transitionDuration: {
        fastest: animations.duration.fastest,
        fast: animations.duration.fast,
        normal: animations.duration.normal,
        slow: animations.duration.slow,
        slower: animations.duration.slower,
        slowest: animations.duration.slowest,
      },
      transitionTimingFunction: {
        spring: animations.timingFunction.spring,
        smooth: animations.timingFunction.smooth,
        swift: animations.timingFunction.swift,
        snappy: animations.timingFunction.snappy,
        bounce: animations.timingFunction.bounce,
      },

      // ======================================================================
      // BREAKPOINTS (Screens)
      // ======================================================================
      screens: {
        xs: spacingTokens.breakpoints.xs,
        sm: spacingTokens.breakpoints.sm,
        md: spacingTokens.breakpoints.md,
        lg: spacingTokens.breakpoints.lg,
        xl: spacingTokens.breakpoints.xl,
        '2xl': spacingTokens.breakpoints['2xl'],
      },

      // ======================================================================
      // BACKDROP BLUR (for Glass Morphism)
      // ======================================================================
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        DEFAULT: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
        '2xl': '40px',
        '3xl': '64px',
      },
    },
  },
  plugins: [
    // Add any Tailwind plugins here
    // Example: require('@tailwindcss/forms'),
  ],
}

export default config
