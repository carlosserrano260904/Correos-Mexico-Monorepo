// src/stores/useAddressStore.ts
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type { FrontendAddress, CreateAddressRequest, UpdateAddressRequest } from '@/schemas/address'
import { addressApiService } from '@/services/addressApi'

interface AddressState {
  addresses: FrontendAddress[];
  selectedAddress: FrontendAddress | null;
  defaultAddressId: number | null;
  loading: boolean;
  error: string | null;
  currentUserId: number | null;
  
  // API operations
  loadUserAddresses: (userId: number) => Promise<void>;
  createAddress: (addressData: CreateAddressRequest) => Promise<FrontendAddress>;
  updateAddress: (addressId: number, addressData: UpdateAddressRequest) => Promise<FrontendAddress>;
  deleteAddress: (addressId: number) => Promise<void>;
  getAddressById: (addressId: number) => Promise<FrontendAddress>;
  
  // Local operations
  selectAddress: (addressId: number) => void;
  setDefaultAddress: (addressId: number) => void;
  clearSelection: () => void;
  
  // Read operations
  getSelectedAddress: () => FrontendAddress | null;
  getDefaultAddress: () => FrontendAddress | null;
  getAddressesCount: () => number;
  hasAddresses: () => boolean;
  
  // Utilities
  clearError: () => void;
  refreshAddresses: () => Promise<void>;
}

