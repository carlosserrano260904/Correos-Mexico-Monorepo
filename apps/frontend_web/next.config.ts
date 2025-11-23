import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Configuración para monorepo
  transpilePackages: [],
  
  // Para desarrollo en monorepo - permite archivos externos
  experimental: {
    externalDir: true,
  },
  
  images: {
    domains: [
      'correos-de-mexico.s3.us-east-2.amazonaws.com',
      'via.placeholder.com',
      'localhost',
      '192.168.1.98'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'correos-de-mexico.s3.us-east-2.amazonaws.com',
        port: '',
        pathname: '/images/**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '192.168.1.98',
        port: '',
        pathname: '/**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
  },
  
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      // Mejora el hot reload en monorepos
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
        ignored: /node_modules/,
      }
    }
    return config
  },
  
  // Configuración del servidor de desarrollo
  // devIndicators: {
  //   buildActivity: true,
  // },
  
  // Si necesitas transpilar paquetes específicos del monorepo
  // transpilePackages: ['@your-monorepo/shared-lib'],
}

export default nextConfig