//app/pago/page.tsx
'use client'
import React from 'react'
import { Plantilla } from '@/components/plantilla'
import DeliveryAdress from './Componentes/deliveryAddress'
import OrderReview from './Componentes/orderReview'
import Link from 'next/link'
import PaymentMethod from './Componentes/paymentMethod'
import { ResumenCompra } from '@/components/resumenCompra'
import { useCart } from '@/hooks/useCart'
import { CartCard } from '../../components/cartcard'
import { BotonRegresar }  from "@/components/BotonRegresar";

export default function Home() {
  const { items } = useCart();

  return (
    <Plantilla>

      <BotonRegresar redirectTo='/Carrito' />

      {/* CONTENEDOR PRINCIPAL RESPONSIVO */}
      <div
        id='painPage'
        className='flex flex-col md:flex-row gap-6 w-full'
      >
        {/* CONTENIDO DERECHO */}
        <div
          id='rightContent'
          className='w-full md:w-2/3'
        >
          {/* DIRECCIÓN */}
          <div id='Direccion de Envio'>
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Información de Entrega
            </h2>

            <DeliveryAdress />

            <div className="m-2">
              <Link href={'/pago/MasDirecciones'}>
                <button className="text-sm text-[#DE1484] cursor-pointer">
                  Cambiar dirección de entrega
                </button>
              </Link>
            </div>
          </div>

          {/* MÉTODO DE PAGO */}
          <div id='Informacion del metodo de pago' className="mt-8">
            <PaymentMethod />

            <div className="m-2">
              <Link href={'/pago/MasFormasdePago'}>
                <button className="text-sm text-[#DE1484] cursor-pointer">
                  Cambiar forma de pago
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* CONTENIDO IZQUIERDO */}
        <div
          id='leftContent'
          className='w-full md:w-1/3'
        >
          <ResumenCompra
            className='mt-10 md:mt-13 w-full'
            texto="Pagar Ahora"
            link="/pago/compra-exitosa"
          />
        </div>
      </div>

      {/* CARRITO (ya responsivo) */}
      <CartCard
        className='lg:basis-2/3 ml-2 mt-10'
        items={items}
      />
    </Plantilla>
  );
}
