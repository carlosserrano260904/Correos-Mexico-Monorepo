import React from "react";
import { FavoriteProductCard } from "./FavoriteProductCard";
import { useFavorites } from "@/hooks/useFavorites";

export const FavoritesList: React.FC = () => {
  const { Favorites, removeFromFavorites } = useFavorites();

  const handleDelete = (productId: number) => {
    removeFromFavorites(productId);
  };

  const handleAddToList = (productId: number, listName: string) => {
    // Esta función se actualizará cuando implementemos el store de listas
    console.log(`Agregar producto ${productId} a lista: ${listName}`);
    alert(`Producto agregado a la lista: ${listName}`);
  };

  return (
    <div className="space-y-4">
      {Favorites.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No tienes productos en favoritos
        </div>
      ) : (
        Favorites.map((product) => (
          <FavoriteProductCard
            key={product.ProductID}
            productId={product.ProductID}
            image={product.ProductImageUrl}
            title={product.ProductName}
            price={product.productPrice}
            available={product.ProductStatus}
            freeShipping={product.ProductStock > 0} // Ejemplo de lógica
            onDelete={() => handleDelete(product.ProductID)}
            onAddToList={(listName) => handleAddToList(product.ProductID, listName)}
          />
        ))
      )}
    </div>
  );
};