// components/CarrouselProducts.tsx
'use client';

import { useFeaturedProducts } from '@/hooks/useProduct';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "./ui/carousel";
import { ProductCard } from "./primitivos";

export const CarrouselProducts = () => {
  const { featuredProducts, loading, error } = useFeaturedProducts(8);

  if (loading) {
    return (
      <div className="my-8">
        <h2 className="text-2xl sm:text-3xl my-4 ms-4 sm:ms-12 font-bold text-gray-800">Productos Destacados</h2>
        <div className="flex gap-4 px-4 sm:px-12 overflow-x-auto">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="min-w-[200px] h-64 bg-gray-200 animate-pulse rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-8">
        <h2 className="text-2xl sm:text-3xl my-4 ms-4 sm:ms-12 font-bold text-gray-800">Productos Destacados</h2>
        <p className="text-red-500 text-center">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="my-8 relative">
      <h2 className="text-2xl sm:text-3xl my-4 ms-4 sm:ms-12 font-bold text-gray-800">Productos Destacados</h2>
      
      <Carousel
        opts={{
          align: "start",
          loop: true,
          dragFree: false,
          duration: 25,
        }}
        className="relative w-full"
      >
        {/* Botones adaptados a móvil */}
        <CarouselPrevious className="absolute left-1 sm:left-2 top-[45%] sm:top-1/2 -translate-y-1/2 z-20 bg-white/95 hover:bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 backdrop-blur-sm size-7 sm:size-10" />
        <CarouselNext className="absolute right-1 sm:right-2 top-[45%] sm:top-1/2 -translate-y-1/2 z-20 bg-white/95 hover:bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 backdrop-blur-sm size-7 sm:size-10" />
        
        <CarouselContent className="ml-0 py-4 sm:py-6">
          {featuredProducts.map((product, index) => (
            <CarouselItem 
              key={product.ProductID} 
              className="pl-3 sm:pl-6 basis-full xs:basis-2/3 sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
            >
              <div className="h-full">
                <ProductCard
                  ProductID={product.ProductID}
                  ProductName={product.ProductName}
                  ProductPrice={product.productPrice}
                  ProductImage={product.ProductImageUrl}
                  ProductColors={product.ProductColors}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};
