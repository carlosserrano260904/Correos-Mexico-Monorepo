import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  output: 'standalone',
  
  transpilePackages: [],
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
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
        ignored: /node_modules/,
      }
    }
    return config
  },
}

export default nextConfig