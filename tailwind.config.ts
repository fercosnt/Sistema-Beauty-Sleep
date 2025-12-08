import type { Config } from "tailwindcss";
// Importar tokens do Design System
import { colors } from "./Design novo/src/tokens/colors";
import { typography } from "./Design novo/src/tokens/typography";
import { spacingTokens } from "./Design novo/src/tokens/spacing";
import { shadows } from "./Design novo/src/tokens/shadows";
import { animations } from "./Design novo/src/tokens/animations";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    // Incluir componentes do Design System
    "./Design novo/src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // ======================================================================
      // COLORS - Design System Tokens
      // ======================================================================
      colors: {
        // Design System Brand Colors (sobrescrevem as cores antigas)
        primary: {
          DEFAULT: colors.primary.DEFAULT, // #00109E
          hover: colors.primary.hover,
          active: colors.primary.active,
          // Manter escala antiga para compatibilidade (será migrada gradualmente)
          50: '#f0f1f8',
          100: '#e1e3f1',
          200: '#c3c7e3',
          300: '#a5abd5',
          400: '#878fc7',
          500: '#5D64BB',
          600: colors.primary.DEFAULT, // Usar primary DEFAULT como 600
          700: '#5A60B5',
          800: '#272C62',
          900: '#12142B',
        },
        secondary: {
          DEFAULT: colors.secondary.DEFAULT, // #BB965B (Gold)
          hover: colors.secondary.hover,
          active: colors.secondary.active,
          // Escala baseada na cor Gold do Design System
          50: '#fef9f3',
          100: '#fdf2e7',
          200: '#fae5cf',
          300: '#f6d1b7',
          400: '#f0b88f',
          500: colors.secondary.DEFAULT, // #BB965B
          600: '#a68350',
          700: '#917045',
          800: '#7c5d3a',
          900: '#674a2f',
        },
        accent: {
          DEFAULT: colors.accent.DEFAULT, // #35BFAD
          hover: colors.accent.hover,
          active: colors.accent.active,
        },
        // Neutral colors do Design System
        neutral: colors.neutral,
        // Semantic colors do Design System
        success: {
          DEFAULT: colors.success.DEFAULT,
          700: colors.success[700],
          // Manter escala antiga para compatibilidade
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          800: '#166534',
          900: '#14532d',
        },
        warning: {
          DEFAULT: colors.warning.DEFAULT,
          700: colors.warning[700],
          // Manter escala antiga para compatibilidade
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          800: '#92400e',
          900: '#78350f',
        },
        error: {
          DEFAULT: colors.error.DEFAULT,
          700: colors.error[700],
          // Escala mantida para compatibilidade
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: colors.error.DEFAULT, // #EF4444
          600: '#dc2626',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        info: {
          DEFAULT: colors.info.DEFAULT,
          // Escala baseada em accent (info = accent no Design System)
          // Cores similares a accent mas mantendo compatibilidade
          50: '#f0fdfa', // accent muito claro
          100: '#ccfbf1', // accent claro
          200: '#99f6e4', 
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: colors.info.DEFAULT, // #35BFAD
          700: '#0d9488',
          800: '#0f766e',
          900: '#134e4a',
        },
        // Chart colors
        chart: colors.chart,
        // Admin theme colors
        admin: {
          bg: colors.adminTheme.background,
          sidebar: colors.adminTheme.sidebar,
          sidebarForeground: colors.adminTheme.sidebarForeground,
          sidebarAccent: colors.adminTheme.sidebarAccent,
          sidebarBorder: colors.adminTheme.sidebarBorder,
          sidebarRing: colors.adminTheme.sidebarRing,
        },
        // Glass morphism
        glass: {
          white: colors.glass.background.white,
          'white-hover': colors.glass.background.whiteHover,
          dark: colors.glass.background.dark,
        },
        // Manter cores antigas para compatibilidade (serão migradas)
        danger: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
        'lp-dark': {
          DEFAULT: '#12142B',
          light: '#1C1F46',
          medium: '#242859',
        },
        'lp-blue': {
          DEFAULT: '#262A5D',
          light: '#5D64BB',
        },
      },
      // ======================================================================
      // TYPOGRAPHY - Design System Tokens
      // ======================================================================
      fontFamily: {
        // Design System fonts (prioridade)
        sans: typography.fontFamily.sans.split(', '),
        heading: typography.fontFamily.heading.split(', '),
        mono: typography.fontFamily.mono.split(', '),
        // Manter fontes antigas para compatibilidade
        helvetica: ['Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
        'helvetica-rounded': ['Helvetica Rounded Bold', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
        'helvetica-compressed': ['Helvetica Compressed', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
      },
      fontSize: {
        xs: [...typography.fontSize.xs] as [string, { lineHeight: string }],
        sm: [...typography.fontSize.sm] as [string, { lineHeight: string }],
        base: [...typography.fontSize.base] as [string, { lineHeight: string }],
        lg: [...typography.fontSize.lg] as [string, { lineHeight: string }],
        xl: [...typography.fontSize.xl] as [string, { lineHeight: string }],
        '2xl': [...typography.fontSize['2xl']] as [string, { lineHeight: string }],
        '3xl': [...typography.fontSize['3xl']] as [string, { lineHeight: string }],
        '4xl': [...typography.fontSize['4xl']] as [string, { lineHeight: string }],
        '5xl': [...typography.fontSize['5xl']] as [string, { lineHeight: string }],
        '6xl': [...typography.fontSize['6xl']] as [string, { lineHeight: string }],
        '7xl': [...typography.fontSize['7xl']] as [string, { lineHeight: string }],
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
      // SPACING - Design System Tokens
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
      // SHADOWS - Design System Tokens
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
      // BREAKPOINTS
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
      // ======================================================================
      // ANIMATIONS - Design System Tokens
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
    },
  },
  plugins: [],
};
export default config;

