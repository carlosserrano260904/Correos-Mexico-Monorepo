import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Configuración para monorepo
  transpilePackages: [],
  
  // Para desarrollo en monorepo - permite archivos externos
  experimental: {
    externalDir: true,
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'correos-de-mexico.s3.us-east-2.amazonaws.com',
        pathname: '/images/**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '192.168.1.98',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'correos-storage.emmanuelbayona.dev',
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
  
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  }
}

export default nextConfig
