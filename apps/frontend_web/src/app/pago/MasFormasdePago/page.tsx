'use client'
import { Plantilla } from "@/components/plantilla"
import PaymentMethodPrim from "../Componentes/Primitivos/paymentMethod"
import SumatoriaOrden from "../Componentes/Primitivos/sumatoriaOrden"
import { PaymentMethodProps } from "@/types/interface"
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import FormularioPagoTarjeta from "../Componentes/Primitivos/formularioPagoTarjeta"
import React, { useState } from "react"
import { ResumenCompra } from '@/components/resumenCompra'
import { useCart } from '@/hooks/useCart'
import { CartCard } from '../../../components/cartcard'
import { BotonRegresar } from "@/components/BotonRegresar";
import { useRouter } from "next/navigation";

export default function MasTarjetas() {
    const [tarjetaSeleccionada, setTarjetaSeleccionada] = useState<number | null>(null);
    const { items } = useCart();
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

    const router = useRouter();

    const handleSeleccionarTarjeta = (id: number) => {
        setTarjetaSeleccionada(id);
    };

    const handleConfirmarSeleccion = () => {
        if (tarjetaSeleccionada) {
            const tarjeta = tarjetas.find(t => t.id === tarjetaSeleccionada);
            console.log('Tarjeta seleccionada:', tarjeta);
            // Aquí puedes agregar la lógica para proceder con la tarjeta seleccionada
            alert(`Tarjeta ${tarjeta?.TipoTarjeta} de ${tarjeta?.NombreDeTarjeta} seleccionada correctamente`);
            router.push('/pago');
        }
    };

    return (
        <Plantilla>
            <BotonRegresar className="ml-5" redirectTo="/pago" />

            <div
                id="mainPage"
                className="
                    flex 
                    flex-col gap-4
                    md:flex-row md:gap-0
                "
            >
                {/* LEFT CONTENT */}
                <div
                    id="leftContent"
                    className="
                        w-full md:w-3/4 
                        rounded-lg m-2 p-4
                    "
                >
                    <h2 className="text-xl font-semibold text-gray-800 mb-6">
                        Seleccionar método de pago
                    </h2>

                    {/* Lista de tarjetas */}
                    <div className="space-y-4 mb-6">
                        {tarjetas.map((tarjeta) => (
                            <div
                                key={tarjeta.id}
                                onClick={() => handleSeleccionarTarjeta(tarjeta.id)}
                                className={`
                                    relative cursor-pointer transition-all duration-200 rounded-lg overflow-hidden
                                    bg-gray-100
                                    ${tarjetaSeleccionada === tarjeta.id
                                        ? 'ring-2 ring-pink-500 shadow-lg transform scale-[1.02]'
                                        : 'hover:shadow-md hover:scale-[1.01]'
                                    }
                                `}
                            >
                                <div className="absolute top-4 right-4 z-10">
                                    {tarjetaSeleccionada === tarjeta.id ? (
                                        <div className="w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center shadow">
                                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                    ) : (
                                        <div className="w-6 h-6 bg-gray-300 rounded-full shadow-inner"></div>
                                    )}
                                </div>

                                <div
                                    className={`
                                        absolute inset-0 pointer-events-none transition-opacity duration-200
                                        ${tarjetaSeleccionada === tarjeta.id
                                            ? 'bg-pink-50 opacity-20'
                                            : 'bg-transparent'
                                        }
                                    `}
                                ></div>

                                <PaymentMethodPrim {...tarjeta} />
                            </div>
                        ))}
                    </div>

                    {/* Botón confirmar */}
                    <div className="flex justify-center mb-4">
                        <button
                            onClick={handleConfirmarSeleccion}
                            disabled={!tarjetaSeleccionada}
                            className={`font-semibold py-3 px-8 rounded-xl shadow-lg transition-all duration-200 focus:outline-none focus:ring-4
                                ${tarjetaSeleccionada
                                    ? "bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white focus:ring-pink-300 hover:shadow-xl cursor-pointer transform hover:-translate-y-0.5"
                                    : "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none"
                                }`}
                        >
                            Confirmar tarjeta seleccionada
                        </button>
                    </div>

                    {/* Botón agregar nueva tarjeta */}
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

                {/* RIGHT CONTENT */}
                <div
                    id="rightContent"
                    className="
                        w-full md:w-1/4
                    "
                >
                    <ResumenCompra className="lg:basis-1/3 h-fit mt-19" />
                </div>
            </div>

            {/* CART CARD */}
            <CartCard
                className="w-full lg:basis-2/3 ml-0 md:ml-2"
                items={items}
            />
        </Plantilla>
    )
}