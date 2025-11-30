'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { IoAddCircleOutline } from "react-icons/io5";
import { Plantilla } from '@/components/plantilla';
import BotonRegresar from '@/components/BotonRegresar';

interface Card {
  id: string | number;
  lastFour: string;
  bankName: string;
  expirationDate: string;
  visualExp: string;
  variant: 'blue' | 'pink';
}

export default function MisTarjetasPage() {
  const [cards, setCards] = useState<Card[]>([]);

  // Simulación de carga
  useEffect(() => {
    const mockData: Card[] = [
      {
        id: 1,
        lastFour: "5491",
        bankName: "Banco",
        expirationDate: "11/2025",
        visualExp: "12/23/2030",
        variant: 'blue'
      },
      {
        id: 2,
        lastFour: "5491",
        bankName: "Banco",
        expirationDate: "11/2025",
        visualExp: "12/23/2030",
        variant: 'pink'
      },
      {
        id: 3,
        lastFour: "5491",
        bankName: "Banco",
        expirationDate: "11/2025",
        visualExp: "12/23/2030",
        variant: 'blue'
      }
    ];
    setCards(mockData);
  }, []);

  const handleDelete = (id: string | number) => {
    if (window.confirm("¿Eliminar esta tarjeta?")) {
        setCards(cards.filter(card => card.id !== id));
    }
  };

  return (
    <Plantilla>
      <div className="w-full min-h-screen bg-white font-sans">
        {/* Contenedor limitado para que no se estire demasiado */}
        <div className="max-w-5xl mx-auto px-4 py-12">

          <BotonRegresar />

          <h1 className="text-3xl font-bold text-black mb-8">
            Mis Tarjetas
          </h1>

          <div className="space-y-6">
            {cards.map((card) => (
              <div 
                key={card.id} 
                // Contenedor de la fila (gris claro)
                className="w-full bg-[#F9F9F9] rounded-[20px] p-6 flex flex-col md:flex-row items-center gap-8 shadow-sm"
              >
                {/* 1. TARJETA VISUAL (Izquierda) */}
                {/* shrink-0 evita que se aplaste. Definimos gradientes explícitos */}
                <div 
                  className={`
                    w-72 h-44 rounded-2xl p-5 flex flex-col justify-between text-white relative overflow-hidden shrink-0 shadow-md
                    ${card.variant === 'blue' 
                      ? 'bg-gradient-to-r from-[#7B85FF] to-[#5962FF]' 
                      : 'bg-gradient-to-r from-[#F06292] to-[#E91E63]'
                    }
                  `}
                >
                  {/* Nombre y Apellido */}
                  <div className="z-10 relative">
                    <p className="text-[10px] font-medium opacity-90 tracking-wide">Nombre y Apellido</p>
                  </div>

                  {/* Número de tarjeta */}
                  <div className="z-10 relative mt-2">
                    <div className="flex items-center gap-2 text-xl opacity-90">
                       <span className="text-2xl mt-1 tracking-widest">•••• •••• ••••</span> 
                       <span className="font-semibold text-2xl tracking-widest">{card.lastFour}</span>
                    </div>
                  </div>

                  {/* Fecha Expiración Visual */}
                  <div className="z-10 relative">
                    <p className="text-[9px] opacity-75 uppercase mb-0.5">Expiración</p>
                    <p className="text-sm font-medium tracking-wider">{card.visualExp}</p>
                  </div>
                  
                  {/* Decoración circular fondo */}
                  <div className="absolute top-[-50%] right-[-20%] w-56 h-56 bg-white opacity-10 rounded-full blur-2xl pointer-events-none"></div>
                </div>

                {/* 2. TEXTO INFO (Centro) */}
                <div className="flex-1 w-full text-center md:text-left space-y-1">
                    <h3 className="text-xl text-gray-800 font-normal">
                      Tarjeta terminada en <span className="font-semibold">{card.lastFour}</span>
                    </h3>
                    <p className="text-gray-500 text-base font-light">
                      {card.bankName}
                    </p>
                    <p className="text-black font-bold text-base pt-2">
                      Vencimiento: {card.expirationDate}
                    </p>
                </div>

                {/* 3. BOTÓN ELIMINAR (Derecha) */}
                <div className="shrink-0 w-full md:w-auto">
                  <button 
                    onClick={() => handleDelete(card.id)}
                    className="bg-[#D81B60] hover:bg-[#ad144d] text-white font-medium py-3 px-12 rounded-[12px] text-sm transition-colors duration-200 w-full md:w-auto shadow-sm"
                  >
                    Eliminar
                  </button>
                </div>

              </div>
            ))}
          </div>

          {/* BOTÓN AÑADIR */}
          <div className="mt-8">
            <Link href="/boton-configuracion/tarjetass/agregar_tarjetas" className="block group">
              <div className="w-full bg-[#F3F3F3] hover:bg-[#e9e9e9] transition-colors rounded-[20px] h-24 flex items-center justify-center gap-3 cursor-pointer">
                <div className="text-gray-400 group-hover:text-gray-600 transition-colors">
                   <IoAddCircleOutline size={30} />
                </div>
                <span className="text-gray-500 font-medium text-lg group-hover:text-gray-700 transition-colors">
                  Añadir tarjeta
                </span>
              </div>
            </Link>
          </div>

        </div>
      </div>
    </Plantilla>
  )
}