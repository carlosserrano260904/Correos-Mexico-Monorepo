// src/services/productsApi.ts
import api from '../lib/api';
import {
  FrontendProduct,
  BackendCreateProductDto,
  BackendProductEntity,
} from '@/schemas/products';
import {
  mapBackendToFrontend,
  mapFrontendToUpdateDto,
  validateBackendProductsArray,
} from '../utils/mappers';

class ProductsApiService {
  private readonly baseUrl = '/products';

  /**
   * Obtiene todos los productos del backend.
   */
  async getAllProducts(): Promise<FrontendProduct[]> {
    try {
      console.log('🔍 Obteniendo todos los productos…');
      const response = await api.get<BackendProductEntity[]>(this.baseUrl);
      return validateBackendProductsArray(response.data);
    } catch (error) {
      console.error('❌ Error obteniendo productos:', error);
      throw new Error('Error al obtener productos de la API');
    }
  }

  /**
   * Obtiene un producto por ID.
   */
  async getProductById(id: number): Promise<FrontendProduct> {
    try {
      console.log(`🔍 Obteniendo producto ID: ${id}`);
      const response = await api.get<BackendProductEntity>(`${this.baseUrl}/${id}`);
      return mapBackendToFrontend(response.data);
    } catch (error) {
      console.error(`❌ Error obteniendo producto ${id}:`, error);
      throw new Error(`Error al obtener producto con ID ${id}`);
    }
  }

  /**
   * Crea un producto. Solo envía JSON; la imagen se sube aparte.
   */
  async createProduct(productData: BackendCreateProductDto): Promise<FrontendProduct> {
    try {
      console.log('🔍 Creando producto (JSON):', productData);
      const response = await api.post<BackendProductEntity>(
        this.baseUrl,
        productData,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
      return mapBackendToFrontend(response.data);
    } catch (error) {
      console.error('❌ Error completo creando producto:', error);
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        console.error('❌ Status:', axiosError.response?.status);
        console.error('❌ Data:', axiosError.response?.data);
      }
      throw new Error('Error al crear producto en el servidor');
    }
  }

  /**
   * Actualiza un producto existente.
   */
  async updateProduct(id: number, productData: Partial<FrontendProduct>): Promise<string> {
    try {
      console.log(`🔍 Actualizando producto ${id}:`, productData);
      const updateDto = mapFrontendToUpdateDto(productData);
      const response = await api.patch<string>(`${this.baseUrl}/${id}`, updateDto);
      return response.data;
    } catch (error) {
      console.error(`❌ Error actualizando producto ${id}:`, error);
      throw new Error(`Error al actualizar producto con ID ${id}`);
    }
  }

  /**
   * Elimina un producto.
   */
  async deleteProduct(id: number): Promise<string> {
    try {
      console.log(`🔍 Eliminando producto ${id}`);
      const response = await api.delete<string>(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`❌ Error eliminando producto ${id}:`, error);
      throw new Error(`Error al eliminar producto con ID ${id}`);
    }
  }

  /**
   * Realiza un health check simple.
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await api.get(`${this.baseUrl}`);
      return response.status === 200;
    } catch (error) {
      console.error('❌ Health check fallido:', error);
      return false;
    }
  }
}

export const productsApiService = new ProductsApiService();
