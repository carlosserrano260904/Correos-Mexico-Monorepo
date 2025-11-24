'use client'

import { useRouter } from 'next/navigation'
import { NavbarCorreos } from '@/components/NavbarCorreos'
import Footer from '@/components/footerCorreos';


export default function CotizarPage() {
const router = useRouter();

// Función de navegación para MexPost Nacional
const handleNacional = () => {
    router.push('/CorreosMX/cotizar/nacional');
};

// Función de navegación para MexPost Internacional
const handleInternacional = () => {
    router.push('/CorreosMX/cotizar/internacional');
};

return (
    // Reemplazamos <></> por un div envolvente para controlar toda la vista
    <div className="bg-white min-h-screen flex flex-col">
        
        {/* 1. Navbar Superior (Ajusta 'transparent' si es necesario para el nuevo fondo blanco) */}
        <NavbarCorreos transparent={false} />

        {/* 2. Sección Principal: Diseño de Dos Columnas */}
        <main className="flex-grow max-w-7xl mx-auto w-full px-6 md:px-12 py-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
                
                {/* LADO IZQUIERDO: Título y Opciones */}
                <div className="py-8 md:py-16 space-y-6">
                    
                    {/* Texto de Anclaje/Etiqueta */}
                    <p className="inline-block bg-pink-100 text-pink-600 px-3 py-1 rounded-full text-sm font-semibold">
                        Detalles y cotización de un envío
                    </p>

                    {/* Título Principal */}
                    <h1 className="text-5xl font-bold text-gray-900 leading-tight">
                        Cotiza tu envío
                    </h1>
                    
                    {/* Subtexto */}
                    <p className="text-gray-600 text-lg">
                        Selecciona un método de envío MEXPOST para cotizar tu envío.
                    </p>

                    {/* Botones de Selección */}
                    <div className="flex gap-4 pt-4">
                        <button
                            onClick={handleNacional}
                            className="flex items-center gap-2 bg-gray-50 border border-pink-200 text-gray-700 hover:bg-pink-50 hover:border-pink-300 transition duration-300 text-base font-medium px-6 py-3 rounded-xl shadow-sm"
                        >
                            {/* Ícono simulado de MexPost Nacional (puedes reemplazarlo por un ícono real) */}
                            <span className="text-pink-600">✉️</span> 
                            MEXPOST Nacional
                        </button>

                        <button
                            onClick={handleInternacional}
                            className="flex items-center gap-2 bg-gray-50 border border-pink-200 text-gray-700 hover:bg-pink-50 hover:border-pink-300 transition duration-300 text-base font-medium px-6 py-3 rounded-xl shadow-sm"
                        >
                            {/* Ícono simulado de MexPost Internacional (puedes reemplazarlo por un ícono real) */}
                            <span className="text-pink-600">🌎</span>
                            MEXPOST Internacional
                        </button>
                    </div>
                </div>

                {/* LADO DERECHO: Imágenes */}
                <div className="space-y-6 flex flex-col justify-start">
                    
                    {/* Contenedor Superior de Imagen */}
                    <div className="relative h-64 w-full bg-gray-200 rounded-xl overflow-hidden shadow-lg">
                        <img
                            src="/Imagen1CotizarEnvio.jpg" //imagen cotizar envio
                            alt="Imagen de entrega de paquete"
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Contenedor Inferior de Imagen */}
                    <div className="relative h-64 w-full bg-gray-200 rounded-xl overflow-hidden shadow-lg">
                        <img
                            src="/Imagen2CotizarEnvio.jpg" //imagen cotizar envio
                            alt="Imagen de entrega de paquete"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

            </div>
        </main>

        {/* 3. Footer inferior */}
        <Footer />
    </div>
);
}