'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useProductById, useProducts } from '@/hooks/useProduct';
import { ProductDetails } from '@/components/primitivos/ProductDetails';
import { ProductStory } from '@/components/primitivos/ProductStory';
import { Plantilla } from '@/components/plantilla';
import { CarrouselProducts } from '@/components/CarouselProducts';
import { ReviewsSection } from '@/components/ReviewsSection'; 
import { CarouselDetalles } from '@/components/CarouselDetalles';

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id as string;
  
  const { product, loading, error } = useProductById(productId);
  const { products } = useProducts();

  /* LOADING */
  if (loading) {
    return (
      <Plantilla>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            <div className="space-y-4">
              <div className="aspect-square bg-gray-200 animate-pulse rounded-2xl"></div>
              <div className="grid grid-cols-3 gap-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="aspect-square bg-gray-200 animate-pulse rounded-lg"></div>
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <div className="h-8 bg-gray-200 animate-pulse rounded w-3/4"></div>
              <div className="h-6 bg-gray-200 animate-pulse rounded w-1/4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 animate-pulse rounded"></div>
                <div className="h-4 bg-gray-200 animate-pulse rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 animate-pulse rounded w-4/6"></div>
              </div>
              <div className="h-12 bg-gray-200 animate-pulse rounded-xl"></div>
            </div>
          </div>
        </div>
      </Plantilla>
    );
  }

  /* ERROR O PRODUCTO NO ENCONTRADO */
  if (error || !product) {
    return (
      <Plantilla>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            {error ? 'Error' : 'Producto no encontrado'}
          </h2>
          <p className="text-gray-600">
            {error || 'El producto que buscas no existe.'}
          </p>
        </div>
      </Plantilla>
    );
  }

  /* TODO OK */
  return (
    <Plantilla>
      <div className="space-y-12 lg:space-y-16">
        {/* Detalles del Producto */}
        <ProductDetails product={product} />

        {/* Historia / Descripción */}
        <ProductStory
          title={product.ProductName}
          description={product.ProductDescription || 'Producto de alta calidad.'}
          imageUrl={product.ProductImageUrl}
          imageAlt={product.ProductName}
        />

        {/* Carousel Detalles */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <CarouselDetalles
            items={[
              { image: product.ProductImageUrl, description: product.ProductDescription },
              { image: product.ProductImageUrl, description: product.ProductDescription },
              { image: product.ProductImageUrl, description: product.ProductDescription },
              { image: product.ProductImageUrl, description: product.ProductDescription }
            ]}
            limit={3}
          />
        </div>

        {/* Sección de Reviews */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ReviewsSection 
            productId={productId}
            productName={product.ProductName}
          />
        </div>

        {/* Productos relacionados */}
        {products?.length > 0 && (
          <div className="mx-auto px-4 sm:px-6 lg:px-8">
            <CarrouselProducts
              entradas={products}
              title="Productos relacionados"
              className="mi-clase-personalizada"
            />
          </div>
        )}

        {/* También te puede interesar */}
        {products?.length > 0 && (
          <div className="mx-auto px-4 sm:px-6 lg:px-8">
            <CarrouselProducts
              entradas={products}
              title="También te puede interesar"
              className="mi-clase-personalizada"
            />
          </div>
        )}
      </div>
    </Plantilla>
  );
}