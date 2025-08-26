// src/services/authApi.ts
import api from '../lib/api';
import { 
  mapBackendAuthToFrontend, 
  mapBackendSignupToFrontend,
  mapBackendUserToFrontend, 
  mapBackendOtpToFrontend 
} from '../utils/mappers';
import {
  BackendLoginRequest,
  BackendRegisterRequest,
  BackendVerifyOtpRequest,
  BackendResendOtpRequest,
  FrontendAuthResponse,
  FrontendUserProfile,
  FrontendOtpResponse,
} from '../schemas/auth';

// ===== TYPES =====
export interface RegisterRequest {
  correo: string;
  contrasena: string;
  nombre?: string;
  apellido?: string;
}

export interface LoginRequest {
  correo: string;
  contrasena: string;
}

export interface AuthResponse {
  access_token?: string;
  token?: string; // For signup response
  user?: {
    id: number;
    correo: string;
    nombre?: string;
    apellido?: string;
  };
  // For signup response
  id?: number;
  userId?: number;
}

export interface UserProfile {
  id: number;
  correo: string;
  nombre?: string;
  apellido?: string;
  // Add other profile fields as needed
}

export interface VerifyOtpRequest {
  correo: string;
  token: string;
}

export interface ResendOtpRequest {
  correo: string;
}

export interface UpdatePasswordRequest {
  correo: string;
  contrasena: string;
}

// ===== AUTH API SERVICE =====
class AuthApiService {
  private readonly baseUrl = '/auth';

