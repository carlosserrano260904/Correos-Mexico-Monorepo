'use client'

import React, { useState } from 'react';
import { NavbarCorreos } from '../../components/NavbarCorreos';
import FooterCorreos from '@/components/footerCorreos';

export default function Comentario() {
  const [comentario, setComentario] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Comentario enviado:', comentario);
    alert('¡Gracias por tus comentarios!');
    setComentario('');
  };

  return (
    <div className="bg-white min-h-screen flex flex-col font-sans">
      <NavbarCorreos />
      <main className="flex-grow">
        <section className="max-w-8xl mx-auto px-4 pt-6 pb-12 md:px-8 md:pt-1">
        {/*TARJETA PRINCIPAL*/}
        <div className="relative w-full rounded-[2.5rem] overflow-hidden bg-gradient-to-b from-pink-300/60 via-pink-50/30 to-white p-8 md:p-16 text-center">
            
            {/* 2. ENCABEZADO Y TEXTO */}
            <div className="max-w-3xl mx-auto mb-10">
            <h2 className="text-7xl md:text-10xl font-extrabold text-gray-700 tracking-tight mb-4 leading-tight">
                ¡Queremos leer tus <br className="hidden md:block" />
                <span className="text-pink-600">comentarios</span>!
            </h2>
            
            <p className="text-gray-800 text-lg md:text-xl leading-relaxed">
                Si te gustaría enviarnos tus comentarios sobre nuestros servicios, 
                por favor hazlo en la siguiente caja de comentarios.
            </p>
            </div>

            {/* 3. EL FORMULARIO */}
            <div className="max-w-4xl mx-auto">
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                
                {/* Área de texto (Textarea) */}
                <textarea
                className="w-full h-48 bg-gray-50 border border-gray-200 rounded-2xl p-6 text-gray-700 text-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all resize-none shadow-inner"
                placeholder="Escribe aquí tus comentarios."
                ></textarea>
                
                {/* Botón Enviar (Alineado a la derecha) */}
                <div className="flex justify-end mt-2">
                <button
                    type="submit"
                    className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                >
                    Enviar
                </button>
                </div>

            </form>
            </div>
        </div>
        </section>
      </main>
        <FooterCorreos />
    </div>
  );
}