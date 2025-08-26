import React, { useState, useEffect } from "react";
import AdressTable from "./Primitivos/UserDirection";
import Link from 'next/link';
import { useDefaultAddress } from '@/hooks/useAddress';
import { useAuthStore } from '@/stores/useAuthStore';
import type { FrontendAddress } from '@/schemas/address';
import { UserAddressDeriveryProps } from "@/types/interface";

export default function DeliveryAdress() {
    // 🔐 Obtener usuario autenticado
    const { user } = useAuthStore();
    
    // 🏠 Hook para obtener dirección predeterminada
    const { 
        addresses, 
        loading, 
        error,
        defaultAddress,
        hasDefaultAddress,
        loadAddresses 
    } = useDefaultAddress();

    // 🔄 Cargar direcciones del usuario
    useEffect(() => {
        if (user?.id) {
            loadAddresses(user.id);
        }
    }, [user?.id]);

    // 🔄 Función para transformar FrontendAddress a UserAddressDeriveryProps
    const transformToUserAddressProps = (frontendAddress: FrontendAddress): UserAddressDeriveryProps => {
        return {
            Nombre: frontendAddress.AddressName,
            Apellido: user?.apellido || '', // Usar apellido del usuario autenticado
            Calle: frontendAddress.Street,
            Numero: frontendAddress.ExteriorNumber || frontendAddress.InteriorNumber || 0,
            CodigoPostal: frontendAddress.PostalCode,
            Estado: frontendAddress.State,
            Municipio: frontendAddress.Municipality,
            Ciudad: frontendAddress.Municipality,
            Colonia: frontendAddress.Neighborhood,
            NumeroDeTelefono: frontendAddress.PhoneNumber,
            InstruccionesExtra: frontendAddress.AdditionalInfo || '',
        };
    };

    // 🎯 Obtener datos para mostrar
    const addressToShow = defaultAddress ? transformToUserAddressProps(defaultAddress) : null;

    return (
        <div className="p-8 rounded-lg m-2 bg-[#f5f5f5]">
            <h1 className='font-semibold m-2'>Direccion de Envio</h1>
            
            {loading && (
                <div className="flex justify-center items-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-pink-500"></div>
                    <span className="ml-2 text-gray-600">Cargando dirección...</span>
                </div>
            )}

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    <p className="text-sm">Error al cargar la dirección: {error}</p>
                </div>
            )}

            {!loading && !error && !addressToShow && (
                <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
                    <p className="text-sm font-semibold">No tienes una dirección de entrega seleccionada</p>
                    <p className="text-sm">Por favor, selecciona una dirección para continuar con tu pedido.</p>
                </div>
            )}

            {!loading && !error && addressToShow && (
                <AdressTable {...addressToShow} />
            )}
        </div>
    )
}