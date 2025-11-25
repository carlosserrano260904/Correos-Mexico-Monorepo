'use client'
import React from 'react'
import { ColetcionCardProps, ProductCardProps } from '@/types/interface'
import { Card, CardContent } from "@/components/ui/card"
import Link from 'next/link'
import { IoBagOutline, IoHeartOutline, IoHeartSharp, IoBag } from "react-icons/io5";
import { useFavorites } from '@/hooks/useFavorites';
import { useProducts } from '@/hooks/useProduct';
import { useCart } from '@/hooks/useCart';
import { SafeImage } from './ui/SafeImage';

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

export const ProductCard = ({ ProductID, ProductImage, ProductColors, ProductName, ProductPrice, onClick }: ProductCardProps) => {
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const { addToCart, removeFromCart, getCartItem } = useCart();
  const { getProduct } = useProducts();

  const formattedPrice = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 2,
  }).format(ProductPrice);

  const isProductFavorite = isFavorite(ProductID);
  const isInCart = getCartItem(ProductID) !== undefined;

  const Colors: string[] = ProductColors ? ProductColors.filter(c => c.includes('#')) : [];

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault(); // Previene navegación
    e.stopPropagation(); // Detiene que el clic suba al Link (si hubiera uno)
    
    if (isProductFavorite) {
      removeFromFavorites(ProductID);
    } else {
      const fullProduct = getProduct(ProductID);
      if (fullProduct) addToFavorites(fullProduct);
    }
  };

  const handleToggleCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Previene navegación
    e.stopPropagation(); // Detiene que el clic suba
    
    if (isInCart) {
      removeFromCart(ProductID);
    } else {
      const fullProduct = getProduct(ProductID);
      if (fullProduct) addToCart(fullProduct, 1);
    }
  };

  return (
    <Card className="w-full h-full mx-auto border-0 shadow-none bg-[#F9FAFB] rounded-[24px] overflow-hidden group/card font-sans hover:bg-[#F3F4F6] transition-colors duration-300 flex flex-col">
      
      {/* 1. LINK SOLO EN LA IMAGEN */}
      <Link href={`/Producto/${ProductID}`} onClick={onClick} className="block relative w-full">
        {/* Responsive: p-8 en móvil, p-12 en escritorio para controlar el tamaño de la imagen */}
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-transparent p-8 sm:p-12 flex items-center justify-center">
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

      {/* 2. CONTENIDO INFERIOR */}
      <CardContent className="px-4 pb-4 pt-0 sm:px-6 sm:pb-8 sm:pt-2 flex-grow flex flex-col justify-end space-y-2 sm:space-y-3">
        
        {/* Fila de Colores e Iconos */}
        <div className="flex justify-between items-center">
          {/* Puntos de colores */}
          <div className="flex gap-1.5 sm:gap-2 h-5 items-center">
            {Colors.length > 0 ? Colors.slice(0, 3).map((color, index) => (
                <div key={index} className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full border border-black/10" style={{ backgroundColor: color }} />
            )) : <div className="h-3"></div>}
          </div>

          {/* BOTONES INTERACTIVOS - FUERA DE CUALQUIER LINK */}
          <div className="flex gap-2 sm:gap-3 text-gray-400 z-10 relative">
            <button 
              onClick={handleToggleFavorite}
              className="hover:text-red-500 transition-colors p-1 hover:bg-white rounded-full"
              type="button"
            >
              {isProductFavorite ? <IoHeartSharp className="w-5 h-5 sm:w-6 sm:h-6 text-red-500" /> : <IoHeartOutline className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>
            <button 
              onClick={handleToggleCart}
              className="hover:text-gray-800 transition-colors p-1 hover:bg-white rounded-full"
              type="button"
            >
              {isInCart ? <IoBag className="w-5 h-5 sm:w-6 sm:h-6 text-gray-800" /> : <IoBagOutline className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>
          </div>
        </div>

        {/* 3. LINK SOLO EN TEXTO Y PRECIO */}
        <Link href={`/Producto/${ProductID}`} onClick={onClick} className="block">
          <div>
            {/* Texto responsive: más pequeño en móvil */}
            <h3 className="text-gray-600 text-sm sm:text-base font-medium mb-1 text-left truncate">
              {ProductName}
            </h3>
            <div className="text-gray-900 text-lg sm:text-xl font-bold text-left">
              {formattedPrice}
            </div>
          </div>
        </Link>

      </CardContent>
    </Card>
  )
}

export const ColectionCard = ({ ProductID, ProductImage, ProductName, onClick }: ColetcionCardProps) => {
  return (
    <Card className="w-full mx-auto border-0 shadow-none bg-[#F9FAFB] rounded-[24px] overflow-hidden group/card h-full font-sans hover:bg-gray-100 transition-colors duration-300">
      <Link href={`/Producto/${ProductID}`} onClick={onClick} className="block h-full flex flex-col">
        
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-transparent p-2 flex items-center justify-center">
          <SafeImage 
            src={ProductImage} 
            alt={ProductName}
            width={500}
            height={600}
            className="w-full h-full object-contain transition-transform duration-500 group-hover/card:scale-110 mix-blend-multiply"
            priority={false}
          />
        </div>

        <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6 pt-0 flex-grow flex flex-col justify-end">
           {/* Se puede personalizar más si es necesario */}
           {/* ... contenido similar ... */}
           <div>
            <h3 className="text-gray-500 text-sm font-medium mb-1 text-left truncate tracking-wide">
              {ProductName}
            </h3>
             <div className="text-gray-900 text-lg font-bold text-left">
               Ver colección
             </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  )
}

export const Title = ({ children, className = "" }: { children: string; className?: string }) => {
  return (
    // Responsive text size
    <h2 className={`text-2xl sm:text-3xl font-bold text-gray-900 text-center break-words whitespace-normal mb-8 ${className} relative inline-block`}>
      {children}
      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-12 sm:w-16 h-1 bg-gradient-to-r from-[#DE1484] to-pink-500 rounded-full"></div>
    </h2>
  );
};

export const ProductCardSkeleton = () => {
  return (
    <Card className="w-full h-full mx-auto animate-pulse border-0 mb-6 bg-[#F9FAFB] rounded-[24px]">
      <CardContent className="p-0 overflow-hidden h-full flex flex-col">
        <div className="aspect-[3/4] w-full bg-gray-200 m-8 rounded-xl self-center" />
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

export const ProductGrid = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  return (
    // Grid responsive: 1 col móvil, 2 col tablet pequeña, 3 col tablet grande/laptop, 4 col escritorio
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-8 ${className}`}>
      {children}
    </div>
  );
}