//configuration page.tsx
'use client'
import { Plantilla } from '@/components/plantilla';
import React from 'react';
import { useRouter} from 'next/navigation';
import BotonRegresar from '@/components/BotonRegresar';

export default function ConfiguracionScreen() {
    const router = useRouter();

    const handleNavigate = (ruta: string) => {
        router.push(ruta);
  };

  return (
    <Plantilla>
     <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        <BotonRegresar />

        {/* Título */}
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8 sm:mb-12">Configuración</h1>

        {/* Grid de opciones */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          
        {/* Mis Direcciones */}
          <div className="bg-white rounded-xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Mis Direcciones</h2>
            <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 leading-relaxed">
              Configura las direcciones donde recibirás los paquetes que ordenes en el ecommerce.
            </p>
            <button 
              onClick={() => handleNavigate('/boton-configuracion/mis-direcciones')}
              className="text-pink-600 hover:text-pink-700 font-semibold text-sm sm:text-base flex items-center gap-1 transition-colors cursor-pointer"
            >
              Configurar
              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

        {/* Mis Cupones */}
          <div className="bg-white rounded-xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Mis Cupones</h2>
            <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 leading-relaxed">
              Configura los cupones que puedes utilizar para tus compras en el sitio.
            </p>
            <button 
              onClick={() => handleNavigate('/boton-configuracion/mis-cupones')}
              className="text-pink-600 hover:text-pink-700 font-semibold text-sm sm:text-base flex items-center gap-1 transition-colors cursor-pointer"
            >
              Configurar
              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

        {/* Mis Tarjetas */}
          <div className="bg-white rounded-xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Mis Tarjetas</h2>
            <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 leading-relaxed">
              Configura las tarjetas con las que efectuarás tus pagos, al realizar una compra.
            </p>
            <button 
              onClick={() => handleNavigate('/boton-configuracion/tarjetass')}
              className="text-pink-600 hover:text-pink-700 font-semibold text-sm sm:text-base flex items-center gap-1 transition-colors cursor-pointer"
            >
              Configurar
              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

        {/* Mis Pedidos */}
          <div className="bg-white rounded-xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Mis Pedidos</h2>
            <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 leading-relaxed">
              Lleva a cabo un análisis de los pedidos que has realizado en la aplicación.
            </p>
            <button 
              onClick={() => handleNavigate('/boton-configuracion/mis-pedidos')}
              className="text-pink-600 hover:text-pink-700 font-semibold text-sm sm:text-base flex items-center gap-1 transition-colors cursor-pointer"
            >
              Ver
              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

        {/* Historial de Facturas */}
          <div className="bg-white rounded-xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Historial de Facturas</h2>
            <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 leading-relaxed">
              Accede al historial de facturas de las compras que has realizado con el tiempo.
            </p>
            <button 
              onClick={() => handleNavigate('/boton-configuracion/historial-facturas')}
              className="text-pink-600 hover:text-pink-700 font-semibold text-sm sm:text-base flex items-center gap-1 transition-colors cursor-pointer"
            >
              Ver
              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            </div>

          {/* Términos y Condiciones */}
          <div className="bg-white rounded-xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Términos y Condiciones</h2>
            <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 leading-relaxed">
              Conoce los términos y condiciones de CorreosClic para asegurar una buena experiencia de uso.
            </p>
            <button 
              onClick={() => handleNavigate('/boton-configuracion/terminos-condiciones')}
              className="text-pink-600 hover:text-pink-700 font-semibold text-sm sm:text-base flex items-center gap-1 transition-colors cursor-pointer"
            >
              Ver
              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

        </div>

        {/* BOTONES INFERIORES */}
        <div className="mt-8 sm:mt-12 space-y-3">
          <button className="w-full py-3 rounded-full bg-pink-500 text-white font-medium hover:bg-pink-600 transition-colors text-sm sm:text-base cursor-pointer">
            Cerrar sesión
          </button>
          <button className="w-full py-3 rounded-full bg-gray-300 text-gray-700 font-medium hover:bg-gray-400 transition-colors text-sm sm:text-base cursor-pointer">
            Eliminar Cuenta
          </button>
      </div>
     </div>
    </div>
    </Plantilla>
  );
}