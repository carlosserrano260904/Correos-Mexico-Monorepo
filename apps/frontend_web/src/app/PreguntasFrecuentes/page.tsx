'use client'

import React, { useState } from 'react';
import { PlusCircle, MinusCircle } from 'lucide-react';
import { NavbarCorreos } from '../../components/NavbarCorreos';
import FooterCorreos from '@/components/footerCorreos';

// --- DATOS DE PREGUNTAS ---
const PREGUNTAS_DATA = [
  {
    id: 1,
    titulo: 'Pregunta número uno',
    respuesta: 'Respuesta a la pregunta aquí. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur faucibus tortor dapibus lectus congue lacinia. Donec accumsan vitae nisl eu dictum.'
  },
  {
    id: 2,
    titulo: 'Pregunta número dos',
    respuesta: 'Respuesta a la pregunta aquí. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur faucibus tortor dapibus lectus congue lacinia. Donec accumsan vitae nisl eu dictum.'
  },
  {
    id: 3,
    titulo: 'Pregunta número tres',
    respuesta: 'Respuesta a la pregunta aquí. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur faucibus tortor dapibus lectus congue lacinia. Donec accumsan vitae nisl eu dictum.'
  },
  {
    id: 4,
    titulo: 'Pregunta número cuatro',
    respuesta: 'Respuesta a la pregunta aquí. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur faucibus tortor dapibus lectus congue lacinia. Donec accumsan vitae nisl eu dictum.'
  },
];

export default function PreguntasFrecuentes() {
  const [openId, setOpenId] = useState<number | null>(null);
  const togglePregunta = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="bg-white min-h-screen flex flex-col font-sans">
      <NavbarCorreos />
      <main className="flex-grow">
        <section className="max-w-8xl mx-auto px-4 pt-6 pb-12 md:px-8 md:pt-1"> 
        <div className="relative w-full h-[400px] md:h-[500px] rounded-[2.5rem] overflow-hidden shadow-2xl">
            <div 
            className="absolute inset-0 w-full h-full bg-pink-500 transition-transform duration-700 hover:scale-105"
            style={{
                backgroundImage: "url('/PreguntasFrecuentes.png')",
                backgroundSize: 'cover',
                backgroundPosition: 'center' 
            }}
            >
            {/* Gradiente superpuesto */}
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-pink-400/80 to-pink-400/50 mix-blend-multiply md:mix-blend-normal"></div>
            </div>

            {/* CONTENIDO DE TEXTO */}
            <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-4">
            
            {/* Badge (Pastilla blanca) */}
            <div className="bg-white text-black-600 text-sm md:text-base font-bold px-6 py-2 rounded-full mb-6 shadow-sm inline-block tracking-wide">
                Centro de Ayuda
            </div>

            {/* Título Principal */}
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 tracking-tight drop-shadow-lg">
                Preguntas Frecuentes
            </h1>

            {/* Subtítulo */}
            <p className="text-pink-50 text-lg md:text-xl font-medium max-w-2xl mx-auto drop-shadow-md">
                Encuentra aquí las respuestas a diferentes preguntas.
            </p>
            </div>

        </div>
        </section>

        {/* --- SECCIÓN DE CONTENIDO --- */}
        <section className="max-w-7xl mx-auto px-6 py-20 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16"> 
            
            {/* COLUMNA IZQUIERDA*/}
            <div className="lg:col-span-5">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6 leading-tight">
                ¿Tienes alguna duda?
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
                Las siguientes son algunas de las preguntas que con frecuencia se realizan respecto a nuestros servicios. 
                Estamos aquí para ayudarte.
            </p>
            </div>

            {/* COLUMNA DERECHA*/}
            <div className="lg:col-span-6 lg:col-start-7 space-y-6">
            {PREGUNTAS_DATA.map((pregunta) => {
                const isOpen = openId === pregunta.id;

                return (
                <div key={pregunta.id} className="border-b border-gray-100 pb-6 last:border-0">
                    <button 
                    onClick={() => togglePregunta(pregunta.id)}
                    className="w-full flex items-start gap-4 text-left group focus:outline-none transition-colors"
                    >
                    <div className="mt-1 flex-shrink-0 text-pink-500 transition-transform duration-300">
                        {isOpen ? (
                        <MinusCircle className="w-8 h-8" strokeWidth={1.5} />
                        ) : (
                        <PlusCircle className="w-8 h-8 group-hover:text-pink-600" strokeWidth={1.5} />
                        )}
                    </div>
                    <span className={`text-xl md:text-2xl font-bold transition-colors ${isOpen ? 'text-gray-900' : 'text-gray-800 group-hover:text-pink-600'}`}>
                        {pregunta.titulo}
                    </span>
                    </button>

                    <div 
                    className={`overflow-hidden transition-all duration-300 ease-in-out pl-12 ${
                        isOpen ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'
                    }`}
                    >
                    <p className="text-gray-500 leading-relaxed">
                        {pregunta.respuesta}
                    </p>
                    </div>
                </div>
                );
            })}
            </div>
        </div>
        </section>
      </main>
        <FooterCorreos />
    </div>
  );
}