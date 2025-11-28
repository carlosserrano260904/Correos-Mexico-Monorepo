//'use client'
//import { CarrouselProducts } from '@/components/CarouselProducts'
import { Anuncios, Anuncios2, Anuncios3, Anuncios4, Anuncios5 } from '@/app/components/anuncios'
import { Boletin } from '@/app/components/boletin'
import React from 'react'
import { Plantilla } from '@/app/components/plantilla'
//import { useProducts } from '@/hooks/useProduct'
//import Categories from '@/components/Categories'


export default function Home() {
  //const { Products } = useProducts();

  return (
    <Plantilla>
      {/* Sección principal con espaciado responsive */}
      <div className='mb-4 sm:mb-6 md:mb-8'>
        <Anuncios />
      </div>
      
      {/* Categories con margen responsive */}
      {/*<div className='mb-4 sm:mb-6 md:mb-8'>
        <Categories />
      </div>*/}
      
      {/* Anuncios2 con espaciado adaptativo */}
      <div className='my-4 sm:my-6 md:my-8'>
        <Anuncios2 />
      </div>

      {/* Carrousel Products con padding responsive */}
      {/*<div className='py-4 sm:py-6 md:py-8'>
        <CarrouselProducts 
          entradas={Products} 
          title="Productos Destacados" 
        />
      </div>*/}

      {/* Anuncios3 con espaciado consistente */}
      <div className='my-4 sm:my-6 md:my-8'>
        <Anuncios3 />
      </div>

      {/* Grid de carrousels para móvil, stack en desktop */}
      {/*<div className='space-y-6 sm:space-y-8 md:space-y-10 lg:space-y-12'>
        <div className='py-4 sm:py-6 md:py-8'>
          <CarrouselProducts 
            entradas={Products} 
            title='Relacionados con lo último que viste' 
          />
        </div>
        
        <div className='py-4 sm:py-6 md:py-8'>
          <CarrouselProducts 
            entradas={Products} 
            title='Pensados para ti en Joyería y Bisutería' 
          />
        </div>
      </div>*/}

      {/* Anuncios4 con espaciado responsive */}
      <div className='my-4 sm:my-6 md:my-8 lg:my-10'>
        <Anuncios4 />
      </div>

      {/* Último carrousel con espaciado superior */}
      {/*<div className='pt-4 sm:pt-6 md:pt-8 pb-4 sm:pb-6 md:pb-8'>
        <CarrouselProducts 
          entradas={Products} 
          title='Tu historial de productos' 
        />
      </div>*/}

      {/* Anuncios5 con espaciado adaptativo */}
      <div className='my-4 sm:my-6 md:my-8 lg:my-10'>
        <Anuncios5 />
      </div>

      {/* Boletin final con padding generoso */}
      <div className='py-6 sm:py-8 md:py-10 lg:py-12'>
        <Boletin />
      </div>
    </Plantilla>
  );
}