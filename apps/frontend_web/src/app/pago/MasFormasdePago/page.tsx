'use client'
import { Plantilla } from "@/components/plantilla"
import PaymentMethodPrim from "../Componentes/Primitivos/paymentMethod"
import SumatoriaOrden from "../Componentes/Primitivos/sumatoriaOrden"
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import FormularioPagoTarjeta from "../Componentes/Primitivos/formularioPagoTarjeta"
import React, { useState } from "react"

export default function MasTarjetas() {
    const [tarjetaSeleccionada, setTarjetaSeleccionada] = useState<number | null>(null);
    
    // Datos de ejemplo para las tarjetas
    const tarjetas = [
        {
            id: 1,
            NombreDeTarjeta: "Juan Pérez",
            NumeroDeTarjeta: "**** **** **** 1234",
            FechaVencimiento: "12/25",
            CodigoSeguridad: "***",
            TipoTarjeta: "Visa",
            Banco: "Banco Nacional"
        },
        {
            id: 2,
            NombreDeTarjeta: "María González",
            NumeroDeTarjeta: "**** **** **** 5678",
            FechaVencimiento: "08/26",
            CodigoSeguridad: "***",
            TipoTarjeta: "Mastercard",
            Banco: "Banco Internacional"
        },
        {
            id: 3,
            NombreDeTarjeta: "Carlos Rodríguez",
            NumeroDeTarjeta: "**** **** **** 9012",
            FechaVencimiento: "03/27",
            CodigoSeguridad: "***",
            TipoTarjeta: "American Express",
            Banco: "Banco Premium"
        }
    ];

    const handleSeleccionarTarjeta = (id: number) => {
        setTarjetaSeleccionada(id);
    };

    const handleConfirmarSeleccion = () => {
        if (tarjetaSeleccionada) {
            const tarjeta = tarjetas.find(t => t.id === tarjetaSeleccionada);
            console.log('Tarjeta seleccionada:', tarjeta);
            // Aquí puedes agregar la lógica para proceder con la tarjeta seleccionada
            alert(`Tarjeta ${tarjeta?.TipoTarjeta} de ${tarjeta?.NombreDeTarjeta} seleccionada correctamente`);
        }
    };

    return (
        <Plantilla>
            <div id='mainPage' className='flex'>
                <div id='leftContent' className='w-3/4 bg-[#f5f5f5] rounded-lg m-2 p-4'>
                    <h2 className="text-xl font-semibold text-gray-800 mb-6">
                        Seleccionar método de pago
                    </h2>
                    
                    {/* Lista de tarjetas seleccionables */}
                    <div className="space-y-4 mb-6">
                        {tarjetas.map((tarjeta) => (
                            <div 
                                key={tarjeta.id}
                                onClick={() => handleSeleccionarTarjeta(tarjeta.id)}
                                className={`
                                    relative cursor-pointer transition-all duration-200 rounded-lg overflow-hidden
                                    ${tarjetaSeleccionada === tarjeta.id 
                                        ? 'ring-2 ring-pink-500 shadow-lg transform scale-[1.02]' 
                                        : 'hover:shadow-md hover:scale-[1.01]'
                                    }
                                `}
                            >
                                {/* Indicador de selección */}
                                {tarjetaSeleccionada === tarjeta.id && (
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
                                    ${tarjetaSeleccionada === tarjeta.id 
                                        ? 'bg-pink-50 opacity-20' 
                                        : 'bg-transparent'
                                    }
                                `}></div>
                                
                                <PaymentMethodPrim {...tarjeta} />
                            </div>
                        ))}
                    </div>
                    
                    {/* Botón de confirmación */}
                    {tarjetaSeleccionada && (
                        <div className="flex justify-center mb-4">
                            <button
                                onClick={handleConfirmarSeleccion}
                                className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-semibold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-pink-300"
                            >
                                Confirmar tarjeta seleccionada
                            </button>
                        </div>
                    )}
                    
                    {/* Botón para agregar nueva tarjeta */}
                    <div className="flex justify-center">
                        <Dialog>
                            <DialogTrigger>
                                <div className="flex items-center gap-2 text-pink-500 hover:text-pink-600 cursor-pointer font-medium transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    Agregar nueva tarjeta de pago
                                </div>
                            </DialogTrigger>
                            <DialogContent className="w-2/3 h-2/3 overflow-auto">
                                <DialogTitle>Nueva Tarjeta de Pago</DialogTitle>
                                <hr />
                                <FormularioPagoTarjeta />
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