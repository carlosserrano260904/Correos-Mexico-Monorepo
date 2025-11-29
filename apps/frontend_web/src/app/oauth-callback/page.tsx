// app/oauth-callback/page.tsx
"use client";

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function OAuthCallback() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const error = searchParams.get('error');

    if (token) {
      // Guardar token y redirigir
      localStorage.setItem('token', token);
      window.opener?.postMessage({ type: 'OAUTH_SUCCESS', token }, window.location.origin);
      window.close();
    } else if (error) {
      window.opener?.postMessage({ type: 'OAUTH_ERROR', error }, window.location.origin);
      window.close();
    } else {
      // Si no hay token ni error, esperar un momento y cerrar
      setTimeout(() => {
        window.close();
      }, 3000);
    }
  }, [searchParams]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Procesando autenticación...</p>
      </div>
    </div>
  );
}   