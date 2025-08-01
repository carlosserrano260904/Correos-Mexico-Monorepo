import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Configuración para monorepo
  transpilePackages: [],
  
  // Para desarrollo en monorepo - permite archivos externos
  experimental: {
    externalDir: true,
  },
  
  // Configuración de Webpack para hot reload en monorepo
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