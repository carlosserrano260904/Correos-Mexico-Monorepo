'use client'
import Link from 'next/link';
import React, { useState } from "react";
import { usePayments } from '@/hooks/usePayments';
import { useAuthStore } from '@/stores/useAuthStore';
import type { AddCardRequest, CardFormData } from '@/schemas/payments';
import { paymentsApiService } from '@/services/paymentsApi';

interface FormularioPagoTarjetaProps {
    onCardCreated?: (card: any) => void;
}

export default function FormularioPagoTarjeta({ onCardCreated }: FormularioPagoTarjetaProps){
    const [formData, setFormData] = useState({
        NombreTarjeta: '',
        NumeroTarjeta: '',
        FechaExpiracion: '',
        CodigoSeguridad: '',
    });

    // 🔐 Hooks para manejo de pagos y autenticación
    const { addCard, loading, validateCardForm } = usePayments();
    const { user } = useAuthStore();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<string[]>([]);
    
    const resetForm = () => setFormData({
        NombreTarjeta: '',
        NumeroTarjeta: '',
        FechaExpiracion: '',
        CodigoSeguridad: '',
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        
        if (!user?.id) {
            alert('Error: Usuario no autenticado');
            return;
        }

        // Limpiar errores previos
        setErrors([]);

        // Validar formulario
        const validation = validateCardForm(formData);
        if (!validation.isValid) {
            setErrors(validation.errors);
            return;
        }

        setIsSubmitting(true);
        
        try {
            console.log('💳 === PROCESANDO NUEVA TARJETA ===');
            console.log('📋 Datos del formulario:', {
                ...formData,
                NumeroTarjeta: `***${formData.NumeroTarjeta.slice(-4)}`,
                CodigoSeguridad: '***'
            });

            // NOTA: Para un flujo completo con Stripe, necesitarías:
            // 1. Crear token de Stripe con los datos de la tarjeta
            // 2. Enviar el token (no los datos directos) al backend
            
            // Por ahora, vamos a simular el proceso esperando que el backend maneje Stripe
            // TEMPORALMENTE - objeto vacío para ver qué espera el backend
            const cardRequest = {};

            console.log('🔄 Enviando solicitud al backend...');
            const result = await addCard(cardRequest);
            
            if (result.success && result.card) {
                console.log('✅ Tarjeta agregada exitosamente:', result.card);
                alert('Tarjeta agregada exitosamente');
                resetForm();
                
                // Llamar callback para actualizar la vista padre
                if (onCardCreated) {
                    onCardCreated(result.card);
                }
                
            } else {
                console.error('❌ Error agregando tarjeta:', result.error);
                setErrors([result.error || 'Error al agregar la tarjeta']);
            }
            
        } catch (error) {
            console.error('❌ Error inesperado:', error);
            setErrors(['Error inesperado al agregar la tarjeta']);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    Selecciona un método de pago
                </h2>
                <div className="border-b border-gray-200 pb-4">
                    <div className="flex items-center space-x-2 text-gray-700">
                        <div className="w-5 h-5 border-2 border-gray-400 rounded"></div>
                        <span className="text-sm">Añadir tarjeta</span>
                    </div>
                </div>
            </div>

            {/* Mostrar errores */}
            {errors.length > 0 && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                    <p className="font-semibold">Por favor corrige los siguientes errores:</p>
                    <ul className="mt-2 list-disc list-inside">
                        {errors.map((error, index) => (
                            <li key={index} className="text-sm">{error}</li>
                        ))}
                    </ul>
                </div>
            )}

            <form className="space-y-6">
                {/* Sección Datos de la Tarjeta */}
                <div>
                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <label htmlFor="NombreTarjeta" className="block text-sm font-medium text-gray-600 mb-2">
                                Nombre de la tarjeta*
                            </label>
                            <input 
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-colors bg-gray-50 hover:bg-white" 
                                type="text" 
                                name="NombreTarjeta" 
                                value={formData.NombreTarjeta} 
                                onChange={handleChange} 
                                placeholder="Nombre como aparece en la tarjeta" 
                                required 
                            />
                        </div>
                        
                        <div>
                            <label htmlFor="NumeroTarjeta" className="block text-sm font-medium text-gray-600 mb-2">
                                Número de tarjeta*
                            </label>
                            <input 
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-colors bg-gray-50 hover:bg-white" 
                                type="text" 
                                name="NumeroTarjeta" 
                                value={formData.NumeroTarjeta} 
                                onChange={handleChange} 
                                placeholder="1234 5678 9012 3456" 
                                required 
                            />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="FechaExpiracion" className="block text-sm font-medium text-gray-600 mb-2">
                                    Fecha de expirar*
                                </label>
                                <input 
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-colors bg-gray-50 hover:bg-white" 
                                    type="text" 
                                    name="FechaExpiracion" 
                                    value={formData.FechaExpiracion} 
                                    onChange={handleChange} 
                                    placeholder="MM/AA" 
                                    required 
                                />
                            </div>
                            
                            <div>
                                <label htmlFor="CodigoSeguridad" className="block text-sm font-medium text-gray-600 mb-2">
                                    Código seguridad*
                                </label>
                                <input 
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-colors bg-gray-50 hover:bg-white" 
                                    type="text" 
                                    name="CodigoSeguridad" 
                                    value={formData.CodigoSeguridad} 
                                    onChange={handleChange} 
                                    placeholder="CVV" 
                                    maxLength={4}
                                    required 
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Botón de Envío */}
                <div className="flex justify-center pt-6">
                    <div className="w-full max-w-md">
                        <button 
                            type="button"
                            onClick={handleSubmit} 
                            disabled={isSubmitting || loading}
                            className={`
                                w-full font-semibold py-4 px-8 rounded-xl shadow-lg transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-pink-300
                                ${isSubmitting || loading 
                                    ? 'bg-gray-400 cursor-not-allowed' 
                                    : 'bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white hover:shadow-xl transform hover:-translate-y-0.5'
                                }
                            `}
                        >
                            {isSubmitting || loading ? (
                                <div className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                                    Guardando tarjeta...
                                </div>
                            ) : (
                                'Guardar tarjeta'
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}