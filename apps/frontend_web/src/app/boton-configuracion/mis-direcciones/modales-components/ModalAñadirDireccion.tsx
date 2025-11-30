// Modal de Añadir Dirección
import React, { useState } from 'react';

export function ModalAnadirDireccion({ 
  isOpen, 
  onClose, 
  onSave 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onSave: (data: any) => void; 
}) {
  const [formData, setFormData] = useState({
    nombreLugar: '',
    calle: '',
    numero: '',
    colonia: ''
  });

  if (!isOpen) return null;

  const handleSubmit = () => {
    onSave(formData);
    setFormData({ nombreLugar: '', calle: '', numero: '', colonia: '' });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-2xl w-full shadow-xl">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Añadir una dirección</h2>
        
        <div className="space-y-4">
          {/* Nombre del lugar */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Nombre del lugar
            </label>
            <input
              type="text"
              placeholder="Casa..."
              value={formData.nombreLugar}
              onChange={(e) => setFormData({ ...formData, nombreLugar: e.target.value })}
              className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:ring-2 focus:ring-pink-500 focus:outline-none"
            />
          </div>

          {/* Calle */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Calle
            </label>
            <input
              type="text"
              placeholder="Calle..."
              value={formData.calle}
              onChange={(e) => setFormData({ ...formData, calle: e.target.value })}
              className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:ring-2 focus:ring-pink-500 focus:outline-none"
            />
          </div>

          {/* Número */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Número
            </label>
            <input
              type="text"
              placeholder="#123"
              value={formData.numero}
              onChange={(e) => setFormData({ ...formData, numero: e.target.value })}
              className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:ring-2 focus:ring-pink-500 focus:outline-none"
            />
          </div>

          {/* Colonia */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Colonia, Fraccionamiento, Residencial
            </label>
            <input
              type="text"
              placeholder="Fraccionamiento..."
              value={formData.colonia}
              onChange={(e) => setFormData({ ...formData, colonia: e.target.value })}
              className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:ring-2 focus:ring-pink-500 focus:outline-none"
            />
          </div>

          {/* Botones */}
          <div className="flex gap-4 pt-2">
            <button
              onClick={handleSubmit}
              className="flex-1 py-3 px-6 bg-pink-600 hover:bg-pink-700 text-white font-semibold rounded-lg transition-colors"
            >
              Añadir dirección
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
    </div>
  );
}