//comonents/SeleccionarDireccion.tsx
'use client';

import React, { useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { CartItemProps } from "@/components/cartcard";
import AdressTable from "../app/pago/Componentes/Primitivos/UserDirection";
import FormularioAgregarDireccion from "../app/pago/Componentes/Primitivos/formularioDireccion";
import { Dialog, DialogContent, DialogTitle, DialogTrigger, } from "@/components/ui/dialog"
import { useRouter } from "next/navigation";

interface direcciones{
    id: number;
    Nombre: string;
    Apellido: string;
    Calle: string;
    Numero: string;
    CodigoPostal: string;
    Estado: string;
    Municipio: string;
    Ciudad: string;
    Colonia: string;
    NumeroDeTelefono: string;
    InstruccionesExtra: string;
}

interface DireccionProps {
  id?: string;
  className?: string;
  direcciones: (direcciones)[];
}

export const SeleccionarDireccion = ({ id="", className = "", direcciones }: DireccionProps) =>{
    const [direccionSeleccionada, setDireccionSeleccionada] = useState<number | null>(null);
    
    const router = useRouter();

    const handleSeleccionarDireccion = (id: number) => {
        setDireccionSeleccionada(id);
    };

    const handleConfirmarSeleccion = () => {
        if (direccionSeleccionada) {
            const direccion = direcciones.find(d => d.id === direccionSeleccionada);
            console.log('Dirección seleccionada:', direccion);
            // Aquí puedes agregar la lógica para proceder con la dirección seleccionada
            alert(`Dirección de ${direccion?.Nombre} ${direccion?.Apellido} seleccionada correctamente`);
            router.push("/pago");
        }
    };
  return (
    <div
    id={id}
    className={`
        w-full              /* móvil */
        md:w-4/5           /* pantallas medianas (80%) */
        lg:w-full           /* pantallas grandes (75%) */
        xl:w-2/3           /* pantallas muy grandes (66%) */
        rounded-lg
        m-2
        p-4
        ${className}
    `}
    >
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Seleccionar dirección de entrega
        </h2>
        
        {/* Lista de direcciones seleccionables */}
        <div className="space-y-6 mb-6">
            {direcciones.map((direccion, index) => (
                <div key={direccion.id}>

                    {/* Tarjeta clickeable */}
                    <div 
                        onClick={() => handleSeleccionarDireccion(direccion.id)}
                        className={`
                            relative cursor-pointer transition-all duration-200 rounded-lg overflow-hidden
                            bg-gray-100
                            ${direccionSeleccionada === direccion.id 
                                ? 'ring-2 ring-pink-500 shadow-lg transform scale-[1.02]' 
                                : 'hover:shadow-md hover:scale-[1.01]'
                            }
                        `}
                    >
                        
                        {/* Indicador de selección / no selección */}
                        <div className="absolute top-4 right-4 z-10">
                            {direccionSeleccionada === direccion.id ? (
                                // CÍRCULO ROSA CON CHECK
                                <div className="w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center shadow">
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                            ) : (
                                // CÍRCULO GRIS SIN CHECK
                                <div className="w-6 h-6 bg-gray-300 rounded-full shadow-inner"></div>
                            )}
                        </div>

                        {/* Overlay para indicar selección */}
                        <div className={`
                            absolute inset-0 pointer-events-none transition-opacity duration-200
                            ${direccionSeleccionada === direccion.id 
                                ? 'bg-pink-50 opacity-20' 
                                : 'bg-transparent'
                            }
                        `}></div>
                        {/* Numerador */}
                        <h3 className="text-md font-semibold mb-2 ml-21 mt-5">
                            Dirección {index + 1}
                        </h3>
                        <AdressTable {...direccion} />
                        
                    </div>
                </div>
            ))}
        </div>
        
        {/* Botón de confirmación */}
        <div className="flex justify-center mb-4">
            <button
                onClick={handleConfirmarSeleccion}
                disabled={!direccionSeleccionada}
                className={`font-semibold py-3 px-8 rounded-xl shadow-lg transition-all duration-200 focus:outline-none focus:ring-4
                ${direccionSeleccionada
                ? "bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white focus:ring-pink-300 hover:shadow-xl cursor-pointer transform hover:-translate-y-0.5"
                : "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none"}`}
                >
                    Confirmar dirección seleccionada
            </button>
        </div>
        
        {/* Botón para agregar nueva dirección */}
        <div className="flex justify-center">
            <Dialog>
                <DialogTrigger>
                    <div className="flex items-center gap-2 text-pink-500 hover:text-pink-600 cursor-pointer font-medium transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Agregar nueva dirección de entrega
                    </div>
                </DialogTrigger>
                <DialogContent className="w-2/3 h-2/3 overflow-auto">
                    <DialogTitle>Nueva Dirección de Entrega</DialogTitle>
                    <hr />
                    <FormularioAgregarDireccion />
                </DialogContent>
            </Dialog>
        </div>
    </div>
  );
};
