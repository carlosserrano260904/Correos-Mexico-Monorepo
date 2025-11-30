import React from "react";
import { useRouter } from 'next/navigation'
import { IoArrowBackOutline } from 'react-icons/io5'

interface DireccionProps {
    className?: string;
    redirectTo?: string;
  }

export const BotonRegresar = ({className = "", redirectTo = "/"}: DireccionProps) => {

  
  const router = useRouter();
  return (
    <button
        onClick={() => router.push(redirectTo)}
        className={`flex items-center text-gray-600 hover:text-pink-600 transition-colors mb-4 cursor-pointer ${className}`}
    >
        <IoArrowBackOutline className="w-5 h-5 mr-2" />
        Regresar
    </button>
  );
}