import Link from 'next/link'
import React from 'react'
import { Badge } from "@/components/ui/badge"
import { FaCircle } from "react-icons/fa6";

export const Anuncios = () => {
    return (
        <div className='bg-[url(/Bannerdescuentos.png)] w-full h-48 sm:h-64 md:h-80 lg:h-96 xl:h-[500px] 2xl:h-[800px] bg-cover bg-center bg-no-repeat rounded-lg'>

        </div>
    )
}

export const Anuncios2 = () => {
    return (
        <div className='w-full space-y-6'>
            {/* Banner Principal - Envíos Gratis */}
            <div className='w-full h-48 sm:h-64 md:h-80 lg:h-96 xl:h-[450px] 2xl:h-[750px] bg-[url(/EnviosGratis.png)] bg-cover bg-center bg-no-repeat rounded-lg relative overflow-hidden'>

            </div>

            {/* Anuncios Secundarios - Grid de 2 columnas */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {/* Anuncio Audífonos */}
                <div className='h-40 sm:h-48 md:h-56 2xl:h-[400px] bg-[url(/Audifonos.png)] bg-cover bg-center bg-no-repeat rounded-lg relative overflow-hidden'>
                    <div className='absolute inset-0 bg-opacity-40 flex items-center mb-6 justify-start'>
                        <div className='text-left text-white p-3'>
                            <h3 className='text-5xl font-bold mb-2'>Nuevos <br></br> Productos</h3>
                            <button className='bg-[#DE1484] hover:bg-[#de1483] text-white px-4 py-1 rounded-2xl text-2xl font-bold transition-colors'>
                                Ver mas
                            </button>
                        </div>
                    </div>
                </div>

                {/* Anuncio Piñatas */}
                <div className='h-40 sm:h-48 md:h-56 2xl:h-[400px] bg-[url(/Piñatas.png)] bg-cover bg-center bg-no-repeat rounded-lg relative overflow-hidden'>
                    <div className='absolute inset-0 bg-opacity-40 flex items-center mb-16 justify-start'>
                        <div className='text-left text-white p-3'>
                            <h3 className='text-6xl font-bold mb-2'>Artesanias</h3>
                            <button className='bg-[#DE1484] hover:bg-[#de1483] text-white px-4 py-1 rounded-2xl text-2xl font-bold transition-colors'>
                                Descubrir mas
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export const Anuncios3 = () => {
    return (
        <div className='w-full bg-[#F5F5F5] rounded-2xl h-[600px] relative overflow-hidden'>
            <Badge
                variant="secondary"
                className="font-bold text-lg absolute top-6 left-6 z-10 bg-transparent border-0 p-0 text-black flex items-center gap-2"
            >
                <FaCircle color='#DE1484' size={8} />
                HOGAR
            </Badge>
            <div className='w-full h-full bg-[url(/Sillon.png)] bg-contain bg-right bg-no-repeat flex items-center'>
                <div className='basis-1/2 flex flex-col justify-center pl-12 pr-8'>
                    <h1 className='text-5xl 2xl:text-6xl font-bold text-black leading-tight mb-6 max-w-lg'>
                        Diseñados por ti, creados para ti
                    </h1>
                    <p className='text-lg text-gray-700 leading-relaxed mb-8 max-w-md'>
                        Personaliza cada rincón de tu hogar con muebles únicos, funcionales y a tu estilo.
                    </p>
                    <div>
                        <button className='bg-[#DE1484] hover:bg-[#de1483] text-white px-8 py-3 rounded-full text-lg font-semibold transition-colors shadow-lg'>
                            Descubrir más
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}


export const Anuncios4 = () => {
    return (
        <div className='w-full grid grid-cols-1 lg:grid-cols-2 gap-6 h-[600px]'>
            {/* Columna Izquierda - Anuncio Grande de Fragancias */}
            <div className='bg-[#F5F5F5] rounded-2xl relative overflow-hidden'>
                <div className='w-full h-full bg-[url(/Perfume.png)] bg-cover bg-left-bottom bg-no-repeat'>
                    <div className='absolute top-8 right-12 w-1/2'>
                        <div className='ml-0'>
                            <h2 className='text-4xl lg:text-5xl font-bold text-black leading-tight mb-4'>
                                Fragancias que te enamoran
                            </h2>
                        </div>
                        <div className='ml-8'>
                            <p className='text-lg text-gray-700 leading-relaxed mb-6'>
                                Descubre perfumes con hasta 35% de descuento
                            </p>
                        </div>
                        <div className='ml-16'>
                            <button className='bg-[#DE1484] hover:bg-[#de1483] text-white px-6 py-3 rounded-full text-lg font-semibold transition-colors'>
                                Descubrir más
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Columna Derecha - Grid de 3 elementos */}
            <div className='flex flex-col gap-4 h-full'>
                {/* Banner Superior - Dale vida a tu look */}
                <div className='bg-[#F5F5F5] rounded-2xl h-1/2 relative overflow-hidden'>
                    <div className='w-full h-full bg-[url(/Brochas.png)] bg-contain bg-center bg-no-repeat flex items-start'>
                        <div className='flex flex-col justify-center place-items-center w-full mt-7'>
                            <h3 className='text-2xl lg:text-3xl font-bold text-black leading-tight mb-2'>
                                Dale vida a tu look
                            </h3>
                            <p className='text-sm text-gray-600 mb-4'>
                                30% de descuento en la segunda pieza
                            </p>
                            <div>
                                <button className='bg-[#DE1484] hover:bg-[#de1483] text-white px-4 py-2 rounded-full text-sm font-semibold transition-colors'>
                                    Ver colección
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Grid Inferior - 2 tarjetas */}
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 h-1/2'>
                    {/* Tarjeta Izquierda - Cuida tu piel */}
                    <div className='bg-[#F5F5F5] rounded-2xl relative overflow-hidden'>
                        <div className='w-full h-full bg-cover bg-[url(/skincare.png)] bg-center bg-no-repeat flex items-start'>
                            <div className='p-4 w-full'>
                                <h4 className='text-xl font-bold text-black mb-1'>
                                    Cuida tu piel como se merece
                                </h4>
                                <p className='text-xs text-gray-600 mb-3'>
                                    30% de descuento
                                </p>
                                <button className='bg-[#DE1484] hover:bg-[#de1483] text-white px-3 py-1.5 rounded-full text-xs font-semibold transition-colors'>
                                    Comprar ahora
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Tarjeta Derecha - Tu cabello */}
                    <div className='bg-[#F5F5F5] rounded-2xl relative overflow-hidden'>
                        <div className='w-full h-full bg-[url(/bote.png)] bg-cover bg-center bg-no-repeat flex items-start'>
                            <div className='p-4 w-full flex-row justify-items-end'>
                                <h4 className='text-lg font-bold text-black mb-1'>
                                    Tu cabello, tu mejor versión
                                </h4>
                                <p className='text-xs text-gray-600 mb-3'>
                                    25% de descuento
                                </p>
                                <div>
                                    <button className='bg-[#DE1484] hover:bg-[#de1483] text-white px-3 py-1.5 rounded-full text-xs font-semibold transition-colors'>
                                        Ver productos
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export const Anuncios5 = () => {
    return (
        <div className='w-full bg-[#F5F5F5] rounded-2xl h-[600px] relative overflow-hidden p-6'>
            <div className='w-full h-full flex items-center justify-items-center'>
                <div className='basis-1/2 flex flex-col'>
                    <div className='text-4xl text-balance font-bold text-center'>¡Precios especiales solo en nuestra app!</div>
                    <div className='flex justify-center items-center gap-x-2'>
                        <div className='w-[151px]'><img src="/qr.png" alt="qr" /></div>
                        <div className='w-[220px] text-xl text-balance'>Escanea el código QR y descarga <Link href={"/"} className='text-[#DE1484]'>nuestra app</Link></div>
                    </div>
                </div>
                <div className='basis-1/2 bg-[url(/celular.png)] bg-repeat bg-contain h-full'>
                </div>
            </div>
        </div>
    )
}