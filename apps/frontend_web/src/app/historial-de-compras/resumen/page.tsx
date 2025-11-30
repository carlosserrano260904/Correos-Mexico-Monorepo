//app/historial-de-compras/resumen/page.tsx
'use client'
import { Plantilla } from '@/components/plantilla'
import React from 'react'
import { useProducts } from '@/hooks/useProduct'
import { useCart } from '@/hooks/useCart'
import { CarrouselProducts } from '@/components/CarouselProducts'
import { HistorialDeCompras } from '@/components/HistorialDeCompras'
import { ResumenDeCompra } from '@/components/ResumenDeCompra'
import BotonRegresarCarrito from '@/components/BotonRegresarCarrito'

export default function Page() {
  const { products } = useProducts();
  //const { items } = useCart(); // Cambiar CartItems por items
  const items = [
    {
        ProductID: 1,
        ProductName: "Cámara Fotográfica Pro",
        productPrice: 3500,
        ProductImageUrl: "/placeholder-bolsos.png",
        ProductColors: ["Negro"],
        ProductDescription: "Cámara profesional con lente intercambiable.",
        ProductCategory: "Tecnología",
        quantity: 1,
        selectedColor: "Negro",
        selectedSize: "Único",
        isSelected: true,

        // NUEVO: estado de entrega
        delivered: false,
        deliveredDate: "22 de mayo",
        orderDate: "21 de mayo",
        storeName: "Tienda oficial artesanal",
        sellerName: "CorreosMexico MX"
    },
    {
        ProductID: 2,
        ProductName: "Audífonos Bluetooth",
        productPrice: 799,
        ProductImageUrl: "/placeholder-chamarras.png",
        ProductColors: ["Blanco"],
        ProductDescription: "Audífonos inalámbricos con cancelación de ruido.",
        ProductCategory: "Tecnología",
        quantity: 1,
        selectedColor: "Blanco",
        selectedSize: "Único",
        isSelected: true,

        delivered: true, // ❗ No entregado todavía
        orderDate: "18 de mayo",
        storeName: "AudioTech MX",
        sellerName: "Proveedor Oficial"
    }
    ];

  console.log('Carrito - items:', items); // Debug

  return (
    <Plantilla>
        <BotonRegresarCarrito redirectTo='/historial-de-compras' className="ml-2 sm:ml-4 md:ml-19 lg:ml-39"/>
        <ResumenDeCompra fecha={"21 de Septiembre 2025"} items={items}/>
    </Plantilla>
  )
}