import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type { FrontendProduct } from '@/schemas/products'
import type { FrontendCartItem, FrontendCart } from '@/schemas/cart'
import { cartApiService } from '@/services/cartApi'

// Usar el tipo del schema de Zod
export type CartItemProps = FrontendCartItem;

interface CartState {
  cartItems: FrontendCartItem[];
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
  getCartItem: (productId: number) => FrontendCartItem | undefined;
  getSelectedItems: () => FrontendCartItem[];
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

        // Load cart from backend using new schema
        loadCart: async (profileId: number) => {
          set({ loading: true, error: null, currentProfileId: profileId });
          
          try {
            console.log(`🛒 Loading cart for profile ${profileId}`);
            const frontendCart = await cartApiService.getCart(profileId);
            
            console.log('✅ Cart loaded and mapped:', frontendCart);
            
            set({ 
              cartItems: frontendCart.items,
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
            
            // Add to cart via API (doesn't return item data)
            await cartApiService.addToCart(profileId, product.ProductID, quantity);
            
            // Reload cart to get updated data with full relations
            await get().loadCart(profileId);
            
            console.log('✅ Product added to cart and cart reloaded');
            
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
          const profileId = get().currentProfileId;
          
          if (!cartItem?.CartItemId) {
            set({ error: 'Cart item not found or missing backend ID' });
            return;
          }
          
          if (!profileId) {
            set({ error: 'Profile ID not available' });
            return;
          }
          
          set({ loading: true, error: null });
          
          try {
            console.log(`🛒 Updating quantity for item ${cartItem.CartItemId} to ${quantity}`);
            
            // Update quantity via API
            await cartApiService.updateQuantity(cartItem.CartItemId, quantity);
            
            // Reload cart to get updated data
            await get().loadCart(profileId);
            
            console.log('✅ Quantity updated and cart reloaded');
            
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
          const profileId = get().currentProfileId;
          
          if (!cartItem?.CartItemId) {
            set({ error: 'Cart item not found or missing backend ID' });
            return;
          }
          
          if (!profileId) {
            set({ error: 'Profile ID not available' });
            return;
          }
          
          set({ loading: true, error: null });
          
          try {
            console.log(`🛒 Removing item ${cartItem.CartItemId} from cart`);
            
            await cartApiService.removeFromCart(cartItem.CartItemId);
            
            // Reload cart to get updated data
            await get().loadCart(profileId);
            
            console.log('✅ Item removed and cart reloaded');
            
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
          
          const newItem: FrontendCartItem = {
            CartItemId: 0, // Temporary ID for local-only items
            ProductID: product.ProductID,
            ProductName: product.ProductName,
            ProductDescription: product.ProductDescription,
            productPrice: product.productPrice,
            ProductCategory: product.ProductCategory,
            ProductStock: product.ProductStock,
            Color: product.Color,
            ProductBrand: product.ProductBrand,
            ProductSlug: product.ProductSlug,
            ProductSellerName: product.ProductSellerName,
            ProductStatus: product.ProductStatus,
            ProductSold: product.ProductSold,
            ProductSKU: product.ProductSKU,
            prodcutQuantity: quantity,
            unitPrice: product.productPrice,
            isActive: true,
            ProductImageUrl: product.ProductImageUrl || '',
            ProductImages: product.ProductImages || [],
            isSelected: true
          };
          
          return {
            cartItems: [...state.cartItems, newItem]
          };
        }, false, 'addToCart'),
        
        addMultipleToCart: (products) => set((state) => {
          const newItems: FrontendCartItem[] = products.map(product => ({
            CartItemId: 0, // Temporary ID for local-only items
            ProductID: product.ProductID,
            ProductName: product.ProductName,
            ProductDescription: product.ProductDescription,
            productPrice: product.productPrice,
            ProductCategory: product.ProductCategory,
            ProductStock: product.ProductStock,
            Color: product.Color,
            ProductBrand: product.ProductBrand,
            ProductSlug: product.ProductSlug,
            ProductSellerName: product.ProductSellerName,
            ProductStatus: product.ProductStatus,
            ProductSold: product.ProductSold,
            ProductSKU: product.ProductSKU,
            prodcutQuantity: 1,
            unitPrice: product.productPrice,
            isActive: true,
            ProductImageUrl: product.ProductImageUrl || '',
            ProductImages: product.ProductImages || [],
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