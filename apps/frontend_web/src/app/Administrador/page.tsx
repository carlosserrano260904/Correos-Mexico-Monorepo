'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdministradorHome() {
  const router = useRouter();

  useEffect(() => {
    // Redirigir automáticamente a la página de Conductores
    router.push('/Administrador/app/Conductores');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-gray-600">Redirigiendo...</p>
    </div>
  )
}
