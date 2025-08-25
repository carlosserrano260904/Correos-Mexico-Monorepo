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
   * Sube una imagen a tu backend/S3 y devuelve el key generado.
   * NO establecemos manualmente el header 'Content-Type', ya que axios lo gestiona.
   */
 async uploadImage(file: File): Promise<string> {

  console.log('🔍 uploadImage llamado con:', file);

  try {
    console.log('🔍 Subiendo imagen:', file.name);

    const formData = new FormData();
    // Aquí el nombre de campo debe coincidir con FileInterceptor('file') de tu backend
    formData.append('file', file);

    // No definas Content-Type, axios lo hará por ti con el boundary correcto
    const response = await api.post<UploadResponse>(
        '/upload-image/image',
        formData
      );


    console.log('✅ Imagen subida con key:', response.data.url);
    return response.data.url;
  } catch (error) {
    console.error('❌ Error subiendo imagen:', error);
    throw new Error('Error al subir imagen');
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
}

export const uploadApiService = new UploadApiService();
