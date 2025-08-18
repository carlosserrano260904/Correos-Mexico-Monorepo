'use client';

import React from 'react';
import { useCart } from '@/hooks/useCart';
import { useResolvedImageUrl } from '@/hooks/useResolvedImageUrl';

interface CartProductItemProps {
  ProductID: number;
  ProductImageUrl: string | null;
  ProductName: string;
  productPrice: number;
  prodcutQuantity: number;
  isSelected: boolean;
}

export const CartProductItem = ({
  ProductID,
  ProductName,
  prodcutQuantity,
  productPrice,
  ProductImageUrl,
  isSelected,
}: CartProductItemProps) => {
  const { toggleSelection, updateQuantity, removeFromCart } = useCart();

  const handleCheckboxChange = () => toggleSelection(ProductID);
  const handleQuantityDecrease = () => updateQuantity(ProductID, prodcutQuantity - 1);
  const handleQuantityIncrease = () => updateQuantity(ProductID, prodcutQuantity + 1);
  const handleRemoveFromCart = () => removeFromCart(ProductID);

  const formattedPrice = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(productPrice);

  // Usamos el hook para obtener la URL final
  const imageSrc = useResolvedImageUrl(ProductImageUrl);

  return (
    <div className="flex items-center my-3">
      <div className="basis-1/12">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={handleCheckboxChange}
          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-1"
        />
      </div>
      <div className="basis-8/12 flex items-center">
        <div className="basis-1/4">
          <img src={imageSrc} alt="imagen de producto" className="rounded-2xl" />
        </div>
        <div className="basis-3/4 flex-col ms-5">
          <div className="font-semibold mb-2">{ProductName}</div>
          <button
            onClick={handleRemoveFromCart}
            className="bg-transparent text-[#DE1484] hover:underline"
          >
            Eliminar
          </button>
        </div>
      </div>
      <div className="basis-3/12 flex-col">
        <div className="text-center mb-3">{formattedPrice}</div>
        <div>
          <div className="flex items-center justify-center gap-3">
            <div className="flex items-center border border-gray-300 rounded-lg">
              <button
                onClick={handleQuantityDecrease}
                disabled={prodcutQuantity <= 1}
                className="px-3 py-1 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-l-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                –
              </button>
              <span className="px-4 py-1 text-gray-900 font-medium border-x border-gray-300">
                {prodcutQuantity}
              </span>
              <button
                onClick={handleQuantityIncrease}
                className="px-3 py-1 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-r-lg transition-colors"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
