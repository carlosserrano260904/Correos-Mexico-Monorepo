'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export interface OrderProps {
  id: number;
  date: string;
  status: string;
  arrivalDate: string;
  productName: string;
  storeName: string;
  image: string;
}

export const OrderCard: React.FC<{ order: OrderProps }> = ({ order }) => {
  return (
    <div className="bg-[#F3F4F6] rounded-[32px] p-6 sm:p-8 mb-6 last:mb-0 font-sans">
      
      {/* FECHA DEL PEDIDO */}
      <div className="mb-3 pl-1">
        <span className="font-bold text-gray-900 text-base">{order.date}</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">

        {/* IMAGEN */}
        <div className="shrink-0">
          <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden shadow-sm bg-white">
            <Image
              src={order.image}
              alt={order.productName}
              fill
              className="object-cover" // Cambiado de contain a cover para llenar todo
            />
          </div>
        </div>

        {/* CONTENIDO DERECHO */}
        <div className="flex-1 w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          <div className="flex flex-col gap-1 lg:col-span-5">
            <span className="text-[#DE1484] font-bold text-base mb-1">
              {order.status}
            </span>
            <h3 className="font-bold text-gray-900 text-lg sm:text-xl leading-tight">
              {order.arrivalDate}
            </h3>
            <p className="text-gray-600 font-medium text-base mt-1 leading-snug">
              {order.productName}
            </p>
          </div>

          <div className="flex flex-col gap-4 lg:col-span-3 pt-1">
            <p className="text-gray-700 font-bold text-sm sm:text-base leading-snug">
              {order.storeName}
            </p>
          </div>

          {/* BOTONES */}
          <div className="flex flex-col gap-3 lg:col-span-4 pt-1 items-center lg:items-end xl:items-center">
            <Link 
              href="/boton-configuracion/mis-pedidos/pag-pedidos"
              className="bg-[#DE1484] hover:bg-pink-700 text-white font-bold py-2.5 px-8 rounded-full text-base transition-colors w-full sm:w-auto shadow-sm whitespace-nowrap text-center"
            >
              Ver compras
            </Link>
            
            <Link 
              href="/pago/compra-exitosa"
              className="text-[#DE1484] font-medium text-sm hover:underline text-center w-full"
            >
              Rastrear pedido
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};