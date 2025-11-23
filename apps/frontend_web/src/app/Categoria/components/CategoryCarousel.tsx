'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useProducts } from '@/hooks/useProduct'; // Ajusta la ruta según tu estructura
import Link from 'next/link';

interface Product {
  ProductID: string;
  ProductName: string;
  ProductImageUrl: string;
  ProductCategory: string;
}

export const CategoryCarousel: React.FC = () => {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Usar el hook de productos para obtener datos reales
  const { products, loading, error } = useProducts(); // Ajusta según tu hook

  // Extraer categorías únicas de los productos
  const categories = React.useMemo(() => {
    if (!products) return [];
    
    const categoryMap = new Map();
    
    products.forEach((product: Product) => {
      if (product.ProductCategory && !categoryMap.has(product.ProductCategory)) {
        // Usar el primer producto de cada categoría como imagen representativa
        categoryMap.set(product.ProductCategory, {
          name: product.ProductCategory,
          image: product.ProductImageUrl,
          productId: product.ProductID // Para el link
        });
      }
    });
    
    return Array.from(categoryMap.values());
  }, [products]);

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
    
    return () => {
      container?.removeEventListener('scroll', checkScrollButtons);
    };
  }, [categories]); // Revisar scroll cuando cambien las categorías

  // Estados de carga y error
  if (loading) {
    return (
      <div className="relative group">
        <h2 className="text-3xl font-semibold text-gray-800 mb-8 text-center">
          Categorías
        </h2>
        <div className="flex gap-6 sm:gap-8 overflow-x-auto px-6 py-8 scrollbar-hide">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="flex-shrink-0 flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-gray-200 animate-pulse" />
              <div className="mt-4 h-4 w-20 bg-gray-200 animate-pulse rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative group">
        <h2 className="text-3xl font-semibold text-gray-800 mb-8 text-center">
          Categorías
        </h2>
        <p className="text-center text-red-500">Error al cargar categorías</p>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="relative group">
        <h2 className="text-3xl font-semibold text-gray-800 mb-8 text-center">
          Categorías
        </h2>
        <p className="text-center text-gray-500">No hay categorías disponibles</p>
      </div>
    );
  }

  return (
    <div className="relative group">
      <h2 className="text-3xl font-semibold text-gray-800 mb-8 text-center">
        Categorías
      </h2>

      {/* Botones de navegación */}
      {canScrollLeft && (
        <button
          onClick={scrollLeft}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 hover:bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 opacity-0 group-hover:opacity-100 backdrop-blur-sm flex items-center justify-center"
        >
          <span className="text-gray-700 font-bold text-lg">‹</span>
        </button>
      )}
      
      {canScrollRight && (
        <button
          onClick={scrollRight}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 hover:bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 opacity-0 group-hover:opacity-100 backdrop-blur-sm flex items-center justify-center"
        >
          <span className="text-gray-700 font-bold text-lg">›</span>
        </button>
      )}

      {/* Efectos de desvanecimiento en los bordes */}
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent pointer-events-none z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent pointer-events-none z-10" />

      {/* Contenedor del carrusel */}
      <div
        ref={scrollContainerRef}
        className="flex gap-6 sm:gap-8 overflow-x-auto px-6 py-8 scrollbar-hide scroll-smooth"
        onMouseEnter={checkScrollButtons}
      >
        {categories.map((cat) => (
          <Link
            key={cat.name}
            href={`/categorias?category=${encodeURIComponent(cat.name)}`}
            className="flex-shrink-0 flex flex-col items-center text-base sm:text-lg font-semibold group/category"
            onMouseEnter={() => setHoveredCategory(cat.name)}
            onMouseLeave={() => setHoveredCategory(null)}
          >
            {/* Contenedor del ícono con animaciones */}
            <div className="relative">
              {/* Efecto de fondo animado */}
              <div className={`absolute inset-0 rounded-full bg-gradient-to-br from-pink-500/20 to-purple-500/20 transition-all duration-500 ${
                hoveredCategory === cat.name 
                  ? 'opacity-100 scale-110' 
                  : 'opacity-0 scale-100'
              }`} />
              
              {/* Borde animado */}
              <div className={`absolute inset-0 rounded-full border-2 transition-all duration-300 ${
                hoveredCategory === cat.name 
                  ? 'border-pink-300 scale-105' 
                  : 'border-transparent scale-100'
              }`} />
              
              {/* Ícono principal con imagen real del producto */}
              <div className={`
                relative w-24 h-24 rounded-full bg-white flex items-center justify-center overflow-hidden shadow-lg transition-all duration-500 ease-out
                ${hoveredCategory === cat.name 
                  ? 'scale-110 shadow-xl -translate-y-2' 
                  : 'scale-100 shadow-md'
                }
              `}>
                <img 
                  src={cat.image} 
                  alt={cat.name} 
                  className={`w-16 h-16 object-cover transition-all duration-500 ${
                    hoveredCategory === cat.name ? 'scale-110' : 'scale-100'
                  }`}
                  onError={(e) => {
                    // Fallback si la imagen no carga
                    e.currentTarget.src = '/placeholder-category.jpg';
                  }}
                />
                
                {/* Efecto de brillo interno */}
                <div className={`absolute inset-0 bg-gradient-to-br from-white/30 to-transparent rounded-full transition-opacity duration-300 ${
                  hoveredCategory === cat.name ? 'opacity-100' : 'opacity-0'
                }`} />
              </div>

              {/* Punto indicador de hover */}
              <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-pink-500 transition-all duration-300 ${
                hoveredCategory === cat.name 
                  ? 'opacity-100 scale-125' 
                  : 'opacity-0 scale-100'
              }`} />
            </div>

            {/* Texto de la categoría */}
            <span className={`
              mt-4 text-center transition-all duration-300 font-medium
              ${hoveredCategory === cat.name 
                ? 'text-pink-600 scale-105 font-semibold' 
                : 'text-gray-700 scale-100'
              }
            `}>
              {cat.name}
            </span>

            {/* Efecto de tooltip sutil */}
            <div className={`
              absolute -top-12 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-sm px-3 py-1 rounded-lg transition-all duration-300 pointer-events-none
              ${hoveredCategory === cat.name 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-2'
              }
            `}>
              {cat.name}
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45" />
            </div>
          </Link>
        ))}
      </div>

      {/* Indicadores de scroll (puntos) */}
      <div className="flex justify-center mt-4 space-x-2">
        {categories.slice(0, 5).map((_, index) => (
          <button
            key={index}
            className="w-2 h-2 rounded-full bg-gray-100 hover:bg-gray-400 transition-all duration-300 hover:scale-125"
            onClick={() => {
              if (scrollContainerRef.current) {
                const container = scrollContainerRef.current;
                const scrollAmount = container.clientWidth * 0.8;
                container.scrollTo({ 
                  left: scrollAmount * index, 
                  behavior: 'smooth' 
                });
              }
            }}
          />
        ))}
      </div>
    </div>
  );
};