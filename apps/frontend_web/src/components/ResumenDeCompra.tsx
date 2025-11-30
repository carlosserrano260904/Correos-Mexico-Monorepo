//components/ResumenDeCompra.tsx ya quedo
// app/historial-de-compras/resumen/page.tsx
'use client'
import React from 'react'
import { useProducts } from '@/hooks/useProduct'
import { useCart } from '@/hooks/useCart'
import { CarrouselProducts } from '@/components/CarouselProducts'
import { HistorialDeCompras } from '@/components/HistorialDeCompras'
import Image from "next/image";

interface CompraItem {
  ProductID: number;
  ProductName: string;
  productPrice: number;
  ProductImageUrl: string;
  ProductColors: string[];
  ProductDescription: string;
  ProductCategory: string;

  quantity: number;
  selectedColor: string;
  selectedSize: string;
  isSelected: boolean;

  delivered: boolean;
  deliveredDate?: string; // opcional porque no todos la tienen
  orderDate: string;

  storeName: string;
  sellerName: string;
}


interface ComprasPrompt {
  fecha: string;
  items: CompraItem[];
}

export const ResumenDeCompra = ({ fecha, items }: ComprasPrompt) => {
  

  console.log('Carrito - items:', items); // Debug

  return (
    <div className="w-full max-w-3xl mx-auto">

        {/* Título */}
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
        Compras del {fecha}
        </h2>

        {/* Lista */}
        <div className="space-y-4"> 
        {items.map((item, index) => (
            <div key={item.ProductID}>

            {/* Fila */}
            <div className="flex items-center gap-5">

                <Image
                src={item.ProductImageUrl}
                alt={item.ProductName}
                width={100}       // ⬅️ más grande
                height={100}
                className="rounded-lg object-cover"
                />

                <div>
                <p className="font-semibold text-lg text-gray-900">
                    {item.ProductName}
                </p>

                <p className="text-base mt-1">
                    Total:{" "}
                    <span className="text-pink-600 font-bold">
                    ${item.productPrice} MXN
                    </span>
                </p>
                </div>
            </div>

            {/* Línea divisora */}
            {index !== items.length - 1 && (
                <div className="border-t border-gray-200 mt-3"></div>
            )}
            </div>
        ))}
        </div>

    </div>
    );
}