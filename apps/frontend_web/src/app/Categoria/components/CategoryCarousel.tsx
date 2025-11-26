'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';

// LISTA COMBINADA DE CATEGORÍAS
// Incluye las de la Imagen 1 (Destacados, FONART) y la Imagen 2 (Blusas, Pantalones...)
const STATIC_CATEGORIES = [
  { 
    name: 'Blusas', 
    slug: 'blusas', 
    image: '/categorias/blusas.png' // Usa la imagen de la bolsa roja aquí si quieres
  },
  { 
    name: 'Pantalones', 
    slug: 'pantalones', 
    image: '/categorias/pantalones.png' 
  },
  { 
    name: 'Chamarras', 
    slug: 'chamarras', 
    image: '/categorias/chamarras.png' 
  },
  { 
    name: 'Vestidos', 
    slug: 'vestidos', 
    image: '/categorias/vestidos.png' 
  },
  { 
    name: 'Faldas y shorts', 
    slug: 'faldas-shorts', 
    image: '/categorias/faldas_shorts.png' 
  },
  { 
    name: 'Tenis', 
    slug: 'tenis', 
    image: '/categorias/tenis.png' 
  },
  { 
    name: 'Zapatos', 
    slug: 'zapatos', 
    image: '/categorias/zapatos.png' 
  },
  { 
    name: 'Accesorios', 
    slug: 'accesorios', 
    image: '/categorias/accesorios.png' 
  },
  { 
    name: 'Bolsos', 
    slug: 'bolsos', 
    image: '/categorias/bolsos.png' 
  },
];

export const CategoryCarousel: React.FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    checkScrollButtons();
    const container = scrollContainerRef.current;
    container?.addEventListener('scroll', checkScrollButtons);
    return () => container?.removeEventListener('scroll', checkScrollButtons);
  }, []);

  return (
    <div className="relative w-full my-8 group">
      
      {/* Botones de navegación (Flechas laterales) */}
      {/* Se muestran al hacer hover sobre el área */}
      {canScrollLeft && (
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center text-gray-600 hover:text-black hover:scale-110 transition-all opacity-0 group-hover:opacity-100"
        >
          ‹
        </button>
      )}
      
      {canScrollRight && (
        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center text-gray-600 hover:text-black hover:scale-110 transition-all opacity-0 group-hover:opacity-100"
        >
          ›
        </button>
      )}

      {/* Degradados laterales para indicar scroll */}
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white to-transparent pointer-events-none z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white to-transparent pointer-events-none z-10" />

      {/* Contenedor del carrusel */}
      <div
        ref={scrollContainerRef}
        className="flex gap-6 sm:gap-10 overflow-x-auto px-6 py-4 scrollbar-hide scroll-smooth"
        onMouseEnter={checkScrollButtons}
      >
        {STATIC_CATEGORIES.map((cat, index) => (
          <Link
            key={index}
            href={`/categorias?category=${encodeURIComponent(cat.slug)}`}
            className="flex-shrink-0 flex flex-col items-center group/cat cursor-pointer"
          >
            {/* CÍRCULO - ESTILO MINIMALISTA (IMAGEN 2) */}
            {/* Fondo gris muy claro (#F8FAFC), sin bordes llamativos */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[#F8FAFC] flex items-center justify-center overflow-hidden transition-all duration-300 group-hover/cat:scale-105 p-3">
              
              <img 
                src={cat.image} 
                alt={cat.name} 
                // object-contain + p-5: Hace que la imagen "flote" adentro con aire
                className="w-full h-full object-contain mix-blend-multiply"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder.png'; 
                }}
              />
            </div>

            {/* Texto de la categoría */}
            <span className="mt-3 text-center text-sm font-medium text-gray-700 transition-colors duration-300 group-hover/cat:text-black">
              {cat.name}
            </span>
          </Link>
        ))}
      </div>
      
      
      {/* 🚫 AQUÍ ES DONDE ESTABAN LOS PUNTOS. LOS HE ELIMINADO. 🚫 */}

    </div>
    
  );
  
};
 