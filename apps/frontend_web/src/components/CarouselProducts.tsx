// components/CarrouselProducts.tsx
'use client';

import { useFeaturedProducts } from '@/hooks/useProduct';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "./ui/carousel";
import { ProductCard } from "./primitivos";
import { useEffect } from 'react';

interface CarrouselProductsProps {
  entradas?: any[];
  title?: string;
}

export const CarrouselProducts = ({ title = 'Productos Destacados' }: CarrouselProductsProps) => {
  const { featuredProducts, loading, error } = useFeaturedProducts(9);

  useEffect(() => {
    if (featuredProducts.length > 0) {
      console.log('🔍 PRODUCTOS EN CARRUSEL:', featuredProducts);
      featuredProducts.forEach((product, index) => {
        console.log(`${index + 1}. ${product.ProductName}:`, {
          imagen: product.ProductImageUrl,
          precio: product.productPrice,
          categoria: product.ProductCategory
        });
      });
    }
  }, [featuredProducts]);

  if (loading) {
    return (
      <div className="my-12 px-4 sm:px-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">{title}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="aspect-[3/4] w-full bg-gray-100 animate-pulse rounded-[24px]" />
          ))}
        </div>
      </div>
    );
  }

  if (error) return null;

  return (
    <div className="my-12 relative w-full mx-auto group">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">{title}</h2>

      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full relative"
      >
        <CarouselPrevious
          className="absolute -left-4 lg:-left-12 top-1/2 -translate-y-1/2 h-12 w-12 border-0 bg-transparent hover:bg-gray-100 text-gray-400 hover:text-black transition-all opacity-0 group-hover:opacity-100 z-20"
        />
        <CarouselNext
          className="absolute -right-4 lg:-right-12 top-1/2 -translate-y-1/2 h-12 w-12 border-0 bg-transparent hover:bg-gray-100 text-gray-400 hover:text-black transition-all opacity-0 group-hover:opacity-100 z-20"
        />

        <CarouselContent className="-ml-8">
          {featuredProducts.map((product) => (
            <CarouselItem
              key={product.ProductID}
              className="pl-8 basis-full sm:basis-1/2 lg:basis-1/3"
            >
              <ProductCard
                ProductID={product.ProductID}
                ProductName={product.ProductName}
                ProductPrice={product.productPrice}
                ProductImage={product.ProductImageUrl}
                ProductColors={product.ProductColors}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};
