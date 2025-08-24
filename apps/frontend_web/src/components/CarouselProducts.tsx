'use client'

import { ProductosProps } from '@/types' 
import { Carousel, CarouselContent } from "./ui/carousel"
import { ColectionCard, ProductCard } from "./primitivos"
import { useProducts } from "@/hooks/useProduct"

interface Data {entradas: ProductosProps[], className?: string, title: string}

export const CarrouselProducts = ({entradas, className, title}: Data) =>{
  // Usamos el hook personalizado
  const { selectProduct } = useProducts();

  // Función que maneja el clic en un producto
  const handleProductClick = (productId: number) => {
    selectProduct(productId);
    // Aquí el componente ProductCard debe navegar a /Producto/
    // La navegación se maneja dentro del componente ProductCard
  };

  return(
    <div className={`${className} my-6`}>
      <h2 className="text-2xl my-3 ms-10 font-bold">{title}</h2>
      <Carousel>
        <CarouselContent className="mx-4">
          {entradas.map((card) => (
              <ProductCard
                key={card.ProductID}
                ProductColors={card.Color ? [card.Color] : []}
                ProductID={card.ProductID}
                ProductImage={card.ProductImageUrl || 'https://via.placeholder.com/300x300?text=No+Image'}
                ProductName={card.ProductName}
                ProductPrice={card.productPrice}
                onClick={() => handleProductClick(card.ProductID)}
              />
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  )
}

export const CarrouselColection = ({entradas, className, title}: Data) =>{
  // Usamos el hook personalizado
  const { selectProduct } = useProducts();

  // Función que maneja el clic en un producto de colección
  const handleProductClick = (productId: number) => {
    selectProduct(productId);
    // La navegación se maneja dentro del componente ColectionCard
  };

  return(
    <div className={`${className} my-6`}>
      <h2 className="text-2xl my-3 ms-10 font-bold">{title}</h2>
      <Carousel>
        <CarouselContent className="mx-4">
          {entradas.map((card) => (
              <ColectionCard
                key={card.ProductID}
                ProductImage={card.ProductImageUrl || 'https://via.placeholder.com/300x300?text=No+Image'}
                ProductName={card.ProductName}
                onClick={() => handleProductClick(card.ProductID)}
              />
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  )
}