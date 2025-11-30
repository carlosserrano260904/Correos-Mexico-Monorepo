import React from "react"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "./ui/carousel"

interface CarouselDetallesItem {
  image: string
  description: string
}

interface CarouselDetallesProps {
  items: CarouselDetallesItem[]
  limit?: number
}

export const CarouselDetalles = ({ items, limit = 3 }: CarouselDetallesProps) => {
  
  // Limitar número de imágenes
  const limitedItems = items.slice(0, limit)

  return (
    <div className="w-full mx-auto">
      {/* Título */}
      <h2 className="text-xl font-semibold text-gray-800 mb-6 text-left">Detalles</h2>
      
      {/* Carousel */}
      <Carousel
        opts={{
          align: "start",
        }}
        className="relative"
      >
        <CarouselContent className="mx-4">
          {limitedItems.map((item, idx) => (
            <CarouselItem key={idx} className="basis-full sm:basis-1/2 md:basis-1/3">
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
        
        {/* Botones */}
        <CarouselPrevious className="absolute -left-12 top-1/2 -translate-y-1/2 z-20 bg-white border border-gray-300 rounded-full p-3 shadow-lg hover:bg-gray-50" />
        <CarouselNext className="absolute -right-12 top-1/2 -translate-y-1/2 z-20 bg-white border border-gray-300 rounded-full p-3 shadow-lg hover:bg-gray-50" />
        
      </Carousel>
    </div>
  )
}
