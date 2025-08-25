import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { ProductosProps } from '../types/index'
import type { FrontendProduct, FrontendFavorite } from '@/schemas/products'
import { favoritesApiService } from '@/services/favoritesApi'

interface FavoritesState {
  // State
  favorites: ProductosProps[];
  loading: boolean;
  error: string | null;
  currentProfileId: number | null;
  
  // Backend sync methods
  loadFavorites: (profileId: number) => Promise<void>;
  syncAddToFavorites: (product: ProductosProps, profileId: number) => Promise<void>;
  syncRemoveFromFavorites: (favoriteId: number, productId: number) => Promise<void>;
  syncAddToCartFromFavorites: (productId: number, profileId: number) => Promise<void>;
  
  // Local methods (for fallback)
  addToFavorites: (product: ProductosProps) => void;
  removeFromFavorites: (productId: number) => void;
  clearFavorites: () => void;
  
  // Read methods
  getFavorites: () => ProductosProps[];
  isFavorite: (productId: number) => boolean;
  getFavorite: (productId: number) => ProductosProps | undefined;
  getTotalFavorites: () => number;
  
  // State management
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setCurrentProfileId: (profileId: number | null) => void;
}

export const useFavoritesStore = create<FavoritesState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        favorites: [],
        loading: false,
        error: null,
        currentProfileId: null,
        
        // Backend sync methods
        loadFavorites: async (profileId: number) => {
          const currentProfile = get().currentProfileId;
          
          // Skip if we're already loading favorites for this profile
          if (get().loading && currentProfile === profileId) {
            console.log('⏳ Ya cargando favoritos para este perfil, saltando...');
            return;
          }
          
          set({ loading: true, error: null, currentProfileId: profileId }, false, 'loadFavorites:start');
          
          try {
            console.log(`❤️ Cargando favoritos para perfil ${profileId}`);
            const backendFavorites = await favoritesApiService.getFavorites(profileId);
            
            // Convert FrontendFavorite[] to ProductosProps[]
            const favorites: ProductosProps[] = backendFavorites.favorites.map(fav => ({
              ProductID: fav.ProductID,
              ProductName: fav.ProductName,
              ProductDescription: fav.ProductDescription,
              productPrice: fav.productPrice,
              ProductCategory: fav.ProductCategory,
              ProductStock: fav.ProductStock,
              Color: fav.Color,
              ProductBrand: fav.ProductBrand,
              ProductSlug: fav.ProductSlug,
              ProductSellerName: fav.ProductSellerName,
              ProductStatus: fav.ProductStatus,
              ProductSold: fav.ProductSold,
              ProductSKU: fav.ProductSKU,
              ProductImageUrl: fav.ProductImageUrl,
              ProductImages: fav.ProductImages,
              // Add favorite-specific data
              FavoriteId: fav.FavoriteId,
              DateAdded: fav.DateAdded,
            }));
            
            set({ 
              favorites, 
              loading: false, 
              error: null 
            }, false, 'loadFavorites:success');
            
            console.log(`✅ Favoritos cargados: ${favorites.length} elementos`);
            
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            console.error('❌ Error cargando favoritos:', errorMessage);
            
            set({ 
              loading: false, 
              error: errorMessage 
            }, false, 'loadFavorites:error');
          }
        },
        
        syncAddToFavorites: async (product: ProductosProps, profileId: number) => {
          set({ loading: true, error: null }, false, 'syncAddToFavorites:start');
          
          try {
            console.log(`❤️ Agregando a favoritos (backend): ${product.ProductName}`);
            
            // Convert ProductosProps to FrontendProduct for API
            const frontendProduct: FrontendProduct = {
              ProductID: product.ProductID,
              ProductName: product.ProductName,
              ProductDescription: product.ProductDescription,
              productPrice: product.productPrice,
              ProductCategory: product.ProductCategory || null,
              ProductStock: product.ProductStock,
              Color: product.Color,
              ProductBrand: product.ProductBrand,
              ProductSlug: product.ProductSlug,
              ProductSellerName: product.ProductSellerName,
              ProductStatus: product.ProductStatus,
              ProductSold: product.ProductSold,
              ProductSKU: product.ProductSKU,
              ProductImageUrl: product.ProductImageUrl,
              ProductImages: product.ProductImages || [],
            };
            
            await favoritesApiService.addToFavorites(frontendProduct, profileId);
            
            // Update local state immediately (optimistic update)
            set((state) => {
              const exists = state.favorites.some(fav => fav.ProductID === product.ProductID);
              if (exists) return { loading: false };
              
              return {
                favorites: [...state.favorites, product],
                loading: false,
                error: null
              };
            }, false, 'syncAddToFavorites:success');
            
            console.log('✅ Producto agregado a favoritos exitosamente');
            
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            console.error('❌ Error agregando a favoritos:', errorMessage);
            
            set({ 
              loading: false, 
              error: errorMessage 
            }, false, 'syncAddToFavorites:error');
            
            throw error; // Re-throw para que el componente pueda manejarlo
          }
        },
        
        syncRemoveFromFavorites: async (favoriteId: number, productId: number) => {
          set({ loading: true, error: null }, false, 'syncRemoveFromFavorites:start');
          
          try {
            console.log(`❌ Eliminando de favoritos (backend): favoriteId=${favoriteId}, productId=${productId}`);
            
            await favoritesApiService.removeFromFavorites(favoriteId);
            
            // Update local state immediately
            set((state) => ({
              favorites: state.favorites.filter(fav => fav.ProductID !== productId),
              loading: false,
              error: null
            }), false, 'syncRemoveFromFavorites:success');
            
            console.log('✅ Producto eliminado de favoritos exitosamente');
            
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            console.error('❌ Error eliminando de favoritos:', errorMessage);
            
            set({ 
              loading: false, 
              error: errorMessage 
            }, false, 'syncRemoveFromFavorites:error');
            
            throw error; // Re-throw para que el componente pueda manejarlo
          }
        },
        
        syncAddToCartFromFavorites: async (productId: number, profileId: number) => {
          set({ loading: true, error: null }, false, 'syncAddToCartFromFavorites:start');
          
          try {
            console.log(`🛒 Agregando al carrito desde favoritos (backend): productId=${productId}`);
            
            await favoritesApiService.addToCartFromFavorites(productId, profileId);
            
            set({ loading: false, error: null }, false, 'syncAddToCartFromFavorites:success');
            
            console.log('✅ Producto agregado al carrito desde favoritos exitosamente');
            
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            console.error('❌ Error agregando al carrito desde favoritos:', errorMessage);
            
            set({ 
              loading: false, 
              error: errorMessage 
            }, false, 'syncAddToCartFromFavorites:error');
            
            throw error; // Re-throw para que el componente pueda manejarlo
          }
        },
        
        // Local methods (for fallback)
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
        
        // Read methods
        getFavorites: () => get().favorites,
        
        isFavorite: (productId) => get().favorites.some(fav => fav.ProductID === productId),
        
        getFavorite: (productId) => get().favorites.find(fav => fav.ProductID === productId),
        
        getTotalFavorites: () => get().favorites.length,
        
        // State management
        setLoading: (loading) => set({ loading }, false, 'setLoading'),
        
        setError: (error) => set({ error }, false, 'setError'),
        
        setCurrentProfileId: (profileId) => set({ currentProfileId: profileId }, false, 'setCurrentProfileId'),
        
      }),
      {
        name: 'favorites-storage',
        partialize: (state) => ({
          favorites: state.favorites,
          currentProfileId: state.currentProfileId
        })
      }
    ),
    { name: 'FavoritesStore' }
  )
)