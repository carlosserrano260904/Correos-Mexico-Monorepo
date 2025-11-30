'use client';
import React from 'react';
import { Plantilla } from '@/components/plantilla';
import { OrderCard, OrderProps } from '@/components/OrderCard';
import BotonRegresar from '@/components/BotonRegresar';

// Datos falsos para replicar el diseño SE NECESITA BACKEND
const mockOrders: OrderProps[] = [
  {
    id: 1,
    date: '21 de mayo',
    status: 'En curso',
    arrivalDate: 'Llego el 22 de mayo',
    productName: 'Blusa artesanal colores de la sierra',
    storeName: 'Tienda oficial artesanal CorreosMexico MX',
    image: '/placeholder-vestidos.png', 
  },
  {
    id: 2,
    date: '21 de mayo',
    status: 'En curso',
    arrivalDate: 'Llego el 22 de mayo',
    productName: 'Blusa artesanal colores de la sierra',
    storeName: 'Tienda oficial artesanal CorreosMexico MX',
    image: '/placeholder-vestidos.png',
  },
  {
    id: 3,
    date: '21 de mayo',
    status: 'En curso',
    arrivalDate: 'Llego el 22 de mayo',
    productName: 'Blusa artesanal colores de la sierra',
    storeName: 'Tienda oficial artesanal CorreosMexico MX',
    image: '/placeholder-vestidos.png',
  },
];

export default function MisPedidosPage() {
  return (
    <Plantilla>
      <div className="min-h-screen bg-white">
        <div className="px-4 sm:px-8 py-10 max-w-7xl mx-auto">
          
        <BotonRegresar />

          {/* Título */}
          <h1 className="text-4xl font-bold text-black mb-10">
            Mis Pedidos
          </h1>

          {/* Lista de Pedidos */}
          <div className="flex flex-col gap-6">
            {mockOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>

          {/* Estado vacío (Opcional, por si no hay pedidos) */}
          {mockOrders.length === 0 && (
            <div className="text-center py-20 bg-gray-50 rounded-3xl">
              <p className="text-gray-500 text-lg">Aún no has realizado ninguna compra.</p>
            </div>
          )}

        </div>
      </div>
    </Plantilla>
  );
}