"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Plantilla } from '@/components/plantilla';

const Seguimiento: React.FC = () => {
  const [trackingNumber, setTrackingNumber] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    
    router.push("/estatus_solicitud");
  };

  // ... (código anterior)

  return (
<Plantilla>
<div className="relative overflow-hidden bg-white">
{/* Sección superior justo debajo del navbar */}
<div className="w-full flex justify-between items-center px-6 py-4 bg-gray-50">
{/* ... Contenido de la barra superior ... */}
</div>
    
{/* Triángulos decorativos SVG (Se mantienen tal cual) */}
{/* Les daremos z-index: 10 implícito o explícito si es necesario, pero su `opacity` ya los hace un fondo. */}
<svg className="absolute top-10 left-0 w-32 h-32 opacity-20 fill-pink-300 rotate-12" viewBox="0 0 100 100">      
    <polygon points="0,0 100,0 50,100" />    
</svg>
<svg className="absolute top-1/2 right-0 w-24 h-24 opacity-20 fill-pink-300 rotate-45" viewBox="0 0 100 100">      
    <polygon points="0,0 100,0 50,100" />    
</svg>
<svg className="absolute bottom-10 left-10 w-28 h-28 opacity-30 fill-pink-300 -rotate-12" viewBox="0 0 100 100">      
    <polygon points="0,0 100,0 50,100" />    
</svg>

{/* Sección principal (Aseguramos que el contenido principal tenga z-index mayor que los SVGs si estos se traslapan en el centro) */}
{/* Ya tiene z-10, pero le daremos un fondo blanco explícito para que no sea transparente y se vea el contenido del SVG a través de él. */}
<div className="relative z-20 bg-white max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
    {/* Lado Izquierdo: Texto */}
    <div className="space-y-6">
        {/* ... Contenido del texto ... */}
    </div>
    {/* Lado Derecho: Imagen */}
    <div className="flex justify-center">
        {/* ... Contenido de la imagen ... */}
    </div>
</div>
</div>
</Plantilla>
);
};
export default Seguimiento;