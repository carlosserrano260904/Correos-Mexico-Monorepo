import Link from 'next/link';
import React, { useState } from "react";
import { actualizarDireccionAPI, agregarDireccionAPI, eliminarDireccionAPI, obtenerDirecciones } from '../../../../api/direcciones';

// import { useMyAuth } from '../../../context/AuthContext'; este debe ser reemplazado cuando se agregue ya que no existe aun a fecha de 11/28/2025 para que funcione
    // const { userId } = useMyAuth();

// TEMPORAL - hasta que exista login web

import { DireccionesSchema } from '../../../../schemas/addresses';

export interface Direccion {
    id?: number;
    nombre: string;
    telefono: string;
    direccion: string;
    numerointerior: number | null;
    numeroexterior: number | null;
    masInfo?: string;
    codigoPostal: string;
    municipio: string;
    colonia: string;
    estado: string;
}

interface ListaDireccionesProps {
    direcciones: Direccion[];
    onAgregarNueva: () => void;
    onEditar: (index: number) => void;
    onEliminar: (index: number) => void;
    navigation: any;
    direccionSeleccionada: number | null;
    setDireccionSeleccionada: (id: number) => void;
    modoSeleccion: boolean;
}

function adaptarDireccion(apiDir: typeof DireccionesSchema._type) {
    return {
        id: apiDir.id,
        Nombre: apiDir.nombre,
        Calle: apiDir.calle,
        NumeroInterior: apiDir.numero_interior ?? null,
        Numero: apiDir.numero_exterior ?? null,
        CodigoPostal: apiDir.codigo_postal,
        Estado: apiDir.estado,
        Municipio: apiDir.municipio,
        Colonia: apiDir.colonia_fraccionamiento,
        NumeroDeTelefono: String(apiDir.numero_celular),
        InstruccionesExtra: apiDir.mas_info ?? "",
    };
}

export default function FormularioAgregarDireccion(){
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
    })
    
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

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        const userId = 102; // ⚠️ temporal 

        try {
            await agregarDireccionAPI(formData, userId);
            alert("Dirección guardada correctamente");
        } catch (error) {
            console.error(error);
            alert("Error guardando dirección");
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
                    <Link href="/pago/" className="w-full max-w-md">
                        <button 
                            onClick={handleSubmit} 
                            className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-pink-300"
                        >
                            Guardar dirección de entrega
                        </button>
                    </Link>
                </div>
            </form>
        </div>
    )
}