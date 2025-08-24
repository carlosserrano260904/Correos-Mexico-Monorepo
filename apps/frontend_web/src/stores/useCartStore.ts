import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type { FrontendProduct } from '@/schemas/products'
import { cartApiService, type BackendCartItem } from '@/services/cartApi'

// Cart item interface usando el nuevo schema
export interface CartItemProps {
  ProductID: number;
  ProductImageUrl: string;
  ProductName: string;
  productPrice: number;
  prodcutQuantity: number;
  isSelected: boolean;
  cartItemId?: number; // ID del registro en la tabla carrito del backend
}

interface CartState {
  cartItems: CartItemProps[];
  appliedCupons: number[];
  shippingCost: number;
  loading: boolean;
  error: string | null;
  currentProfileId: number | null;
  
  // Backend sync methods
  loadCart: (profileId: number) => Promise<void>;
  syncAddToCart: (product: FrontendProduct, profileId: number, quantity?: number) => Promise<void>;
  syncUpdateQuantity: (productId: number, quantity: number) => Promise<void>;
  syncRemoveFromCart: (productId: number) => Promise<void>;
  
  // Local-only methods (for offline use)
  addToCart: (product: FrontendProduct, quantity?: number) => void;
  addMultipleToCart: (products: FrontendProduct[]) => void;
  
  // Update
  updateQuantity: (productId: number, quantity: number) => void;
  toggleSelection: (productId: number) => void;
  selectAll: (selected: boolean) => void;
  
  // Delete
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
  removeSelected: () => void;
  
  // Read
  getCartItem: (productId: number) => CartItemProps | undefined;
  getSelectedItems: () => CartItemProps[];
  getTotalItems: () => number;
  getSubtotal: () => number;
  getTotal: () => number;
  
  // Cupons
  applyCupon: (cuponId: number) => void;
  removeCupon: (cuponId: number) => void;
  
  // Shipping
  setShippingCost: (cost: number) => void;
  
  // Error handling
  clearError: () => void;
}

