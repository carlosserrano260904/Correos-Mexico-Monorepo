"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { FaLock } from 'react-icons/fa';
import { useRouter, useSearchParams } from 'next/navigation';
import CarruselLogin from '@/components/CarruselLogin';
import { usePasswordRecovery } from '@/hooks/usePasswordRecovery';
import { authApiService } from '@/services/authApi';

const CambiarContrasena = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const passwordRecovery = usePasswordRecovery();

  const [nuevaContrasena, setNuevaContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');
  const [email, setEmail] = useState('');
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Get email and verification status from URL params
  useEffect(() => {
    const emailFromParams = searchParams.get('email');
    const isVerified = searchParams.get('verified') === 'true';
    const emailFromSession = sessionStorage.getItem('password_recovery_email');
    
    // Use email from URL params or fallback to sessionStorage
    const emailToUse = emailFromParams || emailFromSession;
    
    if (!emailToUse || !isVerified) {
      console.log('❌ Cambiar contraseña - Datos faltantes:', { 
        emailFromParams, 
        emailFromSession, 
        isVerified 
      });
      router.push('/recuperar-contrasena');
      return;
    }
    
    setEmail(emailToUse);
    setVerified(isVerified);
    
    console.log('🔍 Cambiar contraseña - Email:', emailToUse);
    console.log('🔍 Cambiar contraseña - Verified:', isVerified);
  }, [searchParams, router]);

  const handleGoToLogin = () => {
    router.push('/login');
  };

  const handleGuardar = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nuevaContrasena || !confirmarContrasena) {
      return;
    }

    if (nuevaContrasena.length < 6) {
      return;
    }

    if (nuevaContrasena !== confirmarContrasena) {
      return;
    }

    if (!email || !verified) {
      console.log('❌ Cambiar contraseña - Email o verificación faltante:', { email, verified });
      setError('Información de verificación no encontrada. Vuelve a intentar el proceso.');
      return;
    }

    console.log('✅ Cambiar contraseña - Actualizando con email:', email);
    
    // Use authApiService directly with the email from URL params
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const message = await authApiService.updatePassword({
        correo: email,
        contrasena: nuevaContrasena
      });
      
      setSuccess(message || 'Contraseña actualizada exitosamente');
      
      // Clean up session storage
      sessionStorage.removeItem('password_recovery_email');
      
      setTimeout(() => {
        router.push('/login?message=password-updated');
      }, 2000);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al actualizar contraseña');
      console.error('Error updating password:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white px-4">
      <div className="flex h-auto w-full max-w-4xl shadow-xl rounded-xl overflow-hidden bg-white">
        
        {/* Lado izquierdo */}
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center relative">
          <button 
            onClick={handleGoToLogin}
            className="absolute left-3 sm:left-6 top-3 sm:top-6 text-gray-600 hover:text-pink-600 transition"
          >
            <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Logo más pequeño */}
          <div className="flex justify-center mb-2 sm:mb-3">
            <Image 
              src="/logoCorreos.png" 
              alt="Logo Correos" 
              width={80} 
              height={80} 
              className="w-16 h-16 sm:w-20 sm:h-20"
              priority 
            />
          </div>

          {/* Título y descripción más compactos */}
          <h2 className="text-lg sm:text-xl font-semibold text-center text-gray-800 mb-2 sm:mb-3">
            Cambiar Contraseña
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 text-center mb-3 sm:mb-4">
            Por favor ingresa una nueva contraseña segura
          </p>

          <form className="flex flex-col gap-4" onSubmit={handleGuardar}>
            <div className="flex items-center border border-gray-300 rounded-full px-4 py-2">
              <FaLock className="text-gray-400 mr-2" />
              <input
                type="password"
                placeholder="Nueva contraseña"
                value={nuevaContrasena}
                onChange={(e) => setNuevaContrasena(e.target.value)}
                className="w-full outline-none bg-transparent"
              />
            </div>
            
            <div className="flex items-center border border-gray-300 rounded-full px-3 py-1.5 sm:py-2">
              <FaLock className="text-gray-400 mr-2 text-sm" />
              <input
                type="password"
                placeholder="Confirmar contraseña"
                value={confirmarContrasena}
                onChange={(e) => setConfirmarContrasena(e.target.value)}
                className="w-full outline-none bg-transparent"
              />
            </div>

            {/* Validation errors */}
            {!nuevaContrasena && confirmarContrasena && (
              <p className="text-red-500 text-sm text-center">Por favor llena ambos campos.</p>
            )}
            {nuevaContrasena && nuevaContrasena.length < 6 && (
              <p className="text-red-500 text-sm text-center">La contraseña debe tener al menos 6 caracteres.</p>
            )}
            {nuevaContrasena && confirmarContrasena && nuevaContrasena !== confirmarContrasena && (
              <p className="text-red-500 text-sm text-center">Las contraseñas no coinciden.</p>
            )}
            
            {/* API messages */}
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            {success && <p className="text-green-600 text-sm text-center">{success}</p>}

            <button
              type="submit"
              disabled={loading || !email || !verified}
              className="w-full bg-pink-600 text-white rounded-full py-2 font-semibold hover:bg-pink-700 transition duration-200 mt-3 sm:mt-4 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Guardando...' : 'Guardar contraseña'}
            </button>
          </form>
        </div>

        {/* Carrusel */}
        <CarruselLogin />
      </div>
    </div>
  );
};

export default CambiarContrasena;
