// src/services/favoritesApi.ts
import api from '../lib/api';
import { 
  BackendFavoritesResponse,
  BackendFavoritesResponseSchema,
  BackendCreateFavoritoDto,
  FrontendFavorites,
  AddToFavoritesRequest,
  AddToFavoritesRequestSchema,
  RemoveFromFavoritesRequest
} from '@/schemas/favorites';
import { 
  mapBackendFavoritesToFrontend,
  mapFrontendProductToAddFavoritesDto
} from '@/utils/mappers';
import type { FrontendProduct } from '@/schemas/products';

class FavoritesApiService {
  private readonly baseUrl = '/favoritos';

  /**
   * Obtener favoritos del usuario con validación Zod y mapeo
   */
  async getFavorites(profileId: number): Promise<FrontendFavorites> {
    try {
      console.log(`❤️ === OBTENIENDO FAVORITOS PARA PERFIL ${profileId} ===`);
      
      const response = await api.get<BackendFavoritesResponse>(`${this.baseUrl}/${profileId}`);
      
      console.log('📡 Respuesta de favoritos (backend):');
      console.log(`   Status: ${response.status}`);
      console.log(`   Items en favoritos: ${response.data?.length || 0}`);
      console.log('   Data:', response.data);
      
      // Validar y mapear usando Zod schemas
      const validatedBackendFavorites = BackendFavoritesResponseSchema.parse(response.data);
      const frontendFavorites = mapBackendFavoritesToFrontend(validatedBackendFavorites);
      
      console.log('✅ Favoritos mapeados y validados para frontend:', frontendFavorites);
      
      return frontendFavorites;
      
    } catch (error) {
      console.error('❌ === ERROR OBTENIENDO FAVORITOS ===');
      console.error('Error completo:', error);
      
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        console.error('📡 Detalles del error:');
        console.error(`   Status: ${axiosError.response?.status}`);
        console.error(`   Data:`, axiosError.response?.data);
        
        // Si no tiene favoritos (404), devolver lista vacía
        if (axiosError.response?.status === 404) {
          console.log('ℹ️ Usuario no tiene favoritos, devolviendo lista vacía');
          return { favorites: [], totalFavorites: 0 };
        }
      }
      
      throw new Error('Error al obtener favoritos del servidor');
    }
  }

  /**
   * Agregar producto a favoritos
   */
  async addToFavorites(product: FrontendProduct, profileId: number): Promise<void> {
    try {
      console.log(`❤️ === AGREGANDO A FAVORITOS ===`);
      console.log(`   Producto: ${product.ProductName} (ID: ${product.ProductID})`);
      console.log(`   Perfil: ${profileId}`);
      
      // Preparar datos para el backend
      const addToFavoritesData = mapFrontendProductToAddFavoritesDto(product, profileId);
      console.log('📤 Datos preparados para backend:', addToFavoritesData);
      
      const response = await api.post(`${this.baseUrl}`, addToFavoritesData);
      
      console.log('📡 Respuesta del servidor:');
      console.log(`   Status: ${response.status}`);
      console.log(`   Data:`, response.data);
      console.log('✅ Producto agregado a favoritos exitosamente');
      
    } catch (error) {
      console.error('❌ === ERROR AGREGANDO A FAVORITOS ===');
      console.error('Error completo:', error);
      
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        console.error('📡 Detalles del error:');
        console.error(`   Status: ${axiosError.response?.status}`);
        console.error(`   Data:`, axiosError.response?.data);
        
        if (axiosError.response?.status === 409) {
          throw new Error('Este producto ya está en tus favoritos');
        } else if (axiosError.response?.status === 404) {
          throw new Error('Producto o usuario no encontrado');
        }
      }
      
      throw new Error('Error al agregar producto a favoritos');
    }
  }

  /**
   * Eliminar producto de favoritos
   */
  async removeFromFavorites(favoriteId: number): Promise<void> {
    try {
      console.log(`❌ === ELIMINANDO DE FAVORITOS ===`);
      console.log(`   Favorite ID: ${favoriteId}`);
      
      const response = await api.delete(`${this.baseUrl}/${favoriteId}`);
      
      console.log('📡 Respuesta del servidor:');
      console.log(`   Status: ${response.status}`);
      console.log(`   Message: ${response.data?.message || 'Eliminado'}`);
      console.log('✅ Producto eliminado de favoritos exitosamente');
      
    } catch (error) {
      console.error('❌ === ERROR ELIMINANDO DE FAVORITOS ===');
      console.error('Error completo:', error);
      
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        console.error('📡 Detalles del error:');
        console.error(`   Status: ${axiosError.response?.status}`);
        console.error(`   Data:`, axiosError.response?.data);
        
        if (axiosError.response?.status === 404) {
          throw new Error('Favorito no encontrado');
        }
      }
      
      throw new Error('Error al eliminar producto de favoritos');
    }
  }

  /**
   * Agregar producto de favoritos al carrito
   */
  async addToCartFromFavorites(productId: number, profileId: number): Promise<void> {
    try {
      console.log(`🛒 === AGREGANDO AL CARRITO DESDE FAVORITOS ===`);
      console.log(`   Producto ID: ${productId}`);
      console.log(`   Perfil: ${profileId}`);
      
      const response = await api.post(`${this.baseUrl}/agregar-a-carrito`, {
        profileId,
        productId
      });
      
      console.log('📡 Respuesta del servidor:');
      console.log(`   Status: ${response.status}`);
      console.log(`   Data:`, response.data);
      console.log('✅ Producto agregado al carrito desde favoritos exitosamente');
      
    } catch (error) {
      console.error('❌ === ERROR AGREGANDO AL CARRITO DESDE FAVORITOS ===');
      console.error('Error completo:', error);
      
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        console.error('📡 Detalles del error:');
        console.error(`   Status: ${axiosError.response?.status}`);
        console.error(`   Data:`, axiosError.response?.data);
      }
      
      throw new Error('Error al agregar producto al carrito desde favoritos');
    }
  }

  /**
   * Obtener el número total de favoritos para un usuario
   */
  async getFavoritesCount(profileId: number): Promise<number> {
    try {
      const favorites = await this.getFavorites(profileId);
      return favorites.totalFavorites;
    } catch (error) {
      console.error('❌ Error obteniendo contador de favoritos:', error);
      return 0; // Return 0 on error
    }
  }

  /**
   * Verificar si un producto está en favoritos
   */
  async isFavorite(productId: number, profileId: number): Promise<boolean> {
    try {
      const favorites = await this.getFavorites(profileId);
      return favorites.favorites.some(fav => fav.ProductID === productId);
    } catch (error) {
      console.error('❌ Error verificando si producto está en favoritos:', error);
      return false; // Return false on error
    }
  }

  /**
   * Realiza un health check simple
   */
  async healthCheck(): Promise<boolean> {
    try {
      console.log('🔍 === HEALTH CHECK DE FAVORITES API ===');
      
      // Try to make a simple request to check if API is available
      const response = await api.get(`${this.baseUrl}/1`); // Try to get favorites for profile 1
      
      console.log('📡 Health check response:');
      console.log(`   Status: ${response.status}`);
      console.log(`   ✅ API está disponible`);
      
      return true; // API is available
      
    } catch (error) {
      console.error('❌ === HEALTH CHECK FALLIDO ===');
      console.error('Error:', error);
      
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        console.error(`   Status: ${axiosError.response?.status}`);
        
        // 404 is expected if profile doesn't exist, API is still working
        if (axiosError.response?.status === 404) {
          console.log(`   ✅ API está disponible (404 es esperado para perfil de prueba)`);
          return true;
        }
      }
      
      console.error(`   ❌ API no está disponible`);
      return false;
    }
  }
}

export const favoritesApiService = new FavoritesApiService();

// Export individual methods for convenience
export const favoritesApi = {
  getFavorites: (profileId: number) => favoritesApiService.getFavorites(profileId),
  addToFavorites: (product: FrontendProduct, profileId: number) => favoritesApiService.addToFavorites(product, profileId),
  removeFromFavorites: (favoriteId: number) => favoritesApiService.removeFromFavorites(favoriteId),
  addToCartFromFavorites: (productId: number, profileId: number) => favoritesApiService.addToCartFromFavorites(productId, profileId),
  getFavoritesCount: (profileId: number) => favoritesApiService.getFavoritesCount(profileId),
  isFavorite: (productId: number, profileId: number) => favoritesApiService.isFavorite(productId, profileId),
  healthCheck: () => favoritesApiService.healthCheck(),
};