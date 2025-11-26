'use client';
import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { useLists } from "@/hooks/useLists";
import { useProducts } from "@/hooks/useProduct";

interface FavoriteProductCardProps {
  productId: number;
  image: string;
  title: string;
  price: number;
  available?: boolean;
  freeShipping?: boolean;
  onAddToList: (listName: string) => void;
  onDelete: () => void;
}

export const FavoriteProductCard: React.FC<FavoriteProductCardProps> = ({
  productId,
  image,
  title,
  price,
  available = true,
  freeShipping = false,
  onAddToList,
  onDelete,
}) => {
  const [newListName, setNewListName] = useState("");
  const [selectedListId, setSelectedListId] = useState<number | null>(null);
  const { Lists, createList, addProductToList } = useLists();
  const { getProduct } = useProducts();

  const handleConfirm = () => {
    const product = getProduct(productId);
    if (!product) return;

    if (selectedListId) {
      // Agregar a lista existente
      addProductToList(selectedListId, product);
      const selectedList = Lists.find(list => list.ListaID === selectedListId);
      onAddToList(selectedList?.ListaName || "Lista");
    } else if (newListName.trim()) {
      // Crear nueva lista y agregar producto
      createList(newListName.trim());
      // Obtener la lista recién creada (será la última)
      const newListId = Lists.length > 0 ? Math.max(...Lists.map(l => l.ListaID)) + 1 : 1;
      setTimeout(() => {
        addProductToList(newListId, product);
      }, 100);
      onAddToList(newListName.trim());
    }
    
    setNewListName("");
    setSelectedListId(null);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(price);
  };

  return (
    <div className="flex items-center gap-4 border-b py-4">
      <img src={image} alt={title} className="w-24 h-28 object-cover" />
      <div className="flex-1">
        <h3 className="font-semibold text-gray-800">{title}</h3>
        <p className="text-black font-bold">{formatPrice(price)}</p>
        {available ? (
          <p className="text-pink-600 text-sm">Producto disponible</p>
        ) : (
          <p className="text-red-600 text-sm">No disponible</p>
        )}
        {freeShipping && (
          <p className="text-green-500 text-sm">Envío gratis</p>
        )}
        <div className="mt-2 flex gap-4 text-sm text-pink-600">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button className="hover:underline">Agregar a lista</button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Agregar a lista</AlertDialogTitle>
              </AlertDialogHeader>
              <div className="space-y-4">
                {Lists.length > 0 && (
                  <div>
                    <p className="text-gray-700 text-sm mb-2">Listas existentes:</p>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {Lists.map((lista) => (
                        <div
                          key={lista.ListaID}
                          className={`border px-3 py-2 rounded-md cursor-pointer transition-colors ${
                            selectedListId === lista.ListaID
                              ? 'border-pink-500 bg-pink-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => setSelectedListId(
                            selectedListId === lista.ListaID ? null : lista.ListaID
                          )}
                        >
                          <p className="text-sm font-medium">{lista.ListaName}</p>
                          <p className="text-xs text-gray-500">
                            {lista.ListaProducts.length} productos
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    O crear nueva lista:
                  </label>
                  <input
                    type="text"
                    value={newListName}
                    onChange={(e) => setNewListName(e.target.value)}
                    placeholder="Lista para navidad"
                    className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel 
                  onClick={() => {
                    setNewListName("");
                    setSelectedListId(null);
                  }}
                  className="rounded-lg"
                >
                  Cancelar
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleConfirm}
                  disabled={!selectedListId && !newListName.trim()}
                  className="bg-pink-600 hover:bg-pink-500 text-white rounded-lg disabled:opacity-50"
                >
                  Confirmar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <button onClick={onDelete} className="hover:underline">
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};