import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { ProductosProps } from '../types/index'

interface FavoritesState {
  favorites: ProductosProps[];
  
  // Insert
  addToFavorites: (product: ProductosProps) => void;
  
  // Delete
  removeFromFavorites: (productId: number) => void;
  clearFavorites: () => void;
  
  //Guardar en lo que viene del backend
  setFavorites: (products: ProductosProps[]) => void;

  // Read
  getFavorites: () => ProductosProps[];
  isFavorite: (productId: number) => boolean;
  getFavorite: (productId: number) => ProductosProps | undefined;
  getTotalFavorites: () => number; 
}

export const useFavoritesStore = create<FavoritesState>()(
  devtools(
    persist(
      (set, get) => ({
        favorites: [],
        
        addToFavorites: (product) => set((state) => {
          // Evitar duplicados
          const exists = state.favorites.some(fav => fav.ProductID === product.ProductID);
          if (exists) return state;
          return {
            favorites: [...state.favorites, product]
          };
        }, false, 'addToFavorites'),
        
        removeFromFavorites: (productId) => set((state) => ({
          favorites: state.favorites.filter(fav => fav.ProductID !== productId)
        }), false, 'removeFromFavorites'),
        
        clearFavorites: () => set(() => ({
          favorites: []
        }), false, 'clearFavorites'),

        setFavorites: (list) => set(() => ({ 
            favorites: list 
        }), false, 'setFavorites'),
        
        getFavorites: () => get().favorites,
        isFavorite: (productId) => get().favorites.some(fav => fav.ProductID === productId),
        getFavorite: (productId) => get().favorites.find(fav => fav.ProductID === productId),
        getTotalFavorites: () => get().favorites.length
      }),
      {
        name: 'favorites-storage',
        partialize: (state) => ({
          favorites: state.favorites
        })
      }
    ),
    { name: 'FavoritesStore' }
  )
)