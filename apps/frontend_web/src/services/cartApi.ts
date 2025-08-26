// src/services/cartApi.ts
import api from '../lib/api';
import { 
  BackendCartItem,
  BackendCartItemSchema,
  BackendCreateCartDto,
  BackendCreateCartDtoSchema,
  BackendUpdateCartDto,
  BackendUpdateCartDtoSchema,
  FrontendCart,
  FrontendCartItem,
  AddToCartRequest,
  UpdateCartQuantityRequest,
  AddToCartRequestSchema,
  UpdateCartQuantityRequestSchema,
  CartItemTransformSchema
} from '@/schemas/cart';
import type { FrontendProduct } from '@/schemas/products';

class CartApiService {
  private readonly baseUrl = '/carrito';

  /**
   * GET /carrito/:profileId - Obtener carrito del usuario
   */
  async getCart(profileId: number): Promise<FrontendCart> {
    try {
      console.log(`🛒 === OBTENIENDO CARRITO PARA PERFIL ${profileId} ===`);
      
      const response = await api.get<BackendCartItem[]>(`${this.baseUrl}/${profileId}`);
      
      console.log('📡 Respuesta del carrito (backend):');
      console.log(`   Status: ${response.status}`);
      console.log(`   Items en carrito: ${response.data.length || 0}`);
      console.log('   Raw data:', response.data);
      
      // El backend devuelve array directo de items de carrito con relaciones
      const validatedItems = response.data.map(item => BackendCartItemSchema.parse(item));
      
      // Transformar a formato frontend
      const frontendItems: FrontendCartItem[] = validatedItems.map(item => 
        CartItemTransformSchema.parse(item)
      );
      
      // Calcular totales
      const subtotal = frontendItems.reduce((acc, item) => 
        acc + (item.prodcutQuantity * item.unitPrice), 0
      );
      
      const frontendCart: FrontendCart = {
        items: frontendItems,
        subtotal,
        total: subtotal, // Sin impuestos por ahora
        totalItems: frontendItems.reduce((acc, item) => acc + item.prodcutQuantity, 0),
        selectedItems: frontendItems.length
      };
      
      console.log('✅ Carrito mapeado y validado para frontend:', frontendCart);
      
      return frontendCart;
      
    } catch (error) {
      console.error('❌ === ERROR OBTENIENDO CARRITO ===');
      console.error('Error completo:', error);
      
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        
        if (axiosError.response?.status === 404) {
          // Carrito vacío - devolver carrito vacío en lugar de error
          console.log('📝 Carrito vacío para el usuario');
          return {
            items: [],
            subtotal: 0,
            total: 0,
            totalItems: 0,
            selectedItems: 0
          };
        }
        
        const backendMessage = axiosError.response?.data?.message;
        throw new Error(backendMessage || `Error del servidor (${axiosError.response?.status})`);
      }
      
      throw new Error('Error al obtener el carrito');
    }
  }

  /**
   * POST /carrito - Agregar producto al carrito
   * Returns success/failure, doesn't return the item (backend doesn't include relations)
   */
  async addToCart(profileId: number, productId: number, cantidad: number): Promise<void> {
    try {
      console.log(`🛒 === AGREGANDO AL CARRITO ===`);
      console.log(`   Profile: ${profileId}, Product: ${productId}, Quantity: ${cantidad}`);
      
      // Validar datos antes de enviar
      const validatedRequest = BackendCreateCartDtoSchema.parse({
        profileId,
        productId,
        cantidad
      });
      
      const response = await api.post(`${this.baseUrl}`, validatedRequest);
      
      console.log('📡 Producto agregado al carrito (backend):');
      console.log(`   Status: ${response.status}`);
      console.log('   Response:', response.data);
      
      // Don't try to parse the response since backend doesn't return full item with relations
      // The cart store will reload the full cart to get updated data
      console.log('✅ Item agregado exitosamente al carrito');
      
    } catch (error) {
      console.error('❌ === ERROR AGREGANDO AL CARRITO ===');
      console.error('Error completo:', error);
      
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        const backendMessage = axiosError.response?.data?.message;
        
        if (axiosError.response?.status === 404) {
          throw new Error('Usuario o producto no encontrado');
        }
        
        throw new Error(backendMessage || `Error del servidor (${axiosError.response?.status})`);
      }
      
      throw new Error('Error al agregar producto al carrito');
    }
  }

  /**
   * PATCH /carrito/:id - Actualizar cantidad de un item
   * Returns success/failure, backend might not include full relations
   */
  async updateQuantity(cartItemId: number, cantidad: number): Promise<void> {
    try {
      console.log(`🛒 === ACTUALIZANDO CANTIDAD ===`);
      console.log(`   Cart Item ID: ${cartItemId}, New Quantity: ${cantidad}`);
      
      // Validar datos antes de enviar
      const validatedRequest = BackendUpdateCartDtoSchema.parse({ cantidad });
      
      const response = await api.patch(`${this.baseUrl}/${cartItemId}`, validatedRequest);
      
      console.log('📡 Cantidad actualizada (backend):');
      console.log(`   Status: ${response.status}`);
      console.log('   Response:', response.data);
      
      console.log('✅ Cantidad actualizada exitosamente');
      
    } catch (error) {
      console.error('❌ === ERROR ACTUALIZANDO CANTIDAD ===');
      console.error('Error completo:', error);
      
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        const backendMessage = axiosError.response?.data?.message;
        
        if (axiosError.response?.status === 404) {
          throw new Error('Producto en carrito no encontrado');
        } else if (axiosError.response?.status === 400) {
          throw new Error(backendMessage || 'La cantidad mínima debe ser 1');
        }
        
        throw new Error(backendMessage || `Error del servidor (${axiosError.response?.status})`);
      }
      
      throw new Error('Error al actualizar cantidad');
    }
  }

  /**
   * DELETE /carrito/:id - Eliminar item del carrito
   */
  async removeFromCart(cartItemId: number): Promise<void> {
    try {
      console.log(`🛒 === ELIMINANDO DEL CARRITO ===`);
      console.log(`   Cart Item ID: ${cartItemId}`);
      
      const response = await api.delete(`${this.baseUrl}/${cartItemId}`);
      
      console.log('📡 Item eliminado del carrito:');
      console.log(`   Status: ${response.status}`);
      
      console.log('✅ Item eliminado exitosamente');
      
    } catch (error) {
      console.error('❌ === ERROR ELIMINANDO DEL CARRITO ===');
      console.error('Error completo:', error);
      
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        const backendMessage = axiosError.response?.data?.message;
        
        if (axiosError.response?.status === 404) {
          throw new Error('Producto en carrito no encontrado');
        }
        
        throw new Error(backendMessage || `Error del servidor (${axiosError.response?.status})`);
      }
      
      throw new Error('Error al eliminar producto del carrito');
    }
  }

  /**
   * GET /carrito/:profileId/subtotal - Calcular subtotal del carrito
   */
  async getSubtotal(profileId: number): Promise<number> {
    try {
      console.log(`🛒 === CALCULANDO SUBTOTAL ===`);
      console.log(`   Profile ID: ${profileId}`);
      
      const response = await api.get<{ subtotal: number }>(`${this.baseUrl}/${profileId}/subtotal`);
      
      console.log('📡 Subtotal calculado (backend):');
      console.log(`   Status: ${response.status}`);
      console.log(`   Subtotal: $${response.data.subtotal}`);
      
      return response.data.subtotal;
      
    } catch (error) {
      console.error('❌ === ERROR CALCULANDO SUBTOTAL ===');
      console.error('Error completo:', error);
      
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        const backendMessage = axiosError.response?.data?.message;
        throw new Error(backendMessage || `Error del servidor (${axiosError.response?.status})`);
      }
      
      throw new Error('Error al calcular subtotal');
    }
  }

  /**
   * GET /carrito/:profileId/proceder - Proceder al pago
   */
  async proceedToPayment(profileId: number): Promise<{ message: string; productos: BackendCartItem[] }> {
    try {
      console.log(`🛒 === PROCEDIENDO AL PAGO ===`);
      console.log(`   Profile ID: ${profileId}`);
      
      const response = await api.get<{ message: string; productos: BackendCartItem[] }>(`${this.baseUrl}/${profileId}/proceder`);
      
      console.log('📡 Preparando pago (backend):');
      console.log(`   Status: ${response.status}`);
      console.log(`   Message: ${response.data.message}`);
      console.log(`   Products: ${response.data.productos.length}`);
      
      return response.data;
      
    } catch (error) {
      console.error('❌ === ERROR PROCEDIENDO AL PAGO ===');
      console.error('Error completo:', error);
      
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        const backendMessage = axiosError.response?.data?.message;
        
        if (axiosError.response?.status === 404) {
          throw new Error('El carrito está vacío');
        }
        
        throw new Error(backendMessage || `Error del servidor (${axiosError.response?.status})`);
      }
      
      throw new Error('Error al proceder al pago');
    }
  }

  /**
   * Utility: Convert FrontendProduct to AddToCartRequest
   */
  productToAddCartRequest(product: FrontendProduct, profileId: number, quantity: number = 1): AddToCartRequest {
    return AddToCartRequestSchema.parse({
      profileId,
      productId: product.ProductID,
      cantidad: quantity
    });
  }

  /**
   * Health check for cart service
   */
  async healthCheck(): Promise<{ isHealthy: boolean; error?: string }> {
    try {
      console.log('🏥 === VERIFICANDO ESTADO DEL CARRITO API ===');
      
      // Try to access a basic endpoint with invalid data to check server response
      await api.get(`${this.baseUrl}/0`, { timeout: 5000 });
      
      return { isHealthy: true };
    } catch (error) {
      console.log('🔍 Respuesta del cart health check:', error);
      
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        // 404 or 400 means server is responding (just invalid data)
        if (axiosError.response?.status === 404 || axiosError.response?.status === 400) {
          return { isHealthy: true };
        }
        return { 
          isHealthy: false, 
          error: `Cart API responded with ${axiosError.response?.status}` 
        };
      }
      
      if (error && typeof error === 'object' && 'code' in error) {
        const axiosError = error as any;
        if (axiosError.code === 'ECONNABORTED') {
          return { isHealthy: false, error: 'Cart API timeout' };
        }
        if (axiosError.code === 'ECONNREFUSED' || axiosError.code === 'ERR_NETWORK') {
          return { isHealthy: false, error: 'Cannot connect to cart API' };
        }
      }
      
      return { isHealthy: false, error: 'Unknown cart API error' };
    }
  }
}

export const cartApiService = new CartApiService();