  /**
   * Register new user
   */
  async register(data: RegisterRequest): Promise<FrontendAuthResponse> {
    try {
      console.log('🔐 === REGISTRANDO NUEVO USUARIO ===');
      console.log('📤 Datos de registro:', { ...data, contrasena: '[HIDDEN]' });
      
      const response = await api.post(`${this.baseUrl}/signup`, data);
      
      console.log('📡 Respuesta de registro:');
      console.log(`   Status: ${response.status}`);
      console.log(`   Token temporal recibido para verificación OTP`);
      
      // Map backend response to frontend format
      const mappedResponse = mapBackendSignupToFrontend(response.data, data.correo);
      
      // For signup, don't store auth token yet (user needs to verify OTP first)
      // Store minimal info for OTP verification
      if (mappedResponse.token) {
        localStorage.setItem('temp_signup_data', JSON.stringify({
          correo: data.correo,
          token: mappedResponse.token,
          userId: mappedResponse.userId,
          needsVerification: mappedResponse.needsVerification || true
        }));
      }
      
      return mappedResponse;
      
    } catch (error) {
      console.error('❌ === ERROR EN REGISTRO ===');
      console.error('Error completo:', error);
      
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        console.error('📡 Detalles del error:');
        console.error(`   Status: ${axiosError.response?.status}`);
        console.error(`   Data:`, axiosError.response?.data);
        
        // Handle specific error cases
        if (axiosError.response?.status === 409) {
          // Email already exists
          const backendMessage = axiosError.response?.data?.message;
          throw new Error(backendMessage || 'Ya existe una cuenta con este correo electrónico');
        } else if (axiosError.response?.status === 400) {
          const backendMessage = axiosError.response?.data?.message;
          throw new Error(backendMessage || 'Datos de registro inválidos');
        } else {
          // Other errors
          const backendMessage = axiosError.response?.data?.message;
          throw new Error(backendMessage || `Error del servidor (${axiosError.response?.status})`);
        }
      }
      
      throw new Error('Error al crear la cuenta. Por favor intenta de nuevo.');
    }
  }

  /**
   * Login user
   */
  async login(data: LoginRequest): Promise<FrontendAuthResponse> {
    try {
      console.log('🔐 === INICIANDO SESIÓN ===');
      console.log('📤 Datos de login:', { correo: data.correo, contrasena: '[HIDDEN]' });
      console.log('📤 Datos completos enviados al backend:', { ...data, contrasena: '[HIDDEN]' });
      
      // Clean and validate data to match backend expectations
      const cleanedData = {
        correo: data.correo,
        contrasena: data.contrasena
      };
      
      console.log('📤 Datos limpios para el backend:', { correo: cleanedData.correo, contrasena: '[HIDDEN]' });
      
      const response = await api.post(`${this.baseUrl}/signin`, cleanedData);
      
      console.log('📡 Respuesta de login:');
      console.log(`   Status: ${response.status}`);
      
      // Map backend response to frontend format
      const mappedResponse = mapBackendAuthToFrontend(response.data);
      
      console.log(`   Usuario autenticado: ${mappedResponse.user.correo}`);
      
      // Store token in localStorage
      if (mappedResponse.access_token) {
        localStorage.setItem('auth_token', mappedResponse.access_token);
        localStorage.setItem('current_user', JSON.stringify(mappedResponse.user));
      }
      
      return mappedResponse;
      
    } catch (error) {
      console.error('❌ === ERROR EN LOGIN ===');
      console.error('Error completo:', error);
      
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        console.error('📡 Detalles del error:');
        console.error(`   Status: ${axiosError.response?.status}`);
        console.error(`   Data:`, axiosError.response?.data);
        
        // Handle specific error cases
        if (axiosError.response?.status === 400) {
          const errorData = axiosError.response?.data;
          if (errorData && errorData.message) {
            console.error('❌ Error 400 - Mensaje específico:', errorData.message);
            throw new Error(`Error de validación: ${Array.isArray(errorData.message) ? errorData.message.join(', ') : errorData.message}`);
          }
          throw new Error('Datos de login inválidos. Verifica tu email y contraseña.');
        } else if (axiosError.response?.status === 401) {
          const errorData = axiosError.response?.data;
          if (errorData && errorData.message) {
            throw new Error(errorData.message);
          }
          throw new Error('Correo o contraseña incorrectos');
        } else if (axiosError.response?.status === 404) {
          throw new Error('No existe una cuenta con este correo electrónico');
        }
      }
      
      throw new Error('Error al iniciar sesión. Por favor intenta de nuevo.');
    }
  }

  /**
   * Get current user info
   */
  async getCurrentUser(): Promise<FrontendUserProfile> {
    try {
      console.log('👤 === OBTENIENDO USUARIO ACTUAL ===');
      
      const token = localStorage.getItem('auth_token');
      if (!token) {
        throw new Error('No hay token de autenticación');
      }
      
      console.log('🔍 Realizando petición al endpoint /auth/me...');
      
      const response = await api.get(`${this.baseUrl}/me`, {
        timeout: 15000, // Override default timeout for this specific request
      });
      
      console.log('📡 Usuario actual obtenido:');
      console.log(`   Status: ${response.status}`);
      console.log('   Response data:', response.data);
      
      // Map backend response to frontend format
      const mappedUser = mapBackendUserToFrontend(response.data);
      
      console.log(`   Usuario: ${mappedUser.correo}`);
      
      // Update stored user data
      localStorage.setItem('current_user', JSON.stringify(mappedUser));
      
      return mappedUser;
      
    } catch (error) {
      console.error('❌ === ERROR OBTENIENDO USUARIO ===');
      console.error('Error completo:', error);
      
      // Handle specific error types
      if (error && typeof error === 'object' && 'code' in error) {
        const axiosError = error as any;
        
        if (axiosError.code === 'ECONNABORTED') {
          // Timeout error - try to use cached data as fallback
          console.error('⏱️ Request timeout - intentando usar datos en caché');
          const cachedUser = this.getStoredUser();
          if (cachedUser) {
            console.log('💾 Usando datos de usuario en caché como fallback');
            return cachedUser;
          }
          throw new Error('El servidor no responde y no hay datos guardados. Verifica tu conexión.');
        }
        
        if (axiosError.code === 'NETWORK_ERROR' || axiosError.code === 'ERR_NETWORK') {
          // Network error - try to use cached data as fallback
          console.error('🌐 Network error - intentando usar datos en caché');
          const cachedUser = this.getStoredUser();
          if (cachedUser) {
            console.log('💾 Usando datos de usuario en caché como fallback');
            return cachedUser;
          }
          throw new Error('Sin conexión al servidor y no hay datos guardados.');
        }
      }
      
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        console.error('📡 Response error:');
        console.error(`   Status: ${axiosError.response?.status}`);
        console.error(`   Data:`, axiosError.response?.data);
        
        if (axiosError.response?.status === 401) {
          // Token expired or invalid, clear storage
          console.log('🚪 Token inválido - cerrando sesión automáticamente');
          this.logout();
          throw new Error('Sesión expirada. Por favor inicia sesión de nuevo.');
        }
        
        if (axiosError.response?.status === 404) {
          throw new Error('Endpoint de usuario no encontrado. Contacta soporte.');
        }
        
        if (axiosError.response?.status === 500) {
          throw new Error('Error interno del servidor. Intenta más tarde.');
        }
      }
      
      // Check if server is completely unreachable
      if (error && typeof error === 'object' && 'request' in error) {
        const axiosError = error as any;
        if (axiosError.request && !axiosError.response) {
          // Server unreachable - try cached data
          console.error('🔌 Servidor inaccesible - intentando usar datos en caché');
          const cachedUser = this.getStoredUser();
          if (cachedUser) {
            console.log('💾 Usando datos de usuario en caché como fallback');
            return cachedUser;
          }
          throw new Error('No se puede conectar al servidor y no hay datos guardados.');
        }
      }
      
      // Final fallback - try cached data
      const cachedUser = this.getStoredUser();
      if (cachedUser) {
        console.log('💾 Error desconocido - usando datos en caché como último recurso');
        return cachedUser;
      }
      
      throw new Error('Error al obtener información del usuario');
    }
  }

  /**
   * Logout user
   */
  logout(): void {
    console.log('🚪 === CERRANDO SESIÓN ===');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('current_user');
    console.log('✅ Sesión cerrada correctamente');
  }

  /**
   * Check if user is logged in
   */
  isAuthenticated(): boolean {
    const token = localStorage.getItem('auth_token');
    const user = localStorage.getItem('current_user');
    return !!(token && user);
  }

  /**
   * Get stored user data
   */
  getStoredUser(): FrontendUserProfile | null {
    try {
      const userStr = localStorage.getItem('current_user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Error parsing stored user:', error);
      return null;
    }
  }

  /**
   * Get stored auth token
   */
  getAuthToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  /**
   * OAuth login (Google/Facebook)
   */
  async oauthLogin(provider: 'google' | 'facebook', token: string): Promise<FrontendAuthResponse> {
    try {
      console.log(`🔐 === LOGIN CON ${provider.toUpperCase()} ===`);
      
      const response = await api.post(`${this.baseUrl}/oauth`, {
        provider,
        token,
      });
      
      console.log('📡 Respuesta de OAuth:');
      console.log(`   Status: ${response.status}`);
      
      // Map backend response to frontend format
      const mappedResponse = mapBackendAuthToFrontend(response.data);
      
      console.log(`   Usuario: ${mappedResponse.user.correo}`);
      
      // Store token in localStorage
      if (mappedResponse.access_token) {
        localStorage.setItem('auth_token', mappedResponse.access_token);
        localStorage.setItem('current_user', JSON.stringify(mappedResponse.user));
      }
      
      return mappedResponse;
      
    } catch (error) {
      console.error(`❌ === ERROR EN OAUTH ${provider.toUpperCase()} ===`);
      console.error('Error completo:', error);
      
      throw new Error(`Error al iniciar sesión con ${provider}`);
    }
  }

  /**
   * Password reset request
   */
  async requestPasswordReset(email: string): Promise<string> {
    try {
      console.log('🔐 === SOLICITUD RECUPERAR CONTRASEÑA ===');
      console.log('📧 Email:', email);
      
      const response = await api.post<{ message: string }>(`${this.baseUrl}/email-otp`, {
        correo: email,
      });
      
      console.log('✅ Solicitud de recuperación enviada');
      return response.data.message;
      
    } catch (error) {
      console.error('❌ === ERROR SOLICITUD RECUPERACIÓN ===');
      console.error('Error completo:', error);
      
      throw new Error('Error al enviar solicitud de recuperación de contraseña');
    }
  }

  /**
   * Verify OTP code
   */
  async verifyOtp(data: VerifyOtpRequest): Promise<FrontendOtpResponse> {
    try {
      console.log('🔐 === VERIFICANDO CÓDIGO OTP ===');
      console.log('📧 Email:', data.correo);
      
      const response = await api.post(`${this.baseUrl}/verify-otp`, data);
      
      console.log('📡 Respuesta de verificación OTP:');
      console.log(`   Status: ${response.status}`);
      console.log(`   Verificación exitosa`);
      
      // Map backend response to frontend format
      const mappedResponse = mapBackendOtpToFrontend(response.data);
      
      // Now store the real auth token after successful verification
      if (mappedResponse.access_token && mappedResponse.user) {
        localStorage.setItem('auth_token', mappedResponse.access_token);
        localStorage.setItem('current_user', JSON.stringify(mappedResponse.user));
      }
      
      // Clear temporary signup data
      localStorage.removeItem('temp_signup_data');
      
      return mappedResponse;
      
    } catch (error) {
      console.error('❌ === ERROR VERIFICANDO OTP ===');
      console.error('Error completo:', error);
      
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        console.error('📡 Detalles del error:');
        console.error(`   Status: ${axiosError.response?.status}`);
        console.error(`   Data:`, axiosError.response?.data);
        
        if (axiosError.response?.status === 401) {
          throw new Error('Código OTP incorrecto o expirado');
        }
      }
      
      throw new Error('Error al verificar el código OTP');
    }
  }

  /**
   * Resend OTP code
   */
  async resendOtp(data: ResendOtpRequest): Promise<string> {
    try {
      console.log('📧 === REENVIANDO CÓDIGO OTP ===');
      console.log('📧 Email:', data.correo);
      
      const response = await api.post<{ message: string }>(`${this.baseUrl}/email-otp`, data);
      
      console.log('✅ Código OTP reenviado');
      return response.data.message;
      
    } catch (error) {
      console.error('❌ === ERROR REENVIANDO OTP ===');
      console.error('Error completo:', error);
      
      throw new Error('Error al reenviar el código OTP');
    }
  }

  /**
   * Get temporary signup data (for OTP verification)
   */
  getTempSignupData(): any {
    try {
      const tempData = localStorage.getItem('temp_signup_data');
      return tempData ? JSON.parse(tempData) : null;
    } catch (error) {
      console.error('Error parsing temp signup data:', error);
      return null;
    }
  }

  /**
   * Clear temporary signup data
   */
  clearTempSignupData(): void {
    localStorage.removeItem('temp_signup_data');
  }

  /**
   * Health check for auth service
   */
  async healthCheck(): Promise<{ isHealthy: boolean; error?: string }> {
    try {
      console.log('🏥 === VERIFICANDO ESTADO DEL SERVIDOR ===');
      
      // Try to ping a basic endpoint with short timeout
      await api.get('/auth/ping', { 
        timeout: 5000,
        headers: { Authorization: 'Bearer invalid-token' }
      });
      
      return { isHealthy: true };
    } catch (error) {
      console.log('🔍 Respuesta del health check:', error);
      
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        // 401 or 404 means server is responding (just endpoint protected/not found)
        if (axiosError.response?.status === 401 || axiosError.response?.status === 404) {
          return { isHealthy: true };
        }
        return { 
          isHealthy: false, 
          error: `Server responded with ${axiosError.response?.status}` 
        };
      }
      
      if (error && typeof error === 'object' && 'code' in error) {
        const axiosError = error as any;
        if (axiosError.code === 'ECONNABORTED') {
          return { isHealthy: false, error: 'Server timeout' };
        }
        if (axiosError.code === 'ECONNREFUSED' || axiosError.code === 'ERR_NETWORK') {
          return { isHealthy: false, error: 'Cannot connect to server' };
        }
      }
      
      return { isHealthy: false, error: 'Unknown error' };
    }
  }

  /**
   * Update password after OTP verification
   */
  async updatePassword(data: UpdatePasswordRequest): Promise<string> {
    try {
      console.log('🔐 === ACTUALIZANDO CONTRASEÑA ===');
      console.log('📧 Email:', data.correo);
      
      const response = await api.put<{ message: string }>(`${this.baseUrl}/update-password`, {
        correo: data.correo,
        contrasena: data.contrasena,
      });
      
      console.log('✅ Contraseña actualizada exitosamente');
      return response.data.message;
      
    } catch (error) {
      console.error('❌ === ERROR ACTUALIZANDO CONTRASEÑA ===');
      console.error('Error completo:', error);
      
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        console.error('📡 Detalles del error:');
        console.error(`   Status: ${axiosError.response?.status}`);
        console.error(`   Data:`, axiosError.response?.data);
        
        if (axiosError.response?.status === 401) {
          throw new Error('Usuario no encontrado');
        } else if (axiosError.response?.status === 400) {
          const backendMessage = axiosError.response?.data?.message;
          throw new Error(backendMessage || 'Datos inválidos para actualizar contraseña');
        } else {
          const backendMessage = axiosError.response?.data?.message;
          throw new Error(backendMessage || 'Error del servidor al actualizar contraseña');
        }
      }
      
      throw new Error('Error al actualizar la contraseña. Por favor intenta de nuevo.');
    }
  }

  /**
   * Test backend connection with detailed logging
   */
  async testConnection(): Promise<void> {
    console.log('🧪 === PROBANDO CONEXIÓN AL BACKEND ===');
    console.log('🌐 URL base configurada:', api.defaults.baseURL);
    console.log('⏱️ Timeout configurado:', api.defaults.timeout, 'ms');
    
    // Check health first
    const health = await this.healthCheck();
    console.log('🏥 Estado del servidor:', health);
    
    if (!health.isHealthy) {
      console.error('❌ Servidor no disponible:', health.error);
      throw new Error(`Servidor no disponible: ${health.error}`);
    }
    
    // Try getCurrentUser with detailed logging
    console.log('👤 Intentando obtener usuario actual...');
    try {
      const user = await this.getCurrentUser();
      console.log('✅ Usuario obtenido correctamente:', user);
    } catch (error) {
      console.error('❌ Error obteniendo usuario:', error);
      throw error;
    }
  }
}

export const authApiService = new AuthApiService();