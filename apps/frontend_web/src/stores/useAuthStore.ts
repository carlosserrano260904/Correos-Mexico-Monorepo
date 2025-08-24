// src/stores/useAuthStore.ts
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { authApiService, type UserProfile, type RegisterRequest, type LoginRequest } from '@/services/authApi';
import { profileApiService, type Profile } from '@/services/profileApi';

interface AuthState {
  // State
  user: UserProfile | null;
  profile: Profile | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  
  // Actions
  register: (data: RegisterRequest) => Promise<void>;
  verifyOtp: (data: { correo: string; token: string }) => Promise<void>;
  login: (data: LoginRequest) => Promise<void>;
  logout: () => void;
  getCurrentUser: () => Promise<void>;
  loadUserProfile: () => Promise<void>;
  updateProfile: (data: Partial<Profile>) => Promise<void>;
  uploadAvatar: (file: File) => Promise<void>;
  
  // Utilities
  clearError: () => void;
  checkAuthStatus: () => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        user: null,
        profile: null,
        isAuthenticated: false,
        loading: false,
        error: null,

        // Register new user
        register: async (data: RegisterRequest) => {
          set({ loading: true, error: null });
          
          try {
            console.log('🔐 Registering user...');
            const response = await authApiService.register(data);
            
            // Check if user needs verification (OTP)
            if (response.needsVerification) {
              // Don't authenticate user yet - they need to verify OTP first
              set({ 
                user: null,
                isAuthenticated: false,
                loading: false,
                error: null,
              });
              
              console.log('✅ User registered - OTP verification required');
            } else {
              // User is fully registered and authenticated
              set({ 
                user: response.user,
                isAuthenticated: true,
                loading: false,
                error: null,
              });
              
              console.log('✅ User registered and authenticated');
              
              // Load user profile after registration
              setTimeout(() => {
                get().loadUserProfile().catch(console.error);
              }, 1000);
            }
            
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error al registrar usuario';
            set({ 
              error: errorMessage,
              loading: false,
              user: null,
              isAuthenticated: false,
            });
            console.error('❌ Registration failed:', error);
            throw error; // Re-throw for component handling
          }
        },

        // Verify OTP after registration
        verifyOtp: async (data: { correo: string; token: string }) => {
          set({ loading: true, error: null });
          
          try {
            console.log('🔐 Verifying OTP...');
            const response = await authApiService.verifyOtp(data);
            
            if (response.isOtpVerified && response.access_token && response.user) {
              // OTP verified successfully - authenticate user
              set({ 
                user: response.user,
                isAuthenticated: true,
                loading: false,
                error: null,
              });
              
              console.log('✅ OTP verified and user authenticated');
              
              // Load user profile after verification
              setTimeout(() => {
                get().loadUserProfile().catch(console.error);
              }, 1000);
            } else {
              // OTP verification failed
              set({ 
                user: null,
                isAuthenticated: false,
                loading: false,
                error: 'Código OTP inválido',
              });
              
              console.log('❌ OTP verification failed');
            }
            
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error al verificar código OTP';
            set({ 
              error: errorMessage,
              loading: false,
              user: null,
              isAuthenticated: false,
            });
            console.error('❌ OTP verification failed:', error);
            throw error; // Re-throw for component handling
          }
        },

        // Login user
        login: async (data: LoginRequest) => {
          set({ loading: true, error: null });
          
          try {
            console.log('🔐 Logging in user...');
            const response = await authApiService.login(data);
            
            set({ 
              user: response.user,
              isAuthenticated: true,
              loading: false,
              error: null,
            });
            
            console.log('✅ User logged in successfully');
            
            // Load user profile after successful login
            setTimeout(() => {
              get().loadUserProfile().catch(console.error);
            }, 1000);
            
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error al iniciar sesión';
            set({ 
              error: errorMessage,
              loading: false,
              user: null,
              isAuthenticated: false,
            });
            console.error('❌ Login failed:', error);
            throw error; // Re-throw for component handling
          }
        },

