import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Configuración para monorepo
  transpilePackages: [],
  
  
  // Deshabilitar ESLint durante el build para deploy rápido
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Deshabilitar TypeScript type checking durante el build
  typescript: {
    ignoreBuildErrors: true,
  },
  
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
    
    // Configuración para resolver problemas de React Context en SSR
    if (isServer) {
      config.externals = config.externals || []
      config.externals.push({
        'react': 'react',
        'react-dom': 'react-dom'
      })
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