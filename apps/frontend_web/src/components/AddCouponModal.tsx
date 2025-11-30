'use client';
import React, { useState } from 'react';

interface AddCouponModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddCouponModal: React.FC<AddCouponModalProps> = ({ isOpen, onClose }) => {
  const [couponCode, setCouponCode] = useState('');

  // Si no está abierto, no renderizamos nada (null)
  if (!isOpen) return null;

  const handleSubmit = () => {
    console.log("Cupón añadido:", couponCode);
    setCouponCode('');
    onClose();
  };

  return (
    // CONTENEDOR PRINCIPAL (OVERLAY)
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
    >
      
      {/* TARJETA DEL MODAL (BLANCA) */}
      {/* animate-in fade-in zoom-in hace una animación suave al aparecer */}
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-6 sm:p-8 animate-in fade-in zoom-in duration-200">
        
        {/* Título */}
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Añadir un cupón
        </h2>
        
        <p className="text-gray-500 text-sm mb-6">
            Código del cupón
        </p>

        {/* Input */}
        <div className="mb-8">
          <input
            id="coupon"
            type="text"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            placeholder="Código del cupón"
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all bg-gray-50"
          />
        </div>

        {/* Botones */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleSubmit}
            disabled={!couponCode.trim()}
            className="w-full sm:w-1/2 bg-[#DE1484] hover:bg-pink-700 text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Añadir cupón
          </button>
          
          <button
            onClick={onClose}
            className="w-full sm:w-1/2 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold py-3 rounded-lg transition-colors"
          >
            Cancelar
          </button>
        </div>

      </div>
    </div>
  );
};