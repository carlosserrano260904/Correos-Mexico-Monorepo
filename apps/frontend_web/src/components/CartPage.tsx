// components/CartPage.tsx
'use client';

import React from 'react';
import { useCart } from '@/hooks/useCart';
import { SafeImage } from '@/components/ui/SafeImage';
import { IoTrash, IoAdd, IoRemove, IoArrowBack, IoCart } from 'react-icons/io5';
import Link from 'next/link';

export const CartPage: React.FC = () => {
  const {
    items,
    updateQuantity,
    removeFromCart,
    clearCart,
    getTotalPrice,
    getTotalItems,
  } = useCart();

  const formattedPrice = (price: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(price);
  };

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateQuantity(productId, newQuantity);
  };

  const handleRemoveItem = (productId: number) => {
    removeFromCart(productId);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Carrito de Compras</h1>
          </div>

          {/* Carrito vacío */}
          <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <IoCart className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Tu carrito está vacío
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              ¡Descubre productos increíbles y agrégalos a tu carrito!
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-[#DE1484] hover:bg-pink-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              <IoArrowBack className="w-5 h-5" />
              Continuar Comprando
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Carrito de Compras</h1>
          <p className="text-gray-600 mt-2">
            Tienes {getTotalItems()} {getTotalItems() === 1 ? 'producto' : 'productos'} en tu carrito
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lista de productos */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={`${item.ProductID}-${item.selectedColor}`}
                className="bg-white rounded-2xl shadow-sm p-6"
              >
                <div className="flex gap-4">
                  {/* Imagen del producto */}
                  <div className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden bg-gray-100">
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
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {item.ProductName}
                        </h3>
                        <p className="text-[#DE1484] font-bold text-lg mb-2">
                          {formattedPrice(item.productPrice)}
                        </p>
                        
                        {/* Color seleccionado */}
                        {item.selectedColor && (
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm text-gray-600">Color:</span>
                            <div
                              className="w-4 h-4 rounded-full border border-gray-300"
                              style={{ backgroundColor: item.selectedColor }}
                            />
                          </div>
                        )}
                      </div>

                      {/* Botón eliminar */}
                      <button
                        onClick={() => handleRemoveItem(item.ProductID)}
                        className="text-gray-400 hover:text-red-500 transition-colors p-1"
                        title="Eliminar producto"
                      >
                        <IoTrash className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Controles de cantidad */}
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-2">
                        <button
                          onClick={() => handleQuantityChange(item.ProductID, item.quantity - 1)}
                          className="w-8 h-8 rounded bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50"
                          disabled={item.quantity <= 1}
                        >
                          <IoRemove className="w-4 h-4" />
                        </button>
                        <span className="text-base font-bold text-gray-900 w-8 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(item.ProductID, item.quantity + 1)}
                          className="w-8 h-8 rounded bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
                        >
                          <IoAdd className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">
                          {formattedPrice(item.productPrice * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Botón limpiar carrito */}
            <div className="flex justify-end">
              <button
                onClick={clearCart}
                className="text-red-500 hover:text-red-700 font-medium text-sm transition-colors"
              >
                Limpiar carrito
              </button>
            </div>
          </div>

          {/* Resumen del pedido */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Resumen del Pedido
              </h3>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({getTotalItems()} productos)</span>
                  <span>{formattedPrice(getTotalPrice())}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Envío</span>
                  <span className="text-green-600">Gratis</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Impuestos</span>
                  <span>{formattedPrice(getTotalPrice() * 0.16)}</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>Total</span>
                    <span>{formattedPrice(getTotalPrice() * 1.16)}</span>
                  </div>
                </div>
              </div>

              <button className="w-full bg-[#DE1484] hover:bg-pink-700 text-white py-4 px-6 rounded-lg font-semibold text-base transition-all duration-300 hover:shadow-lg mb-4">
                Proceder al Pago
              </button>

              <Link
                href="/"
                className="w-full border border-gray-300 text-gray-700 hover:bg-gray-50 py-3 px-6 rounded-lg font-semibold text-base transition-colors flex items-center justify-center gap-2"
              >
                <IoArrowBack className="w-5 h-5" />
                Continuar Comprando
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};