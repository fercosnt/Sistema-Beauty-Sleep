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
    // NOTA: Aliases @beautysmile/* removidos para evitar problemas com espaços no nome da pasta "Design novo"
    // no ambiente Linux do Vercel. Se necessário no futuro, renomear pasta para "Design-novo" ou "DesignNovo"
    const path = require('path')
    
    // Manter apenas aliases @/ que apontam para a raiz do projeto (já configurados no tsconfig.json)
    config.resolve.alias = {
      ...config.resolve.alias,
      // Aliases @beautysmile/* comentados - não estão sendo usados no código principal
      // '@beautysmile/design-system': path.resolve(__dirname, './Design novo/src/index.ts'),
      // '@beautysmile/components': path.resolve(__dirname, './Design novo/src/components/index.ts'),
      // '@beautysmile/tokens': path.resolve(__dirname, './Design novo/src/tokens/index.ts'),
      // '@beautysmile/utils': path.resolve(__dirname, './Design novo/src/utils'),
      // '@beautysmile/templates': path.resolve(__dirname, './Design novo/src/templates'),
      // '@/utils': path.resolve(__dirname, './Design novo/src/utils'),
      // '@/components': path.resolve(__dirname, './Design novo/src/components'),
      // '@/templates': path.resolve(__dirname, './Design novo/src/templates'),
      // '@/assets': path.resolve(__dirname, './Design novo/src/assets'),
    }

    // Ignorar pastas que não devem ser processadas no build
    // NOTA: "Design novo" removido do processamento para evitar problemas com espaços no nome no Vercel
    config.module.rules.push({
      test: /\.(ts|tsx)$/,
      exclude: [
        /node_modules/,
        /Design\//, // Ignorar pasta Design antiga (Storybook)
        /Design novo\//, // Ignorar pasta Design novo (projeto separado, não usado no build principal)
        /meu-projeto-admin\//, // Ignorar pasta meu-projeto-admin (projeto Vite separado)
        /supabase\/functions\//, // Ignorar Edge Functions do Supabase
        /\.stories\.(ts|tsx)$/, // Ignorar arquivos .stories
      ],
    })
    return config
  },
}

module.exports = nextConfig

