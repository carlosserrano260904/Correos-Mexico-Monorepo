'use client'
import React from 'react'
import { ColetcionCardProps, ProductCardProps } from '@/types/interface'
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import Link from 'next/link'
import { IoBagOutline, IoHeartOutline, IoHeartSharp, IoBag } from "react-icons/io5";
import { FaAngleRight } from "react-icons/fa6";
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
  }).format(ProductPrice);
  
  const isProductFavorite = isFavorite(ProductID);
  const isInCart = getCartItem(ProductID) !== undefined;
  
  const Colors: string[] = ProductColors.filter(function(color){
    return color.includes('#')
  })

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isProductFavorite) {
      removeFromFavorites(ProductID);
    } else {
      const fullProduct = getProduct(ProductID);
      if (fullProduct) {
        addToFavorites(fullProduct);
      }
    }
  };

  const handleToggleCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isInCart) {
      removeFromCart(ProductID);
    } else {
      const fullProduct = getProduct(ProductID);
      if (fullProduct) {
        addToCart(fullProduct, 1);
      }
    }
  };
 
  return (
    <Card className="w-full max-w-[300px] min-w-[280px] mx-auto hover:shadow-2xl transition-all duration-500 ease-out hover:-translate-y-3 group/card border-0 bg-white/80 backdrop-blur-sm mb-6">
      <Link href={`/Producto/${ProductID}`} onClick={onClick} className="block">
        <CardContent className="p-0 overflow-hidden rounded-2xl">
          {/* Contenedor de imagen con efectos - grupo específico */}
          <div className="relative h-80 w-full overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 group/image">
            <SafeImage 
              src={ProductImage} 
              alt={ProductName}
              width={400}
              height={320}
              className="w-full h-full object-cover transition-all duration-700 group-hover/image:scale-110"
              priority={false}
            />
            
            {/* Overlay sutil al hover */}
            <div className="absolute inset-0 bg-black/0 group-hover/image:bg-black/5 transition-all duration-500" />
            
            {/* Botones flotantes - mejor posicionados */}
            <div className="absolute top-4 right-4 flex flex-col gap-3">
              <button 
                onClick={handleToggleFavorite}
                className="p-3 bg-white/95 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 transform-gpu group/btn"
              >
                {isProductFavorite ? 
                  <IoHeartSharp className="w-5 h-5 text-red-500 animate-pulse" /> : 
                  <IoHeartOutline className="w-5 h-5 text-gray-600 group-hover/btn:text-red-400 transition-colors" />
                }
              </button>
              <button 
                onClick={handleToggleCart}
                className="p-3 bg-white/95 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 transform-gpu group/btn"
              >
                {isInCart ? 
                  <IoBag className="w-5 h-5 text-[#DE1484] animate-bounce" /> : 
                  <IoBagOutline className="w-5 h-5 text-gray-600 group-hover/btn:text-[#DE1484] transition-colors" />
                }
              </button>
            </div>

            {/* Indicadores de estado */}
            <div className="absolute top-4 left-4 flex gap-2">
              {isProductFavorite && (
                <div className="px-2 py-1 bg-red-500 rounded-full flex items-center">
                  <IoHeartSharp className="w-3 h-3 text-white mr-1" />
                  <span className="text-white text-xs font-medium">Fav</span>
                </div>
              )}
              {isInCart && (
                <div className="px-2 py-1 bg-[#DE1484] rounded-full flex items-center">
                  <IoBag className="w-3 h-3 text-white mr-1" />
                  <span className="text-white text-xs font-medium">En carrito</span>
                </div>
              )}
            </div>
          </div>

          {/* Contenido informativo - mejor espaciado */}
          <div className="p-6 space-y-4">
            {/* Colores con mejor diseño */}
            {Colors.length > 0 && (
              <div className="flex gap-2 items-center">
                <span className="text-xs text-gray-500 font-medium">Colores:</span>
                <div className="flex gap-1.5">
                  {Colors.slice(0, 4).map((color, index) => (
                    <div 
                      key={index} 
                      className="h-5 w-5 rounded-full border-2 border-white shadow-md transition-transform duration-300 hover:scale-125"
                      style={{backgroundColor: color}}
                      title={color}
                    />
                  ))}
                  {Colors.length > 4 && (
                    <div className="h-5 w-5 rounded-full bg-gradient-to-r from-gray-200 to-gray-300 flex items-center justify-center shadow-md">
                      <span className="text-xs text-gray-600 font-bold">+{Colors.length - 4}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Nombre del producto - mejor tipografía */}
            <div>
              <h3 className="font-semibold text-gray-900 line-clamp-2 leading-tight text-lg group-hover/card:text-[#DE1484] transition-colors duration-300">
                {ProductName}
              </h3>
            </div>

            {/* Precio con mejor diseño */}
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-bold text-[#DE1484]">
                {formattedPrice}
              </CardTitle>
              
              {/* Badge de stock o oferta */}
              <div className="px-3 py-1 bg-green-100 rounded-full">
                <span className="text-green-700 text-sm font-medium">Disponible</span>
              </div>
            </div>

            {/* Botón de acción mejorado */}
            <button className="w-full py-3 bg-gradient-to-r from-[#DE1484] to-pink-600 hover:from-pink-600 hover:to-[#DE1484] text-white rounded-xl font-semibold transition-all duration-300 transform-gpu hover:scale-105 hover:shadow-lg active:scale-95 group/button">
              <span className="flex items-center justify-center gap-2">
                Ver producto
                <FaAngleRight className="transition-transform duration-300 group-hover/button:translate-x-1" />
              </span>
            </button>
          </div>
        </CardContent>
      </Link>
    </Card>
  )
}

export const ColectionCard = ({ ProductID, ProductImage, ProductName, onClick }: ColetcionCardProps) => {
  return (
    <Card className="w-full max-w-[320px] min-w-[300px] mx-auto hover:shadow-2xl transition-all duration-500 ease-out hover:-translate-y-3 group/card border-0 bg-gradient-to-br from-blue-50 to-purple-50 mb-6">
      <div className="overflow-hidden rounded-2xl">
        <CardContent className="p-0">
          {/* Imagen de la colección con efectos mejorados */}
          <div className="relative h-72 w-full overflow-hidden group/image">
            <SafeImage 
              src={ProductImage} 
              alt={ProductName}
              width={400}
              height={288}
              className="w-full h-full object-cover transition-all duration-700 group-hover/image:scale-110"
            />
            
            {/* Overlay gradiente mejorado */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-70 group-hover/image:opacity-90 transition-opacity duration-500" />
            
            {/* Título superpuesto */}
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <h3 className="text-2xl font-bold mb-2 drop-shadow-lg group-hover/card:translate-y-1 transition-transform duration-300">
                {ProductName}
              </h3>
              <div className="w-12 h-1 bg-white rounded-full mb-3 group-hover/card:w-16 transition-all duration-300"></div>
              <p className="text-white/90 text-sm drop-shadow-md">
                Colección exclusiva
              </p>
            </div>
          </div>

          {/* Contenido - mejor diseño */}
          <div className="p-6 bg-white">
            <div className="flex justify-between items-center">
              <Link 
                href={`/Producto/${ProductID}`} 
                onClick={onClick}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition-all duration-300 group/link px-4 py-2 rounded-lg hover:bg-blue-50"
              >
                <span>Explorar colección</span>
                <FaAngleRight className="transition-transform duration-300 group-hover/link:translate-x-1" />
              </Link>
              
              <Link 
                href={'/Carrito'}
                className="flex items-center gap-2 text-[#DE1484] hover:text-pink-700 font-semibold transition-all duration-300 group/link px-4 py-2 rounded-lg hover:bg-pink-50"
              >
                <span>Comprar ahora</span>
                <FaAngleRight className="transition-transform duration-300 group-hover/link:translate-x-1" />
              </Link>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  )
}

export const Title = ({ children, className = "" }: { children: string; className?: string }) => {
  return (
    <h2 className={`text-3xl font-bold text-gray-900 text-center break-words whitespace-normal mb-8 ${className} relative inline-block`}>
      {children}
      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-[#DE1484] to-pink-500 rounded-full"></div>
    </h2>
  );
};

// Componente skeleton mejorado
export const ProductCardSkeleton = () => {
  return (
    <Card className="w-full max-w-[300px] min-w-[280px] mx-auto animate-pulse border-0 mb-6">
      <CardContent className="p-0 overflow-hidden rounded-2xl">
        <div className="h-80 w-full bg-gradient-to-r from-gray-200 to-gray-300" />
        <div className="p-6 space-y-4">
          <div className="flex gap-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-5 w-5 rounded-full bg-gray-300" />
            ))}
          </div>
          <div className="h-6 bg-gray-300 rounded w-3/4" />
          <div className="flex justify-between">
            <div className="h-8 bg-gray-300 rounded w-1/3" />
            <div className="h-6 bg-gray-300 rounded w-1/4" />
          </div>
          <div className="h-12 bg-gray-300 rounded-xl" />
        </div>
      </CardContent>
    </Card>
  );
}

// Componente para grid responsivo MEJORADO con más espacio
export const ProductGrid = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 ${className}`}>
      {children}
    </div>
  );
}