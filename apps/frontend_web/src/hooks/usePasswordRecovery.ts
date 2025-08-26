// src/hooks/usePasswordRecovery.ts
'use client';

import { useState } from 'react';
import { authApiService, type UpdatePasswordRequest, type ResendOtpRequest, type VerifyOtpRequest } from '@/services/authApi';

interface PasswordRecoveryState {
  loading: boolean;
  error: string | null;
  success: string | null;
  step: 'email' | 'otp' | 'password' | 'complete';
  email: string;
}

export const usePasswordRecovery = () => {
  const [state, setState] = useState<PasswordRecoveryState>({
    loading: false,
    error: null,
    success: null,
    step: 'email',
    email: ''
  });

  // Send OTP to email
  const sendOtp = async (email: string) => {
    setState(prev => ({ ...prev, loading: true, error: null, success: null }));
    
    try {
      const message = await authApiService.requestPasswordReset(email);
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        success: message,
        step: 'otp',
        email: email
      }));
      return { success: true };
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error instanceof Error ? error.message : 'Error al enviar código OTP'
      }));
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error al enviar código OTP'
      };
    }
  };

  // Resend OTP
  const resendOtp = async () => {
    if (!state.email) {
      setState(prev => ({ ...prev, error: 'Email no disponible para reenvío' }));
      return { success: false, error: 'Email no disponible' };
    }

    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const message = await authApiService.resendOtp({ correo: state.email });
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        success: message
      }));
      return { success: true };
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error instanceof Error ? error.message : 'Error al reenviar código OTP'
      }));
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error al reenviar código OTP'
      };
    }
  };

  // Verify OTP code
  const verifyOtp = async (token: string) => {
    if (!state.email) {
      setState(prev => ({ ...prev, error: 'Email no disponible para verificación' }));
      return { success: false, error: 'Email no disponible' };
    }

    setState(prev => ({ ...prev, loading: true, error: null, success: null }));
    
    try {
      const response = await authApiService.verifyOtp({ 
        correo: state.email, 
        token: token 
      });
      
      if (response.isOtpVerified) {
        setState(prev => ({ 
          ...prev, 
          loading: false, 
          success: 'Código verificado correctamente',
          step: 'password'
        }));
        return { success: true };
      } else {
        setState(prev => ({ 
          ...prev, 
          loading: false, 
          error: 'Código OTP incorrecto o expirado'
        }));
        return { success: false, error: 'Código OTP incorrecto o expirado' };
      }
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error instanceof Error ? error.message : 'Error al verificar código OTP'
      }));
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error al verificar código OTP'
      };
    }
  };

  // Update password
  const updatePassword = async (newPassword: string) => {
    if (!state.email) {
      setState(prev => ({ ...prev, error: 'Email no disponible para actualizar contraseña' }));
      return { success: false, error: 'Email no disponible' };
    }

    setState(prev => ({ ...prev, loading: true, error: null, success: null }));
    
    try {
      const message = await authApiService.updatePassword({
        correo: state.email,
        contrasena: newPassword
      });
      
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        success: message,
        step: 'complete'
      }));
      return { success: true };
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error instanceof Error ? error.message : 'Error al actualizar contraseña'
      }));
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error al actualizar contraseña'
      };
    }
  };

  // Clear messages
  const clearMessages = () => {
    setState(prev => ({ ...prev, error: null, success: null }));
  };

  // Reset entire flow
  const resetFlow = () => {
    setState({
      loading: false,
      error: null,
      success: null,
      step: 'email',
      email: ''
    });
  };

  // Go to specific step (useful for navigation)
  const goToStep = (step: PasswordRecoveryState['step']) => {
    setState(prev => ({ ...prev, step, error: null, success: null }));
  };

  return {
    // State
    loading: state.loading,
    error: state.error,
    success: state.success,
    step: state.step,
    email: state.email,
    
    // Actions
    sendOtp,
    resendOtp,
    verifyOtp,
    updatePassword,
    
    // Utilities
    clearMessages,
    resetFlow,
    goToStep,
    
    // Helper functions
    canProceedToOtp: () => state.step === 'otp' && state.email.length > 0,
    canProceedToPassword: () => state.step === 'password' && state.email.length > 0,
    isComplete: () => state.step === 'complete',
    hasEmail: () => state.email.length > 0,
  };
};