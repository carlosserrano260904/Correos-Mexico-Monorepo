'use client'

import React from 'react'
import Link from 'next/link'
import { IoBagOutline, IoHeartOutline, IoHeartSharp, IoBag } from "react-icons/io5";
import { FaAngleRight } from "react-icons/fa6";

// Componentes de UI e Interfaces
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { ColetcionCardProps, ProductCardProps } from '@/types/interface'
import { SafeImage } from './ui/SafeImage';

// Hooks
import { useFavorites } from '@/hooks/useFavorites';
import { useProducts } from '@/hooks/useProduct';
import { useCart } from '@/hooks/useCart';

export const Btn = ({children, className, link}: {children: React.ReactNode, className:string, link?:string}) => {
  const baseClasses = "p-3 rounded-full bg-[#F3F4F6] min-h-[56px] min-w-[60px] flex items-center justify-center transition-all duration-300 hover:scale-105 hover:shadow-md";
  
  if (link) {
    return(
       <Link href={link} className={`${baseClasses} ${className}`}>{children}</Link>
    )
  }
  return(
    <button className={`${baseClasses} ${className}`}>{children}</button>
  )
}

// --- TARJETA DE PRODUCTO PRINCIPAL ---
export const ProductCard = ({ ProductID, ProductImage, ProductColors, ProductName, ProductPrice, onClick }: ProductCardProps) => {
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const { addToCart, removeFromCart, getCartItem } = useCart();
  const { getProduct } = useProducts();

  // Formato de precio
  const formattedPrice = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 2,
  }).format(ProductPrice);

  const isProductFavorite = isFavorite(ProductID);
  const isInCart = getCartItem(ProductID) !== undefined;

  // Filtramos colores válidos
  const Colors: string[] = ProductColors ? ProductColors.filter(c => c.includes('#')) : [];

  // Lógica de Favoritos
  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isProductFavorite) {
      removeFromFavorites(ProductID);
    } else {
      const fullProduct = getProduct(ProductID);

      if (fullProduct) {
         // @ts-ignore: Ignoramos error de tipo temporal si getProduct devuelve Promise
         addToFavorites(fullProduct); 
      }
    }
  };

  // Lógica de Carrito
  const handleToggleCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isInCart) {
      removeFromCart(ProductID);
    } else {
      const fullProduct = getProduct(ProductID);
      if (fullProduct) {
        // @ts-ignore
        addToCart(fullProduct, 1);
      }
    }
  };

  return (
    <Card className="w-full h-full mx-auto border-0 shadow-none bg-[#F9FAFB] rounded-[24px] overflow-hidden group/card font-sans hover:bg-[#F3F4F6] transition-colors duration-300 flex flex-col">
      
      {/* 1. ZONA DE IMAGEN (Es un Link) */}
      <Link href={`/Producto/${ProductID}`} onClick={onClick} className="block relative w-full">
        {/* Responsive: p-8 en móvil, p-10 en desktop para dar aire a la imagen */}
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-transparent p-8 sm:p-10 flex items-center justify-center">
          <SafeImage 
            src={ProductImage} 
            alt={ProductName}
            width={600}
            height={800}
            className="w-full h-full object-contain transition-transform duration-500 group-hover/card:scale-105 mix-blend-multiply"
            priority={false}
          />
        </div>
      </Link>

      {/* 2. ZONA DE CONTENIDO */}
      <CardContent className="px-4 pb-4 pt-0 sm:px-6 sm:pb-6 sm:pt-2 flex-grow flex flex-col justify-end space-y-3">
        
        {/* Fila de Acciones: Colores e Iconos */}
        {/* Esta fila NO está dentro de un Link para evitar conflictos de clic */}
        <div className="flex justify-between items-center z-10 relative">
          
          {/* Puntos de colores */}
          <div className="flex gap-1.5 sm:gap-2 h-6 items-center">
            {Colors.length > 0 ? Colors.slice(0, 3).map((color, index) => (
                <div 
                  key={index} 
                  className="h-3 w-3 sm:h-3.5 sm:w-3.5 rounded-full border border-black/10 shadow-sm" 
                  style={{ backgroundColor: color }} 
                />
            )) : <div className="h-3"></div>}
          </div>

          {/* BOTONES DE ACCIÓN */}
          <div className="flex gap-2 sm:gap-3 text-gray-400">
            <button 
              onClick={handleToggleFavorite}
              className="p-1.5 rounded-full hover:bg-white hover:shadow-sm transition-all active:scale-90"
              type="button"
              aria-label="Agregar a favoritos"
            >
              {isProductFavorite ? 
                <IoHeartSharp className="w-5 h-5 sm:w-6 sm:h-6 text-red-500" /> : 
                <IoHeartOutline className="w-5 h-5 sm:w-6 sm:h-6" />
              }
            </button>
            <button 
              onClick={handleToggleCart}
              className="p-1.5 rounded-full hover:bg-white hover:shadow-sm transition-all active:scale-90"
              type="button"
              aria-label="Agregar al carrito"
            >
              {isInCart ? 
                <IoBag className="w-5 h-5 sm:w-6 sm:h-6 text-gray-800" /> : 
                <IoBagOutline className="w-5 h-5 sm:w-6 sm:h-6" />
              }
            </button>
          </div>
        </div>

        {/* 3. ZONA DE TEXTO (Es un Link) */}
        <Link href={`/Producto/${ProductID}`} onClick={onClick} className="block group/text">
          <div>
            <h3 className="text-gray-600 text-sm sm:text-base font-medium mb-1 text-left truncate group-hover/text:text-black transition-colors">
              {ProductName}
            </h3>
            <CardTitle className="text-gray-900 text-lg sm:text-xl font-bold text-left">
              {formattedPrice}
            </CardTitle>
          </div>
        </Link>

      </CardContent>
    </Card>
  )
}

