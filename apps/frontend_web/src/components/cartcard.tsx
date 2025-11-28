// components/cartcard.tsx
import React from 'react'
import { CartProductItem } from '@/components/cartProductItem'
import { Separator } from './ui/separator'

// Define la interfaz localmente si no existe en useCartStore
export interface CartItemProps {
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

export const CartCard = ({ className, items }: { className: string, items: CartItemProps[] }) => {
  // ✅ FILTRAR items undefined o null
  const validItems = items ? items.filter(item => 
    item && 
    item.ProductID && 
    item.ProductName && 
    typeof item.productPrice === 'number'
  ) : [];

  console.log('🛒 CartCard - validItems:', validItems); // Debug

  if (validItems.length === 0) {
    return (
      <div className={`w-full h-fit bg-[#F7F7F7] p-8 rounded-2xl text-center ${className}`}>
        <div className="text-6xl mb-4">🛒</div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Tu carrito está vacío</h3>
        <p className="text-gray-600 mb-4">Agrega algunos productos increíbles a tu carrito</p>
        <a 
          href="/" 
          className="inline-block bg-[#DE1484] text-white px-6 py-3 rounded-lg hover:bg-pink-700 transition-colors"
        >
          Continuar Comprando
        </a>
      </div>
    )
  }

  return (
    <div className={`w-full h-fit bg-[#F7F7F7] p-5 rounded-2xl ${className}`}>
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-900">Mi Carrito</h2>
        <p className="text-gray-600 text-sm">
          {validItems.length} {validItems.length === 1 ? 'producto' : 'productos'} en tu carrito
        </p>
      </div>
      
      <Separator className="mb-4"/>
      
      {validItems.map((item, idx) => (
        <div key={`${item.ProductID}-${idx}`}>
          <CartProductItem item={item} />
          {idx < validItems.length - 1 && <Separator className="my-4"/>}
        </div>
      ))}
    </div>
  )
}