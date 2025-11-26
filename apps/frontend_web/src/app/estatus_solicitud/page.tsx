'use client';

import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Plantilla } from '@/components/plantilla';
import React from 'react';

const EstatusSolicitud: React.FC = () => {
  const searchParams = useSearchParams();
  const seguimiento = searchParams.get('seguimiento') || 'N/A';
  const fecha = searchParams.get('fecha') || 'N/A';

  // Tiempo estimado y etapa (puedes hacer lógica real o simular)
  const etapa = 'En revisión';
  const tiempoEstimado = '2 a 3 días hábiles';

  return (
    <Plantilla>
      <div className="min-h-screen flex flex-col items-center justify-start px-6 py-12 bg-white">
        <h1 className="text-3xl font-bold text-center mb-8">
          Estatus de <span className="text-pink-500">solicitud</span>
        </h1>

        <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-5xl space-y-10 md:space-y-0 md:space-x-12">
          {/* Información */}
          <div className="flex-1 space-y-6 text-lg text-gray-700">
            <p>
              <span className="font-semibold">Fecha y hora realizada:</span><br />
              {decodeURIComponent(fecha)}
            </p>
            <p>
              <span className="font-semibold">Número de seguimiento:</span><br />
              {seguimiento}
            </p>
            <p>
              <span className="font-semibold">Etapa:</span><br />
              {etapa}
            </p>
            <p>
              <span className="font-semibold">Tiempo de espera aproximado:</span><br />
              {tiempoEstimado}
            </p>
          </div>

          {/* Imagen */}
          <div className="flex-1 flex justify-center">
            <Image
              src="/estatus.png" // 
              alt="Estatus ilustración"
              width={300}
              height={300}
              className="rounded-md"
            />
          </div>
        </div>

        {/* Línea inferior decorativa */}
        <div className="mt-12 h-3 w-3/4 rounded-full bg-gray-200" />
      </div>
    </Plantilla>
  );
};

export default EstatusSolicitud;
