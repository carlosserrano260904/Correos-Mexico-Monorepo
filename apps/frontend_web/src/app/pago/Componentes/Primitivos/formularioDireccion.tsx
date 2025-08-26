import Link from 'next/link';
import React, { useState } from "react";
import { useAddress } from '@/hooks/useAddress';
import { useAuthStore } from '@/stores/useAuthStore';
import type { CreateAddressRequest } from '@/schemas/address';

interface FormularioAgregarDireccionProps {
    onAddressCreated?: (address: any) => void;
}

export default function FormularioAgregarDireccion({ onAddressCreated }: FormularioAgregarDireccionProps){
    const [formData, setFormData] = useState({
        Nombre:'',
        Apellido:'',
        Calle:'',
        Numero:'',
        CodigoPostal:'',
        Estado:'',
        Municipio:'',
        Ciudad:'',
        Colonia:'',
        NumeroDeTelefono:'',
        InstruccionesExtra:'',
    });

    // 🔐 Hooks para manejo de direcciones y autenticación
    const { createAddress, loading } = useAddress();
    const { user } = useAuthStore();
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const resetForm = () => setFormData({
        Nombre:'',
        Apellido:'',
        Calle:'',
        Numero:'',
        CodigoPostal:'',
        Estado:'',
        Municipio:'',
        Ciudad:'',
        Colonia:'',
        NumeroDeTelefono:'',
        InstruccionesExtra:'',
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

        // Validar campos requeridos
        if (!formData.Nombre || !formData.Calle || !formData.CodigoPostal || !formData.Estado || !formData.Municipio || !formData.Colonia || !formData.NumeroDeTelefono) {
            alert('Por favor, completa todos los campos obligatorios');
            return;
        }

        setIsSubmitting(true);
        
        try {
            // 🔄 Transformar datos del formulario al formato del backend
            const addressRequest: CreateAddressRequest = {
                nombre: formData.Nombre,
                calle: formData.Calle,
                colonia_fraccionamiento: formData.Colonia,
                numero_interior: formData.Numero ? parseInt(formData.Numero) : null,
                numero_exterior: formData.Numero ? parseInt(formData.Numero) : null,
                numero_celular: formData.NumeroDeTelefono,
                codigo_postal: formData.CodigoPostal,
                estado: formData.Estado,
                municipio: formData.Municipio,
                mas_info: formData.InstruccionesExtra || undefined,
                usuarioId: user.id,
            };

            console.log('🏠 Creando dirección:', addressRequest);

            // 📡 Crear dirección a través del hook
            const result = await createAddress(addressRequest);
            
            if (result.success) {
                console.log('✅ Dirección creada exitosamente:', result.address);
                alert('Dirección guardada exitosamente');
                resetForm();
                
                // Llamar callback para actualizar la vista padre
                if (onAddressCreated) {
                    onAddressCreated(result.address);
                }
                
                // Opcional: cerrar modal o navegar
                // window.location.reload(); // O usar router para navegar
                
            } else {
                console.error('❌ Error creando dirección:', result.error);
                alert(`Error al guardar la dirección: ${result.error}`);
            }
            
        } catch (error) {
            console.error('❌ Error inesperado:', error);
            alert('Error inesperado al guardar la dirección');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
            <form className="space-y-8">
                {/* Sección Datos Personales */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">
                        Datos Personales
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label htmlFor="Nombre" className="block text-sm font-medium text-gray-600 mb-2">
                                Nombre*
                            </label>
                            <input 
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-colors bg-gray-50 hover:bg-white" 
                                type="text" 
                                name="Nombre" 
                                value={formData.Nombre} 
                                onChange={handleChange} 
                                placeholder="Ingresa tu nombre" 
                                required 
                            />
                        </div>
                        
                        <div>
                            <label htmlFor="Apellido" className="block text-sm font-medium text-gray-600 mb-2">
                                Apellido*
                            </label>
                            <input 
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-colors bg-gray-50 hover:bg-white" 
                                type="text" 
                                name="Apellido" 
                                value={formData.Apellido} 
                                onChange={handleChange} 
                                placeholder="Ingresa tu apellido" 
                                required 
                            />
                        </div>
                        
                        <div>
                            <label htmlFor="NumeroDeTelefono" className="block text-sm font-medium text-gray-600 mb-2">
                                Teléfono móvil*
                            </label>
                            <input 
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-colors bg-gray-50 hover:bg-white" 
                                type="tel" 
                                name="NumeroDeTelefono" 
                                value={formData.NumeroDeTelefono} 
                                onChange={handleChange} 
                                placeholder="Ej: 618 123 4567" 
                                required 
                            />
                        </div>
                    </div>
                </div>

                {/* Sección Datos de Envío */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">
                        Datos de envío
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label htmlFor="Calle" className="block text-sm font-medium text-gray-600 mb-2">
                                Dirección*
                            </label>
                            <input 
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-colors bg-gray-50 hover:bg-white" 
                                type="text" 
                                name="Calle" 
                                value={formData.Calle} 
                                onChange={handleChange} 
                                placeholder="Calle y número" 
                                required 
                            />
                        </div>
                        
                        <div>
                            <label htmlFor="Ciudad" className="block text-sm font-medium text-gray-600 mb-2">
                                Ciudad*
                            </label>
                            <input 
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-colors bg-gray-50 hover:bg-white" 
                                type="text" 
                                name="Ciudad" 
                                value={formData.Ciudad} 
                                onChange={handleChange} 
                                placeholder="Tu ciudad" 
                                required 
                            />
                        </div>
                        
                        <div>
                            <label htmlFor="Estado" className="block text-sm font-medium text-gray-600 mb-2">
                                Estado*
                            </label>
                            <input 
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-colors bg-gray-50 hover:bg-white" 
                                type="text" 
                                name="Estado" 
                                value={formData.Estado} 
                                onChange={handleChange} 
                                placeholder="Tu estado" 
                                required 
                            />
                        </div>
                        
                        <div>
                            <label htmlFor="Colonia" className="block text-sm font-medium text-gray-600 mb-2">
                                Colonia*
                            </label>
                            <input 
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-colors bg-gray-50 hover:bg-white" 
                                type="text" 
                                name="Colonia" 
                                value={formData.Colonia} 
                                onChange={handleChange} 
                                placeholder="Tu colonia" 
                                required 
                            />
                        </div>
                        
                        <div>
                            <label htmlFor="Municipio" className="block text-sm font-medium text-gray-600 mb-2">
                                Municipio*
                            </label>
                            <input 
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-colors bg-gray-50 hover:bg-white" 
                                type="text" 
                                name="Municipio" 
                                value={formData.Municipio} 
                                onChange={handleChange} 
                                placeholder="Tu municipio" 
                                required 
                            />
                        </div>
                        
                        <div>
                            <label htmlFor="CodigoPostal" className="block text-sm font-medium text-gray-600 mb-2">
                                Código postal*
                            </label>
                            <input 
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-colors bg-gray-50 hover:bg-white" 
                                type="text" 
                                name="CodigoPostal" 
                                value={formData.CodigoPostal} 
                                onChange={handleChange} 
                                placeholder="Ej: 34000" 
                                required 
                            />
                        </div>
                    </div>
                </div>

                {/* Sección Más Información */}
                <div>
                    <label htmlFor="InstruccionesExtra" className="block text-sm font-medium text-gray-600 mb-2">
                        Más información
                    </label>
                    <textarea 
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-colors bg-gray-50 hover:bg-white resize-none"
                        name="InstruccionesExtra" 
                        value={formData.InstruccionesExtra} 
                        onChange={handleChange} 
                        placeholder="Instrucciones adicionales para la entrega (opcional)" 
                        rows={4}
                    />
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
                                    Guardando dirección...
                                </div>
                            ) : (
                                'Guardar dirección de entrega'
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}