'use client';

import React, { useState } from 'react';
import { useCart } from '@/hooks/useCart';
import { useFavorites } from '@/hooks/useFavorites';
import { SafeImage } from '../ui/SafeImage';
import { IoHeartOutline, IoHeartSharp } from "react-icons/io5";

interface ProductDetailsProps {
  product: {
    ProductID: number;
    ProductName: string;
    productPrice: number;
    ProductImageUrl: string;
    ProductColors: string[];
    ProductDescription: string;
    ProductCategory: string;
    ProductStock: number;
    // ProductSizes?: string[];  ← YA NO SE USA
  };
}

export const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => {

  // 🔥🔥🔥 TALLAS 100% FRONTEND 🔥🔥🔥
  const fallbackSizes = ["XS", "S", "M", "L", "XL"];
  const sizes = fallbackSizes;

  const [selectedColor, setSelectedColor] = useState<string>(product.ProductColors?.[0] || '#000');
  const [selectedSize, setSelectedSize] = useState<string>(sizes[0]);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  const { addToCart } = useCart();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();

  const isProductFavorite = isFavorite(product.ProductID);

  const formattedPrice = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(product.productPrice);

  // 🔥 Si tu backend trae varias imágenes, las jalas aquí
  const productImages = [
    product.ProductImageUrl,
    product.ProductImageUrl,
    product.ProductImageUrl,
    product.ProductImageUrl
  ];

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleToggleFavorite = () => {
    if (isProductFavorite) removeFromFavorites(product.ProductID);
    else addToFavorites(product);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-2 gap-10">

        {/* LEFT COLUMN */}
        <div className="flex gap-6">
          
          {/* Thumbs */}
          <div className="flex flex-col gap-3 overflow-y-auto max-h-[520px] pr-2">
            {productImages.map((image, index) => (
              <button
                key={index}
                onClick={() => setActiveImage(index)}
                className={`w-20 h-24 rounded-lg overflow-hidden border-2 ${
                  activeImage === index ? 'border-[#DE1484]' : 'border-gray-200'
                }`}
              >
                <SafeImage
                  src={image}
                  alt={`${product.ProductName} mini ${index}`}
                  width={120}
                  height={120}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>

          {/* Main image */}
          <div className="relative flex-1">
            <SafeImage
              src={productImages[activeImage]}
              alt={product.ProductName}
              width={600}
              height={600}
              className="rounded-xl w-full h-full object-cover bg-gray-100"
            />

            {/* Favorite btn */}
            <button
              onClick={handleToggleFavorite}
              className="absolute bottom-4 right-4 w-12 h-12 rounded-full bg-white shadow border border-gray-200 flex items-center justify-center hover:border-[#DE1484]"
            >
              {isProductFavorite ? (
                <IoHeartSharp className="w-6 h-6 text-[#DE1484]" />
              ) : (
                <IoHeartOutline className="w-6 h-6 text-gray-700" />
              )}
            </button>
          </div>

        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">

          {/* Title */}
          <h1 className="text-2xl font-semibold text-gray-800">
            {product.ProductName}
          </h1>

          {/* Price */}
          <p className="text-4xl font-bold text-gray-900">
            {formattedPrice}
          </p>

          {/* COLORS */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Colores disponibles</h3>

            <div className="flex gap-3">
              {product.ProductColors.map((color, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedColor(color)}
                  className={`w-8 h-8 rounded-full border-2 ${
                    selectedColor === color ? 'border-[#DE1484]' : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* TALLAS — SIEMPRE FRONTEND */}
          {product.ProductCategory === "Moda y Calzado" && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Talla</h3>

              <div className="flex gap-3">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-sm border 
                      ${
                        selectedSize === size
                          ? 'border-[#DE1484] text-[#DE1484] font-semibold'
                          : 'border-gray-300 text-gray-800'
                      }`}
                  >
                    {size}
                  </button>
                ))}
              </div>

              <button className="mt-3 text-[#DE1484] text-sm font-medium underline">
                Encontrar mi talla
              </button>
            </div>
          )}

          {/* Quantity */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Cantidad</h3>

            <div className="flex items-center gap-3 bg-gray-100 p-2 w-fit rounded-full">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 rounded-full border bg-white flex items-center justify-center"
              >
                -
              </button>

              <span className="w-8 text-center font-bold">{quantity}</span>

              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 rounded-full border bg-white flex items-center justify-center"
              >
                +
              </button>
            </div>
          </div>

          {/* Add to cart */}
          <button
            onClick={handleAddToCart}
            disabled={product.ProductStock === 0}
            className="w-full bg-[#DE1484] hover:bg-pink-700 text-white py-4 rounded-full font-semibold text-lg shadow transition"
          >
            Agregar al carrito
          </button>

        </div>

      </div>
    </div>
  );
};
