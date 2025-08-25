// src/services/cartApi.ts
import api from '../lib/api';
import { 
  BackendCartResponse,
  BackendCartResponseSchema,
  BackendCreateCartDto,
  BackendUpdateCartDto,
  FrontendCart,
  AddToCartRequest,
  UpdateCartQuantityRequest,
  AddToCartRequestSchema,
  UpdateCartQuantityRequestSchema
} from '@/schemas/cart';
import { 
  mapBackendCartToFrontend,
  mapFrontendProductToAddCartDto,
  validateUpdateCartQuantity 
} from '@/utils/mappers';
import type { FrontendProduct } from '@/schemas/products';

class CartApiService {
  private readonly baseUrl = '/carrito';

  /**
   * Obtener carrito del usuario con validación Zod y mapeo
   */
  async getCart(profileId: number): Promise<FrontendCart> {
    try {
      console.log(`🛒 === OBTENIENDO CARRITO PARA PERFIL ${profileId} ===`);
      
      const response = await api.get<BackendCartResponse>(`${this.baseUrl}/${profileId}`);
      
      console.log('📡 Respuesta del carrito (backend):');
      console.log(`   Status: ${response.status}`);
      console.log(`   Items en carrito: ${response.data.items?.length || 0}`);
      console.log('   Data:', response.data);
      
      // Validar y mapear usando Zod schemas
      const validatedBackendCart = BackendCartResponseSchema.parse(response.data);
      const frontendCart = mapBackendCartToFrontend(validatedBackendCart);
      
      console.log('✅ Carrito mapeado y validado para frontend:', frontendCart);
      
      return frontendCart;
      
    } catch (error) {
      console.error('❌ === ERROR OBTENIENDO CARRITO ===');
      console.error('Error completo:', error);
      
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        console.error('📡 Detalles del error:');
        console.error(`   Status: ${axiosError.response?.status}`);
        console.error(`   Data:`, axiosError.response?.data);
      }
      
      if (error && typeof error === 'object' && 'issues' in error) {
        console.error('❌ Errores de validación Zod:', (error as any).issues);
      }
      
      throw new Error('Error al obtener carrito del servidor');
    }
  }

  /**
   * Agregar producto al carrito con validación Zod
   */
  async addToCart(data: AddToCartRequest): Promise<string> {
    try {
      console.log('🛒 === AGREGANDO PRODUCTO AL CARRITO ===');
      console.log('📤 Datos a enviar (antes de validación):', data);
      
      // Validar datos de entrada
      const validatedData = AddToCartRequestSchema.parse(data);
      console.log('✅ Datos validados por Zod:', validatedData);
      
      const response = await api.post<string>(this.baseUrl, validatedData);
      
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
      
      if (error && typeof error === 'object' && 'issues' in error) {
        console.error('❌ Errores de validación Zod:', (error as any).issues);
      }
      
      throw new Error('Error al agregar producto al carrito');
    }
  }

  /**
   * Agregar producto al carrito usando FrontendProduct
   */
  async addProductToCart(product: FrontendProduct, profileId: number, quantity: number = 1): Promise<string> {
    try {
      console.log('🛒 === AGREGANDO PRODUCTO AL CARRITO (DESDE FRONTEND) ===');
      console.log('📤 Producto:', { id: product.ProductID, name: product.ProductName });
      
      // Mapear FrontendProduct a AddToCartRequest usando mapper
      const addToCartRequest = mapFrontendProductToAddCartDto(product, profileId, quantity);
      
      return await this.addToCart(addToCartRequest);
      
    } catch (error) {
      console.error('❌ === ERROR AGREGANDO PRODUCTO DESDE FRONTEND ===');
      console.error('Error completo:', error);
      
      throw new Error('Error al agregar producto al carrito');
    }
  }

  /**
   * Actualizar cantidad de un item del carrito con validación Zod
   */
  async updateQuantity(cartItemId: number, data: UpdateCartQuantityRequest): Promise<string> {
    try {
      console.log(`🛒 === ACTUALIZANDO CANTIDAD DEL ITEM ${cartItemId} ===`);
      console.log('📤 Nueva cantidad (antes de validación):', data.cantidad);
      
      // Validar datos de entrada
      const validatedData = UpdateCartQuantityRequestSchema.parse(data);
      console.log('✅ Datos validados por Zod:', validatedData);
      
      const response = await api.patch<string>(`${this.baseUrl}/${cartItemId}`, validatedData);
      
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
      
      if (error && typeof error === 'object' && 'issues' in error) {
        console.error('❌ Errores de validación Zod:', (error as any).issues);
      }
      
      throw new Error('Error al actualizar cantidad en el carrito');
    }
  }

  /**
   * Actualizar cantidad usando número simple
   */
  async updateItemQuantity(cartItemId: number, quantity: number): Promise<string> {
    try {
      console.log(`🛒 === ACTUALIZANDO CANTIDAD SIMPLE DEL ITEM ${cartItemId} ===`);
      
      // Validar y mapear usando helper
      const updateData = validateUpdateCartQuantity(quantity);
      
      return await this.updateQuantity(cartItemId, updateData);
      
    } catch (error) {
      console.error(`❌ === ERROR ACTUALIZANDO CANTIDAD SIMPLE ===`);
      console.error('Error completo:', error);
      
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