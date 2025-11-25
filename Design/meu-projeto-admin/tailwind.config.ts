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
      },
    },
  },
  plugins: [],
} satisfies Config
