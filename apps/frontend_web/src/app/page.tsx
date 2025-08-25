'use client'
import { CarrouselColection, CarrouselProducts } from '@/components/CarouselProducts'
import { Anuncios, Anuncios2, Anuncios3, Anuncios4, Anuncios5 } from '@/components/anuncios'
import { Boletin } from '@/components/boletin'

import Link from 'next/link'
import React from 'react'
import { Plantilla } from '@/components/plantilla'

import { CarouselDetalles } from '@/components/CarouselDetalles'
import { Comentario } from '@/components/Comentario'
import { useProducts } from '@/hooks/useProduct'
import Categories from '@/components/Categories'



const carouselItems = [
  {
    image: "https://merxstore.mx/cdn/shop/files/074732-R01.jpg?v=1686248236&width=1500",
    description: "El bordado, realizado completamente a mano, destaca flores de pétalos amplios en tonos vibrantes."
  },
  {
    image: "https://merxstore.mx/cdn/shop/files/076998E-R01.jpg?v=1696884033&width=800",
    description: "Confeccionada en tela de algodón ligera y fresca, de tono rojo profundo, esta blusa ofrece comodidad sin perder elegancia."
  },
  {
    image: "https://merxstore.mx/cdn/shop/files/076998E-R01.jpg?v=1696884033&width=400",
    description: "Los acabados a mano, con atención al detalle, garantizan una prenda única."
  },
  {
    image: "https://merxstore.mx/cdn/shop/files/076998E-R01.jpg?v=1696884033&width=600",
    description: "Diseño tradicional mexicano con técnicas ancestrales de bordado."
  },
  {
    image: "https://merxstore.mx/cdn/shop/files/076998E-R01.jpg?v=1696884033&width=700",
    description: "Perfecto para ocasiones especiales y uso casual elegante."
  },
  {
    image: "https://merxstore.mx/cdn/shop/files/076998E-R01.jpg?v=1696884033&width=900",
    description: "Materiales de alta calidad y acabados duraderos."
  },
  {
    image: "https://merxstore.mx/cdn/shop/files/076998E-R01.jpg?v=1696884033&width=1200",
    description: "Pieza única hecha por artesanos especializados."
  }
];

// Datos de ejemplo para comentarios
const comentariosEjemplo = [
  {
    imagen: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
    nombre: "Adriana García",
    calificacion: 5,
    puntaje: 5.0,
    fecha: "1 mes atrás",
    comentario: "Estoy muy feliz con mi blusa. El bordado es impresionante, cada puntada parece hecha con mucho cuidado y dedicación. Se nota que está elaborada por manos expertas. Lo que más me sorprendió fue la calidad de la tela es fresca, liviana y super cómoda. ideal para días calurosos. Ya la he lavado un par de veces y los colores siguen igual de vibrantes. La he combinado con jeans, con faldas, incluso con pantalones de vestir, y en todos los casos queda preciosa. Me encanta tener una prenda que refleje tanto la cultura y el arte de nuestras raíces. Totalmente recomendada."
  },
  {
    imagen: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    nombre: "Karen Domínguez",
    calificacion: 4,
    puntaje: 4.0,
    fecha: "3 meses atrás",
    comentario: "Detalles hermosos, pero el tallaje puede mejorar. La blusa es bellísima, el trabajo artesanal que tiene es digno de admiración. Los bordados están perfectamente simétricos y los colores son incluso más bonitos en persona que en las fotos. Sin embargo, debo decir que el tallaje fue un poco más pequeño de lo esperado. Normalmente uso talla M y esta me quedó un poco más ajustada en los hombros. La tela se siente mucha elasticidad, así que si buscas algo más holgado, tal vez sugerir pedir una talla más grande. Aun así, no la devolverían porque es preciosa, solo me gustaría que ofrecieran más guía de tallas más clara. Por todo lo demás, excelente compra!"
  }
];

export default function Home() {
  const { Products } = useProducts();

  return (
    <Plantilla>
      <div className=''>
        <Anuncios />
      </div>
      <Categories />
      <div className='my-3'>
        <Anuncios2 />
      </div>
      <CarrouselProducts entradas={Products} title='Mas vendido para ti en moda' className='pb-3' />
      <CarrouselColection entradas={Products} title='Nuevas Colecciones' className='' />

      <div className='my-3'>
        <Anuncios3 />
      </div>

      <CarrouselProducts entradas={Products} title='Relacionados con lo último que viste' />
      <CarrouselProducts entradas={Products} title='Pensados para ti en Joyería y Bisutería' />

      <div className='my-3'>
        <Anuncios4 />
      </div>

      <CarrouselProducts entradas={Products} title='Tu historial de productos' />

      <div className='my-3'>
        <Anuncios5 />
      </div>

      <div className='my-3'>
        <Boletin />
      </div>
    </Plantilla>
  );
}



