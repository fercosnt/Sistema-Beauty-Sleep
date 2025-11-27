import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Admin theme - Deep Blue
        primary: {
          DEFAULT: '#0A2463',
          50: '#E6EBF5',
          100: '#CCD7EB',
          200: '#99AFD7',
          300: '#6687C3',
          400: '#335FAF',
          500: '#0A2463',
          600: '#081D50',
          700: '#06163C',
          800: '#040E28',
          900: '#020714',
        },
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
