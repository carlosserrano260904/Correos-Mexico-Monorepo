'use client'
import { Plantilla } from "@/components/plantilla";
import React, { useState, useEffect } from "react";
import SumatoriaOrden from "../Componentes/Primitivos/sumatoriaOrden";
import AdressTable from "../Componentes/Primitivos/UserDirection";
import { Dialog, DialogContent, DialogTitle, DialogTrigger, } from "@/components/ui/dialog"
import FormularioAgregarDireccion from "../Componentes/Primitivos/formularioDireccion";
import { actualizarDireccionAPI, agregarDireccionAPI, eliminarDireccionAPI, obtenerDirecciones } from '@/api/direcciones';
import { UserAddressDeriveryProps } from "@/types/interface";
import { ResumenCompra } from '@/components/resumenCompra';
import { useCart } from '@/hooks/useCart'
import { CartCard } from '../../../components/cartcard'
import { DireccionesSchema } from '@/schemas/addresses';

// import { useMyAuth } from '../../../context/AuthContext'; este debe ser reemplazado cuando se agregue ya que no existe aun a fecha de 11/28/2025 para que funcione
    // const { userId } = useMyAuth();

import { useRouter } from "next/navigation";

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


export default function MasDirecciones() {
    const router = useRouter();
    const [direcciones, setDirecciones] = useState<any[]>([]);
    const [direccionSeleccionada, setDireccionSeleccionada] = useState<number | null>(null);
    const { items } = useCart();
    const userId = 102; // remplazo temporal hasta integrar el contexto de autenticación 

    

    useEffect(() => {
        async function cargar() {
            try {
                const resultado = await obtenerDirecciones(userId);
                const adaptadas = resultado.map(adaptarDireccion);
                setDirecciones(adaptadas);
            } catch (err) {
                console.error('Error cargando direcciones:', err);
                window.alert('Error: No se pudieron cargar las direcciones');
            }
        }

        cargar();
    }, [userId]);

    const handleSeleccionarDireccion = (id: number) => {
        setDireccionSeleccionada(id);
    };

    const confirmarSeleccion = async () => {
        if (direccionSeleccionada === null) {
            window.alert('Selecciona una dirección');
            return;
        }

        const direccion = direcciones.find(d => d.id === direccionSeleccionada);
        if (!direccion) {
            window.alert('Error: La dirección seleccionada no existe');
            return;
        }

        try {
            await localStorage.setItem('direccionSeleccionadaId', String(direccion.id));
            router.back();
        } catch (error) {
            console.error('Error al guardar dirección:', error);
            window.alert('Error: No se pudo guardar la dirección seleccionada');
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
                                onClick={confirmarSeleccion }
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
                    <ResumenCompra className='lg:basis-1/3 h-fit mt-2' />
                </div>
            </div>
            <CartCard className='lg:basis-2/3  ml-2' items={items}/>
        </Plantilla>
    )
}