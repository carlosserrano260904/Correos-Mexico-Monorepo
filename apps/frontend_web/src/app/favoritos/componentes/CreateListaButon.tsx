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
  AlertDialogAction
} from "@/components/ui/alert-dialog";

export const CreateListButton: React.FC<{ onClick: (name: string) => void }> = ({ onClick }) => {
  const [listName, setListName] = useState('');

  const handleConfirm = () => {
    if (listName.trim()) {
      onClick(listName.trim());
      setListName(''); // Limpia el input después
    }
  };

  return (
    <div className="text-right my-4">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <button className="bg-pink-600 text-white px-4 py-2 rounded-2xl hover:bg-pink-500">
            + Crear lista
          </button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Crear lista de productos</AlertDialogTitle>
          </AlertDialogHeader>

          <div className="py-2">
            <label htmlFor="listName" className="block text-sm font-medium text-gray-700 mb-1">
              Nombre de la lista:
            </label>
            <input
              id="listName"
              type="text"
              value={listName}
              onChange={(e) => setListName(e.target.value)}
              placeholder="Ej. Lista de Blusas"
              className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-lg">Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirm}
              className="bg-pink-600 hover:bg-pink-500 text-white rounded-lg"
            >
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
