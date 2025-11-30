import React from "react";
import { useRouter } from 'next/navigation';
import { IoHomeOutline } from 'react-icons/io5';

interface DireccionProps {
  className?: string;
  redirectTo?: string;
}

export const BotonRegresarHomePage = ({ className = "", redirectTo = "/" }: DireccionProps) => {
  const router = useRouter();
  
  return (
    <button
      onClick={() => router.push(redirectTo)}
      className={`flex items-center text-gray-600 hover:text-[#DE1484] transition-colors mb-4 cursor-pointer ${className}`}
    >
      {/* Icono de Casita */}
      <IoHomeOutline className="w-5 h-5 mr-2" />
      Regresar a Home
    </button>
  );
};
