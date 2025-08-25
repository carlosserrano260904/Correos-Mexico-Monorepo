'use client'
import { useFavoritesWithBackend, useFavoritesLocal } from './useFavoritesWithBackend'
import { useAuth } from './useAuth'

/**
 * Hook principal para usar favoritos
 * Automáticamente usa backend sync si el usuario está autenticado
 * o fallback a localStorage si no está autenticado
 */
export const useFavorites = () => {
  const auth = useAuth();
  
  // Get profile ID from auth - try multiple sources
  const profileId = auth.isAuthenticated ? (
    auth.user?.profile?.id || // First try user.profile.id
    auth.profile?.id ||       // Then try profile.id directly
    auth.getUserId?.()        // Finally try getUserId helper
  ) : null;
  
  // Debug logging
  console.log('🔍 useFavorites Debug:', {
    isAuthenticated: auth.isAuthenticated,
    user: auth.user,
    profile: auth.profile,
    finalProfileId: profileId,
    userProfileId: auth.user?.profile?.id,
    profileDirectId: auth.profile?.id,
    getUserId: auth.getUserId?.(),
  });
  
  // Use backend-enabled hook if authenticated, otherwise use local-only
  const backendFavorites = useFavoritesWithBackend(profileId);
  const localFavorites = useFavoritesLocal();
  
  // Choose which hook to use based on authentication status
  const activeFavorites = auth.isAuthenticated ? backendFavorites : localFavorites;
  
  return {
    // State (using old naming for backward compatibility)
    Favorites: activeFavorites.favorites,
    
    // Insert
    addToFavorites: activeFavorites.addToFavorites,
    
    // Delete
    removeFromFavorites: activeFavorites.removeFromFavorites,
    clearFavorites: activeFavorites.clearFavorites,
    
    // Read
    getFavorites: activeFavorites.getFavorites,
    isFavorite: activeFavorites.isFavorite,
    getFavorite: activeFavorites.getFavorite,
    getTotalFavorites: activeFavorites.getTotalFavorites,
    
    // Additional methods from new implementation
    toggleFavorite: activeFavorites.toggleFavorite,
    addToCartFromFavorites: 'addToCartFromFavorites' in activeFavorites ? activeFavorites.addToCartFromFavorites : undefined,
    
    // State info
    loading: activeFavorites.loading,
    error: activeFavorites.error,
    isAuthenticated: auth.isAuthenticated,
    profileId,
  }
}