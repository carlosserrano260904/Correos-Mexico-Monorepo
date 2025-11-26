// services/authService.ts
export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar: string | null;
  token?: string;
}

class AuthService {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL;

  /**
   * Login - usando tu endpoint real /api/auth/signin
   */
  async login(loginData: LoginData): Promise<{ user: User; token: string }> {
    console.log('🔐 Attempting login for:', loginData.email);
    
    try {
      const response = await fetch(`${this.baseUrl}/api/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          correo: loginData.email,
          contrasena: loginData.password,
        }),
      });

      console.log('📡 Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.message || 'Error durante el login';

        // Manejar errores específicos como en tu app
        if (errorMessage === 'Usuario no verificado') {
          throw new Error('Usuario no verificado. Por favor recupera tu contraseña para poder ingresar.');
        } else if (errorMessage === 'Credenciales inválidas') {
          throw new Error('Credenciales inválidas. Por favor verifica tu correo electrónico y contraseña.');
        } else if (errorMessage === 'El perfil no está vinculado al usuario') {
          throw new Error('El perfil no está vinculado al usuario. Por favor contacta al administrador.');
        } else {
          throw new Error(errorMessage);
        }
      }

      const data = await response.json();
      console.log('✅ Login successful, token received');

      // Obtener el perfil del usuario usando el token
      const userProfile = await this.getUserProfile(data.token);

      return {
        user: {
          id: userProfile.id,
          name: userProfile.nombre || userProfile.name || loginData.email.split('@')[0],
          email: loginData.email,
          role: 'user',
          avatar: userProfile.imagen || userProfile.avatar,
          token: data.token,
        },
        token: data.token,
      };

    } catch (error) {
      console.error('❌ Login error:', error);
      throw error;
    }
  }

  /**
   * Obtener perfil del usuario usando el token
   */
  private async getUserProfile(token: string): Promise<any> {
    try {
      // Primero obtenemos todos los perfiles
      const response = await fetch(`${this.baseUrl}/api/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error obteniendo perfil');
      }

      const profiles = await response.json();
      
      // Buscar el perfil del usuario actual (necesitarías una forma de identificar el perfil del usuario logueado)
      // Por ahora devolvemos el primer perfil como ejemplo
      return profiles[0] || {};

    } catch (error) {
      console.error('❌ Error getting user profile:', error);
      return {};
    }
  }

  /**
   * Registro - necesitarías crear un endpoint /api/auth/signup o usar /api/profile
   */
  async register(registerData: RegisterData): Promise<{ user: User; token: string }> {
    console.log('📝 Registering new user:', registerData.email);
    
    try {
      // APPROACH 1: Si tienes endpoint de registro
      const response = await fetch(`${this.baseUrl}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: registerData.name,
          correo: registerData.email,
          contrasena: registerData.password,
        }),
      });

      if (!response.ok) {
        // APPROACH 2: Si no existe endpoint de registro, crear perfil directamente
        return await this.registerViaProfile(registerData);
      }

      const data = await response.json();
      
      return {
        user: {
          id: data.userId,
          name: registerData.name,
          email: registerData.email,
          role: 'user',
          avatar: null,
          token: data.token,
        },
        token: data.token,
      };

    } catch (error) {
      console.error('❌ Registration error:', error);
      throw error;
    }
  }

  /**
   * Registro alternativo creando perfil directamente
   */
  private async registerViaProfile(registerData: RegisterData): Promise<{ user: User; token: string }> {
    const newProfileData = {
      nombre: registerData.name,
      email: registerData.email,
      apellido: '',
      numero: '',
      estado: '',
      ciudad: '',
      fraccionamiento: '',
      calle: '',
      codigoPostal: '',
      imagen: 'https://res.cloudinary.com/dgpd2ljyh/image/upload/v1748920792/default_nlbjlp.jpg'
    };

    const response = await fetch(`${this.baseUrl}/api/profile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newProfileData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error('No se pudo registrar el usuario: ' + errorText);
    }

    const newProfile = await response.json();

    // Luego hacer login automáticamente
    return await this.login({
      email: registerData.email,
      password: registerData.password,
    });
  }

  /**
   * Verificar token válido
   */
  async verifyToken(token: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  /**
   * Obtener perfil de usuario
   */
  async getProfile(id: number, token: string): Promise<User> {
    try {
      const response = await fetch(`${this.baseUrl}/api/profile/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Error al obtener perfil');
      }

      const profileData = await response.json();

      return {
        id: profileData.id,
        name: profileData.nombre || profileData.name,
        email: profileData.email || profileData.correo || '',
        role: 'user',
        avatar: profileData.imagen || profileData.avatar,
      };

    } catch (error) {
      console.error('❌ Error getting profile:', error);
      throw error;
    }
  }
}

export const authService = new AuthService();