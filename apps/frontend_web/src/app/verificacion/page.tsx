"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import CarruselLogin from '@/components/CarruselLogin';
import { authApiService } from '@/services/authApi';
import { useAuth } from '@/hooks/useAuth'; 

const VerificacionCodigo = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const auth = useAuth();
  
  const [timer, setTimer] = useState(600); // 10 minutos como en el backend
  const [code, setCode] = useState(["", "", "", "", "", ""]); // 6 dígitos
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');

  // Get email from URL params or temp signup data
  useEffect(() => {
    const emailFromParams = searchParams.get('email');
    const isExisting = searchParams.get('existing') === 'true';
    const tempData = authApiService.getTempSignupData();
    
    const userEmail = emailFromParams || tempData?.correo || '';
    
    if (!userEmail) {
      setError('No se encontró información de registro. Vuelve a registrarte.');
      setTimeout(() => {
        router.push('/registro');
      }, 3000);
      return;
    }
    
    setEmail(userEmail);
    
    // If it's an existing user, automatically send OTP
    if (isExisting && userEmail) {
      console.log('🔄 Usuario existente detectado, enviando OTP...');
      // Send OTP for existing user
      const sendOtpForExistingUser = async () => {
        setLoading(true);
        try {
          await authApiService.resendOtp({ correo: userEmail });
          setCode(["", "", "", "", "", ""]);
          setTimer(600);
          setError('');
          setSuccess('Código enviado a tu correo electrónico. Ingrésalo para acceder a tu cuenta.');
        } catch (error) {
          setError('Error al enviar el código. Intenta de nuevo.');
          console.error('Error sending OTP for existing user:', error);
        }
        setLoading(false);
      };
      sendOtpForExistingUser();
    }
  }, [searchParams, router]); 

  useEffect(() => {
    if (timer > 0) {
      const countdown = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(countdown);
    }
  }, [timer]);

  const handleInputChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return; // Solo permite números

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    setError('');
    setSuccess('');

    if (value && index < 5) { // Cambié a 5 para 6 dígitos
      const next = document.getElementById(`code-${index + 1}`);
      (next as HTMLInputElement)?.focus();
    }
  };

  const handleResendCode = async () => {
    if (!email) return;
    
    setLoading(true);
    try {
      console.log("Reenviando código...");
      await authApiService.resendOtp({ correo: email });
      setCode(["", "", "", "", "", ""]); // Reset 6 dígitos
      setTimer(600); // Reset timer to 10 minutes
      setError('');
      setSuccess('Código reenviado exitosamente. Revisa tu correo electrónico.');
    } catch (error) {
      setError('Error al reenviar el código. Intenta de nuevo.');
      console.error('Error resending OTP:', error);
    }
    setLoading(false);
  };

  const handleGoBack = () => {
    router.back();
  };

  const handleVerificar = async () => {
    if (!email) {
      setError('Error: No se encontró el email. Vuelve a registrarte.');
      return;
    }
    
    if (code.some(d => d === '')) {
      setError('Por favor ingresa los 6 dígitos del código.');
      setSuccess('');
      return;
    }

    const codigoIngresado = code.join('');
    console.log("Código ingresado:", codigoIngresado);

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      console.log('Verificando código OTP...');
      const result = await auth.verifyOtp({
        correo: email,
        token: codigoIngresado,
      });

      if (result.success) {
        console.log('✅ Verificación exitosa');
        setSuccess('¡Código verificado correctamente! Redirigiendo...');
        
        // Redirect to home page after successful verification
        setTimeout(() => {
          router.push('/');
        }, 1500);
      } else {
        console.log('❌ Verificación fallida');
        setError(result.error || 'Código inválido o expirado. Intenta de nuevo.');
      }
      
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setError('Error inesperado al verificar el código. Intenta de nuevo.');
    }
    
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white px-4">
      <div className="flex h-auto w-full max-w-4xl shadow-xl rounded-xl overflow-hidden bg-white">
        
        {/* Lado izquierdo */}
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center relative">
          <button 
            onClick={handleGoBack} 
            className="absolute left-3 sm:left-6 top-3 sm:top-6 text-gray-600 hover:text-pink-600 transition"
          >
            <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Logo */}
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

          {/* Título */}
          <h2 className="text-lg sm:text-xl font-semibold text-center text-gray-800 mb-2 sm:mb-3">
            {searchParams.get('existing') === 'true' ? 'Acceso a tu Cuenta' : 'Verificación de Cuenta'}
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 text-center mb-3 sm:mb-4">
            {searchParams.get('existing') === 'true' 
              ? 'Te enviamos un código de acceso a tu correo electrónico'
              : 'Te enviamos un código de 6 dígitos a tu correo electrónico'
            }
          </p>
          {email && (
            <p className="text-xs text-center text-gray-500 mb-3">
              📧 {email}
            </p>
          )}

          {/* Inputs del código */}
          <div className="flex justify-between mb-4 gap-2">
            {code.map((digit, i) => (
              <input
                key={i}
                id={`code-${i}`}
                type="text"
                maxLength={1}
                className="w-10 h-10 sm:w-12 sm:h-12 text-center border border-gray-300 rounded-md text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-pink-600"
                value={digit}
                onChange={(e) => handleInputChange(i, e.target.value)}
              />
            ))}
          </div>

          {/* Mensajes */}
          {error && <p className="text-red-500 text-sm text-center mb-2">{error}</p>}
          {success && <p className="text-green-600 text-sm text-center mb-2">{success}</p>}

          <button
            onClick={handleVerificar}
            disabled={loading}
            className="w-full bg-pink-600 text-white rounded-full py-2 font-semibold hover:bg-pink-700 transition duration-200 mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Verificando...' : 'Verificar'}
          </button>

          {/* Temporizador */}
          {timer > 0 ? (
            <p className="text-center text-xs sm:text-sm text-gray-600">
              Reenviar el código en <span className="text-pink-600 font-medium">0:{timer < 10 ? `0${timer}` : timer}</span>
            </p>
          ) : (
            <p
              className="text-center text-xs sm:text-sm text-pink-600 font-medium hover:underline cursor-pointer"
              onClick={handleResendCode}
            >
              Reenviar código
            </p>
          )}
        </div>

        {/* Carrusel */}
        <CarruselLogin />
      </div>
    </div>
  );
};

export default VerificacionCodigo;
