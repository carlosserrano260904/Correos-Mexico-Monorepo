'use client'
import { Plantilla } from '@/components/plantilla'
import React, { useEffect } from 'react'
import { CartCard } from '../../components/cartcard'
import { useProducts } from '@/hooks/useProduct'
import { useCart } from '@/hooks/useCart'
import { ResumenCompra } from '@/components/resumenCompra'
import { CarrouselProducts } from '@/components/CarouselProducts'

export default function page() {
  const { Products } = useProducts();
  const { CartItems} = useCart();

  return (
    <Plantilla>
      <div className='flex gap-x-3'>
        <CartCard className='basis-2/3' cartItems={CartItems}/>
        <ResumenCompra className='basis-1/3 h-fit' />
      </div>
      <CarrouselProducts entradas={Products} title='Tambien te podria interesar'/>
    </Plantilla>
  )
}