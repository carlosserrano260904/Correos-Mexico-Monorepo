import React from "react"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "./ui/carousel"

interface CarouselLigeraViranteItem {
  image: string
}

interface CarouselLigeraViranteProps {
  items: CarouselLigeraViranteItem[]
}

export const CarouselLigeraVibrante = ({ items }: CarouselLigeraViranteProps) => {
  return (
    <div className="w-full bg-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Título y descripción alineados a la izquierda */}
        <div className="mb-8">
          <h2 className="text-3xl font-semibold text-gray-900 mb-4 text-left">Ligera y Vibrante</h2>
          <p className="text-gray-600 text-lg text-left max-w-2xl">
            Una blusa que une tradición y estilo en cada puntada.
          </p>
        </div>
        
        {/* Carousel */}
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="relative"
        >
          <CarouselContent className="mx-12">
            {items.map((item, idx) => (
              <CarouselItem key={idx} className="md:basis-1/2 lg:basis-1/2">
                <div className="p-2">
                  <img
                    src={item.image}
                    alt={`Imagen ${idx + 1}`}
                    className="rounded-xl object-cover w-full h-96"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          
          {/* Botones personalizados más separados */}
          <CarouselPrevious className="absolute -left-12 top-1/2 -translate-y-1/2 z-20 bg-white border border-gray-300 rounded-full p-3 shadow-lg hover:bg-gray-50" />
          <CarouselNext className="absolute -right-12 top-1/2 -translate-y-1/2 z-20 bg-white border border-gray-300 rounded-full p-3 shadow-lg hover:bg-gray-50" />
        </Carousel>
      </div>
    </div>
  )
}
