'use client';
import React from 'react';
import Image from 'next/image';
import { useCart } from '@/hooks/useCart';
import { useFavorites } from '@/hooks/useFavorites';
import { 
  IoCartOutline, 
  IoTrashOutline, 
  IoListOutline, 
  IoAlertCircleOutline 
} from 'react-icons/io5';

// Definimos la estructura exacta de tus datos
interface Product {
  ProductID: number | string;
  ProductName: string;
  ProductImageUrl: string;
  productPrice: number;
  ProductDescription?: string;
  // Agrega aquí otros campos si tu backend los manda
}

interface FavoriteProductCardProps {
  product: Product;
  onAddToList?: () => void;
}

export const FavoriteProductCard = ({ product, onAddToList }: FavoriteProductCardProps) => {
  const { addToCart } = useCart();
  const { removeFromFavorites } = useFavorites();

  // Formateador de precio
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(price);
  };

  return (
    <div className="flex flex-col sm:flex-row border-b border-gray-200 py-6 last:border-b-0">
      {/* 1. IMAGEN DEL PRODUCTO (Izquierda - Grande) */}
      <div className="flex-shrink-0 w-full sm:w-48 h-48 relative mb-4 sm:mb-0 bg-white rounded-lg overflow-hidden border border-gray-100">
        <Image
          src={product.ProductImageUrl || '/placeholder.png'}
          alt={product.ProductName}
          fill
          className="object-contain p-2"
        />
      </div>

      {/* 2. INFORMACIÓN (Derecha) */}
      <div className="flex-1 sm:ml-8 flex flex-col justify-center">
        {/* Título */}
        <h3 className="text-xl font-medium text-gray-900 mb-2">
          {product.ProductName}
        </h3>

        {/* Precio - Color Rosa */}
        <div className="text-2xl font-bold text-[#DE1484] mb-3">
          {formatPrice(product.productPrice)}
        </div>

        {/* Estado - SIMULADO NECESITA BACKEND */}
        <div className="flex items-center gap-2 mb-6">
            <div className="flex items-center text-amber-600 text-sm font-medium bg-amber-50 px-2 py-1 rounded">
               <IoAlertCircleOutline className="w-4 h-4 mr-1" />
               <span>Producto no disponible</span> 
            </div>
        </div>

        {/* 3. BOTONES DE ACCIÓN (Iconos + Texto) */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-gray-500">
          
          {/* Botón Carrito */}
          <button 
            onClick={() => addToCart({ ...product, quantity: 1 }, 1)}
            className="flex items-center gap-2 hover:text-[#DE1484] transition-colors group"
          >
            <IoCartOutline className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span>Agregar al carrito</span>
          </button>

          {/* Botón Lista */}
          <button 
            onClick={onAddToList}
            className="flex items-center gap-2 hover:text-[#DE1484] transition-colors group"
          >
            <IoListOutline className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span>Agregar a una lista</span>
          </button>

          {/* Botón Eliminar */}
          <button 
            onClick={() => removeFromFavorites(product.ProductID)}
            className="flex items-center gap-2 hover:text-red-600 transition-colors group"
          >
            <IoTrashOutline className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span>Eliminar</span>
          </button>

        </div>
      </div>
    </div>
  );
};