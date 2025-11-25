'use client';

import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

// Asegúrate de que esta lista tenga los nombres CORRECTOS de tus archivos en la carpeta 'public'
const banners = [
  {
    id: 1,
    image: "/banner-tenis.png",
    alt: "Tenis - Nuevos Modelos"
  },
  {
    id: 2,
    image: "/banner-llego-verano.png",
    alt: "Llegó el verano - Envíos gratis"
  },
  {
    id: 3,
    image: "/banner-verano-amarilla.png",
    alt: "Nuevos modelos deportivos"
  },
  {
    id: 4,
    image: "/banner-temporada-verano.png",
    alt: "Temporada Verano 2025"
  }
];

export const HeroBanner: React.FC = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  const plugin = useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  );

  useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap() + 1);
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <div className="w-full mx-auto rounded-2xl overflow-hidden shadow-sm group relative mb-8">
      <Carousel
        setApi={setApi}
        plugins={[plugin.current]}
        className="w-full"
        opts={{
          loop: true,
          align: "center"
        }}
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent className="ml-0">
          {banners.map((banner, index) => (
            <CarouselItem key={banner.id} className="pl-0">
              {/* --- CAMBIO CLAVE AQUÍ --- */}
              {/* 1. Definimos alturas FIJAS y explícitas para diferentes tamaños de pantalla.
                  h-[300px] en móvil, h-[450px] en tablet pequeña, h-[550px] en escritorio.
                  El 'relative' es necesario para que funcione el 'fill' de la imagen. */}
              <div className="relative w-full h-[300px] sm:h-[450px] md:h-[550px] lg:h-[600px]">
                <Image
                  src={banner.image}
                  alt={banner.alt}
                  // 2. Usamos 'fill' en lugar de width/height. Esto hace que la imagen llene el 'div' padre.
                  fill
                  // 3. 'object-cover' es vital: recorta la imagen para llenar el espacio sin estirarla.
                  className="object-cover"
                  priority={index === 0}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 border-0 bg-black/20 hover:bg-black/40 text-white transition-opacity opacity-0 group-hover:opacity-100 z-20 hidden sm:flex" />
        <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 border-0 bg-black/20 hover:bg-black/40 text-white transition-opacity opacity-0 group-hover:opacity-100 z-20 hidden sm:flex" />
      </Carousel>

      {/* Indicadores (Puntitos) */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-20 pointer-events-none">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => api?.scrollTo(index)}
            className={`h-3 rounded-full transition-all duration-500 pointer-events-auto ${
              index + 1 === current
                ? "bg-[#DE1484] w-8" 
                : "bg-white/80 hover:bg-white w-3" 
            }`}
            aria-label={`Ir a banner ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};