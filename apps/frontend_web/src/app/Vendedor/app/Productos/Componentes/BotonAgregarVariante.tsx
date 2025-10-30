"use client";
import React from 'react';
import { BtnLink } from '@/app/Vendedor/components/primitivos';
import { IoIosAdd } from "react-icons/io"; 


interface BotonAgregarVarianteProps {
  onClick?: () => void; 
  link?: string;
}

export const BotonAgregarVariante: React.FC<BotonAgregarVarianteProps> = ({ link }) => { 

  const effectiveLink = link || "#";

  return (
    <BtnLink
      link={effectiveLink}
      className="flex items-center justify-center w-full px-4 py-2 border border-dashed border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:border-gray-400 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
    >
      {/* Replaced the SVG with the IoIosAdd component */}
      <IoIosAdd className="w-5 h-5 mr-2 text-gray-600" />
      Agregar nueva variante
    </BtnLink>
  );
};