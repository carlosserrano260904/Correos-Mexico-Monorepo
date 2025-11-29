// components/cartProductItem.tsx
import React from 'react'
import { CartItemProps } from './cartcard' // O desde donde lo importes
import { useCart } from '@/hooks/useCart'
import { SafeImage } from './ui/SafeImage'

interface CartProductItemProps {
  item: CartItemProps;
}

export const CartProductItem = ({ item }: CartProductItemProps) => {
  const { updateQuantity, removeFromCart } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(price);
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return;
    updateQuantity(item.ProductID, newQuantity);
  };

  const handleRemove = () => {
    removeFromCart(item.ProductID);
  };

  return (
    <div className="flex items-start gap-4 p-4 hover:bg-gray-50 rounded-lg transition-colors">
      {/* Imagen del producto */}
      <div className="flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden bg-white">
        <SafeImage
          src={item.ProductImageUrl}
          alt={item.ProductName}
          width={96}
          height={96}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Información del producto */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-900 text-lg mb-1">
          {item.ProductName}
        </h3>
        
        {item.selectedColor && (
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm text-gray-600">Color:</span>
            <div
              className="w-4 h-4 rounded-full border border-gray-300"
              style={{ backgroundColor: item.selectedColor }}
              title={item.selectedColor}
            />
          </div>
        )}

        {item.selectedSize && (
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm text-gray-600">Talla:</span>
            <span className="text-sm font-medium">{item.selectedSize}</span>
          </div>
        )}

        {/* Controles de cantidad y precio */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleQuantityChange(item.quantity - 1)}
              disabled={item.quantity <= 1}
              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              -
            </button>
            <span className="w-8 text-center font-medium">{item.quantity}</span>
            <button
              onClick={() => handleQuantityChange(item.quantity + 1)}
              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100"
            >
              +
            </button>
          </div>

          <div className="text-right">
            <div className="font-bold text-lg text-gray-900">
              {formatPrice(item.productPrice * item.quantity)}
            </div>
            <div className="text-sm text-gray-500">
              {formatPrice(item.productPrice)} c/u
            </div>
          </div>
        </div>
      </div>

      {/* Botón eliminar */}
      <button
        onClick={handleRemove}
        className="flex-shrink-0 text-gray-400 hover:text-red-500 transition-colors p-2"
        title="Eliminar producto"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  );
};