'use client'
import { Plantilla } from '@/components/plantilla';
import { CategoryCarousel } from './components/CategoryCarousel';
import { HeroBanner } from './components/HeroBanner';
import SummerTrends from './components/SummerTrends'; 
import  CategoryGrid  from './components/CategoryGrid';
import HeroVideoBanner from './components/HeroVideoBanner';
import  Promo  from './components/promo';
import { CarrouselProducts } from '@/components/CarouselProducts';
import { useProducts } from '@/hooks/useProduct';


export default function Page() {
  const {Products} = useProducts()   
  return (
    <Plantilla>
      <div className="max-w-6xl mx-auto px-4 py-6">
        <CategoryCarousel />
        <HeroBanner />
        <SummerTrends />
        <CarrouselProducts entradas={Products} title='Tendencias de verano' />
        <CarrouselProducts entradas={Products} title='Tendencias de verano' />
        <CategoryGrid />
        <CarrouselProducts entradas={Products} title='Tendencias de verano' />
        <Promo />
        <CarrouselProducts entradas={Products} title='Tendencias de verano' />
        <HeroVideoBanner />
      </div>
    </Plantilla>
  );
}
