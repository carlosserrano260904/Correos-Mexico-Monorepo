// src/services/uploadApi.ts
import api from '../lib/api';

// Interfaces de respuesta que devuelve tu backend
interface UploadResponse {
  url: string; // Key en S3 (o similar) que devuelve el backend
}

interface SignedUrlResponse {
  signedUrl: string;
}

/**
 * Servicio para subir imágenes y obtener URL firmadas.
 */
class UploadApiService {
  private readonly baseUrl = '/upload-image';

  /**
   * Health check to test connectivity to upload service
   */
  async healthCheck(): Promise<boolean> {
    try {
      console.log('🔍 Testing upload service connectivity...');
      const response = await api.get('/upload-image/health');
      console.log('✅ Upload service health check passed:', response.data);
      return true;
    } catch (error) {
      console.error('❌ Upload service health check failed:', error);
      return false;
    }
  }

  /**
   * Sube una imagen a tu backend/S3 y devuelve el key generado.
   * NO establecemos manualmente el header 'Content-Type', ya que axios lo gestiona.
   */
 async uploadImage(file: File): Promise<string> {

  console.log('🔍 uploadImage llamado con:', file);
  console.log('📊 File details:', {
    name: file.name,
    size: file.size,
    type: file.type,
    lastModified: file.lastModified
  });

  try {
    // First, test connectivity
    console.log('🔗 Testing backend connectivity...');
    const isHealthy = await this.healthCheck();
    if (!isHealthy) {
      throw new Error('Backend upload service is not accessible. Please check if the backend server is running.');
    }

    console.log('🔍 Subiendo imagen:', file.name);

    const formData = new FormData();
    // Aquí el nombre de campo debe coincidir con FileInterceptor('file') de tu backend
    formData.append('file', file);

    console.log('📤 Sending request to: /upload-image/image');
    console.log('🌐 API Base URL:', api.defaults.baseURL);
    
    // No definas Content-Type, axios lo hará por ti con el boundary correcto
    const response = await api.post<UploadResponse>(
        '/upload-image/image',
        formData,
        {
          headers: {
            'Accept': 'application/json',
          },
          timeout: 30000, // 30 second timeout for uploads
        }
      );

    console.log('📡 Response status:', response.status);
    console.log('✅ Imagen subida con key:', response.data.url);
    return response.data.url;
  } catch (error) {
    console.error('❌ Error subiendo imagen:', error);
    
    // Enhanced error logging for debugging
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as any;
      console.error('📡 Axios error details:');
      console.error('   Status:', axiosError.response?.status);
      console.error('   StatusText:', axiosError.response?.statusText);
      console.error('   Data:', axiosError.response?.data);
      console.error('   Headers:', axiosError.response?.headers);
      console.error('   URL:', axiosError.config?.url);
      console.error('   Method:', axiosError.config?.method);
      
      // Provide more specific error message
      if (axiosError.code === 'ERR_NETWORK') {
        throw new Error('Network error: Cannot connect to backend server. Please check if the backend is running on port 3000.');
      } else if (axiosError.code === 'ECONNREFUSED') {
        throw new Error('Connection refused: Backend server is not accepting connections. Please start the backend server.');
      } else if (axiosError.message.includes('CORS')) {
        throw new Error('CORS error: Backend server is not allowing requests from this origin. Please check CORS configuration.');
      } else if (axiosError.response?.status === 500) {
        throw new Error(`Server error during image upload: ${axiosError.response?.data?.message || 'Internal server error'}`);
      } else if (axiosError.response?.status === 413) {
        throw new Error('Image file is too large (max 10MB allowed)');
      } else if (axiosError.response?.status === 415) {
        throw new Error('Unsupported file type (only images allowed)');
      } else if (axiosError.response?.status === 400) {
        throw new Error(`Bad request: ${axiosError.response?.data?.message || 'Invalid file or request'}`);
      } else if (!axiosError.response) {
        throw new Error('Network error: No response from server. Check if backend is running and accessible.');
      } else {
        throw new Error(`Upload failed with status ${axiosError.response?.status}: ${axiosError.response?.statusText}`);
      }
    }
    
    throw new Error('Error al subir imagen: ' + (error instanceof Error ? error.message : 'Unknown error'));
  }
  
}


  /**
   * Obtiene una URL firmada a partir del key.
   */
  async getSignedUrl(key: string): Promise<string> {
    try {
      console.log('🔍 Obteniendo signed URL para:', key);

      const response = await api.get<SignedUrlResponse>(
        `${this.baseUrl}/signed-url?key=${encodeURIComponent(key)}`
      );

      console.log('✅ Signed URL obtenida');
      return response.data.signedUrl;
    } catch (error) {
      console.error('❌ Error obteniendo signed URL:', error);
      return 'https://res.cloudinary.com/dgpd2ljyh/image/upload/v1748920792/default_nlbjlp.jpg';
    }
  }

  /**
   * Devuelve la URL para mostrar una imagen; usa la default si no hay key.
   */
  async getImageUrl(key: string | null): Promise<string> {
    if (!key) {
      return 'https://res.cloudinary.com/dgpd2ljyh/image/upload/v1748920792/default_nlbjlp.jpg';
    }
    return await this.getSignedUrl(key);
  }

  /**
   * Test network connectivity to backend
   */
  async testConnectivity(): Promise<{ success: boolean; message: string; details?: any }> {
    try {
      console.log('🔍 Testing network connectivity to backend...');
      console.log('🌐 API Base URL:', api.defaults.baseURL);
      
      // Test basic API connectivity first
      const response = await api.get('/upload-image/health', { timeout: 5000 });
      
      return {
        success: true,
        message: 'Backend connection successful',
        details: {
          status: response.status,
          baseURL: api.defaults.baseURL,
          timestamp: new Date().toISOString()
        }
      };
    } catch (error: any) {
      let message = 'Unknown connection error';
      const details: any = {
        baseURL: api.defaults.baseURL,
        timestamp: new Date().toISOString()
      };
      
      if (error.code === 'ERR_NETWORK') {
        message = 'Network error: Cannot reach backend server';
        details.suggestion = 'Check if backend server is running on the correct port';
      } else if (error.code === 'ECONNREFUSED') {
        message = 'Connection refused by backend server';
        details.suggestion = 'Start the backend server';
      } else if (error.response) {
        message = `Backend responded with error: ${error.response.status}`;
        details.status = error.response.status;
        details.statusText = error.response.statusText;
      } else {
        message = error.message || 'Unknown error';
      }
      
      return {
        success: false,
        message,
        details
      };
    }
  }
}

export const uploadApiService = new UploadApiService();
