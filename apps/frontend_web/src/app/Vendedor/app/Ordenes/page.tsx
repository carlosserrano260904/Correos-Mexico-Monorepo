import { Plantilla } from '../../components/plantilla'
import React from 'react'
import TableroOrdenes from './Componentes/tableroOrdenes'
import { Separator } from '../../../../components/ui/separator'
import { Filtros } from '../../components/filtros';
import { OrdenesProps } from '../../../../types/interface';

const Data: OrdenesProps[] = [
  {
    OrderID: 5,
    OrderInfo: [
      {
        ProductID:1,
        ProductImageUrl: "https://merxstore.mx/cdn/shop/files/076998E-R01.jpg?v=1696884033&width=1500",
        ProductName: "Playera Negra básica",
        ProductQuantity: 3,
        productPrice: 600,
        ProductBrand: "nike",
        
      },
      {
        ProductID:2,
        ProductImageUrl: "https://merxstore.mx/cdn/shop/files/076998E-R01.jpg?v=1696884033&width=1500",
        ProductName: "Playera azul básica",
        ProductQuantity: 3,
        productPrice: 400,
        ProductBrand: "nike"
      }
    ],
    NoProducts: 3,
    OrderStatus: 1,
    OrderTotal: 290,
    OrderDate: "20/01/25",
    PaymentMethod: "Tarjeta de Crédito",
    ClientName: "Ana García",
    Email: "ana.garcia@email.com",
    PhoneNumber: 5512345678,
    PackageStatus: 'Orden procesada'
  },
  {
    OrderID: 6,
    OrderInfo: [
      {
        ProductID:1,
        ProductImageUrl: "https://via.placeholder.com/150",
        ProductName: "Playera Negra",
        ProductQuantity: 5,
        productPrice: 145,
        ProductBrand: "nike"
      }
    ],
    NoProducts: 5,
    OrderStatus: 2,
    OrderTotal: 145,
    OrderDate: "20/01/25",
    PaymentMethod: "PayPal",
    ClientName: "Luis Hernández",
    Email: "luis.h@email.com",
    PhoneNumber: 5587654321,
    PackageStatus: 'Paquete enviado'
  },
  {
    OrderID: 7,
    OrderInfo: [
      {
        ProductID:1,
        ProductImageUrl: "https://merxstore.mx/cdn/shop/files/076998E-R01.jpg?v=1696884033&width=1500",
        ProductName: "Playera Negra básica",
        ProductQuantity: 3,
        productPrice: 600,
        ProductBrand: "nike"
      }
    ],
    NoProducts: 3,
    OrderStatus: 1,
    OrderTotal: 200,
    OrderDate: "20/01/25",
    PaymentMethod: "Tarjeta de Débito",
    ClientName: "Sofía Ramirez",
    Email: "sofia.r@email.com",
    PhoneNumber: 5511223344,
    PackageStatus: 'Pago confirmado'
  },
  {
    OrderID: 8,
    OrderInfo: [
      {
        ProductID:1,
        ProductImageUrl: "https://via.placeholder.com/150",
        ProductName: "Playera Negra",
        ProductQuantity: 5,
        productPrice: 100,
        ProductBrand: "nike"
      }
    ],
    NoProducts: 5,
    OrderStatus: 3,
    OrderTotal: 100,
    OrderDate: "20/01/25",
    PaymentMethod: "Transferencia Bancaria",
    ClientName: "Carlos Mendoza",
    Email: "carlos.m@email.com",
    PhoneNumber: 5599887766,
    PackageStatus: 'Paquete entregado'
  }
];


export default function Ordenes() {
  return (
    <Plantilla title='Ordenes'>
        <Separator className="my-2" />
        <div>
          <Filtros/>
        </div>
        <div className='mt-5'>
          <TableroOrdenes entradas={Data}/>
        </div>
    </Plantilla>
  )
}
