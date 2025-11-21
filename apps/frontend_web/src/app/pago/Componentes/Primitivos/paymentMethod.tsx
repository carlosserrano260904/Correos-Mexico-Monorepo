import React from "react";
import { PaymentMethodProps } from "@/types/interface";

export default function PaymentMethodPrim({NombreDeTarjeta, NumeroDeTarjeta, FechaVencimiento, CodigoSeguridad}: PaymentMethodProps) {
    
    // Función para enmascarar el número de tarjeta
    const maskCardNumber = (cardNumber: string) => {
        if (!cardNumber) return '';
        const lastFourDigits = cardNumber.slice(-4);
        return `**** **** **** ${lastFourDigits}`;
    };

    return (
        <div className="max-w-3xl mx-auto p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                {/* Columna Izquierda */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                            Nombre en la tarjeta
                        </label>
                        <p className="text-gray-900 font-medium">{NombreDeTarjeta}</p>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                            Fecha de vencimiento
                        </label>
                        <p className="text-gray-900">{FechaVencimiento}</p>
                    </div>
                </div>
                
                {/* Columna Derecha */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                            Número de tarjeta
                        </label>
                        <p className="text-gray-900 font-mono tracking-wider">
                            {maskCardNumber(NumeroDeTarjeta)}
                        </p>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                            Código de seguridad
                        </label>
                        <p className="text-gray-900 font-mono">***</p>
                    </div>
                </div>
            </div>
            
            {/* Indicador visual de tarjeta */}
            <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-md flex items-center justify-center">
                        <div className="w-6 h-4 bg-white rounded-sm opacity-80"></div>
                    </div>
                    <div className="text-sm text-gray-600">
                        Tarjeta de crédito/débito
                    </div>
                </div>
            </div>
        </div>
    );
}