import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import { CategoryItem } from "./CategoryItem";
import { CategoriesCarouselProps } from "@/types/interface";
import Link from "next/link";

export const CategoriesCarousel = ({ categories }: CategoriesCarouselProps) => {
  return (
    <div className="w-full mx-auto p-6 relative">
      <h2 className="text-3xl font-semibold text-gray-800 mb-8 text-center">
        Categorías
      </h2>

      <Carousel
        opts={{
          align: "start",
          loop: false,
          dragFree: false,
          duration: 25,
        }}
        className="relative w-full"
      >
        {/* Botones de navegación - siempre visibles */}
        <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-white/95 hover:bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 backdrop-blur-sm size-10" />
        <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-white/95 hover:bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 backdrop-blur-sm size-10" />
        
        <CarouselContent className="ml-0 py-6">
          {categories.map((cat, idx) => (
            <CarouselItem
              key={idx}
              className="pl-6 md:basis-1/6 lg:basis-1/6 flex-shrink-0"
            >
              {/* Envuelve el CategoryItem con Link - versión simplificada */}
              <Link 
                href={`./categories?category=${encodeURIComponent(cat.label)}`}
                className="block transition-all duration-300 ease-out hover:shadow-lg rounded-2xl group/category"
              >
                <div className="h-full">
                  {/* Efecto de fondo gradiente sutil */}
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover/category:opacity-100 transition-opacity duration-500 pointer-events-none -z-10" />
                  
                  <CategoryItem imageSrc={cat.imageSrc} label={cat.label} />
                </div>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};