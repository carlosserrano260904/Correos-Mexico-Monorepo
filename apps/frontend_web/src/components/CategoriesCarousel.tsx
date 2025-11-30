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
        {/* Botones de navegación */}
        <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-white hover:bg-white border border-gray-200 transition-all duration-300 hover:scale-110 backdrop-blur-sm size-10" />
        <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-white hover:bg-white border border-gray-200 transition-all duration-300 hover:scale-110 backdrop-blur-sm size-10" />
        
        <CarouselContent className="ml-0 py-6">
          {categories.map((cat, idx) => (
            <CarouselItem
              key={idx}
              className="pl-6 md:basis-1/6 lg:basis-1/6 flex-shrink-0"
            >
              <Link 
                href={`./categories?category=${encodeURIComponent(cat.label)}`}
                className="block transition-all duration-300 ease-out rounded-2xl group/category"
              >
                <div className="h-full relative">
                  {/* Eliminado el gradiente rosado */}
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
