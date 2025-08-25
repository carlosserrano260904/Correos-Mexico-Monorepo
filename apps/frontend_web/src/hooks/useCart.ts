'use client'
import { useCartStore } from '../stores/useCartStore'

export const useCart = () => {
  const store = useCartStore()
  
  return {
    // State
    CartItems: store.cartItems,
    AppliedCupons: store.appliedCupons,
    ShippingCost: store.shippingCost,
    Loading: store.loading,
    Error: store.error,
    CurrentProfileId: store.currentProfileId,
    
    // Backend sync operations (preferred for authenticated users)
    loadCart: store.loadCart,
    syncAddToCart: store.syncAddToCart,
    syncUpdateQuantity: store.syncUpdateQuantity,
    syncRemoveFromCart: store.syncRemoveFromCart,
    
    // Local-only operations (fallback/offline use)
    addToCart: store.addToCart,
    addMultipleToCart: store.addMultipleToCart,
    
    // Update
    updateQuantity: store.updateQuantity,
    toggleSelection: store.toggleSelection,
    selectAll: store.selectAll,
    
    // Delete
    removeFromCart: store.removeFromCart,
    clearCart: store.clearCart,
    removeSelected: store.removeSelected,
    
    // Read
    getCartItem: store.getCartItem,
    getSelectedItems: store.getSelectedItems,
    getTotalItems: store.getTotalItems,
    getSubtotal: store.getSubtotal,
    getTotal: store.getTotal,
    
    // Cupons
    applyCupon: store.applyCupon,
    removeCupon: store.removeCupon,
    
    // Shipping
    setShippingCost: store.setShippingCost,
    
    // Error handling
    clearError: store.clearError,
  }
}