        // Logout user
        logout: () => {
          console.log('🚪 Logging out user...');
          authApiService.logout();
          
          set({
            user: null,
            profile: null,
            isAuthenticated: false,
            error: null,
          });
          
          console.log('✅ User logged out successfully');
        },

        // Get current user info
        getCurrentUser: async () => {
          set({ loading: true, error: null });
          
          try {
            console.log('👤 Getting current user...');
            const user = await authApiService.getCurrentUser();
            
            set({ 
              user,
              isAuthenticated: true,
              loading: false,
              error: null,
            });
            
            console.log('✅ Current user loaded');
            
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error al obtener usuario';
            set({ 
              error: errorMessage,
              loading: false,
              user: null,
              isAuthenticated: false,
            });
            console.error('❌ Failed to get current user:', error);
            
            // If token is invalid, clear everything
            if (errorMessage.includes('Sesión expirada')) {
              get().logout();
            }
          }
        },

        // Load user profile
        loadUserProfile: async () => {
          const { user } = get();
          if (!user) {
            console.warn('⚠️ No user available to load profile');
            return;
          }
          
          set({ loading: true });
          
          try {
            console.log(`👤 Loading profile for user ${user.id}...`);
            const profile = await profileApiService.getProfile(user.id);
            
            set({ 
              profile,
              loading: false,
            });
            
            console.log('✅ Profile loaded successfully');
            
          } catch (error) {
            console.error('❌ Failed to load profile:', error);
            // Don't set error for profile loading failures
            // Profile might not exist yet
            set({ loading: false });
          }
        },

        // Update user profile
        updateProfile: async (data: Partial<Profile>) => {
          const { user } = get();
          if (!user) {
            throw new Error('No hay usuario autenticado');
          }
          
          set({ loading: true, error: null });
          
          try {
            console.log('👤 Updating profile...');
            const updatedProfile = await profileApiService.updateProfile(user.id, data);
            
            set({ 
              profile: updatedProfile,
              loading: false,
              error: null,
            });
            
            console.log('✅ Profile updated successfully');
            
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error al actualizar perfil';
            set({ 
              error: errorMessage,
              loading: false,
            });
            console.error('❌ Profile update failed:', error);
            throw error;
          }
        },

        // Upload avatar
        uploadAvatar: async (file: File) => {
          const { user } = get();
          if (!user) {
            throw new Error('No hay usuario autenticado');
          }
          
          set({ loading: true, error: null });
          
          try {
            console.log('📷 Uploading avatar...');
            const result = await profileApiService.uploadAvatar(user.id, file);
            
            // Update profile with new avatar URL
            set(state => ({
              profile: state.profile ? { ...state.profile, avatar: result.url } : null,
              loading: false,
              error: null,
            }));
            
            console.log('✅ Avatar uploaded successfully');
            
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error al subir imagen';
            set({ 
              error: errorMessage,
              loading: false,
            });
            console.error('❌ Avatar upload failed:', error);
            throw error;
          }
        },

        // Clear error
        clearError: () => {
          set({ error: null });
        },

        // Check authentication status on app load
        checkAuthStatus: () => {
          console.log('🔍 Checking auth status...');
          
          if (authApiService.isAuthenticated()) {
            const storedUser = authApiService.getStoredUser();
            if (storedUser) {
              set({ 
                user: storedUser,
                isAuthenticated: true,
              });
              
              console.log('✅ User is authenticated');
              
              // Optionally refresh user data
              get().getCurrentUser().catch(console.error);
            }
          } else {
            console.log('ℹ️ User is not authenticated');
            set({ 
              user: null,
              profile: null,
              isAuthenticated: false,
            });
          }
        },
      }),
      {
        name: 'auth-storage',
        partialize: (state) => ({
          user: state.user,
          profile: state.profile,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    ),
    { name: 'AuthStore' }
  )
);