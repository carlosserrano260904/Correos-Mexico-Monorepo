'use client'
import { Plantilla } from "@/components/plantilla"
import PaymentMethodPrim from "../Componentes/Primitivos/paymentMethod"
import SumatoriaOrden from "../Componentes/Primitivos/sumatoriaOrden"
import { PaymentMethodProps } from "@/types/interface"
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import FormularioPagoTarjeta from "../Componentes/Primitivos/formularioPagoTarjeta"
import React, { useState, useEffect } from "react"
import { useRouter } from 'next/navigation';
import { useUserCards, useDefaultCard } from '@/hooks/usePayments';
import { useAuthStore } from '@/stores/useAuthStore';
import type { FrontendCard } from '@/schemas/payments';

export default function MasTarjetas() {
    const [tarjetaSeleccionada, setTarjetaSeleccionada] = useState<number | null>(null);
    const router = useRouter();
    
    // 🔐 Obtener usuario autenticado
    const { user } = useAuthStore();
    
    // 💳 Hook para manejar tarjetas con carga automática
    const { 
        cards, 
        loading, 
        error, 
        selectCard, 
        selectedCard,
        setDefaultCard,
        refreshCards,
        loadCards
    } = useUserCards(user?.id);

    // 🔄 Función para transformar FrontendCard a PaymentMethodProps
    const transformToPaymentMethodProps = (frontendCard: FrontendCard): PaymentMethodProps => {
        return {
            id: frontendCard.CardId,
            NombreDeTarjeta: user?.nombre || 'Usuario', // Usar nombre del usuario
            NumeroDeTarjeta: frontendCard.MaskedNumber || `**** **** **** ${frontendCard.Last4}`,
            FechaVencimiento: "**/**", // Por seguridad, no mostramos fecha real
            CodigoSeguridad: "***", // Por seguridad, siempre oculto
            TipoTarjeta: frontendCard.Brand,
            Banco: frontendCard.Brand, // Usar brand como banco por ahora
        };
    };

    // 🎯 Preparar tarjetas para el componente UI existente
    const tarjetasParaUI = cards.map(card => ({
        id: card.CardId,
        ...transformToPaymentMethodProps(card)
    }));

    const handleSeleccionarTarjeta = (id: number) => {
        setTarjetaSeleccionada(id);
        // También actualizar el store interno
        selectCard(id);
    };

    const handleConfirmarSeleccion = () => {
        console.log('🎯 === INICIANDO CONFIRMACIÓN DE SELECCIÓN DE TARJETA ===');
        console.log('📍 tarjetaSeleccionada:', tarjetaSeleccionada);
        console.log('💳 Total cards:', cards.length);
        
        if (tarjetaSeleccionada) {
            // Buscar la tarjeta real del backend
            const tarjetaBackend = cards.find(card => card.CardId === tarjetaSeleccionada);
            const tarjetaUI = tarjetasParaUI.find(t => t.id === tarjetaSeleccionada);
            
            console.log('💳 Tarjeta seleccionada (Backend):', tarjetaBackend);
            console.log('💳 Tarjeta seleccionada (UI):', tarjetaUI);
            
            // Marcar como tarjeta por defecto
            if (tarjetaBackend) {
                try {
                    console.log('🔄 Procesando selección de tarjeta...');
                    setDefaultCard(tarjetaBackend.CardId);
                    console.log('✅ Tarjeta marcada como predeterminada:', tarjetaBackend.DisplayName);
                    
                    // Redirigir a la página de pago principal
                    console.log('🔄 Redirigiendo a la página de pago...');
                    router.push('/pago');
                    
                } catch (error) {
                    console.error('❌ Error al procesar la selección:', error);
                    alert('Error al seleccionar la tarjeta');
                }
            }
        }
    };

    // 🔄 Efecto para manejar datos del usuario
    useEffect(() => {
        if (user && cards.length > 0) {
            console.log('✅ Tarjetas cargadas:', cards);
            console.log('👤 Usuario:', user);
        }
    }, [user, cards]);

    return (
        <Plantilla>
            <div id='mainPage' className='flex'>
                <div id='leftContent' className='w-3/4 bg-[#f5f5f5] rounded-lg m-2 p-4'>
                    <h2 className="text-xl font-semibold text-gray-800 mb-6">
                        Seleccionar método de pago
                    </h2>

                    {/* Estado de carga */}
                    {loading && (
                        <div className="flex justify-center items-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
                            <span className="ml-3 text-gray-600">Cargando tarjetas...</span>
                        </div>
                    )}

                    {/* Error */}
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                            <p className="font-semibold">Error al cargar tarjetas:</p>
                            <p>{error}</p>
                            <button 
                                onClick={refreshCards}
                                className="mt-2 text-sm underline hover:no-underline"
                            >
                                Reintentar
                            </button>
                        </div>
                    )}

                    {/* Mensaje cuando no hay tarjetas */}
                    {!loading && !error && tarjetasParaUI.length === 0 && (
                        <div className="text-center py-8">
                            <div className="text-gray-500 mb-4">
                                <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No tienes tarjetas guardadas</h3>
                            <p className="text-gray-500 mb-4">Agrega tu primera tarjeta de pago para continuar con tu pedido.</p>
                        </div>
                    )}
                    
                    {/* Lista de tarjetas seleccionables */}
                    {!loading && tarjetasParaUI.length > 0 && (
                        <div className="space-y-4 mb-6">
                            {tarjetasParaUI.map((tarjeta) => (
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
                    )}
                    
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
                                <FormularioPagoTarjeta 
                                    onCardCreated={(newCard) => {
                                        console.log('✅ Nueva tarjeta creada:', newCard);
                                        refreshCards(); // Refrescar la lista
                                    }}
                                />
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