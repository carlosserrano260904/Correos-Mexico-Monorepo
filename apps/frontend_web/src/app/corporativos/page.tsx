'use client'

import React from 'react'
import { NavbarCorreos } from '@/components/NavbarCorreos'
import Footer from '@/components/footer'
import Image from 'next/image'
import { IoAirplaneOutline } from 'react-icons/io5'

export default function Corporativos() {
  return (
    <>
      <NavbarCorreos />
      <div className="min-h-screen bg-white">
        {/* Header section con imagen de fondo */}
        <div className="relative min-h-[400px] bg-pink-100 flex items-center overflow-hidden">
          {/* Texto del lado izquierdo */}
          <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Contenido del lado izquierdo */}
              <div className="space-y-6">
                <h1 className="text-5xl font-bold leading-tight">
                  <span className="text-gray-900">Servicios para</span>
                  <br />
                  <span className="text-pink-500">empresas</span>
                </h1>
              </div>
              
              {/* Imagen del lado derecho */}
              <div className="flex justify-center lg:justify-end">
                <Image
                  src="/repartidor1.png"
                  alt="Repartidor con caja"
                  width={400}
                  height={300}
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="max-w-7xl mx-auto px-6 py-16">
          {/* Sección de Cartas */}
          <div className="mb-16">
            <div className="flex items-center gap-4 mb-8">
              <h2 className="text-4xl font-bold text-gray-800">Cartas</h2>
              <IoAirplaneOutline className="w-8 h-8 text-gray-400" />
            </div>
            
            <p className="text-lg text-gray-800 mb-12">
              Envío masivo de cartas, documentos o tarjetas postales por todo <span className="text-pink-500 font-semibold">méxico</span>
            </p>
          </div>
        </div>

        {/* Layout principal - fuera del contenedor para que llegue al borde */}
        <div className="flex items-start">
          {/* Contenedor de las imágenes con margen izquierdo */}
          <div className="flex-1 max-w-4xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Primera imagen */}
              <div className="text-center">
                <Image
                  src="/envio1.png"
                  alt="Envío estándar"
                  width={600}
                  height={400}
                  className="object-contain mx-auto mb-4"
                />
              </div>
              
              {/* Segunda imagen */}
              <div className="text-center">
                <Image
                  src="/envioGrande.png"
                  alt="Envío grande"
                  width={600}
                  height={400}
                  className="object-contain mx-auto mb-4"
                />
              </div>
            </div>
          </div>

          {/* Cuadro rosa que se extiende hasta el borde derecho */}
          <div className="flex-shrink-0">
            <div className="bg-pink-500 text-white p-8 flex items-center min-h-[200px]" 
                 style={{
                   clipPath: 'polygon(80px 0, 100% 0, 100% 100%, 80px 100%, 0 50%)',
                   width: '400px',
                   paddingLeft: '100px'
                 }}>
              <h3 className="text-xl font-bold">
                Obtén acceso a las tarifas corporativas a partir de las 500 piezas
              </h3>
            </div>
          </div>
        </div>

        {/* Sección de Requisitos */}
        <div className="max-w-7xl mx-auto px-6 py-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-8">Requisitos</h2>
          
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-4 h-4 bg-pink-500 rounded-full mt-1 flex-shrink-0"></div>
              <p className="text-lg text-gray-800">Contar con un registro postal.</p>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-4 h-4 bg-pink-500 rounded-full mt-1 flex-shrink-0"></div>
              <p className="text-lg text-gray-800">Presentar piezas preclasificadas o clasificadas.</p>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-4 h-4 bg-pink-500 rounded-full mt-1 flex-shrink-0"></div>
              <p className="text-lg text-gray-800">
                Depositar la cantidad mínima de piezas requerida por servicios en la oficina postal autorizada para depósitos masivos.
              </p>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-4 h-4 bg-pink-500 rounded-full mt-1 flex-shrink-0"></div>
              <p className="text-lg text-gray-800">No enviar artículos prohibidos.</p>
            </div>
          </div>
        </div>

        {/* Sección de Paquetería */}
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-8">Paquetería</h2>
            
            <p className="text-lg text-gray-800 mb-12">
              Envío masivo de productos y mercancías empaquetadas por toda la república <span className="text-pink-500 font-semibold">mexicana</span>.
            </p>
          </div>
        </div>

        {/* Layout de Paquetería - fuera del contenedor para que llegue al borde */}
        <div className="flex items-start">
          {/* Contenedor de las imágenes con margen izquierdo */}
          <div className="flex-1 max-w-4xl mx-auto px-6">
            <div className="space-y-8">
              {/* Primera imagen - Envío Pequeño */}
              <div className="text-center">
                <Image
                  src="/envioPe.png"
                  alt="Envío Pequeño Paquetería"
                  width={600}
                  height={300}
                  className="object-contain mx-auto"
                />
              </div>
              
              {/* Segunda imagen - Envío Mediano */}
              <div className="text-center">
                <Image
                  src="/envioMe.png"
                  alt="Envío Mediano Paquetería"
                  width={600}
                  height={300}
                  className="object-contain mx-auto"
                />
              </div>

              {/* Tercera imagen - Envío Grande */}
              <div className="text-center">
                <Image
                  src="/envioGr.png"
                  alt="Envío Grande Paquetería"
                  width={600}
                  height={300}
                  className="object-contain mx-auto"
                />
              </div>
            </div>
          </div>

          {/* Cuadro rosa que se extiende hasta el borde derecho */}
          <div className="flex-shrink-0">
            <div className="bg-pink-500 text-white p-8 flex items-center min-h-[200px]" 
                 style={{
                   clipPath: 'polygon(80px 0, 100% 0, 100% 100%, 80px 100%, 0 50%)',
                   width: '400px',
                   paddingLeft: '100px'
                 }}>
              <h3 className="text-xl font-bold">
                Obtén acceso a las tarifas corporativas a partir de las 250 piezas
              </h3>
            </div>
          </div>
        </div>

        {/* Sección de Requisitos para Paquetería */}
        <div className="max-w-7xl mx-auto px-6 py-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-8">Requisitos</h2>
          
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-4 h-4 bg-pink-500 rounded-full mt-1 flex-shrink-0"></div>
              <p className="text-lg text-gray-800">Contar con un registro postal.</p>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-4 h-4 bg-pink-500 rounded-full mt-1 flex-shrink-0"></div>
              <p className="text-lg text-gray-800">Presentar piezas preclasificadas o clasificadas.</p>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-4 h-4 bg-pink-500 rounded-full mt-1 flex-shrink-0"></div>
              <p className="text-lg text-gray-800">
                Depositar la cantidad mínima de piezas requerida por servicios en la oficina postal autorizada para depósitos masivos.
              </p>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-4 h-4 bg-pink-500 rounded-full mt-1 flex-shrink-0"></div>
              <p className="text-lg text-gray-800">No enviar artículos prohibidos.</p>
            </div>
          </div>
        </div>

        {/* Sección de Impresos */}
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-8">Impresos</h2>
            
            <p className="text-lg text-gray-800 mb-12">
              Incrementa la difusión de tus servicios enviando folletos, gacetas, boletines, carteles y más a <span className="text-pink-500 font-semibold">través de nuestra red postal</span>.
            </p>
          </div>
        </div>

        {/* Layout de Impresos - fuera del contenedor para que llegue al borde */}
        <div className="flex items-start">
          {/* Contenedor de las imágenes con margen izquierdo */}
          <div className="flex-1 max-w-4xl mx-auto px-6">
            <div className="space-y-8">
              {/* Primera imagen - Envío Pequeño */}
              <div className="text-center">
                <Image
                  src="/imp1.png"
                  alt="Envío Pequeño Impresos"
                  width={600}
                  height={300}
                  className="object-contain mx-auto"
                />
              </div>
              
              {/* Segunda imagen - Envío Mediano */}
              <div className="text-center">
                <Image
                  src="/imp2.png"
                  alt="Envío Mediano Impresos"
                  width={600}
                  height={300}
                  className="object-contain mx-auto"
                />
              </div>

              {/* Tercera imagen - Envío Grande */}
              <div className="text-center">
                <Image
                  src="/imp3.png"
                  alt="Envío Grande Impresos"
                  width={600}
                  height={300}
                  className="object-contain mx-auto"
                />
              </div>
            </div>
          </div>

          {/* Cuadro rosa que se extiende hasta el borde derecho */}
          <div className="flex-shrink-0">
            <div className="bg-pink-500 text-white p-8 flex items-center min-h-[200px]" 
                 style={{
                   clipPath: 'polygon(80px 0, 100% 0, 100% 100%, 80px 100%, 0 50%)',
                   width: '400px',
                   paddingLeft: '100px'
                 }}>
              <h3 className="text-xl font-bold">
                Obtén acceso a las tarifas corporativas a partir de las 50 piezas
              </h3>
            </div>
          </div>
        </div>

        {/* Sección de Publicaciones periódicas */}
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-8">Publicaciones periódicas.</h2>
            
            <p className="text-lg text-gray-800 mb-12">
              Incrementa la difusión de revistas, diarios u otras publicaciones periódicas y llega a nuevos mercados y sectores de <span className="text-pink-500 font-semibold">todo méxico</span>.
            </p>
          </div>

          {/* Imágenes de Publicaciones periódicas */}
          <div className="space-y-8">
            {/* Primera imagen */}
            <div className="text-center">
              <Image
                src="/period1.png"
                alt="Envío Pequeño Publicaciones"
                width={800}
                height={400}
                className="object-contain mx-auto"
              />
            </div>
            
            {/* Segunda imagen */}
            <div className="text-center">
              <Image
                src="/period2.png"
                alt="Envío Mediano Publicaciones"
                width={800}
                height={400}
                className="object-contain mx-auto"
              />
            </div>

            {/* Tercera imagen */}
            <div className="text-center">
              <Image
                src="/period3.png"
                alt="Envío Grande Publicaciones"
                width={800}
                height={400}
                className="object-contain mx-auto"
              />
            </div>
          </div>
        </div>

        {/* Sección de Contacto y Soporte */}
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">¿Tienes más dudas?</h2>
            <p className="text-lg text-gray-800">Contacta nuestro equipo de soporte.</p>
          </div>

          <div className="text-center">
            <Image
              src="/dudas1.png"
              alt="Centro de Atención a Clientes - Información de Contacto"
              width={800}
              height={500}
              className="object-contain mx-auto"
            />
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  )
}
