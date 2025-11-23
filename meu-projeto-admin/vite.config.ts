import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3002,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@beautysmile/design-system': path.resolve(__dirname, '../design-system/src'),
      '@beautysmile/design-system/styles/globals.css': path.resolve(__dirname, '../design-system/src/styles/globals.css'),
      // Aliases do design-system
      '@/tokens': path.resolve(__dirname, '../design-system/src/tokens'),
      '@/components': path.resolve(__dirname, '../design-system/src/components'),
      '@/templates': path.resolve(__dirname, '../design-system/src/templates'),
      '@/assets': path.resolve(__dirname, '../design-system/src/assets'),
      '@/styles': path.resolve(__dirname, '../design-system/src/styles'),
      '@/utils': path.resolve(__dirname, '../design-system/src/utils'),
    },
  },
  optimizeDeps: {
    include: [
      '@beautysmile/design-system',
      'clsx',
      'class-variance-authority',
      'tailwind-merge',
      '@radix-ui/react-slot',
      '@radix-ui/react-label',
      '@radix-ui/react-dialog',
      '@radix-ui/react-checkbox',
      'lucide-react',
    ],
  },
})
