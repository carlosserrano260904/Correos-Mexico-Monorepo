"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Plantilla } from '@/components/plantilla';

const Seguimiento: React.FC = () => {
  const [trackingNumber, setTrackingNumber] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    
    router.push("/estatus_solicitud");
  };

  return (
    <Plantilla>
    <div className="relative min-h-screen bg-white flex items-center justify-center overflow-hidden">
      {/* Triángulos decorativos */}
      <div
        className="absolute top-4 left-4 w-24 h-24 bg-pink-300 opacity-20 rotate-45"
        style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }}
      />
      <div
        className="absolute top-16 right-10 w-28 h-28 bg-pink-300 opacity-30 -rotate-45"
        style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }}
      />
      <div
        className="absolute bottom-10 left-0 w-48 h-48 bg-pink-300 opacity-40 rotate-12"
        style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }}
      />
      <div
        className="absolute bottom-0 right-4 w-36 h-36 bg-pink-300 opacity-30 rotate-45"
        style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }}
      />

      {/* Contenido principal */}
      <div className="z-10 flex flex-col items-center space-y-6 px-4">
        <h2 className="text-lg text-center font-medium text-gray-800">
          Ingresa tu numero de seguimiento
        </h2>
        <input
          type="text"
          value={trackingNumber}
          onChange={(e) => setTrackingNumber(e.target.value)}
          placeholder="Ej: 123456789"
          className="w-72 px-4 py-2 rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
        />
        <button
          onClick={handleSearch}
          className="bg-fuchsia-500 hover:bg-fuchsia-600 text-white font-bold py-2 px-6 rounded-full shadow-md transition"
        >
          Buscar
        </button>
      </div>
    </div>
    </Plantilla>
  );
};

export default Seguimiento;
