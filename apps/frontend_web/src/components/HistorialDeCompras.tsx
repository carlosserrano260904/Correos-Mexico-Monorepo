'use client';

import React from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { CartItemProps } from "@/components/cartcard";

interface OrderCardListProps {
  className?: string;
  items: (CartItemProps & {
    delivered?: boolean;
    deliveredDate?: string;
    orderDate?: string;
  })[];
}

export const HistorialDeCompras = ({ className = "", items }: OrderCardListProps) => {

  const validItems = items?.filter(item =>
    item &&
    item.ProductID &&
    item.ProductName &&
    typeof item.productPrice === "number"
  ) ?? [];

  return (
    <div className={`space-y-4 ${className}`}>

      {validItems.map((item, index) => {

        const isDelivered = item.delivered ?? true;

        return (
          <Card key={index} className="rounded-2xl shadow-sm p-4">
            <CardContent className="flex items-center w-full justify-between gap-6 py-4">

              {/* LEFT SECTION */}
              <div className="flex items-center gap-4">

                <Image
                  src={item.ProductImageUrl}
                  alt={item.ProductName}
                  width={90}
                  height={90}
                  className="rounded-xl object-cover"
                />

                <div>

                  <p className="text-sm text-gray-600 font-medium">
                    {item.orderDate ?? "Fecha no disponible"}
                  </p>

                  {isDelivered ? (
                    <>
                      <p className="text-pink-600 text-sm font-semibold">Entregado</p>
                      {item.deliveredDate && (
                        <p className="text-sm font-semibold">
                          Llegó el {item.deliveredDate}
                        </p>
                      )}
                    </>
                  ) : (
                    <p className="text-yellow-600 text-sm font-semibold">
                      En progreso
                    </p>
                  )}

                  <p className="text-sm mt-1 font-medium">{item.ProductName}</p>

                  <p className="text-xs text-gray-600">
                    {item.ProductDescription ?? "Sin descripción"}
                  </p>
                </div>
              </div>

              {/* MIDDLE SECTION */}
              <div className="flex flex-col text-sm text-gray-700">
                <span className="font-medium">Tienda oficial artesanal</span>
                <span className="text-xs text-gray-500">CorreosMexico MX</span>

                <button className="text-pink-600 text-sm mt-2 hover:underline">
                  Enviar mensaje
                </button>
              </div>

              {/* RIGHT SECTION */}
              <div className="flex flex-col items-end gap-2">

                <button className="bg-pink-600 text-white px-6 py-2 rounded-full text-sm hover:bg-pink-700">
                  Ver compras
                </button>

                {/* NUEVO BOTÓN: Solo si NO está entregado */}
                {!isDelivered && (
                  <button className="bg-blue-600 text-white px-6 py-2 rounded-full text-sm hover:bg-blue-700">
                    Rastrear paquete
                  </button>
                )}

                <p className="text-xs text-gray-600">Productos destacados</p>
              </div>

            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
