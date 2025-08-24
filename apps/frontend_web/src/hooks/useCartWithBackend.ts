// src/hooks/useCartWithBackend.ts
'use client';

import { useEffect } from 'react';
import { useCartStore } from '@/stores/useCartStore';
import type { FrontendProduct } from '@/schemas/products';

/**
 * Hook that provides cart functionality with automatic backend synchronization
 * Usage:
 * 
 * const cart = useCartWithBackend(currentProfileId);
 * 
 * // Add to cart (syncs with backend)
 * await cart.addToCart(product, quantity);
 * 
 * // Update quantity (syncs with backend)  
 * await cart.updateQuantity(productId, newQuantity);
 * 
 * // Remove from cart (syncs with backend)
 * await cart.removeFromCart(productId);
 * 
 * // Access cart state
 * console.log(cart.items, cart.loading, cart.error);
 */
export const useCartWithBackend = (profileId: number | null) => {
  const {
    // State
    cartItems,
    loading,
    error,
    currentProfileId,
    
    // Backend sync methods
    loadCart,
    syncAddToCart,
    syncUpdateQuantity, 
    syncRemoveFromCart,
    
    // Local methods (for fallback)
    addToCart: localAddToCart,
    updateQuantity: localUpdateQuantity,
    removeFromCart: localRemoveFromCart,
    
    // Other methods
    getSelectedItems,
    getTotalItems,
    getSubtotal,
    getTotal,
    toggleSelection,
    selectAll,
    clearError,
    setShippingCost,
    applyCupon,
    removeCupon,
  } = useCartStore();

  // Load cart when profile changes
  useEffect(() => {
    if (profileId && profileId !== currentProfileId) {
      console.log(`🔄 Profile changed to ${profileId}, loading cart...`);
      loadCart(profileId);
    }
  }, [profileId, currentProfileId, loadCart]);

  // Wrapper functions that handle profileId automatically
  const addToCart = async (product: FrontendProduct, quantity = 1) => {
    if (!profileId) {
      console.warn('⚠️ No profileId provided, using local cart only');
      localAddToCart(product, quantity);
      return;
    }
    
    await syncAddToCart(product, profileId, quantity);
  };

  const updateQuantity = async (productId: number, quantity: number) => {
    if (!profileId) {
      console.warn('⚠️ No profileId provided, using local cart only');
      localUpdateQuantity(productId, quantity);
      return;
    }
    
    await syncUpdateQuantity(productId, quantity);
  };

  const removeFromCart = async (productId: number) => {
    if (!profileId) {
      console.warn('⚠️ No profileId provided, using local cart only');
      localRemoveFromCart(productId);
      return;
    }
    
    await syncRemoveFromCart(productId);
  };

  const refreshCart = async () => {
    if (profileId) {
      await loadCart(profileId);
    }
  };

  return {
    // State
    items: cartItems,
    loading,
    error,
    isReady: !!profileId && profileId === currentProfileId,
    
    // Actions (with backend sync)
    addToCart,
    updateQuantity,
    removeFromCart,
    refreshCart,
    
    // Selection management (local only)
    toggleSelection,
    selectAll,
    getSelectedItems,
    
    // Calculations
    getTotalItems,
    getSubtotal,
    getTotal,
    
    // Shipping & coupons
    setShippingCost,
    applyCupon,
    removeCupon,
    
    // Error handling
    clearError,
    
    // Helper methods
    getCartItem: (productId: number) => cartItems.find(item => item.ProductID === productId),
    hasItem: (productId: number) => cartItems.some(item => item.ProductID === productId),
    isEmpty: () => cartItems.length === 0,
    itemCount: () => cartItems.length,
  };
};

/**
 * Simpler hook for when you just need cart state without backend sync
 */
export const useCartState = () => {
  const {
    cartItems,
    loading,
    error,
    getTotalItems,
    getSubtotal,
    getTotal,
    getSelectedItems,
  } = useCartStore();

  return {
    items: cartItems,
    loading,
    error,
    totalItems: getTotalItems(),
    subtotal: getSubtotal(),
    total: getTotal(),
    selectedItems: getSelectedItems(),
    isEmpty: cartItems.length === 0,
    itemCount: cartItems.length,
  };
};