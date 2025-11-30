// Modal de Confirmación de Eliminación
import React from 'react';

export function ModalEliminarDireccion({ 
  isOpen, 
  onClose, 
  onConfirm 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onConfirm: () => void; 
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-xl border-4 border-blue-400">
        <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">
          ¿Estás seguro de que quieres borrar esta dirección?
        </h2>
        
        <div className="flex gap-4">
          <button
            onClick={onConfirm}
            className="flex-1 py-3 px-6 bg-pink-600 hover:bg-pink-700 text-white font-semibold rounded-lg transition-colors"
          >
            Borrar dirección
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-3 px-6 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}