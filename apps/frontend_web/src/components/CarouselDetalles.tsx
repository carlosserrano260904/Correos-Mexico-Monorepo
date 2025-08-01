import React from "react"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "./ui/carousel"

interface CarouselDetallesItem {
  image: string
  description: string
}

interface CarouselDetallesProps {
  items: CarouselDetallesItem[]
}

export const CarouselDetalles = ({ items }: CarouselDetallesProps) => {
  return (
    
    <div className="w-full max-w-6xl mx-auto p-6">
      {/* Título */}
      <h2 className="text-xl font-semibold text-gray-800 mb-6 text-left">Detalles</h2>
      
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
            <CarouselItem key={idx} className="md:basis-1/3 lg:basis-1/3">
              <div className="flex flex-col items-center p-2">
                <img
                  src={item.image}
                  alt={`Imagen ${idx + 1}`}
                  className="rounded-xl object-cover w-full h-72"
                />
                <div className="mt-4 text-sm text-gray-800 text-left px-2">
                  {item.description}
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        {/* Botones personalizados más separados */}
        <CarouselPrevious className="absolute -left-12 top-1/2 -translate-y-1/2 z-20 bg-white border border-gray-300 rounded-full p-3 shadow-lg hover:bg-gray-50" />
        <CarouselNext className="absolute -right-12 top-1/2 -translate-y-1/2 z-20 bg-white border border-gray-300 rounded-full p-3 shadow-lg hover:bg-gray-50" />
        
      </Carousel>
    </div>
  )
}
