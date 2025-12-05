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
    optimizePackageImports: ['lucide-react', '@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
  },
  // Ignorar pastas de design/storybook e outros projetos durante o build
  webpack: (config, { isServer }) => {
    config.module.rules.push({
      test: /\.(ts|tsx)$/,
      exclude: [
        /node_modules/,
        /Design\//, // Ignorar pasta Design (Storybook)
        /meu-projeto-admin\//, // Ignorar pasta meu-projeto-admin (projeto Vite separado)
        /supabase\/functions\//, // Ignorar Edge Functions do Supabase
        /\.stories\.(ts|tsx)$/, // Ignorar arquivos .stories
      ],
    })
    return config
  },
}

module.exports = nextConfig