export const useAddressStore = create<AddressState>()(
  devtools(
    persist(
      (set, get) => ({
        addresses: [],
        selectedAddress: null,
        defaultAddressId: null,
        loading: false,
        error: null,
        currentUserId: null,

        // Load user addresses from backend
        loadUserAddresses: async (userId: number) => {
          set({ loading: true, error: null, currentUserId: userId });
          
          try {
            console.log(`🏠 Loading addresses for user ${userId}`);
            const addresses = await addressApiService.getUserAddresses(userId);
            
            console.log('✅ Addresses loaded:', addresses);
            
            // If there's a default address stored, mark it
            const { defaultAddressId } = get();
            const updatedAddresses = addresses.map(address => ({
              ...address,
              isDefault: address.AddressId === defaultAddressId,
            }));
            
            set({ 
              addresses: updatedAddresses,
              loading: false,
              error: null,
            });
            
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error loading addresses';
            set({ 
              error: errorMessage,
              loading: false,
              addresses: [], // Clear addresses on error
            });
            console.error('Error loading addresses:', error);
          }
        },

        // Create new address
        createAddress: async (addressData: CreateAddressRequest) => {
          set({ loading: true, error: null });
          
          try {
            console.log(`🏠 Creating new address for user ${addressData.usuarioId}`);
            const newAddress = await addressApiService.createAddress(addressData);
            
            console.log('✅ Address created:', newAddress);
            
            // Add to local state
            set(state => ({ 
              addresses: [...state.addresses, newAddress],
              loading: false,
              error: null,
            }));
            
            // If this is the first address, make it default
            const { addresses } = get();
            if (addresses.length === 1) {
              get().setDefaultAddress(newAddress.AddressId);
            }
            
            return newAddress;
            
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error creating address';
            set({ 
              error: errorMessage,
              loading: false,
            });
            console.error('Error creating address:', error);
            throw error;
          }
        },

        // Update existing address
        updateAddress: async (addressId: number, addressData: UpdateAddressRequest) => {
          set({ loading: true, error: null });
          
          try {
            console.log(`🏠 Updating address ${addressId}`);
            const updatedAddress = await addressApiService.updateAddress(addressId, addressData);
            
            console.log('✅ Address updated:', updatedAddress);
            
            // Update in local state
            set(state => ({
              addresses: state.addresses.map(address =>
                address.AddressId === addressId ? updatedAddress : address
              ),
              selectedAddress: state.selectedAddress?.AddressId === addressId 
                ? updatedAddress 
                : state.selectedAddress,
              loading: false,
              error: null,
            }));
            
            return updatedAddress;
            
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error updating address';
            set({ 
              error: errorMessage,
              loading: false,
            });
            console.error('Error updating address:', error);
            throw error;
          }
        },

        // Delete address
        deleteAddress: async (addressId: number) => {
          set({ loading: true, error: null });
          
          try {
            console.log(`🏠 Deleting address ${addressId}`);
            await addressApiService.deleteAddress(addressId);
            
            console.log('✅ Address deleted');
            
            // Remove from local state
            set(state => {
              const newState = {
                addresses: state.addresses.filter(address => address.AddressId !== addressId),
                loading: false,
                error: null,
                // Clear selection if deleted address was selected
                selectedAddress: state.selectedAddress?.AddressId === addressId 
                  ? null 
                  : state.selectedAddress,
                // Clear default if deleted address was default
                defaultAddressId: state.defaultAddressId === addressId 
                  ? null 
                  : state.defaultAddressId,
              };
              
              // If we removed the default address and there are other addresses, 
              // make the first one default
              if (state.defaultAddressId === addressId && newState.addresses.length > 0) {
                newState.defaultAddressId = newState.addresses[0].AddressId;
                newState.addresses[0].isDefault = true;
              }
              
              return newState;
            });
            
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error deleting address';
            set({ 
              error: errorMessage,
              loading: false,
            });
            console.error('Error deleting address:', error);
            throw error;
          }
        },

        // Get address by ID (from API)
        getAddressById: async (addressId: number) => {
          set({ loading: true, error: null });
          
          try {
            console.log(`🏠 Getting address ${addressId}`);
            const address = await addressApiService.getAddressById(addressId);
            
            console.log('✅ Address retrieved:', address);
            
            set({ loading: false, error: null });
            return address;
            
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error getting address';
            set({ 
              error: errorMessage,
              loading: false,
            });
            console.error('Error getting address:', error);
            throw error;
          }
        },

        // Select address locally
        selectAddress: (addressId: number) => {
          set(state => {
            const address = state.addresses.find(addr => addr.AddressId === addressId);
            return {
              selectedAddress: address || null,
              addresses: state.addresses.map(addr => ({
                ...addr,
                isSelected: addr.AddressId === addressId,
              })),
            };
          });
        },

        // Set default address
        setDefaultAddress: (addressId: number) => {
          set(state => ({
            defaultAddressId: addressId,
            addresses: state.addresses.map(address => ({
              ...address,
              isDefault: address.AddressId === addressId,
            })),
          }));
        },

        // Clear selection
        clearSelection: () => {
          set(state => ({
            selectedAddress: null,
            addresses: state.addresses.map(address => ({
              ...address,
              isSelected: false,
            })),
          }));
        },

        // Get selected address
        getSelectedAddress: () => {
          return get().selectedAddress;
        },

        // Get default address
        getDefaultAddress: () => {
          const { addresses, defaultAddressId } = get();
          return addresses.find(address => address.AddressId === defaultAddressId) || null;
        },

        // Get addresses count
        getAddressesCount: () => {
          return get().addresses.length;
        },

        // Check if user has addresses
        hasAddresses: () => {
          return get().addresses.length > 0;
        },

        // Clear error
        clearError: () => {
          set({ error: null });
        },

        // Refresh addresses (reload from API)
        refreshAddresses: async () => {
          const { currentUserId } = get();
          if (currentUserId) {
            await get().loadUserAddresses(currentUserId);
          }
        },
      }),
      {
        name: 'address-storage',
        partialize: (state) => ({
          defaultAddressId: state.defaultAddressId,
          selectedAddress: state.selectedAddress,
        }),
      }
    ),
    { name: 'AddressStore' }
  )
);

// Export commonly used selectors
export const useAddressSelectors = () => {
  const store = useAddressStore();
  
  return {
    // Computed values
    selectedAddress: store.getSelectedAddress(),
    defaultAddress: store.getDefaultAddress(),
    addressesCount: store.getAddressesCount(),
    hasAddresses: store.hasAddresses(),
    
    // Filtered lists
    getAddressesByState: (state: string) => 
      store.addresses.filter(address => address.State.toLowerCase() === state.toLowerCase()),
    
    getAddressesByPostalCode: (postalCode: string) =>
      store.addresses.filter(address => address.PostalCode === postalCode),
    
    // Address search
    searchAddresses: (query: string) => {
      const lowerQuery = query.toLowerCase();
      return store.addresses.filter(address =>
        address.AddressName.toLowerCase().includes(lowerQuery) ||
        address.Street.toLowerCase().includes(lowerQuery) ||
        address.Neighborhood.toLowerCase().includes(lowerQuery) ||
        address.State.toLowerCase().includes(lowerQuery) ||
        address.Municipality.toLowerCase().includes(lowerQuery) ||
        (address.FullAddress && address.FullAddress.toLowerCase().includes(lowerQuery))
      );
    },
  };
};