import Link from 'next/link'
import React from 'react'
import { Badge } from "@/components/ui/badge"
import { FaCircle } from "react-icons/fa6";

export const Anuncios = () => {
    return (
        <div className='bg-[url(/Bannerdescuentos.png)] w-full h-48 sm:h-64 md:h-80 lg:h-96 xl:h-[500px] 2xl:h-[800px] bg-cover bg-center bg-no-repeat rounded-2xl relative overflow-hidden group'>
            {/* Overlay sutil al hover */}
            <div className='absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-500'></div>
            
            {/* Botón responsive en esquina inferior derecha */}
            <div className='absolute bottom-4 right-4 sm:bottom-6 sm:right-6 md:bottom-8 md:right-8 lg:bottom-10 lg:right-10 z-10'>
                <button className='bg-[#DE1484] hover:bg-pink-700 text-white px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 rounded-xl sm:rounded-2xl text-sm sm:text-base md:text-lg font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-xl sm:hover:shadow-2xl group/btn relative overflow-hidden'>
                    {/* Efecto de brillo en el botón */}
                    <div className='absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700'></div>
                    
                    <span className='relative flex items-center gap-1 sm:gap-2'>
                        Ver ofertas
                        <svg className='w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover/btn:translate-x-1' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M14 5l7 7m0 0l-7 7m7-7H3' />
                        </svg>
                    </span>
                </button>
            </div>

            {/* Elementos decorativos */}
            <div className='absolute top-2 left-2 sm:top-4 sm:left-4 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-pink-500/10 rounded-full blur-lg sm:blur-xl'></div>
            <div className='absolute bottom-2 left-2 sm:bottom-4 sm:left-4 w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-blue-500/10 rounded-full blur-md sm:blur-lg'></div>
        </div>
    )
}

export const Anuncios2 = () => {
    return (
        <div className='w-full space-y-4 sm:space-y-6'>
            {/* Banner Principal - Envíos Gratis */}
            <div className='w-full h-48 sm:h-64 md:h-80 lg:h-96 xl:h-[450px] 2xl:h-[750px] bg-[url(/EnviosGratis.png)] bg-cover bg-center bg-no-repeat rounded-2xl relative overflow-hidden group'>
                {/* Overlay sutil al hover */}
                <div className='absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-500'></div>
            </div>

            {/* Anuncios Secundarios - Grid de 2 columnas */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6'>
                {/* Anuncio Audífonos */}
                <div className='h-40 sm:h-48 md:h-56 lg:h-64 xl:h-72 2xl:h-[400px] bg-[url(/Audifonos.png)] bg-cover bg-center bg-no-repeat rounded-2xl relative overflow-hidden group'>
                    {/* Overlay gradiente */}
                    <div className='absolute inset-0 bg-gradient-to-r from-black/50 to-black/30 sm:from-black/60 sm:to-transparent'></div>
                    
                    {/* Efecto de brillo al hover */}
                    <div className='absolute inset-0 bg-gradient-to-r from-pink-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500'></div>
                    
                    <div className='absolute inset-0 flex items-center justify-start p-4 sm:p-6 md:p-8'>
                        <div className='text-left text-white space-y-2 sm:space-y-3 md:space-y-4'>
                            <h3 className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight'>
                                Nuevos<br />
                                <span className='text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-white'>
                                    Productos
                                </span>
                            </h3>
                            
                            <button className='bg-[#DE1484] hover:bg-pink-700 text-white px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 rounded-xl sm:rounded-2xl text-sm sm:text-base md:text-lg font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-xl sm:hover:shadow-2xl group/btn relative overflow-hidden'>
                                {/* Efecto de brillo en el botón */}
                                <div className='absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700'></div>
                                
                                <span className='relative flex items-center gap-1 sm:gap-2'>
                                    Ver más
                                    <svg className='w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover/btn:translate-x-1' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M14 5l7 7m0 0l-7 7m7-7H3' />
                                    </svg>
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* Elementos decorativos */}
                    <div className='absolute top-2 right-2 sm:top-4 sm:right-4 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-pink-500/10 rounded-full blur-lg sm:blur-xl'></div>
                    <div className='absolute bottom-2 left-2 sm:bottom-4 sm:left-4 w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-blue-500/10 rounded-full blur-md sm:blur-lg'></div>
                </div>

                {/* Anuncio Piñatas */}
                <div className='h-40 sm:h-48 md:h-56 lg:h-64 xl:h-72 2xl:h-[400px] bg-[url(/Piñatas.png)] bg-cover bg-center bg-no-repeat rounded-2xl relative overflow-hidden group'>
                    {/* Overlay gradiente */}
                    <div className='absolute inset-0 bg-gradient-to-r from-purple-900/50 to-purple-900/30 sm:from-purple-900/60 sm:to-transparent'></div>
                    
                    {/* Efecto de brillo al hover */}
                    <div className='absolute inset-0 bg-gradient-to-r from-purple-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500'></div>
                    
                    <div className='absolute inset-0 flex items-center justify-start p-4 sm:p-6 md:p-8'>
                        <div className='text-left text-white space-y-2 sm:space-y-3 md:space-y-4'>
                            <h3 className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight'>
                                Artesanias<br />
                                <span className='text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-white'>
                                    Mexicanas
                                </span>
                            </h3>
                            
                            <button className='bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 rounded-xl sm:rounded-2xl text-sm sm:text-base md:text-lg font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-xl sm:hover:shadow-2xl group/btn relative overflow-hidden'>
                                <div className='absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700'></div>
                                
                                <span className='relative flex items-center gap-1 sm:gap-2'>
                                    Descubrir más
                                    <svg className='w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover/btn:translate-x-1' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M14 5l7 7m0 0l-7 7m7-7H3' />
                                    </svg>
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* Elementos decorativos */}
                    <div className='absolute top-2 right-2 sm:top-4 sm:right-4 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-purple-500/10 rounded-full blur-lg sm:blur-xl'></div>
                    <div className='absolute bottom-2 left-2 sm:bottom-4 sm:left-4 w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-pink-500/10 rounded-full blur-md sm:blur-lg'></div>
                </div>
            </div>
        </div>
    )
}