export const useCartStore = create<CartState>()(
  devtools(
    persist(
      (set, get) => ({
        cartItems: [],
        appliedCupons: [],
        shippingCost: 0,
        loading: false,
        error: null,
        currentProfileId: null,

        // Helper function to map backend items to frontend format
        mapBackendItemToFrontend: (backendItem: BackendCartItem): CartItemProps => ({
          ProductID: backendItem.producto.id,
          ProductImageUrl: backendItem.producto.images?.[0]?.url || '',
          ProductName: backendItem.producto.nombre,
          productPrice: backendItem.producto.precio,
          prodcutQuantity: backendItem.cantidad,
          isSelected: true,
          cartItemId: backendItem.id,
        }),

        // Load cart from backend
        loadCart: async (profileId: number) => {
          set({ loading: true, error: null, currentProfileId: profileId });
          
          try {
            console.log(`🛒 Loading cart for profile ${profileId}`);
            const cartData = await cartApiService.getCart(profileId);
            
            const mappedItems = cartData.items.map((item) => 
              get().mapBackendItemToFrontend(item)
            );
            
            set({ 
              cartItems: mappedItems,
              loading: false,
              error: null,
            });
            
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error loading cart';
            set({ 
              error: errorMessage,
              loading: false,
              cartItems: [], // Clear cart on error
            });
            console.error('Error loading cart:', error);
          }
        },

        // Sync add to cart with backend
        syncAddToCart: async (product: FrontendProduct, profileId: number, quantity = 1) => {
          set({ loading: true, error: null });
          
          try {
            console.log(`🛒 Adding product ${product.ProductID} to cart for profile ${profileId}`);
            
            await cartApiService.addToCart({
              profileId,
              productId: product.ProductID,
              cantidad: quantity,
            });
            
            // Reload cart to get updated data
            await get().loadCart(profileId);
            
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error adding to cart';
            set({ 
              error: errorMessage,
              loading: false,
            });
            console.error('Error adding to cart:', error);
          }
        },

        // Sync update quantity with backend
        syncUpdateQuantity: async (productId: number, quantity: number) => {
          const cartItem = get().cartItems.find(item => item.ProductID === productId);
          
          if (!cartItem?.cartItemId) {
            set({ error: 'Cart item not found or missing backend ID' });
            return;
          }
          
          set({ loading: true, error: null });
          
          try {
            console.log(`🛒 Updating quantity for item ${cartItem.cartItemId} to ${quantity}`);
            
            await cartApiService.updateQuantity(cartItem.cartItemId, { cantidad: quantity });
            
            // Update locally for immediate feedback
            set(state => ({
              cartItems: state.cartItems.map(item =>
                item.ProductID === productId 
                  ? { ...item, prodcutQuantity: Math.max(1, quantity) }
                  : item
              ),
              loading: false,
            }));
            
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error updating quantity';
            set({ 
              error: errorMessage,
              loading: false,
            });
            console.error('Error updating quantity:', error);
          }
        },

        // Sync remove from cart with backend
        syncRemoveFromCart: async (productId: number) => {
          const cartItem = get().cartItems.find(item => item.ProductID === productId);
          
          if (!cartItem?.cartItemId) {
            set({ error: 'Cart item not found or missing backend ID' });
            return;
          }
          
          set({ loading: true, error: null });
          
          try {
            console.log(`🛒 Removing item ${cartItem.cartItemId} from cart`);
            
            await cartApiService.removeFromCart(cartItem.cartItemId);
            
            // Update locally for immediate feedback
            set(state => ({
              cartItems: state.cartItems.filter(item => item.ProductID !== productId),
              loading: false,
            }));
            
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error removing from cart';
            set({ 
              error: errorMessage,
              loading: false,
            });
            console.error('Error removing from cart:', error);
          }
        },

        clearError: () => set({ error: null }),
        
        addToCart: (product, quantity = 1) => set((state) => {
          const existingItem = state.cartItems.find(item => item.ProductID === product.ProductID);
          
          if (existingItem) {
            return {
              cartItems: state.cartItems.map(item =>
                item.ProductID === product.ProductID 
                  ? { ...item, prodcutQuantity: item.prodcutQuantity + quantity }
                  : item
              )
            };
          }
          
          const newItem: CartItemProps = {
            ProductID: product.ProductID,
            ProductImageUrl: product.ProductImageUrl || '',
            ProductName: product.ProductName,
            productPrice: product.productPrice,
            prodcutQuantity: quantity,
            isSelected: true
          };
          
          return {
            cartItems: [...state.cartItems, newItem]
          };
        }, false, 'addToCart'),
        
        addMultipleToCart: (products) => set((state) => {
          const newItems: CartItemProps[] = products.map(product => ({
            ProductID: product.ProductID,
            ProductImageUrl: product.ProductImageUrl || '',
            ProductName: product.ProductName,
            productPrice: product.productPrice,
            prodcutQuantity: 1,
            isSelected: true
          }));
          
          return {
            cartItems: [...state.cartItems, ...newItems]
          };
        }, false, 'addMultipleToCart'),
        
        updateQuantity: (productId, quantity) => set((state) => ({
          cartItems: state.cartItems.map(item =>
            item.ProductID === productId 
              ? { ...item, prodcutQuantity: Math.max(1, quantity) }
              : item
          )
        }), false, 'updateQuantity'),
        
        toggleSelection: (productId) => set((state) => ({
          cartItems: state.cartItems.map(item =>
            item.ProductID === productId 
              ? { ...item, isSelected: !item.isSelected }
              : item
          )
        }), false, 'toggleSelection'),
        
        selectAll: (selected) => set((state) => ({
          cartItems: state.cartItems.map(item => ({ ...item, isSelected: selected }))
        }), false, 'selectAll'),
        
        removeFromCart: (productId) => set((state) => ({
          cartItems: state.cartItems.filter(item => item.ProductID !== productId)
        }), false, 'removeFromCart'),
        
        clearCart: () => set(() => ({
          cartItems: [],
          appliedCupons: []
        }), false, 'clearCart'),
        
        removeSelected: () => set((state) => ({
          cartItems: state.cartItems.filter(item => !item.isSelected)
        }), false, 'removeSelected'),
        
        getCartItem: (productId) => get().cartItems.find(item => item.ProductID === productId),
        
        getSelectedItems: () => get().cartItems.filter(item => item.isSelected),
        
        getTotalItems: () => get().cartItems.reduce((total, item) => total + item.prodcutQuantity, 0),
        
        getSubtotal: () => get().cartItems
          .filter(item => item.isSelected)
          .reduce((total, item) => total + (item.productPrice * item.prodcutQuantity), 0),
        
        getTotal: () => {
          const subtotal = get().getSubtotal();
          const shipping = get().shippingCost;
          // Aquí puedes agregar lógica para descuentos de cupones
          return subtotal + shipping;
        },
        
        applyCupon: (cuponId) => set((state) => ({
          appliedCupons: [...state.appliedCupons, cuponId]
        }), false, 'applyCupon'),
        
        removeCupon: (cuponId) => set((state) => ({
          appliedCupons: state.appliedCupons.filter(id => id !== cuponId)
        }), false, 'removeCupon'),
        
        setShippingCost: (cost) => set(() => ({
          shippingCost: cost
        }), false, 'setShippingCost')
      }),
      {
        name: 'cart-storage',
        partialize: (state) => ({
          cartItems: state.cartItems,
          appliedCupons: state.appliedCupons,
          shippingCost: state.shippingCost,
          currentProfileId: state.currentProfileId,
        })
      }
    ),
    { name: 'CartStore' }
  )
)