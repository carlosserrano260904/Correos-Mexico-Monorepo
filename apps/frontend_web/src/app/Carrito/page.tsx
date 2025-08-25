'use client'
import { Plantilla } from '@/components/plantilla'
import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { CartCard } from '../../components/cartcard'
import { useProducts } from '@/hooks/useProduct'
import { useCart } from '@/hooks/useCart'
import { useAuth } from '@/hooks/useAuth'
import { ResumenCompra } from '@/components/resumenCompra'
import { CarrouselProducts } from '@/components/CarouselProducts'

export default function page() {
  const router = useRouter();
  const auth = useAuth();
  const { Products } = useProducts();
  const { CartItems} = useCart();

  // Protección de autenticación
  useEffect(() => {
    if (!auth.loading && !auth.isAuthenticated) {
      router.push('/login?redirect=/Carrito');
    }
  }, [auth.loading, auth.isAuthenticated, router]);

  // Mostrar loading mientras se verifica autenticación
  if (auth.loading) {
    return (
      <Plantilla>
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
        </div>
      </Plantilla>
    );
  }

  // Si no está autenticado, no mostrar el contenido
  if (!auth.isAuthenticated) {
    return null; // El useEffect se encargará de la redirección
  }

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