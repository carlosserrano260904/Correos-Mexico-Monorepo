'use client'
import React from 'react';
import { NavbarCorreos } from '@/components/NavbarCorreos';
import FooterCorreos from '@/components/footerCorreos';

export default function Oficinas() {
  const servicios = [
    "Depósito de cartas y paquetes para envío nacional e internacional.",
    "Recepción de cartas y paquetes.",
    "Compra de guías prepagadas MEXPOST.",
    "Envío de Giros Postales.",
    "Arrendamiento de Cajas de Apartado.",
    "Expedición de Cartilla de Identidad Postal.",
    "Almacenaje.",
    "Presentación a la Aduana.",
    "Servicios adicionales."
  ];

  return (
    <div className="bg-white min-h-screen flex flex-col font-sans">
      <NavbarCorreos />

      {/* --- HERO CON IMAGEN --- */}
      <section className="max-w-8xl mx-auto px-4 pt-6 pb-12 md:px-2 md:pt-1">
        <div className="relative w-[1200px] h-[400px] md:h-[500px] rounded-[2.5rem] overflow-hidden shadow-2xl">
          <div
            className="absolute inset-0 w-full h-full transition-transform duration-700 hover:scale-105"
            style={{
              backgroundImage: "url('/hacerEnvio.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          ></div>

          {/* Capa de color */}
          <div className="absolute inset-0 bg-gradient-to-r from-pink-600/90 via-pink-500/80 to-pink-400/70"></div>

          {/* Contenido */}
          <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-4">
            
            <a href="/centro-de-ayuda">
            <div className="bg-white text-black-600 text-sm md:text-base font-bold px-6 py-2 rounded-full mb-6 shadow-sm inline-block tracking-wide">
                Centro de Ayuda
            </div>
            </a>

            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 drop-shadow-lg">
              Servicios en ventanilla
            </h1>

            <p className="text-pink-50 text-lg md:text-xl font-medium max-w-2xl">
              Conoce las formas en las que puedes enviar distintos paquetes con nuestros servicios.
            </p>
          </div>
        </div>
      </section>

      {/* --- SECCIÓN DE SERVICIOS --- */}
      <section className="max-w-7xl mx-auto px-6 py-2 md:py-2">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">

          {/* Texto Izquierda */}
          <div className="ml-18 lg:col-span-5 ">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6 leading-tight">
                Acude con confianza a nuestras oficinas
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
                En nuestras más de 1,100 oficinas postales, podrás tener acceso a los siguientes servicios principales:
            </p>
            </div>

          {/* Imagen Derecha */}
          <div className="lg:col-span-7 flex justify-center">
            <img
              src="/edificioVent.png"
              className="w-full max-w-md drop-shadow-xl"
              alt="Edificio oficinas"
            />
          </div>
        </div>

        {/* Grid de Servicios */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
          {servicios.map((s, index) => (
            <div
              key={index}
              className="bg-[#F7F2FB] border border-gray-100 rounded-3xl p-6 shadow hover:shadow-md transition"
            >
              <div className="w-10 h-10 bg-purple-200 rounded-full flex items-center justify-center mb-3">
                <span className="text-purple-600 text-xl">📫</span>
              </div>
              <p className="text-gray-700 font-medium">{s}</p>
            </div>
          ))}
        </div>
      </section>

      <FooterCorreos />
    </div>
  );
}
