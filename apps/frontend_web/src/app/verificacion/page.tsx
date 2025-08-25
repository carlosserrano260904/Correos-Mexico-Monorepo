"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import CarruselLogin from '@/components/CarruselLogin'; 

const VerificacionCodigo = () => {
  const [timer, setTimer] = useState(20);
  const [code, setCode] = useState(["", "", "", ""]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter(); 

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

    if (value && index < 3) {
      const next = document.getElementById(`code-${index + 1}`);
      (next as HTMLInputElement)?.focus();
    }
  };

  const handleResendCode = () => {
    console.log("Código reenviado");
    setCode(["", "", "", ""]);
    setTimer(20);
    setError('');
    setSuccess('');
  };

  const handleGoBack = () => {
    router.back();
  };

  const handleVerificar = () => {
    if (code.some(d => d === '')) {
      setError('Por favor ingrese los 4 dígitos del código.');
      setSuccess('');
      return;
    }

    const codigoIngresado = code.join('');
    console.log("Código ingresado:", codigoIngresado);

    setError('');
    setSuccess('¡Código verificado correctamente!');


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
            Verificación
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 text-center mb-3 sm:mb-4">
            Te enviamos un código de verificación al celular
          </p>

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
            className="w-full bg-pink-600 text-white rounded-full py-2 font-semibold hover:bg-pink-700 transition duration-200 mb-4"
          >
            Verificar
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
