/**
 * Storybook Theme Configuration
 * Beauty Smile Design System
 *
 * Custom branding and theming for Storybook UI
 */

import { create } from '@storybook/theming/create'

export default create({
  base: 'light',

  // Brand
  brandTitle: 'Beauty Smile Design System',
  brandUrl: 'https://beautysmile.com',
  brandImage: undefined, // Add logo URL here if available
  brandTarget: '_self',

  // Colors
  colorPrimary: '#00109E', // Deep Blue (primary brand color)
  colorSecondary: '#35BFAD', // Turquoise (accent color)

  // UI
  appBg: '#F8F9F9', // neutral-50
  appContentBg: '#FFFFFF',
  appPreviewBg: '#FFFFFF',
  appBorderColor: '#D6D7D5', // neutral-300
  appBorderRadius: 8,

  // Typography
  fontBase:
    'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  fontCode: '"JetBrains Mono", Menlo, Monaco, "Courier New", monospace',

  // Text colors
  textColor: '#2D2E30', // neutral-900
  textInverseColor: '#FFFFFF',
  textMutedColor: '#6B6D70', // neutral-700

  // Toolbar default and active colors
  barTextColor: '#6B6D70', // neutral-700
  barSelectedColor: '#35BFAD', // Turquoise accent
  barHoverColor: '#00109E', // Primary blue
  barBg: '#FFFFFF',

  // Form colors
  inputBg: '#FFFFFF',
  inputBorder: '#D6D7D5', // neutral-300
  inputTextColor: '#2D2E30', // neutral-900
  inputBorderRadius: 8,

  // Buttons
  buttonBg: '#00109E', // Primary blue
  buttonBorder: '#00109E',
  booleanBg: '#E8E9E8', // neutral-200
  booleanSelectedBg: '#35BFAD', // Turquoise accent
})
