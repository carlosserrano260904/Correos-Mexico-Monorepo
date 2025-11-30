'use client'
import React, { useState } from 'react'
import { MdAlternateEmail } from 'react-icons/md'

export const Boletin = () => {

  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Email suscrito:", email);
  };

  return (
    <div className='bg-[#DE1484] w-full max-w-[320px] sm:max-w-[500px] md:max-w-[700px] lg:max-w-[900px] xl:max-w-[990px] rounded-2xl mx-auto p-4 sm:p-5 flex flex-col lg:flex-row gap-6 sm:gap-8'>

        {/* Imagen */}
        <div className='basis-full lg:basis-1/3 flex items-center justify-center order-2 lg:order-1'>
            <img 
                src="/correo.png" 
                alt="correo" 
                className='w-48 h-auto sm:w-56 md:w-64 lg:w-72 xl:w-80'
            />
        </div>
        
        {/* Contenido */}
        <div className='basis-full lg:basis-2/3 flex flex-col justify-center gap-4 sm:gap-5 md:gap-6 order-1 lg:order-2'>
            
            {/* Título */}
            <div className='text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-balance text-center lg:text-left'>
                Suscríbete a nuestro boletín para recibir las últimas actualizaciones.
            </div>
            
            {/* Formulario */}
            <form 
            onSubmit={handleSubmit}
            className='flex flex-col items-center lg:items-start w-full max-w-xl mx-auto lg:mx-0 gap-4'
            >

            {/* Input grande estilo pill con degradado */}
            <div className="relative w-full">
                <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Ingresa tu email"
                className="w-full h-14 sm:h-16 rounded-full 
                            bg-gradient-to-r from-[#DD6FA3] to-[#E875AA] 
                            text-white placeholder-white/70
                            px-10 text-base sm:text-lg
                            focus:outline-none focus:ring-2 focus:ring-white"
                />

                {/* Icono dentro del input */}
                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <MdAlternateEmail className="text-white text-lg sm:text-xl opacity-90" />
                </div>
            </div>


            {/* Botón separado (no solapado) como el primer diseño */}
            <button
                type="submit"
                className="bg-white text-black rounded-full px-6 py-3 
                        text-sm sm:text-base font-semibold shadow-md
                        hover:scale-105 transition-transform duration-200"
            >
                Suscribirse →
            </button>

            </form>

            {/* Descripción */}
            <div className='text-white text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-balance text-center lg:text-left'>
                Manténgase al día con las últimas actualizaciones, productos y categorías de CorreosClic.
            </div>
        </div>
    </div>
  )
}
