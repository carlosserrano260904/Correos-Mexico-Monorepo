// hooks/useCart.ts
'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  ProductID: number;
  ProductName: string;
  productPrice: number;
  ProductImageUrl: string;
  ProductColors: string[];
  ProductDescription?: string;
  ProductCategory?: string;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
  isSelected?: boolean;
}

interface CartStore {
  items: CartItem[];
  ShippingCost: number;
  AppliedCupons: number[];
  addToCart: (product: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getItemCount: (productId: number) => number;
  isInCart: (productId: number) => boolean;
  
  // Nuevas funciones para resumen de compra
  getSelectedItems: () => CartItem[];
  getSubtotal: () => number;
  getTotal: () => number;
  setShippingCost: (cost: number) => void;
  applyCupon: (cuponId: number) => void;
  removeCupon: (cuponId: number) => void;
  toggleItemSelection: (productId: number) => void;
  selectAllItems: () => void;
  unselectAllItems: () => void;
  
  // Función faltante para ProductCard
  getCartItem: (productId: number) => CartItem | undefined;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      ShippingCost: 0,
      AppliedCupons: [],
      
      addToCart: (product, quantity = 1) => {
        set((state) => {
          const existingItemIndex = state.items.findIndex(
            item => item.ProductID === product.ProductID
          );

          if (existingItemIndex >= 0) {
            const updatedItems = [...state.items];
            updatedItems[existingItemIndex].quantity += quantity;
            return { items: updatedItems };
          } else {
            const newItem: CartItem = {
              ...product,
              quantity,
              isSelected: true,
            };
            return { items: [...state.items, newItem] };
          }
        });
      },

      removeFromCart: (productId: number) => {
        set((state) => ({
          items: state.items.filter(item => item.ProductID !== productId),
          AppliedCupons: state.AppliedCupons.filter(id => id !== productId)
        }));
      },

      updateQuantity: (productId: number, quantity: number) => {
        if (quantity <= 0) {
          get().removeFromCart(productId);
          return;
        }

        set((state) => ({
          items: state.items.map(item =>
            item.ProductID === productId ? { ...item, quantity } : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [], AppliedCupons: [], ShippingCost: 0 });
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.productPrice * item.quantity,
          0
        );
      },

      getItemCount: (productId: number) => {
        const item = get().items.find(item => item.ProductID === productId);
        return item ? item.quantity : 0;
      },

      isInCart: (productId: number) => {
        return get().items.some(item => item.ProductID === productId);
      },

      // ✅ FUNCIÓN NUEVA - Para ProductCard
      getCartItem: (productId: number) => {
        return get().items.find(item => item.ProductID === productId);
      },

      getSelectedItems: () => {
        return get().items.filter(item => item.isSelected);
      },

      getSubtotal: () => {
        const selectedItems = get().getSelectedItems();
        return selectedItems.reduce(
          (total, item) => total + item.productPrice * item.quantity,
          0
        );
      },

      getTotal: () => {
        const subtotal = get().getSubtotal();
        const shipping = get().ShippingCost;
        return subtotal + shipping;
      },

      setShippingCost: (cost: number) => {
        set({ ShippingCost: cost });
      },

      applyCupon: (cuponId: number) => {
        set((state) => ({
          AppliedCupons: [...state.AppliedCupons, cuponId]
        }));
      },

      removeCupon: (cuponId: number) => {
        set((state) => ({
          AppliedCupons: state.AppliedCupons.filter(id => id !== cuponId)
        }));
      },

      toggleItemSelection: (productId: number) => {
        set((state) => ({
          items: state.items.map(item =>
            item.ProductID === productId 
              ? { ...item, isSelected: !item.isSelected }
              : item
          ),
        }));
      },

      selectAllItems: () => {
        set((state) => ({
          items: state.items.map(item => ({ ...item, isSelected: true })),
        }));
      },

      unselectAllItems: () => {
        set((state) => ({
          items: state.items.map(item => ({ ...item, isSelected: false })),
        }));
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);