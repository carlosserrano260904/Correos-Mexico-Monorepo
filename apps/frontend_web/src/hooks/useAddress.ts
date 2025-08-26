// src/hooks/useAddress.ts
'use client';

import React, { useEffect } from 'react';
import { useAddressStore, useAddressSelectors } from '@/stores/useAddressStore';
import type { FrontendAddress, CreateAddressRequest, UpdateAddressRequest } from '@/schemas/address';

/**
 * Hook principal para manejar direcciones
 * 
 * Usage:
 * const address = useAddress();
 * 
 * // Cargar direcciones
 * useEffect(() => {
 *   address.loadAddresses(userId);
 * }, [userId]);
 * 
 * // Crear dirección
 * await address.createAddress(newAddressData);
 * 
 * // Seleccionar dirección
 * address.selectAddress(addressId);
 */
export const useAddress = () => {
  const {
    // State
    addresses,
    selectedAddress,
    defaultAddressId,
    loading,
    error,
    currentUserId,
    
    // API actions
    loadUserAddresses,
    createAddress,
    updateAddress,
    deleteAddress,
    getAddressById,
    
    // Local actions
    selectAddress,
    setDefaultAddress,
    clearSelection,
    
    // Read operations
    getSelectedAddress,
    getDefaultAddress,
    getAddressesCount,
    hasAddresses,
    
    // Utilities
    clearError,
    refreshAddresses,
  } = useAddressStore();

  // Get computed selectors
  const selectors = useAddressSelectors();

  // Wrapper functions with error handling
  const handleCreateAddress = async (addressData: CreateAddressRequest) => {
    try {
      const newAddress = await createAddress(addressData);
      return { success: true, address: newAddress };
    } catch (error) {
      console.error('❌ Error in handleCreateAddress:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error al crear dirección' 
      };
    }
  };

  const handleUpdateAddress = async (addressId: number, addressData: UpdateAddressRequest) => {
    try {
      const updatedAddress = await updateAddress(addressId, addressData);
      return { success: true, address: updatedAddress };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error al actualizar dirección' 
      };
    }
  };

  const handleDeleteAddress = async (addressId: number) => {
    try {
      await deleteAddress(addressId);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error al eliminar dirección' 
      };
    }
  };

  const handleGetAddress = async (addressId: number) => {
    try {
      const address = await getAddressById(addressId);
      return { success: true, address };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error al obtener dirección' 
      };
    }
  };

  const handleLoadAddresses = async (userId: number) => {
    try {
      await loadUserAddresses(userId);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error al cargar direcciones' 
      };
    }
  };

  return {
    // State
    addresses,
    selectedAddress,
    defaultAddressId,
    loading,
    error,
    currentUserId,
    
    // API actions with error handling
    loadAddresses: handleLoadAddresses,
    createAddress: handleCreateAddress,
    updateAddress: handleUpdateAddress,
    deleteAddress: handleDeleteAddress,
    getAddress: handleGetAddress,
    
    // Local actions
    selectAddress,
    setDefaultAddress,
    clearSelection,
    
    // Read operations
    getSelectedAddress,
    getDefaultAddress,
    getAddressesCount,
    hasAddresses,
    
    // Computed selectors
    ...selectors,
    
    // Utilities
    clearError,
    refreshAddresses,
    
    // Helper functions
    isAddressSelected: (addressId: number) => selectedAddress?.AddressId === addressId,
    isDefaultAddress: (addressId: number) => defaultAddressId === addressId,
    canDeleteAddress: (addressId: number) => {
      // Can't delete if it's the only address or if it's being used in an order
      return addresses.length > 1 && defaultAddressId !== addressId;
    },
    
    // Validation helpers
    validateAddressData: (data: Partial<CreateAddressRequest>) => {
      const errors: string[] = [];
      
      if (!data.nombre?.trim()) errors.push('El nombre es obligatorio');
      if (!data.calle?.trim()) errors.push('La calle es obligatoria');
      if (!data.colonia_fraccionamiento?.trim()) errors.push('La colonia/fraccionamiento es obligatoria');
      if (!data.numero_celular?.trim()) errors.push('El número de celular es obligatorio');
      if (!data.codigo_postal?.trim()) errors.push('El código postal es obligatorio');
      if (!data.estado?.trim()) errors.push('El estado es obligatorio');
      if (!data.municipio?.trim()) errors.push('El municipio es obligatorio');
      
      if (data.codigo_postal && !/^\d{5}$/.test(data.codigo_postal)) {
        errors.push('El código postal debe tener 5 dígitos');
      }
      
      if (data.numero_celular && !/^[\+\-\s\d\(\)]{10,15}$/.test(data.numero_celular)) {
        errors.push('El formato del número de celular no es válido');
      }
      
      return {
        isValid: errors.length === 0,
        errors,
      };
    },
    
    // Status checks
    isLoading: () => loading,
    hasError: () => !!error,
    isEmpty: () => addresses.length === 0,
    isReady: () => !loading && currentUserId !== null,
  };
};

/**
 * Hook para componentes que requieren direcciones
 * Carga automáticamente las direcciones del usuario autenticado
 */
export const useUserAddresses = (userId?: number) => {
  const address = useAddress();
  
  useEffect(() => {
    if (userId && (!address.currentUserId || address.currentUserId !== userId)) {
      address.loadAddresses(userId);
    }
  }, [userId, address.currentUserId]);

  return address;
};

/**
 * Hook para seleccionar una dirección específica
 * Útil para formularios de checkout o edición
 */
export const useAddressSelection = (addressId?: number) => {
  const address = useAddress();
  
  useEffect(() => {
    if (addressId) {
      address.selectAddress(addressId);
    } else {
      address.clearSelection();
    }
    
    return () => {
      address.clearSelection();
    };
  }, [addressId]);

  return {
    ...address,
    isSelected: addressId ? address.isAddressSelected(addressId) : false,
  };
};

/**
 * Hook para manejar dirección por defecto
 * Útil para checkout y formularios de envío
 */
export const useDefaultAddress = () => {
  const address = useAddress();
  
  const setAsDefault = (addressId: number) => {
    address.setDefaultAddress(addressId);
    // También seleccionar como dirección activa
    address.selectAddress(addressId);
  };
  
  return {
    ...address,
    defaultAddress: address.getDefaultAddress(),
    setAsDefault,
    hasDefaultAddress: () => !!address.getDefaultAddress(),
  };
};

/**
 * Hook para búsqueda de direcciones
 * Incluye funcionalidad de filtrado en tiempo real
 */
export const useAddressSearch = (initialQuery: string = '') => {
  const address = useAddress();
  const [query, setQuery] = React.useState(initialQuery);
  
  const searchResults = React.useMemo(() => {
    if (!query.trim()) return address.addresses;
    return address.searchAddresses(query);
  }, [query, address.addresses]);
  
  return {
    query,
    setQuery,
    searchResults,
    resultCount: searchResults.length,
    hasResults: searchResults.length > 0,
    clearQuery: () => setQuery(''),
  };
};