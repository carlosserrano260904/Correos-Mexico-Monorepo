'use client'
import { Plantilla } from "@/components/plantilla";
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import SumatoriaOrden from "../Componentes/Primitivos/sumatoriaOrden";
import AdressTable from "../Componentes/Primitivos/UserDirection";
import { Dialog, DialogContent, DialogTitle, DialogTrigger, } from "@/components/ui/dialog"
import FormularioAgregarDireccion from "../Componentes/Primitivos/formularioDireccion";
import { UserAddressDeriveryProps } from "@/types/interface";
import { useUserAddresses, useDefaultAddress } from "@/hooks/useAddress";
import { useAuthStore } from "@/stores/useAuthStore";
import type { FrontendAddress } from "@/schemas/address";



export default function MasDirecciones() {
    const [direccionSeleccionada, setDireccionSeleccionada] = useState<number | null>(null);
    const router = useRouter();
    
    // 🔐 Obtener usuario autenticado
    const { user } = useAuthStore();
    
    // 🏠 Hook para manejar direcciones con carga automática
    const { 
        addresses, 
        loading, 
        error, 
        selectAddress, 
        selectedAddress,
        setDefaultAddress,
        refreshAddresses,
        loadAddresses
    } = useUserAddresses(user?.id);

    // 🔄 Función para transformar FrontendAddress a UserAddressDeriveryProps
    const transformToUserAddressProps = (frontendAddress: FrontendAddress): UserAddressDeriveryProps => {
        return {
            Nombre: frontendAddress.AddressName,
            Apellido: '', // FrontendAddress no tiene apellido separado, usar del usuario
            Calle: frontendAddress.Street,
            Numero: frontendAddress.ExteriorNumber || frontendAddress.InteriorNumber || 0,
            CodigoPostal: frontendAddress.PostalCode,
            Estado: frontendAddress.State,
            Municipio: frontendAddress.Municipality,
            Ciudad: frontendAddress.Municipality, // En el schema, municipio sirve como ciudad
            Colonia: frontendAddress.Neighborhood,
            NumeroDeTelefono: frontendAddress.PhoneNumber,
            InstruccionesExtra: frontendAddress.AdditionalInfo || '',
        };
    };

    // 🎯 Preparar direcciones para el componente UI existente
    const direccionesParaUI = addresses.map(address => ({
        id: address.AddressId,
        ...transformToUserAddressProps(address)
    }));

    const handleSeleccionarDireccion = (id: number) => {
        setDireccionSeleccionada(id);
        // También actualizar el store interno
        selectAddress(id);
    };

    const handleConfirmarSeleccion = () => {
        console.log('🎯 === INICIANDO CONFIRMACIÓN DE SELECCIÓN ===');
        console.log('📍 direccionSeleccionada:', direccionSeleccionada);
        console.log('📦 Total addresses:', addresses.length);
        console.log('🔢 Router object:', router);
        
        if (direccionSeleccionada) {
            // Buscar la dirección real del backend
            const direccionBackend = addresses.find(addr => addr.AddressId === direccionSeleccionada);
            const direccionUI = direccionesParaUI.find(d => d.id === direccionSeleccionada);
            
            console.log('🏠 Dirección seleccionada (Backend):', direccionBackend);
            console.log('🏠 Dirección seleccionada (UI):', direccionUI);
            
            // Marcar como dirección por defecto
            if (direccionBackend) {
                try {
                    console.log('🔄 Procesando selección de dirección...');
                    setDefaultAddress(direccionBackend.AddressId);
                    console.log('✅ Dirección marcada como predeterminada:', direccionBackend.AddressName);
                    
                    // Redirigir inmediatamente sin alert que puede bloquear la navegación
                    console.log('🔄 Redirigiendo a la página de pago...');
                    
                    // Intentar múltiples métodos de navegación
                    try {
                        router.push('/pago');
                        console.log('✅ router.push() ejecutado');
                    } catch (routerError) {
                        console.error('❌ Error con router.push:', routerError);
                        // Fallback: usar window.location
                        console.log('🔄 Intentando con window.location...');
                        window.location.href = '/pago';
                    }
                    
                } catch (error) {
                    console.error('❌ Error al procesar la selección:', error);
                    alert('Error al seleccionar la dirección');
                }
            }
        }
    };

    // 🔄 Efecto para manejar datos del usuario (apellido)
    useEffect(() => {
        if (user && addresses.length > 0) {
            console.log('✅ Direcciones cargadas:', addresses);
            console.log('👤 Usuario:', user);
        }
    }, [user, addresses]);

    return (
        <Plantilla>
            <div id='mainPage' className='flex'>
                <div id='leftContent' className='w-3/4 bg-[#f5f5f5] rounded-lg m-2 p-4'>
                    <h2 className="text-xl font-semibold text-gray-800 mb-6">
                        Seleccionar dirección de entrega
                    </h2>

                    {/* Estado de carga */}
                    {loading && (
                        <div className="flex justify-center items-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
                            <span className="ml-3 text-gray-600">Cargando direcciones...</span>
                        </div>
                    )}

                    {/* Error */}
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                            <p className="font-semibold">Error al cargar direcciones:</p>
                            <p>{error}</p>
                            <button 
                                onClick={refreshAddresses}
                                className="mt-2 text-sm underline hover:no-underline"
                            >
                                Reintentar
                            </button>
                        </div>
                    )}

                    {/* Mensaje cuando no hay direcciones */}
                    {!loading && !error && direccionesParaUI.length === 0 && (
                        <div className="text-center py-8">
                            <div className="text-gray-500 mb-4">
                                <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No tienes direcciones guardadas</h3>
                            <p className="text-gray-500 mb-4">Agrega tu primera dirección de entrega para continuar con tu pedido.</p>
                        </div>
                    )}
                    
                    {/* Lista de direcciones seleccionables */}
                    {!loading && direccionesParaUI.length > 0 && (
                        <div className="space-y-4 mb-6">
                            {direccionesParaUI.map((direccion) => (
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
                    )}
                    
                    {/* Botón de confirmación */}
                    {direccionSeleccionada && (
                        <div className="flex justify-center mb-4">
                            <button
                                onClick={handleConfirmarSeleccion}
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
                                <FormularioAgregarDireccion 
                                    onAddressCreated={(newAddress) => {
                                        console.log('✅ Nueva dirección creada:', newAddress);
                                        refreshAddresses(); // Refrescar la lista
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