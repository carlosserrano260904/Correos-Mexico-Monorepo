'use client';
import React from "react";
import { FavoriteProductCard } from "./FavoriteProductCard";
import { useFavorites } from "@/hooks/useFavorites";

export const FavoritesList: React.FC = () => {
  const { Favorites } = useFavorites();

  // Función placeholder para el botón de lista
  const handleAddToList = () => {
    alert("Funcionalidad de agregar a lista (Próximamente)");
  };

  if (!Favorites || Favorites.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg">
        No tienes productos en favoritos
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-white rounded-lg">
      {Favorites.map((product) => (
        <FavoriteProductCard
          key={product.ProductID}
          product={product} 
          onAddToList={handleAddToList}
        />
      ))}
    </div>
  );
};