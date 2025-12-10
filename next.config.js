/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
  // Otimizações de performance
  swcMinify: true, // Usar SWC para minificação (mais rápido)
  compress: true, // Compressão Gzip/Brotli
  poweredByHeader: false, // Remover header X-Powered-By por segurança
  // Otimizar imports de pacotes grandes
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-slot', '@radix-ui/react-label'],
  },
  // Ignorar pastas de design/storybook e outros projetos durante o build
  webpack: (config, { isServer }) => {
      // Configurar path aliases para Design System
    const path = require('path')
    const designNovoPath = path.resolve(__dirname, './Design novo/src')
    
    config.resolve.alias = {
      ...config.resolve.alias,
      '@beautysmile/design-system': path.resolve(__dirname, './Design novo/src/index.ts'),
      '@beautysmile/components': path.resolve(__dirname, './Design novo/src/components/index.ts'),
      '@beautysmile/tokens': path.resolve(__dirname, './Design novo/src/tokens/index.ts'),
      '@beautysmile/utils': path.resolve(__dirname, './Design novo/src/utils'),
      '@beautysmile/templates': path.resolve(__dirname, './Design novo/src/templates'),
      // Resolver @/ dentro de Design novo para apontar para Design novo/src
      '@/utils': path.resolve(__dirname, './Design novo/src/utils'),
      '@/components': path.resolve(__dirname, './Design novo/src/components'),
      '@/templates': path.resolve(__dirname, './Design novo/src/templates'),
      '@/assets': path.resolve(__dirname, './Design novo/src/assets'),
    }

    // Ignore background images that cause build errors
    config.module.rules.push({
      test: /\.(png|jpg|jpeg|gif)$/,
      include: /Design novo\/src\/assets\/backgrounds/,
      type: 'asset/resource',
      generator: {
        filename: 'static/images/[name][ext]',
      },
    })

    config.module.rules.push({
      test: /\.(ts|tsx)$/,
      exclude: [
        /node_modules/,
        /Design\//, // Ignorar pasta Design antiga (Storybook)
        /meu-projeto-admin\//, // Ignorar pasta meu-projeto-admin (projeto Vite separado)
        /supabase\/functions\//, // Ignorar Edge Functions do Supabase
        /\.stories\.(ts|tsx)$/, // Ignorar arquivos .stories
        // NÃO excluir "Design novo" - precisamos compilar esses arquivos
      ],
    })
    return config
  },
}

module.exports = nextConfig

