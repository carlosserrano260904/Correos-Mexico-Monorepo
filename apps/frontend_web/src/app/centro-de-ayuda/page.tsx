import React from "react";
import Image from "next/image";
import { NavbarCorreos } from "@/components/NavbarCorreos";
import Footer from "@/components/footerCorreos";

export default function CentroDeAyuda() {
  return (
    <div className="w-full min-h-screen bg-white">
      <NavbarCorreos />

      {/* Contenedor principal */}
      <section className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Texto */}
        <div className="flex flex-col justify-center">
          <span className="text-pink-600 font-semibold text-sm bg-pink-100 py-1 px-3 rounded-full w-fit mb-4">
            ¿Cómo podemos ayudarte?
          </span>

          <h1 className="text-5xl font-bold text-gray-900 mb-6">Centro de Ayuda</h1>

          <p className="text-gray-700 leading-relaxed text-lg max-w-lg">
            ¡Bienvenido al centro de ayuda! Encuentra aquí información segura y
            confiable respecto a nuestros servicios, preguntas frecuentes y
            maneras de realizar tus envíos.
          </p>
        </div>

        {/* Imágenes */}
        <div className="flex flex-col gap-6 items-center">
            <div className="w-full h-[32rem] relative rounded-xl overflow-hidden border">
                <Image
                    src="/imgCentroAyuda.png"
                    alt="Correos de Mexico"
                    fill
                    className="object-cover"
                />
            </div>
        </div>
      </section>

      {/* Sección de tarjetas */}
        <section className="max-w-7xl mx-auto px-6 pb-20 grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Tarjeta 1 */}
        <div className="bg-gray-50 rounded-3xl p-8 shadow-sm flex flex-col gap-4">
        <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 text-xl">
        <span>💬</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Preguntas Frecuentes</h2>
        <p className="text-gray-600 text-m">
        ¿Eres dueño de una empresa o estás emprendiendo? ¡Conoce los servicios que ofrecemos para ti!
        </p>
        <a href="/PreguntasFrecuentes">
        <button className="bg-pink-600 text-white w-fit px-6 py-2 rounded-full text-sm font-semibold flex items-center gap-2 hover:bg-pink-700 transition">
            Saber más →
        </button>
        </a>
        </div>


        {/* Tarjeta 2 */}
        <div className="bg-gray-50 rounded-3xl p-8 shadow-sm flex flex-col gap-4">
        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-xl">
        <span>💼</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Servicios para Empresas</h2>
        <p className="text-gray-600 text-m">
        ¿Eres dueño de una empresa o estás emprendiendo? ¡Conoce los servicios que ofrecemos para ti!
        </p>
        <a href="/servicio_empresas">
        <button className="bg-pink-600 text-white w-fit px-6 py-2 rounded-full text-sm font-semibold flex items-center gap-2 hover:bg-pink-700 transition">
            Saber más →
        </button>
        </a>
        </div>


        {/* Tarjeta 3 */}
        <div className="bg-gray-50 rounded-3xl p-8 shadow-sm flex flex-col gap-4">
        <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 text-xl">
        <span>✉️</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900">¿Cómo hacer un envío?</h2>
        <p className="text-gray-600 text-m">
        ¿Eres dueño de una empresa o estás emprendiendo? ¡Conoce los servicios que ofrecemos para ti!
        </p>
        <a href="/como-enviar">
        <button className="bg-pink-600 text-white w-fit px-6 py-2 rounded-full text-sm font-semibold flex items-center gap-2 hover:bg-pink-700 transition">
            Saber más →
        </button>
        </a>
        </div>


        {/* Tarjeta 4 */}
        <div className="bg-gray-50 rounded-3xl p-8 shadow-sm flex flex-col gap-4">
        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-500 text-xl">
        <span>👥</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Servicios en ventanilla</h2>
        <p className="text-gray-600 text-m">
        ¿Eres dueño de una empresa o estás emprendiendo? ¡Conoce los servicios que ofrecemos para ti!
        </p>
        <a href="/servicios-ventanilla">
        <button className="bg-pink-600 text-white w-fit px-6 py-2 rounded-full text-sm font-semibold flex items-center gap-2 hover:bg-pink-700 transition">
            Saber más →
        </button>
        </a>
        </div>
        </section>
        <Footer />
        
    </div>
  );
}
