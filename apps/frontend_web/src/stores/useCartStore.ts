import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { ProductosProps } from '../types/interface'

// Extendemos ItemCartProps para el carrito
export interface CartItemProps {
  ProductID: number;
  ProductImageUrl: string;
  ProductName: string;
  productPrice: number;
  prodcutQuantity: number;
  isSelected: boolean;
}

interface CartState {
  cartItems: CartItemProps[];
  appliedCupons: number[];
  shippingCost: number;
  
  // Insert
  addToCart: (product: ProductosProps, quantity?: number) => void;
  addMultipleToCart: (products: ProductosProps[]) => void;
  
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
}

export const useCartStore = create<CartState>()(
  devtools(
    persist(
      (set, get) => ({
        cartItems: [],
        appliedCupons: [],
        shippingCost: 0,
        
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
            ProductImageUrl: product.ProductImageUrl,
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
            ProductImageUrl: product.ProductImageUrl,
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
          shippingCost: state.shippingCost
        })
      }
    ),
    { name: 'CartStore' }
  )
)