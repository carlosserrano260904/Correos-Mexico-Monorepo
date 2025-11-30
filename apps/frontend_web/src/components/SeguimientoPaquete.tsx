//components/SeguimientoPaquete.tsx
"use client";

import React, { useState } from "react";
import { IoCloseOutline } from "react-icons/io5";

interface SeguimientoPrompt {
  className?: String;
  seguimiento: {
    numeroDeSeguimiento: string;
    transportista: string;
    destino: string;
    puntoActual: string;
    fechaEstimada: string;
  };
}

export const SeguimientoPaquete = ({ seguimiento, className="" }: SeguimientoPrompt) => {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [status, setStatus] = useState(2);
  const [isOpen, setIsOpen] = useState(false); // ⬅️ Nuevo estado del modal

  const handleSearch = () => {
    if (!trackingNumber) return;
    setStatus(1);
  };

  return (
    <>
      {/* LINK QUE ABRE EL MODAL */}
      <button
        className={`text-pink-600 underline hover:text-pink-700 text-sm transition cursor-pointer p-0 bg-transparent ${className}`}
        onClick={() => setIsOpen(true)}
      >
        Ver seguimiento
      </button>

      {/* MODAL */}
      {isOpen && (
        <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center z-50 px-4">

          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-xl p-6 relative">

            {/* Botón de cerrar */}
            <button
              className="cursor-pointer absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              onClick={() => setIsOpen(false)}
            >
              <IoCloseOutline className="w-7 h-7" />
            </button>

            {/* Header */}
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Seguimiento del envío
            </h2>

            {/* Input */}
            <label className="text-sm font-medium text-gray-700">
              Ingresa el número de seguimiento
            </label>

            <div className="flex gap-3 mt-2">
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="Número de seguimiento"
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-pink-500 outline-none"
              />

              <button
                onClick={handleSearch}
                className="cursor-pointer bg-pink-600 hover:bg-pink-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition"
              >
                Buscar
              </button>
            </div>

            {/* Timeline */}
            <h3 className="mt-6 mb-4 font-semibold text-gray-800">
              Estado del envío
            </h3>

            <div className="relative flex items-center justify-between w-full">

              {/* Contenedor más pequeño para líneas */}
              <div className="absolute left-1/2 -translate-x-1/2 w-[70%] top-[30%]">
                <div className="absolute left-0 w-full h-[7px] bg-gray-200 -translate-y-1/2 z-0"></div>

                <div
                  className="absolute left-0 h-[7px] bg-pink-500 -translate-y-1/2 z-0 transition-all duration-300"
                  style={{
                    width:
                      status === 1 ? "0%" : status === 2 ? "50%" : "100%",
                  }}
                ></div>
              </div>

              {/* Paso 1 */}
              <div className="flex flex-col items-center w-1/3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 z-10 ${
                    status >= 1
                      ? "bg-pink-600 text-white border-pink-600"
                      : "bg-gray-200 text-gray-500 border-gray-300"
                  }`}
                >
                  1
                </div>
                <span
                  className={`mt-2 text-sm font-medium ${
                    status >= 1 ? "text-pink-600" : "text-gray-500"
                  }`}
                >
                  Envío creado
                </span>
              </div>

              {/* Paso 2 */}
              <div className="flex flex-col items-center w-1/3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 z-10 ${
                    status >= 2
                      ? "bg-pink-600 text-white border-pink-600"
                      : "bg-gray-200 text-gray-500 border-gray-300"
                  }`}
                >
                  2
                </div>
                <span
                  className={`mt-2 text-sm font-medium ${
                    status >= 2 ? "text-pink-600" : "text-gray-500"
                  }`}
                >
                  En camino
                </span>
              </div>

              {/* Paso 3 */}
              <div className="flex flex-col items-center w-1/3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 z-10 ${
                    status >= 3
                      ? "bg-green-600 text-white border-green-600"
                      : "bg-gray-200 text-gray-500 border-gray-300"
                  }`}
                >
                  3
                </div>
                <span
                  className={`mt-2 text-sm font-medium ${
                    status >= 3 ? "text-green-600" : "text-gray-500"
                  }`}
                >
                  Recibido
                </span>
              </div>
            </div>

            {/* Información */}
            <div className="grid grid-cols-2 gap-4 bg-gray-100 rounded-xl p-4 mt-6">
              <div>
                <p className="text-xs text-gray-500">Número de seguimiento</p>
                <p className="font-semibold">{seguimiento.numeroDeSeguimiento}</p>
              </div>

              <div>
                <p className="text-xs text-gray-500">Transportista</p>
                <p className="font-semibold">{seguimiento.transportista}</p>
              </div>

              <div>
                <p className="text-xs text-gray-500">Destino</p>
                <p className="font-semibold">{seguimiento.destino}</p>
              </div>

              <div>
                <p className="text-xs text-gray-500">Punto actual</p>
                <p className="font-semibold">{seguimiento.puntoActual}</p>
              </div>

              <div>
                <p className="text-xs text-gray-500">Fecha estimada</p>
                <p className="font-semibold">{seguimiento.fechaEstimada}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
