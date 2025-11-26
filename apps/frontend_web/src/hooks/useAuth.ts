// hooks/useAuth.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService } from '@/services/authService';
import { LoginData, RegisterData, User } from '@/schemas/auth';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  fetchUserProfile: (id: number) => Promise<void>;
  verifyAuth: () => Promise<boolean>;
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (data: LoginData) => {
        console.log('🚀 Starting login process...', { email: data.email });
        set({ isLoading: true });
        
        try {
          if (!data.email || !data.password) {
            throw new Error('Email y contraseña son requeridos');
          }

          const { user, token } = await authService.login(data);
          
          console.log('✅ Login successful:', { userId: user.id, name: user.name });
          
          set({ 
            user, 
            token,
            isAuthenticated: true, 
            isLoading: false 
          });

        } catch (error) {
          console.error('❌ Login error:', error);
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (data: RegisterData) => {
        console.log('🚀 Starting registration process...', { email: data.email });
        set({ isLoading: true });
        
        try {
          if (!data.name || !data.email || !data.password) {
            throw new Error('Todos los campos son requeridos');
          }

          if (data.password !== data.confirmPassword) {
            throw new Error('Las contraseñas no coinciden');
          }

          const { user, token } = await authService.register(data);
          
          console.log('✅ Registration successful:', { userId: user.id, name: user.name });
          
          set({ 
            user, 
            token,
            isAuthenticated: true, 
            isLoading: false 
          });

        } catch (error) {
          console.error('❌ Registration error:', error);
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        const currentUser = get().user;
        console.log('👋 Logging out...', { userId: currentUser?.id });
        set({ 
          user: null, 
          token: null,
          isAuthenticated: false 
        });
      },

      updateUser: (updatedUser: Partial<User>) => {
        const { user } = get();
        console.log('✏️ Updating user...', { updates: updatedUser });
        
        if (user) {
          set({ 
            user: { ...user, ...updatedUser } 
          });
        }
      },

      fetchUserProfile: async (id: number) => {
        console.log('📥 Fetching user profile...', { id });
        
        try {
          const { token } = get();
          if (!token) throw new Error('No authentication token');

          const userProfile = await authService.getProfile(id, token);
          set({ 
            user: userProfile,
            isAuthenticated: true 
          });

        } catch (error) {
          console.error('❌ Error fetching profile:', error);
          throw error;
        }
      },

      verifyAuth: async (): Promise<boolean> => {
        const { token } = get();
        if (!token) return false;

        try {
          const isValid = await authService.verifyToken(token);
          if (!isValid) {
            set({ 
              user: null, 
              token: null,
              isAuthenticated: false 
            });
          }
          return isValid;
        } catch (error) {
          set({ 
            user: null, 
            token: null,
            isAuthenticated: false 
          });
          return false;
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token,
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);