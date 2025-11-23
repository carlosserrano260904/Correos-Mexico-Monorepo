'use client';

import React, { useState } from 'react';
import { useCart } from '@/hooks/useCart';
import { useFavorites } from '@/hooks/useFavorites';
import { SafeImage } from '../ui/SafeImage';
import { IoHeartOutline, IoHeartSharp, IoBagOutline, IoStar, IoShieldCheckmark, IoRocket, IoReturnUpBack } from "react-icons/io5";

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
    ProductSizes?: string[];
    ProductBrand?: string;
  };
}

export const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => {
  const [selectedColor, setSelectedColor] = useState<string>(
    product.ProductColors?.[0] || '#000000'
  );
  const [selectedSize, setSelectedSize] = useState<string>(
    product.ProductSizes?.[0] || 'M'
  );
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  
  const { addToCart } = useCart();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  
  const isProductFavorite = isFavorite(product.ProductID);
  
  const formattedPrice = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(product.productPrice);

  const productImages = [
    product.ProductImageUrl,
    product.ProductImageUrl,
    product.ProductImageUrl,
  ];

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleToggleFavorite = () => {
    if (isProductFavorite) {
      removeFromFavorites(product.ProductID);
    } else {
      addToFavorites(product);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
          {/* Galería de imágenes - Compacta */}
          <div className="space-y-4">
            {/* Imagen principal */}
            <div className="aspect-square overflow-hidden rounded-xl bg-gray-100 group">
              <SafeImage
                src={productImages[activeImage]}
                alt={product.ProductName}
                width={600}
                height={600}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {/* Badge de stock */}
              <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold ${
                product.ProductStock > 0 
                  ? 'bg-green-500 text-white' 
                  : 'bg-red-500 text-white'
              }`}>
                {product.ProductStock > 0 ? 'En stock' : 'Agotado'}
              </div>
            </div>
            
            {/* Miniaturas */}
            <div className="grid grid-cols-3 gap-3">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(index)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                    activeImage === index 
                      ? 'border-[#DE1484]' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <SafeImage
                    src={image}
                    alt={`${product.ProductName} ${index + 1}`}
                    width={150}
                    height={150}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Información del producto - Compacta */}
          <div className="space-y-6">
            {/* Header */}
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                    {product.ProductName}
                  </h1>
                  
                  {/* Rating y categoría */}
                  <div className="flex items-center gap-4 mb-3">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <IoStar key={star} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                      <span className="text-sm text-gray-600 ml-1">4.8</span>
                    </div>
                    <span className="text-sm text-gray-500">•</span>
                    <span className="text-sm text-gray-500">{product.ProductCategory}</span>
                  </div>
                </div>
                
                {/* Botón favorito */}
                <button
                  onClick={handleToggleFavorite}
                  className="flex-shrink-0 w-10 h-10 bg-white border border-gray-200 rounded-lg flex items-center justify-center hover:border-[#DE1484] transition-colors"
                >
                  {isProductFavorite ? (
                    <IoHeartSharp className="w-5 h-5 text-[#DE1484]" />
                  ) : (
                    <IoHeartOutline className="w-5 h-5 text-gray-600" />
                  )}
                </button>
              </div>

              {/* Precio */}
              <div className="flex items-center gap-3">
                <p className="text-3xl font-bold text-[#DE1484]">
                  {formattedPrice}
                </p>
                {product.ProductStock > 0 && (
                  <div className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium">
                    ✓ Disponible
                  </div>
                )}
              </div>

              {/* Descripción */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Descripción</h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {product.ProductDescription || 'Producto de alta calidad con los mejores materiales.'}
                </p>
              </div>
            </div>

            {/* Selectores de personalización */}
            <div className="space-y-5">
              {/* Colores */}
              {product.ProductColors && product.ProductColors.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-gray-900">Color</h3>
                  <div className="flex gap-2">
                    {product.ProductColors.map((color, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedColor(color)}
                        className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                          selectedColor === color 
                            ? 'border-[#DE1484] ring-2 ring-pink-200' 
                            : 'border-white hover:border-gray-200'
                        }`}
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Tallas */}
              {product.ProductSizes && product.ProductSizes.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-gray-900">Talla</h3>
                  <div className="flex gap-2">
                    {product.ProductSizes.map((size, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedSize(size)}
                        className={`px-3 py-2 border rounded-lg text-sm font-medium transition-all duration-200 ${
                          selectedSize === size
                            ? 'border-[#DE1484] bg-[#DE1484] text-white'
                            : 'border-gray-300 text-gray-700 hover:border-gray-400'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Cantidad */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-900">Cantidad</h3>
                <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-2 w-fit">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    <span className="text-sm font-bold">-</span>
                  </button>
                  <span className="text-base font-bold text-gray-900 w-6 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 rounded bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    <span className="text-sm font-bold">+</span>
                  </button>
                </div>
              </div>

              {/* Botón principal */}
              <button
                onClick={handleAddToCart}
                disabled={product.ProductStock === 0}
                className="w-full bg-[#DE1484] hover:bg-pink-700 text-white py-3 px-6 rounded-lg font-semibold text-base transition-all duration-300 hover:shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 group relative overflow-hidden"
              >
                <div className='absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700'></div>
                <span className='relative flex items-center gap-2'>
                  <IoBagOutline className="w-5 h-5" />
                  Agregar al Carrito
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};