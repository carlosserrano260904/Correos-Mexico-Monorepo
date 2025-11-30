import React from "react";
import Image from "next/image";
import { CartItemProps } from "@/components/cartcard";
import { SeguimientoPaquete } from "./SeguimientoPaquete";

interface OrderCardListProps {
  className?: string;
  items?: (CartItemProps & {
    delivered?: boolean;
    deliveredDate?: string;
    orderDate?: string;
  })[];
}

export const CompraExitosa = ({ className = "", items }: OrderCardListProps) => {
  const infoEnvio = {
    numeroDeSeguimiento: "MX123456789",
    transportista: "Correos de México",
    destino: "Durango, Durango",
    puntoActual: "Lugar actual",
    fechaEstimada: "29 de octubre, 2025",
  };
  return (
    <div>
      <div className="w-full min-h-screen flex justify-center py-10 bg-white text-gray-800">
        <div className="w-full max-w-3xl px-6">
          {/* Icono y título */}
          <div className="flex flex-col items-center mb-10">
            <div className="w-20 h-20 flex items-center justify-center">
                  <Image
                      src="/exito.png"
                      alt="Icono de compra exitosa"
                      width={80}
                      height={80}
                      className="object-contain"
                  />
              </div>
            <h1 className="text-2xl font-semibold text-pink-600 mt-4">Compra exitosa</h1>

            <div className="text-gray-600 mt-1 text-sm">
              <span className="font-medium mr-2">ID de la orden:</span>
              <span className="text-gray-800 font-semibold">ID9012</span>
            </div>

            <div className="text-gray-600 text-sm mt-1">
              <span className="mr-2">Fecha:</span>
              <span className="text-gray-800 font-semibold">28 de noviembre del 2025</span>
            </div>
            <SeguimientoPaquete seguimiento={infoEnvio}/>
          </div>

          {/* Lista de productos */}
          <div className="space-y-6">
              {items?.map((item, index) => (
              <div key={index} className="flex items-center justify-between border-b pb-4">
                  <div className="flex items-start gap-4">
                      <div className="w-14 h-20 relative">
                          <Image
                              src={item.ProductImageUrl}
                              alt={item.ProductName}
                              fill
                              className="object-cover rounded"
                          />
                      </div>
                      <div className="flex flex-col text-sm">
                          <span className="font-medium">{item.ProductName}</span>
                          <span className="text-gray-500 text-xs">{item.ProductCategory}</span>
                      </div>
                  </div>
                  <span className="text-pink-600 font-semibold text-lg">${item.productPrice}</span>
              </div>
              ))}
          </div>
        </div>
      </div>
    </div>
    
  );
}
