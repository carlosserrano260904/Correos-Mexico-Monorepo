'use client'

import { NavbarCorreos } from '@/components/NavbarCorreos'

export default function MexpostInternacional() {
  return (
    <>
      <NavbarCorreos transparent={true} />
      <div className="flex flex-col min-h-screen bg-pink-100 relative">
        {/* Contenido principal */}
        <main className="flex-grow flex flex-col items-center justify-center px-4 py-16 text-center pt-54">
          {/* Título */}
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            MexPost <span className="text-pink-600">Internacional.</span>
          </h1>

          {/* Mensaje de mantenimiento */}
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-xl mt-8">
            <p className="text-gray-700 text-lg">
              Lamentamos el inconveniente, esta página se encuentra en mantenimiento.<br />
              Gracias por tu comprensión.
            </p>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 py-6 text-sm text-gray-600 text-center flex flex-wrap justify-center gap-4 px-4">
          <span>Términos y condiciones</span>
          <span>Promociones</span>
          <span>Cómo cuidamos tu privacidad</span>
          <span>Accesibilidad</span>
          <span>Ayuda</span>
        </footer>
      </div>
    </>
  )
}
