'use client';
import React, { useState } from 'react';
import { Plantilla } from '@/components/plantilla';
import { CouponCard, CouponVariant } from '@/components/CouponCard';
import { AddCouponModal } from '@/components/AddCouponModal';
import { IoAddCircleOutline } from 'react-icons/io5';
import BotonRegresar from '@/components/BotonRegresar';

// ... (Aquí sigue tu interfaz CouponData y el array mockCoupons igual que antes) ...
interface CouponData {
  id: number;
  code: string;
  name: string;
  discountText: string;
  expirationDate: string;
  variant: CouponVariant;
  statusLabel: string;
  statusColor: 'green' | 'red';
}

// Datos Mockeados idénticos a la imagen
const mockCoupons: CouponData[] = [
  // Fila 1 - Estilo Morado
  { id: 1, code: 'EX806', name: 'Tech15', discountText: 'Descuento del 20% en todas las compras / nombre del producto.', expirationDate: '24/10/2025', variant: 'purple', statusLabel: 'Activo', statusColor: 'green' },
  { id: 2, code: 'EX806', name: 'Tech15', discountText: 'Descuento del 20% en todas las compras / nombre del producto.', expirationDate: '24/10/2025', variant: 'purple', statusLabel: 'Activo', statusColor: 'green' },
  { id: 3, code: 'EX806', name: 'Tech15', discountText: 'Descuento del 20% en todas las compras / nombre del producto.', expirationDate: '24/10/2025', variant: 'purple', statusLabel: 'Activo', statusColor: 'green' },

  // Fila 2 - Estilo Verde (Con etiqueta roja de Expirado)
  { id: 4, code: 'EX806', name: 'NombreCupón', discountText: 'Descuento del 20% en todas las compras / nombre del producto.', expirationDate: '24/10/2025', variant: 'green', statusLabel: 'Expirado', statusColor: 'red' },
  { id: 5, code: 'EX806', name: 'NombreCupón', discountText: 'Descuento del 20% en todas las compras / nombre del producto.', expirationDate: '24/10/2025', variant: 'green', statusLabel: 'Expirado', statusColor: 'red' },
  { id: 6, code: 'EX806', name: 'NombreCupón', discountText: 'Descuento del 20% en todas las compras / nombre del producto.', expirationDate: '24/10/2025', variant: 'green', statusLabel: 'Expirado', statusColor: 'red' },

  // Fila 3 - Estilo Naranja
  { id: 7, code: 'EX806', name: 'NombreCupón', discountText: 'Descuento del 20% en todas las compras / nombre del producto.', expirationDate: '24/10/2025', variant: 'orange', statusLabel: 'Cupón activo', statusColor: 'green' },
  { id: 8, code: 'EX806', name: 'NombreCupón', discountText: 'Descuento del 20% en todas las compras / nombre del producto.', expirationDate: '24/10/2025', variant: 'orange', statusLabel: 'Cupón activo', statusColor: 'green' },
  { id: 9, code: 'EX806', name: 'NombreCupón', discountText: 'Descuento del 20% en todas las compras / nombre del producto.', expirationDate: '24/10/2025', variant: 'orange', statusLabel: 'Cupón activo', statusColor: 'green' },
];

export default function CuponesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const handleAddCoupon = () => {
    setIsModalOpen(true); // Abrir modal
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Cerrar modal
  };

  return (
    <Plantilla>
      {/* 2. Colocar el componente del Modal */}
      <AddCouponModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />

      <div className="min-h-screen bg-gray-50/30">
        <div className="px-4 sm:px-8 py-10 max-w-7xl mx-auto">

            <BotonRegresar />
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-center justify-between mb-10 gap-4">
            <h1 className="text-4xl font-bold text-black text-left w-full sm:w-auto">
              Mis Cupones
            </h1>
            
            <div className="w-full sm:w-auto flex justify-end">
              <button 
                onClick={handleAddCoupon} // 3. Conectar el botón
                className="flex items-center gap-2 bg-[#DE1484] hover:bg-pink-700 text-white font-medium px-6 py-3 rounded-lg transition-colors shadow-sm"
              >
                <IoAddCircleOutline className="w-6 h-6" />
                <span>Añadir un cupón</span>
              </button>
            </div>
          </div>

          {/* Grid de Cupones */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockCoupons.map((coupon) => (
              <CouponCard
                key={coupon.id}
                code={coupon.code}
                name={coupon.name}
                discountText={coupon.discountText}
                expirationDate={coupon.expirationDate}
                variant={coupon.variant}
                statusLabel={coupon.statusLabel}
                statusColor={coupon.statusColor}
              />
            ))}
          </div>

          {mockCoupons.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">No tienes cupones disponibles.</p>
            </div>
          )}

        </div>
      </div>
    </Plantilla>
  );
}