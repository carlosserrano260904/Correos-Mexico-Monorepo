// components/CarrouselProducts.tsx
'use client';

import { useFeaturedProducts } from '@/hooks/useProduct';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "./ui/carousel";
import { ProductCard } from "./primitivos"; // Asegúrate que esta ruta sea correcta

// Definimos la interfaz para las props si planeas usarlas después, 
// aunque por ahora el hook usa un límite interno.
interface CarrouselProductsProps {
  entradas?: any[]; 
  title?: string;
}

export const CarrouselProducts = ({ title = 'Productos Destacados' }: CarrouselProductsProps) => {
  // Pedimos 9 productos para tener suficientes para el scroll
  const { featuredProducts, loading, error } = useFeaturedProducts(9);

  // Skeleton de carga minimalista
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

  if (error) return null; // Si hay error, mejor no mostrar nada en esta sección

  return (
    // Agregamos 'group' al contenedor principal para que las flechas aparezcan al hacer hover
    <div className="my-12 relative w-full mx-auto px-4 sm:px-12 group">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">{title}</h2>
      
      <Carousel
        opts={{
          align: "start", // Alinea al inicio para que se vean 3 completos
          loop: true,
        }}
        className="w-full relative"
      >
        {/* FLECHAS MINIMALISTAS */}
        {/* Se posicionan fuera del contenido y son transparentes hasta el hover */}
        <CarouselPrevious 
          className="absolute -left-4 lg:-left-12 top-1/2 -translate-y-1/2 h-12 w-12 border-0 bg-transparent hover:bg-gray-100 text-gray-400 hover:text-black transition-all opacity-0 group-hover:opacity-100 z-20"
          variant="ghost"
        />
        <CarouselNext 
          className="absolute -right-4 lg:-right-12 top-1/2 -translate-y-1/2 h-12 w-12 border-0 bg-transparent hover:bg-gray-100 text-gray-400 hover:text-black transition-all opacity-0 group-hover:opacity-100 z-20"
          variant="ghost"
        />
        
        {/* Usamos -ml-4 y pl-4 para generar el espacio entre tarjetas (gap) */}
        <CarouselContent className="-ml-8">
          {featuredProducts.map((product) => (
            <CarouselItem 
              key={product.ProductID} 
              // AQUÍ ESTÁ LA CLAVE DEL LAYOUT:
              // pl-8: Crea el espacio entre tarjetas.
              // sm:basis-1/2: En tablets muestra 2.
              // lg:basis-1/3: En escritorio muestra EXACTAMENTE 3.
              className="pl-8 basis-full sm:basis-1/2 lg:basis-1/3"
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