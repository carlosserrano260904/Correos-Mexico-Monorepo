'use client'
import Link from 'next/link';
import React, { useState } from "react";

export default function FormularioPagoTarjeta(){
    const [formData, setFormData] = useState({
        NombreTarjeta: '',
        NumeroTarjeta: '',
        FechaExpiracion: '',
        CodigoSeguridad: '',
    })
    
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

    const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        console.log(JSON.stringify(formData));
        resetForm()
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
                    <Link href="/confirmacion/" className="w-full max-w-md">
                        <button 
                            onClick={handleSubmit} 
                            className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-pink-300"
                        >
                            Guardar tarjeta
                        </button>
                    </Link>
                </div>
            </form>
        </div>
    )
}