import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Public theme - Turquoise
        accent: {
          DEFAULT: '#00A8CC',
          50: '#E6F7FB',
          100: '#CCEFF7',
          200: '#99DFEF',
          300: '#66CFE7',
          400: '#33BFDF',
          500: '#00A8CC',
          600: '#0087A3',
          700: '#00667A',
          800: '#004452',
          900: '#002329',
        },
      },
    },
  },
  plugins: [],
} satisfies Config
