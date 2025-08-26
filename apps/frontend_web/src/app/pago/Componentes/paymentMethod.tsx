import React, { useState, useEffect } from "react";
import PaymentMethodPrim from "./Primitivos/paymentMethod";
import Link from 'next/link'
import { useDefaultCard } from '@/hooks/usePayments';
import { useAuthStore } from '@/stores/useAuthStore';
import type { FrontendCard } from '@/schemas/payments';
import { PaymentMethodProps } from "@/types/interface";

export default function PaymentMethod() {
    // 🔐 Obtener usuario autenticado
    const { user } = useAuthStore();
    
    // 💳 Hook para obtener tarjeta por defecto
    const { 
        defaultCard,
        loading, 
        error,
        hasDefaultCard,
        loadCards 
    } = useDefaultCard();

    // 🔄 Cargar tarjetas del usuario
    useEffect(() => {
        if (user?.id) {
            loadCards(user.id);
        }
    }, [user?.id]);

    // 🔄 Función para transformar FrontendCard a PaymentMethodProps
    const transformToPaymentMethodProps = (frontendCard: FrontendCard): PaymentMethodProps => {
        return {
            id: frontendCard.CardId,
            NombreDeTarjeta: 'Usuario', // El backend no guarda el nombre en la tarjeta
            NumeroDeTarjeta: frontendCard.MaskedNumber || `**** **** **** ${frontendCard.Last4}`,
            FechaVencimiento: "**/**", // Por seguridad, no mostramos fecha real
            CodigoSeguridad: "***", // Por seguridad, siempre oculto
            TipoTarjeta: frontendCard.Brand,
            Banco: frontendCard.Brand, // Usar brand como banco por ahora
        };
    };

    return (
        <div className="p-8 rounded-lg m-2 bg-[#f5f5f5]">
            <h1 className='font-semibold m-2'>Información del Método de Pago</h1>
            
            {loading && (
                <div className="flex justify-center items-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-pink-500"></div>
                    <span className="ml-2 text-gray-600">Cargando método de pago...</span>
                </div>
            )}

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    <p className="text-sm">Error al cargar método de pago: {error}</p>
                </div>
            )}

            {!loading && !error && !hasDefaultCard() && (
                <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
                    <p className="text-sm font-semibold">No tienes un método de pago seleccionado</p>
                    <p className="text-sm">Por favor, agrega una tarjeta para continuar con tu pedido.</p>
                    <Link href="/pago/MasFormasdePago" className="text-pink-500 underline text-sm">
                        Agregar método de pago
                    </Link>
                </div>
            )}

            {!loading && !error && hasDefaultCard() && defaultCard && (
                <PaymentMethodPrim {...transformToPaymentMethodProps(defaultCard)} />
            )}
        </div>
    )
}