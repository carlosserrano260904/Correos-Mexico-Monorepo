'use client';
import React, { useState } from 'react';
import { MoreVertical } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ListaCardProps {
  id?: string;
  nombre: string;
  cantidad: number;
  image: string;
  onEdit: () => void;
  onDelete: () => void;
}

export const ListaCard: React.FC<ListaCardProps> = ({
  id,
  nombre,
  cantidad,
  image,
  onEdit,
  onDelete,
}) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <div
      className="relative bg-white rounded-2xl shadow-md w-full max-w-[220px] cursor-pointer"
      onClick={() => router.push(`/listas/${id}`)} 
    >
        
      <img
        src={image}
        alt={nombre}
        className="rounded-t-2xl w-full h-64 object-cover p-4"

      />

      <div className="px-4 pb-4">
        <h3 className="font-semibold text-gray-800">{nombre}</h3>
        <p className="text-sm text-gray-500">
          {cantidad} producto{cantidad !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Menú tres puntitos */}
      <div
        className="absolute top-3 right-3 z-20"
        onClick={(e) => {
          e.stopPropagation(); 
          setOpen(!open);
        }}
      >
        <MoreVertical className="text-gray-600 hover:text-black cursor-pointer" />
        {open && (
          <div className="absolute right-0 mt-2 bg-white border rounded-lg shadow-lg w-40 text-sm text-gray-700 z-30">
            <button
              onClick={() => {
                onEdit();
                setOpen(false);
              }}
              className="w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              Editar nombre
            </button>
            <button
              onClick={() => {
                onDelete();
                setOpen(false);
              }}
              className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
            >
              Eliminar lista
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
