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
}

module.exports = nextConfig

