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

      {/* --- HERO CON IMAGEN RESPONSIVE --- */}
      <section className="w-full px-4 pt-6 pb-8 md:pb-12 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="relative w-full h-[300px] sm:h-[400px] md:h-[450px] lg:h-[500px] rounded-2xl md:rounded-[2.5rem] overflow-hidden shadow-2xl">
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
            <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-4 sm:px-6">
              
              <a href="/centro-de-ayuda">
                <div className="bg-white text-black-600 text-xs sm:text-sm md:text-base font-bold px-4 sm:px-6 py-1.5 sm:py-2 rounded-full mb-4 sm:mb-6 shadow-sm inline-block tracking-wide">
                  Centro de Ayuda
                </div>
              </a>

              <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-extrabold text-white mb-2 sm:mb-4 drop-shadow-lg">
                Servicios en ventanilla
              </h1>

              <p className="text-pink-50 text-sm sm:text-base md:text-lg lg:text-xl font-medium max-w-xs sm:max-w-md md:max-w-2xl">
                Conoce las formas en las que puedes enviar distintos paquetes con nuestros servicios.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- SECCIÓN DE SERVICIOS RESPONSIVE --- */}
      <section className="w-full px-4 md:px-6 lg:px-8 py-8 md:py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center mb-12 md:mb-16">

            {/* Texto Izquierda */}
            <div className="lg:col-span-5 order-2 lg:order-1">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 sm:mb-6 leading-tight">
                Acude con confianza a nuestras oficinas
              </h2>
              <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
                En nuestras más de 1,100 oficinas postales, podrás tener acceso a los siguientes servicios principales:
              </p>
            </div>

            {/* Imagen Derecha */}
            <div className="lg:col-span-7 flex justify-center order-1 lg:order-2">
              <img
                src="/edificioVent.png"
                className="w-full max-w-[280px] sm:max-w-sm md:max-w-md drop-shadow-xl"
                alt="Edificio oficinas"
              />
            </div>
          </div>

          {/* Grid de Servicios Responsive */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
            {servicios.map((s, index) => (
              <div
                key={index}
                className="bg-[#F7F2FB] border border-gray-100 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow hover:shadow-lg transition-shadow duration-300"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-200 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                  <span className="text-purple-600 text-xl sm:text-2xl">📫</span>
                </div>
                <p className="text-gray-700 font-medium text-sm sm:text-base leading-relaxed">{s}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FooterCorreos />
    </div>
  );
}