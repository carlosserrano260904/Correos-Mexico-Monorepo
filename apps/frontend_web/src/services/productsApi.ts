// src/services/productsApi.ts - CON DEBUG INTEGRADO
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
import { 
  debugProductData, 
  testSingleProductMapping,
  debugAndCleanProducts 
} from '../utils/debugProductData';

class ProductsApiService {
  private readonly baseUrl = '/products';

  /**
   * Obtiene todos los productos del backend - CON DEBUG MEJORADO
   */
  async getAllProducts(): Promise<FrontendProduct[]> {
    try {
      console.log('🚀 === INICIANDO OBTENCIÓN DE PRODUCTOS ===');
      console.log('🔍 Haciendo petición a:', this.baseUrl);
      
      const response = await api.get<BackendProductEntity[]>(this.baseUrl);
      
      console.log('📡 Respuesta del servidor recibida:');
      console.log(`   Status: ${response.status}`);
      console.log(`   Cantidad de productos: ${response.data?.length || 0}`);
      
      // 🔍 DEBUG DETALLADO - INSPECCIONAR ESTRUCTURA REAL
      if (response.data && Array.isArray(response.data)) {
        console.log('🔍 === INICIANDO INSPECCIÓN DETALLADA ===');
        debugProductData(response.data);
        
        // 🧪 PROBAR MAPEO DEL PRIMER PRODUCTO
        if (response.data.length > 0) {
          console.log('🧪 === PROBANDO MAPEO DEL PRIMER PRODUCTO ===');
          console.log('Datos originales del primer producto:');
          console.log(JSON.stringify(response.data[0], null, 2));
          
          try {
            const testMapping = mapBackendToFrontend(response.data[0]);
            console.log('✅ Mapeo individual exitoso para el primer producto');
          } catch (error) {
            console.error('❌ Error en mapeo individual del primer producto:', error);
          }
        }
        
        console.log('🔄 === INICIANDO VALIDACIÓN DE TODOS LOS PRODUCTOS ===');
        const validatedProducts = validateBackendProductsArray(response.data);
        
        console.log('🎉 === PROCESO COMPLETADO ===');
        console.log(`✅ Productos procesados exitosamente: ${validatedProducts.length}`);
        console.log(`📊 Tasa de éxito: ${((validatedProducts.length / response.data.length) * 100).toFixed(1)}%`);
        
        return validatedProducts;
      } else {
        console.warn('⚠️ La respuesta no contiene un array válido de productos');
        console.log('Datos recibidos:', response.data);
        return [];
      }
      
    } catch (error) {
      console.error('❌ === ERROR EN getAllProducts ===');
      console.error('Error completo:', error);
      
      // Análisis detallado del error
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        console.error('📡 Detalles del error de red:');
        console.error(`   Status: ${axiosError.response?.status}`);
        console.error(`   StatusText: ${axiosError.response?.statusText}`);
        console.error(`   URL: ${axiosError.config?.url}`);
        console.error(`   Method: ${axiosError.config?.method}`);
        console.error(`   Response Data:`, axiosError.response?.data);
      }
      
      throw new Error('Error al obtener productos de la API');
    }
  }

  /**
   * Obtiene un producto por ID - CON DEBUG MEJORADO
   */
  async getProductById(id: number): Promise<FrontendProduct> {
    try {
      console.log(`🚀 === OBTENIENDO PRODUCTO ID: ${id} ===`);
      
      const response = await api.get<BackendProductEntity>(`${this.baseUrl}/${id}`);
      
      console.log('📡 Respuesta para producto individual:');
      console.log(`   Status: ${response.status}`);
      console.log('   Datos recibidos:', JSON.stringify(response.data, null, 2));
      
      // 🔍 DEBUG PARA PRODUCTO INDIVIDUAL
      console.log('🔍 === ANALIZANDO PRODUCTO INDIVIDUAL ===');
      if (response.data && typeof response.data === 'object') {
        const product = response.data as any;
        console.log('📊 Tipos de datos del producto:');
        Object.entries(product).forEach(([key, value]) => {
          console.log(`  ${key}: ${typeof value} = ${JSON.stringify(value)}`);
        });
      }
      
      // 🧪 PROBAR MAPEO
      console.log('🧪 === PROBANDO MAPEO INDIVIDUAL ===');
      const mappedProduct = mapBackendToFrontend(response.data);
      
      console.log('✅ Producto mapeado exitosamente');
      console.log('🎉 Resultado final:', mappedProduct);
      
      return mappedProduct;
      
    } catch (error) {
      console.error(`❌ === ERROR OBTENIENDO PRODUCTO ${id} ===`);
      console.error('Error completo:', error);
      
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        console.error('📡 Detalles del error:');
        console.error(`   Status: ${axiosError.response?.status}`);
        console.error(`   Data:`, axiosError.response?.data);
      }
      
      throw new Error(`Error al obtener producto con ID ${id}`);
    }
  }

  /**
   * Crea un producto usando multipart/form-data para compatibilidad con el backend
   */
  async createProduct(productData: BackendCreateProductDto, files?: File[]): Promise<FrontendProduct> {
    try {
      console.log('🚀 === CREANDO PRODUCTO ===');
      console.log('📤 Datos a enviar:', JSON.stringify(productData, null, 2));
      console.log('📁 Archivos a subir:', files?.length || 0);
      
      // Crear FormData para multipart/form-data
      const formData = new FormData();
      
      // Agregar campos del producto
      formData.append('nombre', productData.nombre);
      formData.append('descripcion', productData.descripcion);
      formData.append('precio', productData.precio.toString());
      if (productData.categoria) {
        formData.append('categoria', productData.categoria);
      }
      
      // Agregar archivos si existen
      if (files && files.length > 0) {
        files.forEach((file, index) => {
          formData.append('images', file);
        });
      }
      
      const response = await api.post<BackendProductEntity>(
        this.baseUrl,
        formData,
        {
          headers: { 
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      console.log('📡 Respuesta del servidor al crear:');
      console.log(`   Status: ${response.status}`);
      console.log('   Producto creado:', JSON.stringify(response.data, null, 2));
      
      // 🧪 MAPEAR RESPUESTA
      const mappedProduct = mapBackendToFrontend(response.data);
      console.log('✅ Producto creado y mapeado exitosamente');
      
      return mappedProduct;
      
    } catch (error) {
      console.error('❌ === ERROR CREANDO PRODUCTO ===');
      console.error('Error completo:', error);
      
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        console.error('📡 Detalles del error de creación:');
        console.error(`   Status: ${axiosError.response?.status}`);
        console.error(`   StatusText: ${axiosError.response?.statusText}`);
        console.error(`   Response Data:`, axiosError.response?.data);
        console.error(`   Request Data:`, productData);
      }
      
      throw new Error('Error al crear producto en el servidor');
    }
  }

  /**
   * Actualiza un producto existente - CON DEBUG
   */
  async updateProduct(id: number, productData: Partial<FrontendProduct>): Promise<string> {
    try {
      console.log(`🚀 === ACTUALIZANDO PRODUCTO ${id} ===`);
      console.log('📤 Datos del frontend recibidos:', JSON.stringify(productData, null, 2));
      
      const updateDto = mapFrontendToUpdateDto(productData);
      console.log('📋 DTO generado para backend:', JSON.stringify(updateDto, null, 2));
      
      const response = await api.patch<string>(`${this.baseUrl}/${id}`, updateDto);
      
      console.log('📡 Respuesta del servidor:');
      console.log(`   Status: ${response.status}`);
      console.log(`   Message: ${response.data}`);
      console.log('✅ Producto actualizado exitosamente');
      
      return response.data;
      
    } catch (error) {
      console.error(`❌ === ERROR ACTUALIZANDO PRODUCTO ${id} ===`);
      console.error('Error completo:', error);
      console.error('Datos que se intentaron actualizar:', productData);
      
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        console.error('📡 Detalles del error de actualización:');
        console.error(`   Status: ${axiosError.response?.status}`);
        console.error(`   Data:`, axiosError.response?.data);
      }
      
      throw new Error(`Error al actualizar producto con ID ${id}`);
    }
  }

  /**
   * Elimina un producto - CON DEBUG
   */
  async deleteProduct(id: number): Promise<string> {
    try {
      console.log(`🚀 === ELIMINANDO PRODUCTO ${id} ===`);
      
      const response = await api.delete<string>(`${this.baseUrl}/${id}`);
      
      console.log('📡 Respuesta del servidor:');
      console.log(`   Status: ${response.status}`);
      console.log(`   Message: ${response.data}`);
      console.log('✅ Producto eliminado exitosamente');
      
      return response.data;
      
    } catch (error) {
      console.error(`❌ === ERROR ELIMINANDO PRODUCTO ${id} ===`);
      console.error('Error completo:', error);
      
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        console.error('📡 Detalles del error de eliminación:');
        console.error(`   Status: ${axiosError.response?.status}`);
        console.error(`   Data:`, axiosError.response?.data);
      }
      
      throw new Error(`Error al eliminar producto con ID ${id}`);
    }
  }

  /**
   * Realiza un health check simple - CON DEBUG
   */
  async healthCheck(): Promise<boolean> {
    try {
      console.log('🔍 === HEALTH CHECK DE PRODUCTOS API ===');
      
      const response = await api.get(`${this.baseUrl}`);
      
      console.log('📡 Health check response:');
      console.log(`   Status: ${response.status}`);
      console.log(`   ✅ API está funcionando correctamente`);
      
      return response.status === 200;
      
    } catch (error) {
      console.error('❌ === HEALTH CHECK FALLIDO ===');
      console.error('Error:', error);
      
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        console.error(`   Status: ${axiosError.response?.status}`);
        console.error(`   ❌ API no está disponible`);
      }
      
      return false;
    }
  }

  /**
   * 🛠️ MÉTODO TEMPORAL PARA DEBUG - eliminar después
   */
  async debugMode(): Promise<void> {
    console.log('🔧 === MODO DEBUG ACTIVADO ===');
    
    try {
      // Test health check
      const isHealthy = await this.healthCheck();
      console.log(`🏥 Health check: ${isHealthy ? '✅ OK' : '❌ FAIL'}`);
      
      if (isHealthy) {
        // Test getAllProducts con análisis detallado
        console.log('🧪 Probando getAllProducts...');
        const products = await this.getAllProducts();
        console.log(`📊 Resultado: ${products.length} productos obtenidos`);
        
        // Test producto individual si hay productos
        if (products.length > 0) {
          console.log('🧪 Probando getProductById...');
          const firstProduct = await this.getProductById(products[0].ProductID);
          console.log(`📦 Producto individual obtenido: ${firstProduct.ProductName}`);
        }
      }
      
    } catch (error) {
      console.error('❌ Error en modo debug:', error);
    }
    
    console.log('🔧 === FIN MODO DEBUG ===');
  }
}

export const productsApiService = new ProductsApiService();

// 🛠️ FUNCIONES DE DEBUG EXPORTADAS PARA USO MANUAL
export const debugFunctions = {
  // Inspeccionar datos crudos
  async inspectRawData(): Promise<void> {
    try {
      const response = await api.get('/products');
      debugProductData(response.data);
    } catch (error) {
      console.error('Error inspeccionando datos:', error);
    }
  },
  
  // Probar mapeo de un producto específico
  async testProductMapping(productId: number): Promise<void> {
    try {
      const response = await api.get(`/products/${productId}`);
      testSingleProductMapping(response.data);
    } catch (error) {
      console.error('Error probando mapeo:', error);
    }
  },
  
  // Activar modo debug completo
  async runFullDebug(): Promise<void> {
    await productsApiService.debugMode();
  }
};

// 🚨 PARA USAR EN CONSOLA DEL BROWSER (temporal):
// import { debugFunctions } from '@/services/productsApi'
// debugFunctions.runFullDebug()