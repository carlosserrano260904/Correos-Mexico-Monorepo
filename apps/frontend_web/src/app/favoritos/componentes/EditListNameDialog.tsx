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

export const EditListNameDialog: React.FC<{
  currentName: string;
  onConfirm: (newName: string) => void;
}> = ({ currentName, onConfirm }) => {
  const [newName, setNewName] = useState(currentName);

  const handleConfirm = () => {
    const trimmed = newName.trim();
    if (trimmed) {
      onConfirm(trimmed);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button className="text-pink-600 text-sm hover:underline">
          Editar el nombre
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Editar nombre de la lista</AlertDialogTitle>
        </AlertDialogHeader>

        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Nuevo nombre:
          </label>
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Ej. Lista de blusas"
            className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel className="rounded-lg">Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className="bg-pink-600 hover:bg-pink-500 text-white rounded-lg"
          >
            Guardar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
