'use client'
import React from 'react'
import { MdAlternateEmail } from 'react-icons/md'

export const Boletin = () => {
  return (
    <div className='bg-[#DE1484] w-full max-w-[320px] sm:max-w-[500px] md:max-w-[700px] lg:max-w-[900px] xl:max-w-[990px] rounded-2xl mx-auto p-4 sm:p-5 flex flex-col lg:flex-row gap-6 sm:gap-8'>
        {/* Imagen - Centrada en móvil, a la izquierda en desktop */}
        <div className='basis-full lg:basis-1/3 flex items-center justify-center order-2 lg:order-1'>
            <img 
                src="/correo.png" 
                alt="correo" 
                className='w-48 h-auto sm:w-56 md:w-64 lg:w-72 xl:w-80'
            />
        </div>
        
        {/* Contenido - Primero en móvil, segundo en desktop */}
        <div className='basis-full lg:basis-2/3 flex flex-col justify-center gap-4 sm:gap-5 md:gap-6 order-1 lg:order-2'>
            {/* Título responsive */}
            <div className='text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-balance text-center lg:text-left'>
                Suscríbete a nuestro boletín para recibir las últimas actualizaciones.
            </div>
            
            {/* Input con botón - Full width en móvil */}
            <div className='relative w-full max-w-full sm:max-w-lg mx-auto lg:mx-0'>
                <div className='absolute left-4 top-1/2 transform -translate-y-1/2 z-10 flex items-center'>
                    <MdAlternateEmail className='text-black text-lg sm:text-xl' />
                </div>
                <input
                    type="email"
                    placeholder="Ingresa tu email"
                    className='w-full bg-white/40 rounded-full pl-12 pr-32 py-3 sm:py-4 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white text-sm sm:text-base'
                />
                <button className='absolute right-2 top-1/2 transform -translate-y-1/2 bg-white text-black px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-xl group/btn relative overflow-hidden'>
                    {/* Efecto de brillo en el botón */}
                    <div className='absolute inset-0 bg-gradient-to-r from-pink-500/20 to-transparent transform -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700'></div>
                    
                    <span className='relative flex items-center gap-1 sm:gap-2 text-xs sm:text-sm md:text-base'>
                        Suscribirse
                        <svg className='w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-300 group-hover/btn:translate-x-1' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M14 5l7 7m0 0l-7 7m7-7H3' />
                        </svg>
                    </span>
                </button>
            </div>
            
            {/* Descripción responsive */}
            <div className='text-white text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-balance text-center lg:text-left'>
                Manténgase al día con las últimas actualizaciones, productos y categorías de CorreosClic.
            </div>
        </div>
    </div>
  )
}