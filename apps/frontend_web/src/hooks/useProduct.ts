'use client'
import { useProductsStore } from '../stores/useProductStore'
import { useEffect, useMemo } from 'react'
import { useHydration } from './useHydratyon'
import type { FrontendProduct } from '@/schemas/products'

export const useProducts = () => {
  const store = useProductsStore()
  const isHydrated = useHydration()

  useEffect(() => {
    if (store.products.length === 0 && !store.loading) {
      store.loadProducts()
    }
  }, [store.products.length, store.loading, store.loadProducts])

  const getProductsByCategory = useMemo(() => {
    return (category: string): FrontendProduct[] => {
      if (!category) return store.products
      
      return store.products.filter(product => 
        product.ProductCategory?.toLowerCase() === category.toLowerCase()
      )
    }
  }, [store.products])

  const getFeaturedProducts = useMemo(() => {
    return (limit?: number): FrontendProduct[] => {
      const featuredProducts = store.products.filter(product => 
        product.ProductStatus === true && product.ProductStock > 0
      )
      
      return limit ? featuredProducts.slice(0, limit) : featuredProducts
    }
  }, [store.products])

  const getAvailableCategories = useMemo(() => {
    return (): string[] => {
      const categories = store.products
        .map(product => product.ProductCategory)
        .filter((category, index, self) => 
          category && self.indexOf(category) === index
        )
      
      return categories as string[]
    }
  }, [store.products])

  const getProductCountByCategory = useMemo(() => {
    return (category: string): number => {
      return store.products.filter(product => 
        product.ProductCategory?.toLowerCase() === category.toLowerCase()
      ).length
    }
  }, [store.products])

  const searchProducts = useMemo(() => {
    return (query: string): FrontendProduct[] => {
      if (!query.trim()) return store.products
      
      const searchTerm = query.toLowerCase()
      return store.products.filter(product =>
        product.ProductName.toLowerCase().includes(searchTerm) ||
        product.ProductDescription.toLowerCase().includes(searchTerm) ||
        product.ProductCategory?.toLowerCase().includes(searchTerm)
      )
    }
  }, [store.products])

  const getProductsByPriceRange = useMemo(() => {
    return (minPrice: number, maxPrice: number): FrontendProduct[] => {
      return store.products.filter(product =>
        product.productPrice >= minPrice && product.productPrice <= maxPrice
      )
    }
  }, [store.products])

  const getAvailableProducts = useMemo(() => {
    return (): FrontendProduct[] => {
      return store.products.filter(product =>
        product.ProductStatus === true && product.ProductStock > 0
      )
    }
  }, [store.products])

  return {
    // ===== STATE =====
    Products: store.products,
    selectedProduct: store.selectedProduct,
    loading: store.loading,
    error: store.error,
    isHydrated,

    // ===== API ACTIONS =====
    loadProducts: store.loadProducts,
    loadProduct: store.loadProduct,
    addProduct: store.addProduct,
    updateProduct: store.updateProduct,
    deleteProduct: store.deleteProduct,

    // ===== LOCAL ACTIONS =====
    selectProduct: store.selectProduct,

    // ===== READ OPERATIONS (compatibilidad) =====
    getProducts: store.getProducts,
    getProduct: store.getProduct,
    hasSelectedProduct: store.hasSelectedProduct,

    // ===== FUNCIONES DE FILTRADO RESTAURADAS =====
    getProductsByCategory,
    getFeaturedProducts,
    getAvailableCategories,
    getProductCountByCategory,
    searchProducts,
    getProductsByPriceRange,
    getAvailableProducts,

    // ===== ERROR HANDLING =====
    clearError: store.clearError
  }
}