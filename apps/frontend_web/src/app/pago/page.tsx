'use client'
import React from 'react'
import { Plantilla } from '@/components/plantilla'
import  DeliveryAdress  from './Componentes/deliveryAdress'
import OrderReview from './Componentes/orderReview'
import Link from 'next/link'
import PaymentMethod from './Componentes/paymentMethod'
import { ResumenCompra } from '@/components/resumenCompra'

export default function Home() {


  return (
    <Plantilla>
      <div id='painPage' className='flex'>
        <div id='rigthContent' className='w-2/3'>
          <div id='Direccion de Envio'>
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Información de Entrega
            </h2>
            <DeliveryAdress></DeliveryAdress>
            <div className="m-2 justify-self-end">
              <Link href={'/pago/MasDirecciones'}>
                <button className="text-sm text-[#DE1484]"> Cambiar Direccion de entrega</button>
              </Link>
            </div>
          </div>
          <div id='Informacion del metodo de pago'>
            <PaymentMethod></PaymentMethod>
            <div className="m-2 justify-self-end">
              <Link href={'/pago/MasFormasdePago'}>
                  <button className="text-sm text-[#DE1484]"> Cambiar Forma de pago</button>
              </Link>
            </div>
          </div>
        </div>
        <div id='leftContent' className='w-1/3'>
          <ResumenCompra className='mt-12'></ResumenCompra>
          {/* <div className='bg-[#DE1484] m-2 rounded-lg text-center text-white py-2 w-1/2 justify-self-center'>
            <button>Confirmar compra</button>
          </div> */}
        </div>
      </div>
    </Plantilla>
  );
}

