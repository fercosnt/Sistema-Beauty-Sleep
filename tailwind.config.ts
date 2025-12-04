import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Usando fontes do sistema - Helvetica nativa (macOS) ou Arial como fallback
        sans: ['Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
        helvetica: ['Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
        // Variantes especializadas usam fontes do sistema com fallback
        'helvetica-rounded': ['Helvetica Rounded Bold', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
        'helvetica-compressed': ['Helvetica Compressed', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
      },
      colors: {
        // Beauty Smile LP Colors - Baseado no CSS da Landing Page
        primary: {
          50: '#f0f1f8',   // Muito claro (gerado)
          100: '#e1e3f1',  // Claro (gerado)
          200: '#c3c7e3',  // Claro médio (gerado)
          300: '#a5abd5',  // Médio claro (gerado)
          400: '#878fc7',  // Médio (gerado)
          500: '#5D64BB',  // Azul médio da LP (botões e gradientes)
          600: '#565CAE',  // Azul médio escuro da LP
          700: '#5A60B5',  // Azul médio alternativo
          800: '#272C62',  // Azul escuro da LP (cards)
          900: '#12142B',  // Azul muito escuro da LP (quase preto)
        },
        // Cores específicas da LP
        'lp-dark': {
          DEFAULT: '#12142B',  // Azul muito escuro
          light: '#1C1F46',     // Azul escuro para textos
          medium: '#242859',    // Azul escuro médio
        },
        'lp-blue': {
          DEFAULT: '#262A5D',  // Azul escuro
          light: '#5D64BB',    // Azul médio
        },
        secondary: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7e22ce',
          800: '#6b21a8',
          900: '#581c87',
        },
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
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
      },
    },
  },
  plugins: [],
};
export default config;

