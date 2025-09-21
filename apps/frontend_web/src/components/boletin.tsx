'use client'
import React from 'react'
import { MdAlternateEmail } from 'react-icons/md'

export const Boletin = () => {
  return (
    <div className='bg-[#DE1484] w-[990px] rounded-2xl mx-auto p-5 flex'>
        <div className='basis-1/3 flex items-center justify-center'>
                <img src="/correo.png" alt="correo" width={280} height={228} />
        </div>
        <div className='basis-2/3 flex flex-col justify-center gap-6'>
            <div className='text-white text-4xl font-bold text-balance w-full'>
                Suscríbete a nuestro boletín para recibir las últimas actualizaciones.
            </div>
            <div className='relative max-w-lg mx-auto'>
                <div className='absolute left-4 top-1/2 transform -translate-y-1/2 z-10'>
                    <MdAlternateEmail className='text-black text-xl' />
                </div>
                <input
                    type="email"
                    placeholder="Ingresa tu email"
                    className='w-full bg-white/40 rounded-full pl-12 pr-32 py-4 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white'
                />
                <button className='absolute right-2 top-1/2 transform -translate-y-1/2 bg-white text-black px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition-colors'>
                    Suscribirse
                </button>
            </div>
            <div className='text-white text-2xl text-balance w-full'>
                Manténgase al día con las últimas actualizaciones, productos y categorías de CorreosClic.
            </div>
        </div>
    </div>
  )
}