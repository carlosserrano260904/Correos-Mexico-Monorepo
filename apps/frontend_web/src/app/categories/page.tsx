'use client'
import { Plantilla } from '@/components/plantilla';
import { CategoryCarousel } from '../Categoria/components/CategoryCarousel'; 
import { HeroBanner } from '../Categoria/components/HeroBanner'; 
import SummerTrends from '../Categoria/components/SummerTrends';
import CategoryGrid from '../Categoria/components/CategoryGrid';
import HeroVideoBanner from '../Categoria/components/HeroVideoBanner';
import { CarrouselProducts } from '@/components/CarouselProducts';
import { useProducts } from '@/hooks/useProduct'
import Promo from '../Categoria/components/promo';
import { useSearchParams } from 'next/navigation'


export default function Page() {
  const searchParams = useSearchParams()
  const category = searchParams.get('category')
  const { getProductsByCategory } = useProducts()
  const products = category ? getProductsByCategory(category) : []
  // const sampleProducts = [
  //   {
  //     ProductID: "1",
  //     ProductImageUrl: "/artesanal.png",
  //     ProductName: "Blusa casual",
  //     productPrice: 349,
  //     variants: [{ valor: "Rojo" }, { valor: "Azul" }]
  //   },
  //   {
  //     ProductID: "2",
  //     ProductImageUrl: "/artesanal.png",
  //     ProductName: "Pantalón de mezclilla",
  //     productPrice: 599,
  //     variants: [{ valor: "Negro" }, { valor: "Azul" }]
  //   },
  //   {
  //     ProductID: "3",
  //     ProductImageUrl: "/artesanal.png",
  //     ProductName: "Vestido largo",
  //     productPrice: 799,
  //     variants: [{ valor: "Verde" }, { valor: "Blanco" }]
  //   },
  //   {
  //     ProductID: "3",
  //     ProductImageUrl: "/artesanal.png",
  //     ProductName: "Vestido largo",
  //     productPrice: 799,
  //     variants: [{ valor: "Verde" }, { valor: "Blanco" }]
  //   },
  //   {
  //     ProductID: "3",
  //     ProductImageUrl: "/artesanal.png",
  //     ProductName: "Vestido largo",
  //     productPrice: 799,
  //     variants: [{ valor: "Verde" }, { valor: "Blanco" }]
  //   }
  // ];

  return (
    <Plantilla>
      <div className="max-w-6xl mx-auto px-4 py-6">
        <CategoryCarousel />
        <HeroBanner />
        <SummerTrends />
        <CarrouselProducts entradas={products} title='Tendencias de Verano' />
        
        <CarrouselProducts entradas={products} title='Tendencias de Verano'/>
        <CategoryGrid />
        <CarrouselProducts entradas={products} title='Tendencias de Verano'/>
        <Promo />

        <CarrouselProducts entradas={products} title='Tendencias de Verano'/>
        <HeroVideoBanner />
      </div>
    </Plantilla>
  );
}
