'use client';

import { ProductosProps } from '@/types';
import { Carousel, CarouselContent } from "./ui/carousel";
import { ColectionCard, ProductCard } from "./primitivos";
import { useProducts } from "@/hooks/useProduct";

interface Data {
  entradas: ProductosProps[];
  className?: string;
  title: string;
}

export const CarrouselProducts: React.FC<Data> = ({
  entradas,
  className = "",
  title
}) => {
  const { selectProduct } = useProducts();

  const handleProductClick = (productId: number): void => {
    selectProduct(productId);
  };

  return (
    <div className={`${className} my-6`}>
      <h2 className="text-2xl my-3 ms-10 font-bold">{title}</h2>
      <Carousel>
        <CarouselContent className="mx-4">
          {entradas.map((card: ProductosProps) => (
            <ProductCard
              key={card.ProductID}
              ProductColors={card.variants?.map((variant) => variant.valor) ?? []}
              ProductID={card.ProductID}
              ProductImage={card.ProductImageUrl}
              ProductName={card.ProductName}
              ProductPrice={card.productPrice}
              onClick={() => handleProductClick(card.ProductID)}
            />
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export const CarrouselColection: React.FC<Data> = ({
  entradas,
  className = "",
  title
}) => {
  const { selectProduct } = useProducts();

  const handleProductClick = (productId: number): void => {
    selectProduct(productId);
  };

  return (
    <div className={`${className} my-6`}>
      <h2 className="text-2xl my-3 ms-10 font-bold">{title}</h2>
      <Carousel>
        <CarouselContent className="mx-4">
          {entradas.map((card: ProductosProps) => (
            <ColectionCard
              key={card.ProductID}
              ProductID={card.ProductID}
              ProductImage={card.ProductImageUrl}
              ProductName={card.ProductName}
              onClick={() => handleProductClick(card.ProductID)}
            />
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};
