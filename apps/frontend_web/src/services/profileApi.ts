// src/services/profileApi.ts
import api from '../lib/api';
import { authApiService } from './authApi';
import { 
  mapBackendProfileToFrontend, 
  mapFrontendProfileToUpdateDto 
} from '../utils/mappers';
import {
  FrontendProfile,
  BackendCreateProfileDto,
  BackendUpdateProfileDto,
} from '../schemas/profile';

// ===== TYPES =====
export type Profile = FrontendProfile;
export type CreateProfileRequest = BackendCreateProfileDto;
export type UpdateProfileRequest = BackendUpdateProfileDto;

// ===== PROFILE API SERVICE =====
class ProfileApiService {
  private readonly baseUrl = '/profile';

  /**
   * Get authenticated headers
   */
  private getAuthHeaders() {
    const token = authApiService.getAuthToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  /**
   * Create new profile
   */
  async createProfile(data: CreateProfileRequest): Promise<Profile> {
    try {
      console.log('👤 === CREANDO PERFIL ===');
      console.log('📤 Datos del perfil:', data);
      
      const response = await api.post(this.baseUrl, data, {
        headers: this.getAuthHeaders(),
      });
      
      console.log('📡 Respuesta de creación de perfil:');
      console.log(`   Status: ${response.status}`);
      
      // Map backend response to frontend format
      const mappedProfile = mapBackendProfileToFrontend(response.data);
      console.log(`   Perfil creado con ID: ${mappedProfile.id}`);
      
      return mappedProfile;
      
    } catch (error) {
      console.error('❌ === ERROR CREANDO PERFIL ===');
      console.error('Error completo:', error);
      
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        console.error('📡 Detalles del error:');
        console.error(`   Status: ${axiosError.response?.status}`);
        console.error(`   Data:`, axiosError.response?.data);
        
        if (axiosError.response?.status === 401) {
          throw new Error('No estás autenticado. Por favor inicia sesión.');
        }
      }
      
      throw new Error('Error al crear el perfil');
    }
  }

