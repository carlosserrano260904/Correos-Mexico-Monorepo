// src/hooks/useFavoritesWithBackend.ts
'use client';

import { useEffect } from 'react';
import { useFavoritesStore } from '@/stores/useFavoritesStore';
import type { ProductosProps } from '@/types/index';

/**
 * Hook that provides favorites functionality with automatic backend synchronization
 * Usage:
 * 
 * const favorites = useFavoritesWithBackend(currentProfileId);
 * 
 * // Add to favorites (syncs with backend)
 * await favorites.addToFavorites(product);
 * 
 * // Remove from favorites (syncs with backend)  
 * await favorites.removeFromFavorites(favoriteId, productId);
 * 
 * // Add to cart from favorites (syncs with backend)
 * await favorites.addToCartFromFavorites(productId);
 * 
 * // Access favorites state
 * console.log(favorites.favorites, favorites.loading, favorites.error);
 */
export const useFavoritesWithBackend = (profileId: number | null) => {
  const {
    // State
    favorites,
    loading,
    error,
    currentProfileId,
    
    // Backend sync methods
    loadFavorites,
    syncAddToFavorites,
    syncRemoveFromFavorites,
    syncAddToCartFromFavorites,
    
    // Local methods (for fallback)
    addToFavorites: localAddToFavorites,
    removeFromFavorites: localRemoveFromFavorites,
    clearFavorites,
    
    // Read methods
    getFavorites,
    isFavorite,
    getFavorite,
    getTotalFavorites,
    
    // State management
    setLoading,
    setError,
    setCurrentProfileId,
  } = useFavoritesStore();

  // Load favorites when profileId changes
  useEffect(() => {
    if (profileId && profileId !== currentProfileId) {
      console.log(`❤️ Profile changed to ${profileId}, loading favorites...`);
      loadFavorites(profileId);
    }
  }, [profileId, currentProfileId, loadFavorites]);

  // Main API methods with backend sync
  const addToFavorites = async (product: ProductosProps) => {
    if (!profileId) {
      console.error('❌ No profileId provided for adding to favorites');
      throw new Error('Usuario no autenticado');
    }

    try {
      await syncAddToFavorites(product, profileId);
    } catch (error) {
      // If backend fails, try local fallback
      console.warn('⚠️ Backend sync failed, using local storage fallback');
      localAddToFavorites(product);
      throw error; // Still throw the original error
    }
  };

  const removeFromFavorites = async (productId: number) => {
    if (!profileId) {
      console.error('❌ No profileId provided for removing from favorites');
      throw new Error('Usuario no autenticado');
    }

    // Find favorite to get favoriteId
    const favorite = getFavorite(productId);
    if (!favorite || !('FavoriteId' in favorite)) {
      console.error('❌ No se encontró el favoriteId para el producto');
      throw new Error('Favorito no encontrado');
    }

    try {
      await syncRemoveFromFavorites((favorite as any).FavoriteId, productId);
    } catch (error) {
      // If backend fails, try local fallback
      console.warn('⚠️ Backend sync failed, using local storage fallback');
      localRemoveFromFavorites(productId);
      throw error; // Still throw the original error
    }
  };

  const addToCartFromFavorites = async (productId: number) => {
    if (!profileId) {
      console.error('❌ No profileId provided for adding to cart from favorites');
      throw new Error('Usuario no autenticado');
    }

    try {
      await syncAddToCartFromFavorites(productId, profileId);
    } catch (error) {
      console.error('❌ Error adding to cart from favorites:', error);
      throw error;
    }
  };

  const toggleFavorite = async (product: ProductosProps) => {
    if (isFavorite(product.ProductID)) {
      await removeFromFavorites(product.ProductID);
    } else {
      await addToFavorites(product);
    }
  };

  // Return the API
  return {
    // State
    favorites,
    loading,
    error,
    currentProfileId,
    
    // Main methods (with backend sync)
    addToFavorites,
    removeFromFavorites,
    addToCartFromFavorites,
    toggleFavorite,
    
    // Utility methods
    clearFavorites,
    getFavorites,
    isFavorite,
    getFavorite,
    getTotalFavorites,
    
    // Manual control (if needed)
    loadFavorites: profileId ? () => loadFavorites(profileId) : undefined,
    setError,
    
    // Local fallback methods (for emergency use)
    localAddToFavorites,
    localRemoveFromFavorites,
  };
};

/**
 * Hook para usar favoritos sin backend (solo localStorage)
 * Útil para usuarios no autenticados o como fallback
 */
export const useFavoritesLocal = () => {
  const {
    favorites,
    addToFavorites,
    removeFromFavorites,
    clearFavorites,
    getFavorites,
    isFavorite,
    getFavorite,
    getTotalFavorites,
  } = useFavoritesStore();

  const toggleFavorite = (product: ProductosProps) => {
    if (isFavorite(product.ProductID)) {
      removeFromFavorites(product.ProductID);
    } else {
      addToFavorites(product);
    }
  };

  return {
    favorites,
    addToFavorites,
    removeFromFavorites,
    clearFavorites,
    getFavorites,
    isFavorite,
    getFavorite,
    getTotalFavorites,
    toggleFavorite,
    loading: false, // Local storage is always "instant"
    error: null,
  };
};