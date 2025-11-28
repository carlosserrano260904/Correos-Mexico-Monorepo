'use client';

import React from 'react';
import { useCart } from '@/hooks/useCart';
import { useFavorites } from '@/hooks/useFavorites';
import { IoHeartOutline, IoHeartSharp } from "react-icons/io5";

// Versión ultra-simplificada para debug
export const CartProductItem = ({ item }: { item: any }) => {
  const { toggleSelection, updateQuantity, removeFromCart } = useCart();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();

  // Función DIRECTA sin lógica compleja
  const handleFavorite = () => {
    console.log('🔄 Favorite clicked for:', item.ProductID);
    
    if (isFavorite(item.ProductID)) {
      removeFromFavorites(item.ProductID);
    } else {
      addToFavorites(item); // Usar el item directamente
    }
  };

  const isFav = isFavorite(item.ProductID);
  
  console.log('🎯 CartProductItem Render:', {
    id: item.ProductID,
    isFavorite: isFav,
    item: item
  });

  return (
    <div className="border p-4 m-2">
      <div className="flex justify-between items-center">
        <div>
          <h3>{item.ProductName}</h3>
          <p>Precio: ${item.productPrice}</p>
          <p>Cantidad: {item.productQuantity}</p>
        </div>
        
        {/* Botón de favoritos SUPER SIMPLE */}
        <button
          onClick={handleFavorite}
          className={`p-2 ${isFav ? 'text-red-500' : 'text-gray-500'}`}
        >
          {isFav ? <IoHeartSharp /> : <IoHeartOutline />}
        </button>
      </div>
      
      <div className="text-xs text-gray-500 mt-2">
        ID: {item.ProductID} | En favs: {isFav ? 'SÍ' : 'NO'}
      </div>
    </div>
  );
};