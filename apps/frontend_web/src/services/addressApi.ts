// src/services/addressApi.ts
import api from '../lib/api';
import { 
  BackendAddress,
  BackendAddressSchema,
  FrontendAddress,
  CreateAddressRequest,
  UpdateAddressRequest,
  CreateAddressRequestSchema,
  UpdateAddressRequestSchema,
  AddressTransformSchema
} from '@/schemas/address';

class AddressApiService {
  private readonly baseUrl = '/misdirecciones';

  /**
   * GET /misdirecciones/usuario/:usuarioId - Obtener direcciones del usuario
   */
  async getUserAddresses(userId: number): Promise<FrontendAddress[]> {
    try {
      console.log(`🏠 === OBTENIENDO DIRECCIONES DEL USUARIO ${userId} ===`);
      
      const response = await api.get<BackendAddress[]>(`${this.baseUrl}/usuario/${userId}`);
      
      console.log('📡 Respuesta de direcciones (backend):');
      console.log(`   Status: ${response.status}`);
      console.log(`   Direcciones encontradas: ${response.data.length}`);
      console.log('   Raw data:', response.data);
      
      // Validar y transformar cada dirección
      const validatedAddresses = response.data.map(address => BackendAddressSchema.parse(address));
      const frontendAddresses: FrontendAddress[] = validatedAddresses.map(address => 
        AddressTransformSchema.parse(address)
      );
      
      console.log('✅ Direcciones mapeadas para frontend:', frontendAddresses);
      
      return frontendAddresses;
      
    } catch (error) {
      console.error('❌ === ERROR OBTENIENDO DIRECCIONES ===');
      console.error('Error completo:', error);
      
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        
        if (axiosError.response?.status === 404) {
          // Usuario no tiene direcciones - devolver array vacío
          console.log('📝 Usuario no tiene direcciones guardadas');
          return [];
        }
        
        const backendMessage = axiosError.response?.data?.message;
        throw new Error(backendMessage || `Error del servidor (${axiosError.response?.status})`);
      }
      
      throw new Error('Error al obtener las direcciones');
    }
  }

  /**
   * GET /misdirecciones/:id - Obtener una dirección por ID
   */
  async getAddressById(addressId: number): Promise<FrontendAddress> {
    try {
      console.log(`🏠 === OBTENIENDO DIRECCIÓN ${addressId} ===`);
      
      const response = await api.get<BackendAddress>(`${this.baseUrl}/${addressId}`);
      
      console.log('📡 Dirección obtenida (backend):');
      console.log(`   Status: ${response.status}`);
      console.log('   Address data:', response.data);
      
      // Validar y transformar dirección
      const validatedAddress = BackendAddressSchema.parse(response.data);
      const frontendAddress = AddressTransformSchema.parse(validatedAddress);
      
      console.log('✅ Dirección mapeada para frontend:', frontendAddress);
      
      return frontendAddress;
      
    } catch (error) {
      console.error('❌ === ERROR OBTENIENDO DIRECCIÓN ===');
      console.error('Error completo:', error);
      
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        const backendMessage = axiosError.response?.data?.message;
        
        if (axiosError.response?.status === 404) {
          throw new Error('Dirección no encontrada');
        }
        
        throw new Error(backendMessage || `Error del servidor (${axiosError.response?.status})`);
      }
      
      throw new Error('Error al obtener la dirección');
    }
  }

  /**
   * POST /misdirecciones - Crear nueva dirección
   */
  async createAddress(addressData: CreateAddressRequest): Promise<FrontendAddress> {
    try {
      console.log(`🏠 === CREANDO NUEVA DIRECCIÓN ===`);
      console.log(`   Usuario: ${addressData.usuarioId}`);
      console.log('   Datos:', { ...addressData, numero_celular: '[HIDDEN]' });
      
      // Validar datos antes de enviar
      const validatedRequest = CreateAddressRequestSchema.parse(addressData);
      
      const response = await api.post<BackendAddress>(`${this.baseUrl}`, validatedRequest);
      
      console.log('📡 Dirección creada (backend):');
      console.log(`   Status: ${response.status}`);
      console.log('   Created address:', response.data);
      
      // Validar y transformar respuesta
      const validatedAddress = BackendAddressSchema.parse(response.data);
      const frontendAddress = AddressTransformSchema.parse(validatedAddress);
      
      console.log('✅ Dirección creada y mapeada:', frontendAddress);
      
      return frontendAddress;
      
    } catch (error) {
      console.error('❌ === ERROR CREANDO DIRECCIÓN ===');
      console.error('Error completo:', error);
      
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        const backendMessage = axiosError.response?.data?.message;
        
        if (axiosError.response?.status === 400) {
          throw new Error(backendMessage || 'Datos inválidos para crear dirección');
        }
        
        throw new Error(backendMessage || `Error del servidor (${axiosError.response?.status})`);
      }
      
      throw new Error('Error al crear la dirección');
    }
  }

  /**
   * PATCH /misdirecciones/:id - Actualizar dirección
   */
  async updateAddress(addressId: number, addressData: UpdateAddressRequest): Promise<FrontendAddress> {
    try {
      console.log(`🏠 === ACTUALIZANDO DIRECCIÓN ${addressId} ===`);
      console.log('   Datos a actualizar:', addressData);
      
      // Validar datos antes de enviar
      const validatedRequest = UpdateAddressRequestSchema.parse(addressData);
      
      const response = await api.patch<BackendAddress>(`${this.baseUrl}/${addressId}`, validatedRequest);
      
      console.log('📡 Dirección actualizada (backend):');
      console.log(`   Status: ${response.status}`);
      console.log('   Updated address:', response.data);
      
      // Validar y transformar respuesta
      const validatedAddress = BackendAddressSchema.parse(response.data);
      const frontendAddress = AddressTransformSchema.parse(validatedAddress);
      
      console.log('✅ Dirección actualizada y mapeada:', frontendAddress);
      
      return frontendAddress;
      
    } catch (error) {
      console.error('❌ === ERROR ACTUALIZANDO DIRECCIÓN ===');
      console.error('Error completo:', error);
      
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        const backendMessage = axiosError.response?.data?.message;
        
        if (axiosError.response?.status === 404) {
          throw new Error('Dirección no encontrada');
        } else if (axiosError.response?.status === 400) {
          throw new Error(backendMessage || 'Datos inválidos para actualizar dirección');
        }
        
        throw new Error(backendMessage || `Error del servidor (${axiosError.response?.status})`);
      }
      
      throw new Error('Error al actualizar la dirección');
    }
  }

  /**
   * DELETE /misdirecciones/:id - Eliminar dirección
   */
  async deleteAddress(addressId: number): Promise<void> {
    try {
      console.log(`🏠 === ELIMINANDO DIRECCIÓN ${addressId} ===`);
      
      const response = await api.delete(`${this.baseUrl}/${addressId}`);
      
      console.log('📡 Dirección eliminada:');
      console.log(`   Status: ${response.status}`);
      
      console.log('✅ Dirección eliminada exitosamente');
      
    } catch (error) {
      console.error('❌ === ERROR ELIMINANDO DIRECCIÓN ===');
      console.error('Error completo:', error);
      
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        const backendMessage = axiosError.response?.data?.message;
        
        if (axiosError.response?.status === 404) {
          throw new Error('Dirección no encontrada');
        }
        
        throw new Error(backendMessage || `Error del servidor (${axiosError.response?.status})`);
      }
      
      throw new Error('Error al eliminar la dirección');
    }
  }

  /**
   * Utility: Crear dirección desde datos del usuario
   */
  createAddressFromUserData(userData: {
    nombre: string;
    calle: string;
    colonia_fraccionamiento: string;
    numero_interior?: number | null;
    numero_exterior?: number | null;
    numero_celular: string;
    codigo_postal: string;
    estado: string;
    municipio: string;
    mas_info?: string;
  }, userId: number): CreateAddressRequest {
    return CreateAddressRequestSchema.parse({
      ...userData,
      usuarioId: userId,
    });
  }

  /**
   * Health check for address service
   */
  async healthCheck(): Promise<{ isHealthy: boolean; error?: string }> {
    try {
      console.log('🏥 === VERIFICANDO ESTADO DE DIRECCIONES API ===');
      
      // Try to access a basic endpoint with invalid data to check server response
      await api.get(`${this.baseUrl}/usuario/0`, { timeout: 5000 });
      
      return { isHealthy: true };
    } catch (error) {
      console.log('🔍 Respuesta del address health check:', error);
      
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        // 404 means server is responding (just no addresses found)
        if (axiosError.response?.status === 404) {
          return { isHealthy: true };
        }
        return { 
          isHealthy: false, 
          error: `Address API responded with ${axiosError.response?.status}` 
        };
      }
      
      if (error && typeof error === 'object' && 'code' in error) {
        const axiosError = error as any;
        if (axiosError.code === 'ECONNABORTED') {
          return { isHealthy: false, error: 'Address API timeout' };
        }
        if (axiosError.code === 'ECONNREFUSED' || axiosError.code === 'ERR_NETWORK') {
          return { isHealthy: false, error: 'Cannot connect to address API' };
        }
      }
      
      return { isHealthy: false, error: 'Unknown address API error' };
    }
  }
}

export const addressApiService = new AddressApiService();