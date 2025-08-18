'use client'
import { useState, useEffect, ReactNode } from 'react'

/**
 * Hook para manejar problemas de hidratación
 * Previene errores de hidratación esperando a que el componente se monte en el cliente
 */
export function useHydration() {
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  return isHydrated
}

/**
 * Hook combinado para productos con estado de carga y hydratación
 */
export function useProductsWithHydration() {
  const isHydrated = useHydration()
  const [isInitialLoad, setIsInitialLoad] = useState(true)

  useEffect(() => {
    if (isHydrated) {
      // Pequeño delay para evitar flashes
      const timer = setTimeout(() => {
        setIsInitialLoad(false)
      }, 100)
      
      return () => clearTimeout(timer)
    }
  }, [isHydrated])

  return {
    isHydrated,
    isInitialLoad: isInitialLoad || !isHydrated,
    showSkeleton: !isHydrated || isInitialLoad
  }
}

/**
 * Hook para detectar si estamos en el cliente
 */
export function useIsClient() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return isClient
}

/**
 * Tipos para el componente ClientOnly
 */
interface ClientOnlyProps {
  children: ReactNode
  fallback?: ReactNode
}

/**
 * Wrapper component para prevenir hidratación
 */
export function ClientOnly({ children, fallback = null }: ClientOnlyProps) {
  const isHydrated = useHydration()
  
  if (!isHydrated) {
    return fallback as React.ReactElement
  }
  
  return children as React.ReactElement
}