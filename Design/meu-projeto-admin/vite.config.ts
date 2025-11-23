import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// @ts-expect-error - Node.js modules are available in Vite config runtime
import { resolve, dirname } from 'path'
// @ts-expect-error - Node.js modules are available in Vite config runtime
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const designSystemPath = resolve(__dirname, '../design-system/src')
const projectSrcPath = resolve(__dirname, './src')

// Plugin para resolver aliases @/ do design-system corretamente
const resolveDesignSystemAliases = () => {
  return {
    name: 'resolve-design-system-aliases',
    resolveId(id: string, importer?: string) {
      // Se o import usa @/ e o importer está dentro do design-system
      if (id.startsWith('@/') && importer?.includes('design-system')) {
        const resolvedPath = resolve(designSystemPath, id.replace(/^@\//, ''))
        return resolvedPath
      }
      return null
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), resolveDesignSystemAliases()],
  server: {
    port: 3002,
  },
  resolve: {
    alias: {
      // Alias do projeto
      '@': projectSrcPath,
      // Alias do design-system
      '@beautysmile/design-system': designSystemPath,
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
