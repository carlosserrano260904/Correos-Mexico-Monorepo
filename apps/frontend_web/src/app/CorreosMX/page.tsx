'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { NavbarCorreos } from '@/components/NavbarCorreos'
import { CarouselServicios } from '@/components/CarouselServicios'
import Image from 'next/image'
import Foterr from '@/components/footerCorreos';
import {
  IoPricetagOutline,
  IoCalculatorOutline,
  IoLocationOutline,
  IoSearchOutline,
  IoMailOutline,
  IoCubeOutline,
  IoPrintOutline,
  IoBriefcaseOutline
} from 'react-icons/io5'

export default function CorreosMX() {
  const [botonSeleccionado, setBotonSeleccionado] = useState('')
  const router = useRouter()

  const botones = [
    {
      id: 'cotizar',
      texto: 'Cotizar Envío',
      icono: <IoPricetagOutline className="w-5 h-5" />
    },
    {
      id: 'tarifas',
      texto: 'Tarifas de Envío',
      icono: <IoCalculatorOutline className="w-5 h-5" />
    },
    {
      id: 'ubicaciones',
      texto: 'Ubicaciones y Horarios',
      icono: <IoLocationOutline className="w-5 h-5" />
    }
  ]

  // --- ARRAY DE SERVICIOS ACTUALIZADO ---
  const servicios = [
    {
      id: 'correspondencia',
      titulo: 'Correspondencia',
      descripcion: 'Envío masivo de cartas, documentos o tarjetas postales por todo México y el mundo.',
      icono: <IoMailOutline className="w-8 h-8" />
    },
    {
      id: 'paqueteria',
      titulo: 'Paquetería',
      descripcion: 'Envío masivo de productos y mercancías empaquetadas por toda la República Mexicana.',
      icono: <IoCubeOutline className="w-8 h-8" /> 
    },
    {
      id: 'impresos',
      titulo: 'Impresos',
      descripcion: 'Envía desde folletos, boletines, hasta carteles y catálogos y haz crecer tu negocio a través de nuestra red postal.',
      icono: <IoPrintOutline className="w-8 h-8" /> 
    },
    {
    id: 'embalajes',
    titulo: 'Embalajes',
    descripcion: 'Garantiza la entrega adecuada y segura de tus empaques y embalajes por toda la República.',
    icono: <IoBriefcaseOutline className="w-8 h-8" /> 
   }
  ]

  return (
    <>
      <NavbarCorreos />
      <div className='min-h-screen bg-gray-100 rounded-xl py-3 pt-9'>
        <div className="w-full relative">
          {/* Imagen de fondo solo para la sección del título */}
          <div className="absolute left-0 right-0 top-0 rounded-xl overflow-hidden" style={{ height: '1000px', marginLeft: '-40px', marginRight: '-40px' }}>
            <Image
              src="/fondoCorreos.png"
              alt="Fondo Correos de México"
              fill
              className="object-contain object-center opacity-100 w-full"
              priority
            />
          </div>
          
          <div className="max-w-7xl mx-auto px-6 py-16 relative z-10">
            {/* Título principal */}
            <div className="mb-12">
              <h1 className="text-6xl font-bold leading-tight">
                <span className="text-pink-500">Envíos</span>{" "}
                <span className="text-gray-900">para</span>
                <br />
                <span className="text-gray-900">todos, a dónde</span>
                <br />
                <span className="text-gray-900">sea, cuándo sea.</span>
              </h1>
            </div>

            {/* Botones animados */}
            <div className="flex gap-4 mb-8">
              {botones.map((boton) => (
                <button
                  key={boton.id}
                  onClick={() => {
                    setBotonSeleccionado(boton.id)
                    if (boton.id === 'cotizar') router.push('/CorreosMX/cotizar')
                    if (boton.id === 'tarifas') router.push('/CorreosMX/tarifas')
                    if (boton.id === 'ubicaciones') router.push('/CorreosMX/ubicaciones')
                  }}
                  className={`flex items-center gap-3 px-6 py-3 rounded-full font-medium shadow-md transform
                    transition-all duration-300 ease-in-out
                    hover:scale-105 active:scale-95 focus:outline-none
                    ${botonSeleccionado === boton.id
                      ? 'bg-pink-500 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'}
                  `}
                >
                  {boton.icono}
                  <span>{boton.texto}</span>
                </button>
              ))}
            </div>

            {/* Búsqueda por guía */}
            <div className="max-w-2xl mb-96">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Ingresa tu número de guía..."
                  className="block w-full px-6 pr-16 py-4 rounded-full min-h-[60px] bg-white placeholder-gray-500 text-center focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 border border-gray-200 shadow-md"
                />
                <div className="absolute inset-y-0 right-0 pr-2 flex items-center">
                  <button className="bg-pink-500 hover:bg-pink-600 text-white p-3 rounded-full transition-colors">
                    <IoSearchOutline className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Carrusel de servicios */}
            <CarouselServicios servicios={servicios} />
          </div>
        </div>

        <div className="w-full -mx-10 mt-16 relative min-h-[800px] bg-gray-100">
          <div className="absolute top-40 left-0" style={{ width: '42%', height: '540px' }}>
            <div
              className="h-full bg-pink-500"
              style={{
                marginLeft: '-10vw',
                paddingLeft: '10vw',
                borderTopRightRadius: '9999px',
                borderBottomRightRadius: '9999px'
              }}
            ></div>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              {/* Imagen */}
              <div className="flex justify-center -ml-32 overflow-visible -mt-12">
                <Image
                  src="/cajitauwu.png"
                  alt="Caja de Correos de México"
                  width={1320}
                  height={1320}
                  className="object-contain max-w-none"
                  priority
                />
              </div>

              {/* Texto y estadísticas */}
              <div className="space-y-10 mt-4">
                <div>
                  <h2 className="text-5xl font-bold mb-8 text-gray-900 leading-tight">
                    Tu conexión confiable en todo el país y el mundo
                  </h2>
                  <p className="text-xl text-gray-600 mb-12 leading-relaxed">
                    En Correos de México, trabajamos día con día para conectar a millones de personas a través de nuestro servicio postal.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-6 w-full max-w-2xl">
                  <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
                    <div className="text-5xl font-bold text-pink-500 mb-3">7,200+</div>
                    <div className="text-lg text-gray-600 font-medium">Oficinas Postales</div>
                  </div>
                  <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
                    <div className="text-5xl font-bold text-green-500 mb-3">100 +</div>
                    <div className="text-lg text-gray-600 font-medium">Años de experiencia</div>
                  </div>
                  <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
                    <div className="text-5xl font-bold text-green-500 mb-3">2,659</div>
                    <div className="text-lg text-gray-600 font-medium">Rutas</div>
                  </div>
                  <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
                    <div className="text-5xl font-bold text-pink-500 mb-3">7,345</div>
                    <div className="text-lg text-gray-600 font-medium">Empleados</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Foterr />
    </>
  )
}
