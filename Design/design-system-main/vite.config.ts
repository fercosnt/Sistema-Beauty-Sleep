import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
      include: ['src/**/*'],
      exclude: ['src/**/*.stories.tsx', 'src/**/*.test.tsx'],
    }),
  ],
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        tokens: resolve(__dirname, 'src/tokens/index.ts'),
        components: resolve(__dirname, 'src/components/index.ts'),
        templates: resolve(__dirname, 'src/templates/index.ts'),
        assets: resolve(__dirname, 'src/assets/index.ts'),
      },
      formats: ['es', 'cjs'],
      fileName: (format, entryName) => {
        const ext = format === 'es' ? 'js' : 'cjs'
        return entryName === 'index'
          ? `index.${ext}`
          : `${entryName}/index.${ext}`
      },
    },
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        'tailwindcss',
      ],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'jsx',
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') {
            return 'styles/globals.css'
          }
          return assetInfo.name || 'assets/[name].[ext]'
        },
      },
    },
    sourcemap: true,
    minify: 'esbuild',
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@/tokens': resolve(__dirname, './src/tokens'),
      '@/components': resolve(__dirname, './src/components'),
      '@/templates': resolve(__dirname, './src/templates'),
      '@/assets': resolve(__dirname, './src/assets'),
      '@/styles': resolve(__dirname, './src/styles'),
      '@/utils': resolve(__dirname, './src/utils'),
    },
  },
})
