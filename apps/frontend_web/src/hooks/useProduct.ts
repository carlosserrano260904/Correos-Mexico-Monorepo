'use client'
import { useProductsStore } from '../stores/useProductStore'

export const useProducts = () => {
  const store = useProductsStore()
  
  return {
    Products: store.products,
    addProducts: store.addProducts,
    addProduct: store.addProduct,
    updateProduct: store.updateProduct,
    deleteProduct: store.deleteProduct,
    getProducts: store.getProducts,
    getProduct: store.getProduct,
    getProductsByCategory: store.getProductsByCategory,
    selectProduct: store.selectProduct,
    selectedProduct: store.selectedProduct,
    
    hasSelectedProduct: () => store.selectedProduct !== null,
    getSelectedProductId: () => store.selectedProduct?.ProductID || null,
  }
}