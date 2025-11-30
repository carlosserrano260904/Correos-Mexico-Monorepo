//app/Carrito/page.tsx
// app/Carrito/page.tsx
'use client'
import { Plantilla } from '@/components/plantilla'
import React from 'react'
import { CartCard } from '../../components/cartcard'
import { useProducts } from '@/hooks/useProduct'
import { useCart } from '@/hooks/useCart'
import { ResumenCompra } from '@/components/resumenCompra'
import { CarrouselProducts } from '@/components/CarouselProducts'


export default function Page() {
  const { products } = useProducts();
  const { items } = useCart(); 

  console.log('Carrito - items:', items); // Debug

  return (
    <Plantilla>

      <div className='flex flex-col lg:flex-row gap-6'>
        {/* ✅ Pasar items en lugar de cartItems */}
        <CartCard className='lg:basis-2/3' items={items}/>
        <ResumenCompra className='lg:basis-1/3 h-fit' />
      </div>
      <CarrouselProducts entradas={products} title='También te podría interesar'/>
    </Plantilla>
  )
}