import React from "react"
import { useRouter } from 'next/navigation'
import { Carousel, CarouselContent, CarouselItem } from "./ui/carousel"
import { IoMailOutline, IoArchiveOutline, IoDocumentTextOutline, IoCashOutline, IoSettingsOutline, IoArrowForwardOutline } from 'react-icons/io5'

interface ServicioItem {
  id: string
  titulo: string
  descripcion: string
  icono: React.ReactNode
}

interface CarouselServiciosProps {
  servicios: ServicioItem[]
}

export const CarouselServicios = ({ servicios }: CarouselServiciosProps) => {
  const router = useRouter()

  const handleCardClick = (servicioId: string) => {
    switch (servicioId) {
      case 'servicios-ventanilla':
        router.push('/servicios-ventanilla')
        break
      case 'prohibidos':
        router.push('/articulosprohibidos')
        break
      case 'enviar':
        router.push('/como-enviar')
        break
      case 'corporativos':
        router.push('/corporativos')
        break
      // Agregar más casos cuando tengamos más páginas
      default:
        console.log(`Página no disponible para: ${servicioId}`)
    }
  }
  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      {/* Carousel */}
      <Carousel
        opts={{
          align: "start",
          loop: false,
        }}
        className="relative"
      >
        <CarouselContent className="mx-12">
          {servicios.map((servicio) => (
            <CarouselItem key={servicio.id} className="md:basis-1/3 lg:basis-1/4">
              <div className="bg-white rounded-xl shadow-md p-6 h-full flex flex-col">
                {/* Icono en cuadrado rosa */}
                <div className="mb-6">
                  <div className="w-16 h-16 bg-pink-500 rounded-lg flex items-center justify-center text-white">
                    {servicio.icono}
                  </div>
                </div>
                
                {/* Título */}
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {servicio.titulo}
                </h3>
                
                {/* Descripción */}
                <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-grow">
                  {servicio.descripcion}
                </p>
                
                {/* Botón "Más información" */}
                <button 
                  onClick={() => handleCardClick(servicio.id)}
                  className="flex items-center justify-between px-3 py-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors cursor-pointer w-full"
                >
                  <span className="text-sm font-medium text-gray-700">
                    Más información
                  </span>
                  <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center text-white">
                    <IoArrowForwardOutline className="w-4 h-4" />
                  </div>
                </button>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  )
}
