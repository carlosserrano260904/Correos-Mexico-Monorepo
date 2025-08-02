'use client'
import { Plantilla } from "@/components/plantilla";
import React, { useState } from "react";
import SumatoriaOrden from "./sumatoriaOrden";



import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import FormularioAgregarDireccion from "./formularioDireccion";
import { UserAddressDeriveryProps } from "@/types/interface";
import AdressTable from "./UserDirection";



export default function MasDirecciones({ Nombre, Apellido, Calle, Numero, CodigoPostal, Estado, Municipio, Ciudad, Colonia, NumeroDeTelefono, InstruccionesExtra }:UserAddressDeriveryProps ) {
    const [direccionSeleccionada, setDireccionSeleccionada] = useState<number | null>(null);
    
    // Datos de ejemplo para las direcciones
    const direcciones = [
        {
            id: 1,
            Nombre: "Juan",
            Apellido: "Pérez",
            Calle: "Av. Principal",
            Numero: "123",
            CodigoPostal: "34000",
            Estado: "Durango",
            Municipio: "Durango",
            Ciudad: "Durango",
            Colonia: "Centro",
            NumeroDeTelefono: "618 123 4567",
            InstruccionesExtra: "Casa de dos pisos, portón azul"
        },
        {
            id: 2,
            Nombre: "María",
            Apellido: "González",
            Calle: "Calle Secundaria",
            Numero: "456",
            CodigoPostal: "34100",
            Estado: "Durango",
            Municipio: "Durango",
            Ciudad: "Durango",
            Colonia: "San José",
            NumeroDeTelefono: "618 987 6543",
            InstruccionesExtra: "Departamento 3B, edificio blanco"
        },
        {
            id: 3,
            Nombre: "Carlos",
            Apellido: "Rodríguez",
            Calle: "Blvd. Norte",
            Numero: "789",
            CodigoPostal: "34200",
            Estado: "Durango",
            Municipio: "Durango",
            Ciudad: "Durango",
            Colonia: "Las Flores",
            NumeroDeTelefono: "618 555 0123",
            InstruccionesExtra: "Frente al parque, casa con jardín"
        }
    ];

    const handleSeleccionarDireccion = (id: number) => {
        setDireccionSeleccionada(id);
    };

    const handleConfirmarSeleccion = () => {
        if (direccionSeleccionada) {
            const direccion = direcciones.find(d => d.id === direccionSeleccionada);
            console.log('Dirección seleccionada:', direccion);
            // Aquí puedes agregar la lógica para proceder con la dirección seleccionada
            alert(`Dirección de ${direccion?.Nombre} ${direccion?.Apellido} seleccionada correctamente`);
        }
    };

    return (
        <Plantilla>
            <div id='mainPage' className='flex'>
                <div id='leftContent' className='w-3/4 bg-[#f5f5f5] rounded-lg m-2 p-4'>
                    <h2 className="text-xl font-semibold text-gray-800 mb-6">
                        Seleccionar dirección de entrega
                    </h2>
                    
                    {/* Lista de direcciones seleccionables */}
                    <div className="space-y-4 mb-6">
                        {direcciones.map((direccion) => (
                            <div 
                                key={direccion.id}
                                onClick={() => handleSeleccionarDireccion(direccion.id)}
                                className={`
                                    relative cursor-pointer transition-all duration-200 rounded-lg overflow-hidden
                                    ${direccionSeleccionada === direccion.id 
                                        ? 'ring-2 ring-pink-500 shadow-lg transform scale-[1.02]' 
                                        : 'hover:shadow-md hover:scale-[1.01]'
                                    }
                                `}
                            >
                                {/* Indicador de selección */}
                                {direccionSeleccionada === direccion.id && (
                                    <div className="absolute top-4 right-4 z-10">
                                        <div className="w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center">
                                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                    </div>
                                )}
                                
                                {/* Overlay para indicar selección */}
                                <div className={`
                                    absolute inset-0 pointer-events-none transition-opacity duration-200
                                    ${direccionSeleccionada === direccion.id 
                                        ? 'bg-pink-50 opacity-20' 
                                        : 'bg-transparent'
                                    }
                                `}></div>
                                
                                <AdressTable {...direccion} />
                            </div>
                        ))}
                    </div>
                    
                    {/* Botón de confirmación */}
                    {direccionSeleccionada && (
                        <div className="flex justify-center mb-4">
                            <button
                                onClick={handleConfirmarSeleccion}
                                className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-semibold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-pink-300"
                            >
                                Confirmar dirección seleccionada
                            </button>
                        </div>
                    )}
                    
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
                
                <div id='rightContent' className='w-1/4'>
                    <SumatoriaOrden />
                </div>
            </div>
        </Plantilla>
    )
}