export const Anuncios3 = () => {
    return (
        <div className='w-full bg-[#F5F5F5] rounded-2xl h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] relative overflow-hidden group'>
            <Badge
                variant="secondary"
                className="font-bold text-sm sm:text-base md:text-lg absolute top-4 left-4 sm:top-6 sm:left-6 z-10 bg-transparent border-0 p-0 text-black flex items-center gap-2"
            >
                <FaCircle color='#DE1484' size={6} className='sm:size-[8px]' />
                HOGAR
            </Badge>
            <div className='w-full h-full bg-[url(/Sillon.png)] bg-contain bg-right bg-no-repeat flex items-center'>
                {/* Overlay sutil al hover */}
                <div className='absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-500'></div>
                
                <div className='basis-full md:basis-1/2 flex flex-col justify-center pl-4 pr-4 sm:pl-6 sm:pr-6 md:pl-8 md:pr-8 lg:pl-12 lg:pr-12 z-10'>
                    <h1 className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-black leading-tight mb-4 sm:mb-6 max-w-full md:max-w-lg'>
                        Diseñados por ti, creados para ti
                    </h1>
                    <p className='text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed mb-4 sm:mb-6 md:mb-8 max-w-full md:max-w-md'>
                        Personaliza cada rincón de tu hogar con muebles únicos, funcionales y a tu estilo.
                    </p>
                    <div>
                        <button className='bg-[#DE1484] hover:bg-pink-700 text-white px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 rounded-full text-sm sm:text-base md:text-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-xl sm:hover:shadow-2xl group/btn relative overflow-hidden'>
                            {/* Efecto de brillo en el botón */}
                            <div className='absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700'></div>
                            
                            <span className='relative flex items-center gap-1 sm:gap-2'>
                                Descubrir más
                                <svg className='w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover/btn:translate-x-1' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M14 5l7 7m0 0l-7 7m7-7H3' />
                                </svg>
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export const Anuncios4 = () => {
    return (
        <div className='w-full grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 min-h-[350px] sm:min-h-[420px] md:min-h-[500px] lg:min-h-[600px]'>
            {/* Columna Izquierda - Anuncio Grande de Fragancias */}
            <div className='bg-[#F5F5F5] rounded-2xl relative overflow-hidden group'>
                {/* Overlay sutil al hover */}
                <div className='absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-500 z-10'></div>
                
                <div className='w-full h-full bg-[url(/Perfume.png)] bg-cover bg-center bg-no-repeat'>
                    <div className='absolute top-3 right-3 sm:top-6 sm:right-6 md:top-8 md:right-8 lg:top-8 lg:right-12 w-full sm:w-3/4 md:w-2/3 lg:w-1/2 z-20 px-3 sm:px-0'>
                        <div className='ml-0'>
                            <h2 className='text-lg sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-black leading-snug mb-2 sm:mb-3 md:mb-4'>
                                Fragancias que te enamoran
                            </h2>
                        </div>
                        <div className='ml-0 sm:ml-4 md:ml-8'>
                            <p className='text-xs sm:text-sm md:text-base lg:text-lg text-gray-700 leading-relaxed mb-3 sm:mb-4 md:mb-6'>
                                Descubre perfumes con hasta 35% de descuento
                            </p>
                        </div>
                        <div className='ml-0 sm:ml-8 md:ml-12 lg:ml-16'>
                            <button className='bg-[#DE1484] hover:bg-pink-700 text-white px-3 py-1.5 sm:px-4 sm:py-2 md:px-5 md:py-2.5 lg:px-6 lg:py-3 rounded-full text-xs sm:text-sm md:text-base lg:text-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-xl sm:hover:shadow-2xl group/btn relative overflow-hidden'>
                                {/* Efecto de brillo en el botón */}
                                <div className='absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700'></div>
                                
                                <span className='relative flex items-center gap-1 sm:gap-2'>
                                    Descubrir más
                                    <svg className='w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 transition-transform duration-300 group-hover/btn:translate-x-1' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M14 5l7 7m0 0l-7 7m7-7H3' />
                                    </svg>
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Columna Derecha - Grid de 3 elementos */}
            <div className='flex flex-col gap-3 sm:gap-4 min-h-[320px] sm:min-h-[380px] md:min-h-[450px]'>
                {/* Banner Superior - Dale vida a tu look */}
                <div className='bg-[#F5F5F5] rounded-2xl min-h-[120px] sm:min-h-[160px] md:min-h-[200px] relative overflow-hidden group'>
                    {/* Overlay sutil al hover */}
                    <div className='absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-500'></div>
                    
                    <div className='w-full h-full bg-[url(/Brochas.png)] bg-contain bg-top bg-no-repeat flex items-start'>
                        <div className='flex flex-col justify-center place-items-center w-full mt-3 sm:mt-6 md:mt-7 z-10 px-2 sm:px-0'>
                            <h3 className='text-base sm:text-xl md:text-2xl lg:text-3xl font-bold text-black leading-snug mb-1 sm:mb-2 text-center'>
                                Dale vida a tu look
                            </h3>
                            <p className='text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3 md:mb-4 text-center'>
                                30% de descuento en la segunda pieza
                            </p>
                            <div>
                                <button className='bg-[#DE1484] hover:bg-pink-700 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg group/btn relative overflow-hidden'>
                                    {/* Efecto de brillo en el botón */}
                                    <div className='absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700'></div>
                                    
                                    <span className='relative flex items-center gap-1'>
                                        Ver colección
                                        <svg className='w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-300 group-hover/btn:translate-x-1' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M14 5l7 7m0 0l-7 7m7-7H3' />
                                        </svg>
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Grid Inferior - 2 tarjetas */}
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 min-h-[200px] sm:min-h-[260px]'>
                    {/* Tarjeta Izquierda - Cuida tu piel */}
                    <div className='bg-[#F5F5F5] rounded-2xl relative overflow-hidden group min-h-[120px]'>
                        {/* Overlay sutil al hover */}
                        <div className='absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-500'></div>
                        
                        <div className='w-full h-full bg-[url(/skincare.png)] bg-contain bg-center bg-no-repeat flex items-start'>
                            <div className='p-2 sm:p-3 md:p-4 w-full z-10'>
                                <h4 className='text-sm sm:text-base md:text-lg lg:text-xl font-bold text-black mb-1 leading-snug'>
                                    Cuida tu piel
                                </h4>
                                <p className='text-xs text-gray-600 mb-2 sm:mb-3'>
                                    30% de descuento
                                </p>
                                <button className='bg-[#DE1484] hover:bg-pink-700 text-white px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg group/btn relative overflow-hidden'>
                                    {/* Efecto de brillo en el botón */}
                                    <div className='absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700'></div>
                                    
                                    <span className='relative flex items-center gap-1'>
                                        Comprar ahora
                                        <svg className='w-2 h-2 sm:w-3 sm:h-3 transition-transform duration-300 group-hover/btn:translate-x-1' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M14 5l7 7m0 0l-7 7m7-7H3' />
                                        </svg>
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Tarjeta Derecha - Tu cabello */}
                    <div className='bg-[#F5F5F5] rounded-2xl relative overflow-hidden group min-h-[120px]'>
                        {/* Overlay sutil al hover */}
                        <div className='absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-500'></div>
                        
                        <div className='w-full h-full bg-[url(/bote.png)] bg-contain bg-center bg-no-repeat flex items-start'>
                            <div className='p-2 sm:p-3 md:p-4 w-full flex-row justify-items-end z-10'>
                                <h4 className='text-sm sm:text-base md:text-lg font-bold text-black mb-1 leading-snug'>
                                    Tu cabello
                                </h4>
                                <p className='text-xs text-gray-600 mb-2 sm:mb-3'>
                                    25% de descuento
                                </p>
                                <div>
                                    <button className='bg-[#DE1484] hover:bg-pink-700 text-white px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg group/btn relative overflow-hidden'>
                                        {/* Efecto de brillo en el botón */}
                                        <div className='absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700'></div>
                                        
                                        <span className='relative flex items-center gap-1'>
                                            Ver productos
                                            <svg className='w-2 h-2 sm:w-3 sm:h-3 transition-transform duration-300 group-hover/btn:translate-x-1' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M14 5l7 7m0 0l-7 7m7-7H3' />
                                            </svg>
                                        </span>
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
        <div className='w-full bg-[#F5F5F5] rounded-2xl h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] relative overflow-hidden p-4 sm:p-6 group'>
            {/* Overlay sutil al hover */}
            <div className='absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-500'></div>
            
            <div className='w-full h-full flex flex-col lg:flex-row items-center justify-center z-10 gap-4 sm:gap-6 md:gap-8'>
                <div className='basis-full lg:basis-1/2 flex flex-col items-center justify-center space-y-4 sm:space-y-6 md:space-y-8 text-center lg:text-left'>
                    <div className='text-xl sm:text-2xl md:text-3xl lg:text-4xl text-balance font-bold max-w-full lg:max-w-md'>
                        ¡Precios especiales solo en nuestra app!
                    </div>
                    <div className='flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6'>
                        <div className='w-24 h-24 sm:w-32 sm:h-32 md:w-[151px] md:h-[151px] transform transition-transform duration-300 group-hover:scale-105'>
                            <img src="/qr.png" alt="qr" className='w-full h-full rounded-2xl shadow-lg' />
                        </div>
                        <div className='w-full sm:w-48 md:w-56 lg:w-[220px] text-sm sm:text-base md:text-lg lg:text-xl text-balance'>
                            Escanea el código QR y descarga <Link href={"/"} className='text-[#DE1484] hover:text-pink-700 font-semibold transition-colors duration-300'>nuestra app</Link>
                        </div>
                    </div>
                    <button className='bg-[#DE1484] hover:bg-pink-700 text-white px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 rounded-full text-sm sm:text-base md:text-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-xl sm:hover:shadow-2xl group/btn relative overflow-hidden'>
                        {/* Efecto de brillo en el botón */}
                        <div className='absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700'></div>
                        
                        <span className='relative flex items-center gap-1 sm:gap-2'>
                            Descargar Ahora
                            <svg className='w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover/btn:translate-x-1' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4v16m8-8H4' />
                            </svg>
                        </span>
                    </button>
                </div>
                <div className='basis-full lg:basis-1/2 bg-[url(/celular.png)] bg-contain bg-center bg-no-repeat h-32 sm:h-48 md:h-64 lg:h-full transform transition-transform duration-500 group-hover:scale-105'>
                </div>
            </div>
        </div>
    )
}