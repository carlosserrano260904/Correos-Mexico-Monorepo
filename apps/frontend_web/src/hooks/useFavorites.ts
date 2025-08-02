'use client'
import { useFavoritesStore } from '../stores/useFavoritesStore'

export const useFavorites = () => {
  const store = useFavoritesStore()
  
  return {
    // State
    Favorites: store.favorites,
    
    // Insert
    addToFavorites: store.addToFavorites,
    
    // Delete
    removeFromFavorites: store.removeFromFavorites,
    clearFavorites: store.clearFavorites,
    
    // Read
    getFavorites: store.getFavorites,
    isFavorite: store.isFavorite,
    getFavorite: store.getFavorite,
    getTotalFavorites: store.getTotalFavorites
  }
}