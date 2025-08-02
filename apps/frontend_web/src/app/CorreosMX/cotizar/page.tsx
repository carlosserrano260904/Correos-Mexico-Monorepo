'use client'

import { useRouter } from 'next/navigation'
import { NavbarCorreos } from '@/components/NavbarCorreos'

export default function CotizarPage() {
const router = useRouter();

return (
    <>
    <NavbarCorreos transparent={true} />

    <div
        className="min-h-screen flex flex-col justify-between bg-cover bg-center relative"
        style={{
        backgroundImage: 'url("/fondorosa.png")',
        }}
    >
        {/* contenido principal */}
        <main className="flex flex-col px-10 py-20 flex-grow pt-54">
        <div className="mb-32">
            <h1 className="text-6xl font-bold text-gray-900 leading-tight">
            <span className="text-pink-600">Cotiza</span> tu envío<span className="text-gray-900">.</span>
            </h1>
        </div>

          {/* botones */}
        <div className="flex justify-center gap-14 mt-10">
            <button
            onClick={() => router.push('/CorreosMX/cotizar/nacional')}
            className="bg-pink-600 hover:bg-pink-700 text-white text-lg font-semibold px-12 py-5 rounded-lg shadow-md transition-transform transform hover:scale-105 duration-300 ease-in-out"
            >
            MexPost Nacional
            </button>

            <button
            onClick={() => router.push('/CorreosMX/cotizar/internacional')}
            className="bg-pink-600 hover:bg-pink-700 text-white text-lg font-semibold px-12 py-5 rounded-lg shadow-md transition-transform transform hover:scale-105 duration-300 ease-in-out"
            >
            MexPost Internacional
            </button>
        </div>
        </main>

        {/* footer */}
        <footer className="bg-white border-t border-gray-200 py-6 text-sm text-gray-600 text-center flex flex-wrap justify-center gap-6 px-4 font-semibold">
        <span className="cursor-pointer hover:underline">Términos y condiciones</span>
        <span className="cursor-pointer hover:underline">Promociones</span>
        <span className="cursor-pointer hover:underline">Cómo cuidamos tu privacidad</span>
        <span className="cursor-pointer hover:underline">Accesibilidad</span>
        <span className="cursor-pointer hover:underline">Ayuda</span>
        </footer>
    </div>
    </>
);
}
