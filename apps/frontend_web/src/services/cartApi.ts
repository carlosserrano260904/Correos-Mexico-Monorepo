// src/services/cartApi.ts
import api from '../lib/api';

export interface BackendCartItem {
  id: number;
  profileId: number;
  productId: number;
  cantidad: number;
  producto: {
    id: number;
    nombre: string;
    precio: number;
    images: Array<{ url: string }>;
  };
}

export interface CartResponse {
  items: BackendCartItem[];
  subtotal: number;
  total: number;
}

export interface AddToCartRequest {
  profileId: number;
  productId: number;
  cantidad: number;
}

export interface UpdateQuantityRequest {
  cantidad: number;
}

class CartApiService {
  private readonly baseUrl = '/carrito';

  /**
   * Obtener carrito del usuario
   */
  async getCart(profileId: number): Promise<CartResponse> {
    try {
      console.log(`🛒 === OBTENIENDO CARRITO PARA PERFIL ${profileId} ===`);
      
      const response = await api.get<CartResponse>(`${this.baseUrl}/${profileId}`);
      
      console.log('📡 Respuesta del carrito:');
      console.log(`   Status: ${response.status}`);
      console.log(`   Items en carrito: ${response.data.items?.length || 0}`);
      
      return response.data;
      
    } catch (error) {
      console.error('❌ === ERROR OBTENIENDO CARRITO ===');
      console.error('Error completo:', error);
      
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        console.error('📡 Detalles del error:');
        console.error(`   Status: ${axiosError.response?.status}`);
        console.error(`   Data:`, axiosError.response?.data);
      }
      
      throw new Error('Error al obtener carrito del servidor');
    }
  }

  /**
   * Agregar producto al carrito
   */
  async addToCart(data: AddToCartRequest): Promise<string> {
    try {
      console.log('🛒 === AGREGANDO PRODUCTO AL CARRITO ===');
      console.log('📤 Datos a enviar:', data);
      
      const response = await api.post<string>(this.baseUrl, data);
      
      console.log('📡 Respuesta del servidor:');
      console.log(`   Status: ${response.status}`);
      console.log(`   Message: ${response.data}`);
      
      return response.data;
      
    } catch (error) {
      console.error('❌ === ERROR AGREGANDO AL CARRITO ===');
      console.error('Error completo:', error);
      console.error('Datos que se intentaron enviar:', data);
      
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        console.error('📡 Detalles del error:');
        console.error(`   Status: ${axiosError.response?.status}`);
        console.error(`   Data:`, axiosError.response?.data);
      }
      
      throw new Error('Error al agregar producto al carrito');
    }
  }

  /**
   * Actualizar cantidad de un item del carrito
   */
  async updateQuantity(cartItemId: number, data: UpdateQuantityRequest): Promise<string> {
    try {
      console.log(`🛒 === ACTUALIZANDO CANTIDAD DEL ITEM ${cartItemId} ===`);
      console.log('📤 Nueva cantidad:', data.cantidad);
      
      const response = await api.patch<string>(`${this.baseUrl}/${cartItemId}`, data);
      
      console.log('📡 Respuesta del servidor:');
      console.log(`   Status: ${response.status}`);
      console.log(`   Message: ${response.data}`);
      
      return response.data;
      
    } catch (error) {
      console.error(`❌ === ERROR ACTUALIZANDO CANTIDAD DEL ITEM ${cartItemId} ===`);
      console.error('Error completo:', error);
      
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        console.error('📡 Detalles del error:');
        console.error(`   Status: ${axiosError.response?.status}`);
        console.error(`   Data:`, axiosError.response?.data);
      }
      
      throw new Error('Error al actualizar cantidad en el carrito');
    }
  }

  /**
   * Eliminar item del carrito
   */
  async removeFromCart(cartItemId: number): Promise<string> {
    try {
      console.log(`🛒 === ELIMINANDO ITEM ${cartItemId} DEL CARRITO ===`);
      
      const response = await api.delete<string>(`${this.baseUrl}/${cartItemId}`);
      
      console.log('📡 Respuesta del servidor:');
      console.log(`   Status: ${response.status}`);
      console.log(`   Message: ${response.data}`);
      
      return response.data;
      
    } catch (error) {
      console.error(`❌ === ERROR ELIMINANDO ITEM ${cartItemId} ===`);
      console.error('Error completo:', error);
      
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        console.error('📡 Detalles del error:');
        console.error(`   Status: ${axiosError.response?.status}`);
        console.error(`   Data:`, axiosError.response?.data);
      }
      
      throw new Error('Error al eliminar item del carrito');
    }
  }

  /**
   * Calcular subtotal del carrito
   */
  async getSubtotal(profileId: number): Promise<{ subtotal: number }> {
    try {
      console.log(`🛒 === CALCULANDO SUBTOTAL PARA PERFIL ${profileId} ===`);
      
      const response = await api.get<{ subtotal: number }>(`${this.baseUrl}/${profileId}/subtotal`);
      
      console.log('📡 Subtotal calculado:');
      console.log(`   Status: ${response.status}`);
      console.log(`   Subtotal: $${response.data.subtotal}`);
      
      return response.data;
      
    } catch (error) {
      console.error(`❌ === ERROR CALCULANDO SUBTOTAL ===`);
      console.error('Error completo:', error);
      
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        console.error('📡 Detalles del error:');
        console.error(`   Status: ${axiosError.response?.status}`);
        console.error(`   Data:`, axiosError.response?.data);
      }
      
      throw new Error('Error al calcular subtotal del carrito');
    }
  }

  /**
   * Proceder al pago
   */
  async proceedToCheckout(profileId: number): Promise<any> {
    try {
      console.log(`🛒 === PROCEDIENDO AL PAGO PARA PERFIL ${profileId} ===`);
      
      const response = await api.get(`${this.baseUrl}/${profileId}/proceder`);
      
      console.log('📡 Respuesta de checkout:');
      console.log(`   Status: ${response.status}`);
      console.log('   Data:', response.data);
      
      return response.data;
      
    } catch (error) {
      console.error(`❌ === ERROR EN CHECKOUT ===`);
      console.error('Error completo:', error);
      
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        console.error('📡 Detalles del error:');
        console.error(`   Status: ${axiosError.response?.status}`);
        console.error(`   Data:`, axiosError.response?.data);
      }
      
      throw new Error('Error al proceder al checkout');
    }
  }

  /**
   * Health check del servicio de carrito
   */
  async healthCheck(): Promise<boolean> {
    try {
      console.log('🔍 === HEALTH CHECK DE CARRITO API ===');
      
      // Intentar obtener un carrito inexistente para verificar que el servicio responda
      const response = await api.get(`${this.baseUrl}/999999`);
      
      console.log('📡 Health check response:');
      console.log(`   Status: ${response.status}`);
      console.log(`   ✅ API de carrito está funcionando`);
      
      return true;
      
    } catch (error) {
      // Un 404 también indica que el servicio está funcionando
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        if (axiosError.response?.status === 404) {
          console.log('✅ API de carrito está funcionando (404 esperado)');
          return true;
        }
      }
      
      console.error('❌ === HEALTH CHECK FALLIDO ===');
      console.error('Error:', error);
      
      return false;
    }
  }
}

export const cartApiService = new CartApiService();