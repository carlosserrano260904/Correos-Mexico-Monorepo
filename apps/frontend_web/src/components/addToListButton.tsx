'use client';
import React, { useState } from 'react';
import { useLists } from '@/hooks/useLists';
import { ProductosProps } from '@/types/interface';
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

interface AddToListButtonProps {
  product: ProductosProps;
  className?: string;
}

export const AddToListButton: React.FC<AddToListButtonProps> = ({ 
  product, 
  className = '' 
}) => {
  const { Lists, createList, addProductToList } = useLists();
  const [newListName, setNewListName] = useState("");
  const [selectedListId, setSelectedListId] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleConfirm = () => {
    if (selectedListId) {
      // Agregar a lista existente
      addProductToList(selectedListId, product);
      const selectedList = Lists.find(list => list.ListaID === selectedListId);
      alert(`Producto agregado a la lista: ${selectedList?.ListaName}`);
    } else if (newListName.trim()) {
      // Crear nueva lista y agregar producto
      createList(newListName.trim());
      // Obtener la lista recién creada (será la última)
      const newListId = Lists.length > 0 ? Math.max(...Lists.map(l => l.ListaID)) + 1 : 1;
      setTimeout(() => {
        addProductToList(newListId, product);
      }, 100);
      alert(`Lista "${newListName.trim()}" creada y producto agregado`);
    }
    
    setNewListName("");
    setSelectedListId(null);
    setIsOpen(false);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <button
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all bg-gray-200 text-gray-700 hover:bg-gray-300 ${className}`}
        >
          <span className="text-lg">📝</span>
          <span className="text-sm">Agregar a lista</span>
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Agregar "{product.ProductName}" a lista</AlertDialogTitle>
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
  );
};