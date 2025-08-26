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
            
            // El backend login solo retorna { token, userId: profile.id }
            // Necesitamos construir un user object mínimo con la información que tenemos
            const tempUser = {
              id: response.userId || response.user?.id || 0,
              correo: data.correo, // Usamos el email del login request
              nombre: response.user?.nombre || null,
              apellido: response.user?.apellido || null,
              rol: 'usuario'
            };
            
            set({ 
              user: tempUser,
              isAuthenticated: true,
              loading: false,
              error: null,
            });
            
            console.log('✅ User logged in successfully');
            console.log('👤 Temp user data:', tempUser);
            
            // Load user profile and get complete user info immediately
            setTimeout(async () => {
              try {
                // Load profile first  
                await get().loadUserProfile();
                // Then try to get complete user data
                await get().getCurrentUser();
              } catch (error) {
                console.warn('⚠️ Could not load additional user data after login:', error);
              }
            }, 500);
            
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
            const currentUser = await authApiService.getCurrentUser();
            
            // El getCurrentUser del backend solo devuelve { id: profileId }
            // Necesitamos combinar esto con información del profile y datos guardados
            const { profile, user: existingUser } = get();
            
            // Crear un usuario mejorado combinando todas las fuentes de datos
            const enhancedUser = {
              id: currentUser.id,
              correo: existingUser?.correo || currentUser.correo || 'no-disponible',
              nombre: profile?.nombre || currentUser.nombre || existingUser?.nombre,
              apellido: profile?.apellido || currentUser.apellido || existingUser?.apellido,
              rol: currentUser.rol || existingUser?.rol || 'usuario',
              profile: currentUser.profile || undefined
            };
            
            set({ 
              user: enhancedUser,
              isAuthenticated: true,
              loading: false,
              error: null,
            });
            
            console.log('✅ Current user loaded and enhanced');
            console.log('👤 Enhanced user data:', enhancedUser);
            
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error al obtener usuario';
            console.warn('⚠️ Could not get current user from API, maintaining existing user data');
            
            // Don't clear user data if we just can't reach the API
            // Only clear if it's a real authentication error
            if (errorMessage.includes('Sesión expirada') || errorMessage.includes('401')) {
              set({ 
                error: errorMessage,
                loading: false,
                user: null,
                isAuthenticated: false,
              });
              get().logout();
            } else {
              // Keep existing user and profile data
              set({ 
                loading: false,
                error: null, // Don't show error for connection issues
              });
            }
            
            console.error('❌ Failed to get current user:', error);
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
            
            // Update user data with profile information - PRIORITY TO PROFILE DATA
            const updatedUser = {
              ...user,
              // Use profile data if available, fallback to existing user data
              nombre: profile.nombre || user.nombre,
              apellido: profile.apellido || user.apellido,
              // Ensure correo is always preserved from user (never from profile)
              correo: user.correo, 
            };
            
            set({ 
              profile,
              user: updatedUser,
              loading: false,
            });
            
            console.log('✅ Profile loaded and user updated successfully');
            console.log('👤 Updated user with profile data:', updatedUser);
            
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
            
            // Update user data with new profile information
            const updatedUser = {
              ...user,
              nombre: updatedProfile.nombre || user.nombre,
              apellido: updatedProfile.apellido || user.apellido,
            };
            
            // Profile updated successfully
            
            // Clear any cached data and force update
            const newState = { 
              profile: updatedProfile,
              user: updatedUser,
              loading: false,
              error: null,
            };
            
            set(newState);
            
            console.log('✅ Profile and user updated in store successfully');
            
            // Force persistence update
            if (typeof window !== 'undefined') {
              localStorage.setItem('auth-storage', JSON.stringify({
                state: newState,
                version: 0,
              }));
            }
            
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
            const currentState = get();
            const updatedProfile = currentState.profile ? { ...currentState.profile, avatar: result.url } : null;
            
            const newState = {
              ...currentState,
              profile: updatedProfile,
              loading: false,
              error: null,
            };
            
            set(newState);
            
            console.log('✅ Avatar uploaded successfully');
            
            // Force persistence update for avatar
            if (typeof window !== 'undefined') {
              localStorage.setItem('auth-storage', JSON.stringify({
                state: {
                  user: newState.user,
                  profile: newState.profile,
                  isAuthenticated: newState.isAuthenticated,
                },
                version: 0,
              }));
            }
            
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
          if (authApiService.isAuthenticated()) {
            const storedUser = authApiService.getStoredUser();
            if (storedUser) {
              set({ 
                user: storedUser,
                isAuthenticated: true,
              });
              
              // DON'T call getCurrentUser here - it causes infinite loops
              // Let components call getCurrentUser when they need fresh data
            }
          } else {
            set({ 
              user: null,
              profile: null,
              isAuthenticated: false,
            });
          }
        },

        // Force refresh profile from API and update all states
        forceRefreshProfile: async () => {
          const { user } = get();
          if (!user?.id) {
            console.warn('⚠️ No user available for profile refresh');
            return;
          }
          
          try {
            console.log('🔄 Force refreshing profile from API...');
            set({ loading: true });
            
            // Get fresh profile from API
            const freshProfile = await profileApiService.getProfile(user.id);
            
            // Update user data with fresh profile information
            const updatedUser = {
              ...user,
              nombre: freshProfile.nombre || user.nombre,
              apellido: freshProfile.apellido || user.apellido,
              // PRESERVE original email - never overwrite
              correo: user.correo,
            };
            
            // Debug logs removed to prevent infinite loops
            
            const newState = {
              profile: freshProfile,
              user: updatedUser,
              loading: false,
              error: null,
              isAuthenticated: true,
            };
            
            set(newState);
            
            // Force update localStorage
            if (typeof window !== 'undefined') {
              localStorage.setItem('auth-storage', JSON.stringify({
                state: {
                  user: newState.user,
                  profile: newState.profile,
                  isAuthenticated: newState.isAuthenticated,
                },
                version: 0,
              }));
            }
            
            console.log('✅ Profile force refreshed successfully');
            
          } catch (error) {
            console.error('❌ Failed to force refresh profile:', error);
            set({ loading: false });
          }
        },

        // Debug function to check current auth state
        debugAuthState: () => {
          const state = get();
          console.log('🔍 === AUTH STATE DEBUG ===');
          console.log('User:', state.user);
          console.log('Profile:', state.profile);
          console.log('IsAuthenticated:', state.isAuthenticated);
          console.log('Loading:', state.loading);
          console.log('Error:', state.error);
          console.log('=========================');
          return state;
        },

        // Clear potentially corrupted auth data
        clearCorruptedData: () => {
          console.log('🧹 Clearing potentially corrupted auth data...');
          
          if (typeof window !== 'undefined') {
            localStorage.removeItem('auth-storage');
            console.log('✅ LocalStorage cleared');
          }
          
          // Also clear the authApiService token
          authApiService.logout();
          
          set({
            user: null,
            profile: null,
            isAuthenticated: false,
            loading: false,
            error: null,
          });
          
          console.log('✅ Auth state cleared');
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