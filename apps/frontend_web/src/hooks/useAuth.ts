// src/hooks/useAuth.ts
'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';
import type { RegisterRequest, LoginRequest } from '@/services/authApi';

/**
 * Hook for authentication functionality
 * 
 * Usage:
 * const auth = useAuth();
 * 
 * // Register
 * await auth.register({ correo: 'test@test.com', contrasena: '123456', nombre: 'Test' });
 * 
 * // Login  
 * await auth.login({ correo: 'test@test.com', contrasena: '123456' });
 * 
 * // Check status
 * if (auth.isAuthenticated) { ... }
 */
export const useAuth = () => {
  const {
    // State
    user,
    profile,
    isAuthenticated,
    loading,
    error,
    
    // Actions
    register,
    verifyOtp,
    login,
    logout,
    getCurrentUser,
    loadUserProfile,
    updateProfile,
    uploadAvatar,
    
    // Utilities
    clearError,
    checkAuthStatus,
  } = useAuthStore();

  // Check auth status on mount
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  // Wrapper functions with error handling
  const handleRegister = async (data: RegisterRequest) => {
    try {
      await register(data);
      return { success: true };
    } catch (error) {
      console.error('❌ Error in handleRegister:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error al registrar' 
      };
    }
  };

  const handleLogin = async (data: LoginRequest) => {
    try {
      await login(data);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error al iniciar sesión' 
      };
    }
  };

  const handleVerifyOtp = async (data: { correo: string; token: string }) => {
    try {
      await verifyOtp(data);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error al verificar código OTP' 
      };
    }
  };

  const handleUpdateProfile = async (data: Partial<typeof profile>) => {
    try {
      if (!data) return { success: false, error: 'No data provided' };
      await updateProfile(data);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error al actualizar perfil' 
      };
    }
  };

  const handleUploadAvatar = async (file: File) => {
    try {
      await uploadAvatar(file);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error al subir imagen' 
      };
    }
  };

  const refreshUserData = async () => {
    if (isAuthenticated) {
      await getCurrentUser();
      await loadUserProfile();
    }
  };

  return {
    // State
    user,
    profile,
    isAuthenticated,
    loading,
    error,
    
    // Actions with error handling
    register: handleRegister,
    verifyOtp: handleVerifyOtp,
    login: handleLogin,
    logout,
    updateProfile: handleUpdateProfile,
    uploadAvatar: handleUploadAvatar,
    refreshUserData,
    
    // Utilities
    clearError,
    
    // Helper functions
    getUserId: () => user?.id,
    getUserEmail: () => user?.correo,
    getUserName: () => user?.nombre || profile?.nombre,
    getFullName: () => {
      const firstName = user?.nombre || profile?.nombre;
      const lastName = user?.apellido || profile?.apellido;
      return [firstName, lastName].filter(Boolean).join(' ');
    },
    hasProfile: () => !!profile,
    getAvatarUrl: () => profile?.avatar,
    
    // Status checks
    isLoading: () => loading,
    hasError: () => !!error,
    isReady: () => !loading && isAuthenticated,
  };
};

/**
 * Hook for protecting routes that require authentication
 */
export const useRequireAuth = () => {
  const auth = useAuth();
  
  useEffect(() => {
    if (!auth.loading && !auth.isAuthenticated) {
      // Redirect to login page
      window.location.href = '/login';
    }
  }, [auth.loading, auth.isAuthenticated]);

  return auth;
};

/**
 * Hook for redirecting authenticated users away from auth pages
 */
export const useRedirectIfAuthenticated = (redirectTo: string = '/') => {
  const auth = useAuth();
  
  useEffect(() => {
    if (auth.isAuthenticated) {
      window.location.href = redirectTo;
    }
  }, [auth.isAuthenticated, redirectTo]);

  return auth;
};