// --- TARJETA DE COLECCIÓN ---
export const ColectionCard = ({ ProductID, ProductImage, ProductName, onClick }: ColetcionCardProps) => {
  return (
    <Card className="w-full mx-auto border-0 shadow-none bg-[#F9FAFB] rounded-[24px] overflow-hidden group/card h-full font-sans hover:bg-gray-100 transition-colors duration-300">
      <Link href={`/Producto/${ProductID}`} onClick={onClick} className="block h-full flex flex-col">
        
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-transparent p-4 flex items-center justify-center">
          <SafeImage 
            src={ProductImage} 
            alt={ProductName}
            width={500}
            height={600}
            className="w-full h-full object-contain transition-transform duration-500 group-hover/card:scale-110 mix-blend-multiply"
            priority={false}
          />
        </div>

        <CardContent className="px-6 pb-6 pt-0 flex-grow flex flex-col justify-end">
           <div>
            <h3 className="text-gray-500 text-sm font-medium mb-1 text-left truncate tracking-wide">
              {ProductName}
            </h3>
             <div className="text-gray-900 text-lg font-bold text-left flex items-center gap-2 group-hover/card:text-[#DE1484] transition-colors">
               Ver colección <FaAngleRight />
             </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  )
}

// --- TÍTULO DE SECCIÓN ---
export const Title = ({ children, className = "" }: { children: string; className?: string }) => {
  return (
    <h2 className={`text-2xl sm:text-3xl font-bold text-gray-900 text-center break-words whitespace-normal mb-8 ${className} relative inline-block`}>
      {children}
      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-12 sm:w-16 h-1 bg-gradient-to-r from-[#DE1484] to-pink-500 rounded-full"></div>
    </h2>
  );
};

// --- DESCUENTO ---
export const Descuento = ({ 
  children, 
  className = "" 
}: { 
  children: React.ReactNode; 
  className?: string;
}) => {
  return (
    <div className={`inline-flex items-center justify-center px-3 py-1 bg-red-500 text-white text-sm font-medium rounded-full ${className}`}>
      {children}
    </div>
  );
}

// --- SKELETON (CARGA) ---
export const ProductCardSkeleton = () => {
  return (
    <Card className="w-full h-full mx-auto animate-pulse border-0 mb-6 bg-[#F9FAFB] rounded-[24px]">
      <CardContent className="p-0 overflow-hidden h-full flex flex-col">
        <div className="aspect-[3/4] w-full bg-gray-200 m-8 rounded-xl self-center opacity-50" />
        <div className="px-6 pb-8 space-y-4">
          <div className="flex justify-between">
             <div className="flex gap-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-3 w-3 rounded-full bg-gray-300" />
                ))}
             </div>
             <div className="flex gap-2">
                <div className="h-6 w-6 rounded-full bg-gray-300" />
                <div className="h-6 w-6 rounded-full bg-gray-300" />
             </div>
          </div>
          <div className="h-4 bg-gray-300 rounded w-3/4" />
          <div className="h-6 bg-gray-300 rounded w-1/3" />
        </div>
      </CardContent>
    </Card>
  );
}

// --- GRID RESPONSIVA ---
export const ProductGrid = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  return (

    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-8 ${className}`}>
      {children}
    </div>
  );
}