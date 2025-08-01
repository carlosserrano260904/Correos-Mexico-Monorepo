"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation'; 
import CarruselLogin from '@/components/CarruselLogin'; 

const RecuperarContrasena = () => {
  const [timer, setTimer] = useState(20);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const router = useRouter(); 

  useEffect(() => {
    if (timer > 0) {
      const countdown = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(countdown);
    }
  }, [timer]);

  const handleResendCode = () => {
    console.log("Código reenviado");
    setTimer(20);
  };

  const handleEnviarCodigo = () => {
    if (!email) {
      setError('Por favor, ingrese su correo electrónico.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Ingrese un correo electrónico válido.');
      return;
    }

    setError('');
    // Aquí iría la lógica para enviar el código al correo
    router.push('/verificacion'); 
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white px-4">
      <div className="flex h-auto w-full max-w-4xl shadow-xl rounded-xl overflow-hidden bg-white">
        
        {/* Formulario */}
        <div className="w-full md:w-1/2 px-3 sm:px-6 py-3 flex flex-col justify-center min-h-0 relative">
          
          {/* flecha para regresar al login */}
          <button 
            onClick={() => router.push('/login')} 
            className="absolute left-3 sm:left-6 top-3 sm:top-6 text-gray-600 hover:text-pink-600 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 text-center mb-2 sm:mb-3">
            ¿Olvidó su contraseña?
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 text-center mb-3 sm:mb-4">
            Escriba su correo electrónico para poder ayudarlo.
          </p>

          <div className="flex items-center border border-gray-300 rounded-full px-4 py-2 mb-2">
            <svg className="text-gray-400 mr-2" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12l-4-4m0 0l-4 4m4-4v8" />
            </svg>
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full outline-none bg-transparent text-sm"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm mb-2 text-center">{error}</p>
          )}

          <button 
            onClick={handleEnviarCodigo} 
            className="w-full bg-pink-600 text-white rounded-full py-2 font-semibold hover:bg-pink-700 transition duration-200 mb-3 sm:mb-4 text-sm"
          >
            Enviar código
          </button>

          {/* Temporizador o reenviar más compacto */}
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

export default RecuperarContrasena;
