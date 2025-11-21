import React from 'react';
import { BtnLink } from '@/app/Vendedor/components/primitivos';


export const BotonCrearProducto = ({onClick} : {onClick:() => void}) => (
<BtnLink
  link="/Productos"
  className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-700"
  onClick={onClick}
>
  Crear producto
</BtnLink>
);