  /**
   * Get profile by ID
   */
  async getProfile(profileId: number): Promise<Profile> {
    try {
      console.log(`👤 === OBTENIENDO PERFIL ${profileId} ===`);
      
      const response = await api.get(`${this.baseUrl}/${profileId}`, {
        headers: this.getAuthHeaders(),
      });
      
      console.log('📡 Perfil obtenido:');
      console.log(`   Status: ${response.status}`);
      
      // Map backend response to frontend format
      const mappedProfile = mapBackendProfileToFrontend(response.data);
      console.log(`   Nombre: ${mappedProfile.nombre || 'Sin nombre'}`);
      
      return mappedProfile;
      
    } catch (error) {
      console.error(`❌ === ERROR OBTENIENDO PERFIL ${profileId} ===`);
      console.error('Error completo:', error);
      
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        console.error('📡 Detalles del error:');
        console.error(`   Status: ${axiosError.response?.status}`);
        
        if (axiosError.response?.status === 404) {
          throw new Error('Perfil no encontrado');
        } else if (axiosError.response?.status === 401) {
          throw new Error('No estás autenticado. Por favor inicia sesión.');
        }
      }
      
      throw new Error('Error al obtener el perfil');
    }
  }

  /**
   * Get all profiles (admin only)
   */
  async getAllProfiles(): Promise<Profile[]> {
    try {
      console.log('👥 === OBTENIENDO TODOS LOS PERFILES ===');
      
      const response = await api.get<Profile[]>(this.baseUrl, {
        headers: this.getAuthHeaders(),
      });
      
      console.log('📡 Perfiles obtenidos:');
      console.log(`   Status: ${response.status}`);
      console.log(`   Total perfiles: ${response.data.length}`);
      
      return response.data;
      
    } catch (error) {
      console.error('❌ === ERROR OBTENIENDO PERFILES ===');
      console.error('Error completo:', error);
      
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        if (axiosError.response?.status === 401) {
          throw new Error('No estás autenticado. Por favor inicia sesión.');
        } else if (axiosError.response?.status === 403) {
          throw new Error('No tienes permisos para ver todos los perfiles.');
        }
      }
      
      throw new Error('Error al obtener los perfiles');
    }
  }

  /**
   * Update profile
   */
  async updateProfile(profileId: number, data: Partial<Profile>): Promise<Profile> {
    try {
      console.log(`👤 === ACTUALIZANDO PERFIL ${profileId} ===`);
      console.log('📤 Datos frontend a actualizar:', data);
      
      // Map frontend data to backend DTO format
      const backendData = mapFrontendProfileToUpdateDto(data);
      console.log('📤 Datos mapeados para backend:', backendData);
      
      const response = await api.patch(`${this.baseUrl}/${profileId}`, backendData, {
        headers: this.getAuthHeaders(),
      });
      
      console.log('📡 Perfil actualizado:');
      console.log(`   Status: ${response.status}`);
      
      // Map backend response to frontend format
      const mappedProfile = mapBackendProfileToFrontend(response.data);
      console.log(`   Perfil ID: ${mappedProfile.id}`);
      
      return mappedProfile;
      
    } catch (error) {
      console.error(`❌ === ERROR ACTUALIZANDO PERFIL ${profileId} ===`);
      console.error('Error completo:', error);
      
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        console.error('📡 Detalles del error:');
        console.error(`   Status: ${axiosError.response?.status}`);
        
        if (axiosError.response?.status === 404) {
          throw new Error('Perfil no encontrado');
        } else if (axiosError.response?.status === 401) {
          throw new Error('No estás autenticado. Por favor inicia sesión.');
        } else if (axiosError.response?.status === 403) {
          throw new Error('No tienes permisos para actualizar este perfil.');
        }
      }
      
      throw new Error('Error al actualizar el perfil');
    }
  }

  /**
   * Delete profile
   */
  async deleteProfile(profileId: number): Promise<void> {
    try {
      console.log(`👤 === ELIMINANDO PERFIL ${profileId} ===`);
      
      await api.delete(`${this.baseUrl}/${profileId}`, {
        headers: this.getAuthHeaders(),
      });
      
      console.log('✅ Perfil eliminado correctamente');
      
    } catch (error) {
      console.error(`❌ === ERROR ELIMINANDO PERFIL ${profileId} ===`);
      console.error('Error completo:', error);
      
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        if (axiosError.response?.status === 404) {
          throw new Error('Perfil no encontrado');
        } else if (axiosError.response?.status === 401) {
          throw new Error('No estás autenticado. Por favor inicia sesión.');
        } else if (axiosError.response?.status === 403) {
          throw new Error('No tienes permisos para eliminar este perfil.');
        }
      }
      
      throw new Error('Error al eliminar el perfil');
    }
  }

  /**
   * Upload profile avatar
   */
  async uploadAvatar(profileId: number, file: File): Promise<{ url: string }> {
    try {
      console.log(`📷 === SUBIENDO AVATAR PARA PERFIL ${profileId} ===`);
      console.log(`📁 Archivo: ${file.name} (${file.size} bytes)`);
      
      const formData = new FormData();
      formData.append('imagen', file);
      
      const response = await api.post<{ url: string }>(
        `${this.baseUrl}/${profileId}/avatar`,
        formData,
        {
          headers: {
            ...this.getAuthHeaders(),
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      console.log('📡 Avatar subido:');
      console.log(`   Status: ${response.status}`);
      console.log(`   URL: ${response.data.url}`);
      
      return response.data;
      
    } catch (error) {
      console.error(`❌ === ERROR SUBIENDO AVATAR PERFIL ${profileId} ===`);
      console.error('Error completo:', error);
      console.error('📋 Archivo:', { name: file.name, size: file.size, type: file.type });
      
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        console.error('📡 Detalles del error:');
        console.error(`   Status: ${axiosError.response?.status}`);
        
        if (axiosError.response?.status === 413) {
          throw new Error('El archivo es demasiado grande. Máximo 5MB.');
        } else if (axiosError.response?.status === 400) {
          throw new Error('Formato de imagen no válido. Usa JPG o PNG.');
        } else if (axiosError.response?.status === 404) {
          throw new Error('Perfil no encontrado');
        } else if (axiosError.response?.status === 401) {
          throw new Error('No estás autenticado. Por favor inicia sesión.');
        }
      }
      
      throw new Error('Error al subir la imagen del perfil');
    }
  }

  /**
   * Health check for profile service
   */
  async healthCheck(): Promise<boolean> {
    try {
      console.log('🔍 === HEALTH CHECK DE PROFILE API ===');
      
      const response = await api.get(this.baseUrl, {
        headers: this.getAuthHeaders(),
      });
      
      console.log(`✅ Profile API está funcionando (Status: ${response.status})`);
      return true;
      
    } catch (error) {
      // 401 means the service is working (just unauthorized)
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        if (axiosError.response?.status === 401) {
          console.log('✅ Profile API está funcionando (401 esperado sin auth)');
          return true;
        }
      }
      
      console.error('❌ Profile API no está disponible');
      return false;
    }
  }
}

export const profileApiService = new ProfileApiService();