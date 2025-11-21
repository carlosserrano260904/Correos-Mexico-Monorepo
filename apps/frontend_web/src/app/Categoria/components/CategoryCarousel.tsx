'use client';

import React from 'react';

interface Category {
  name: string;
  image: string;
}

const categories: Category[] = [
  { name: 'Blusas', image: '/blusas.png' },
  { name: 'Pantalones', image: '/pantalones.png' },
  { name: 'Chamarras', image: '/chamarra.png' },
  { name: 'Vestidos', image: '/vestidos.png' },
  { name: 'Faldas y shorts', image: '/faldas.png' },
  { name: 'Tenis', image: '/tennis.png' },
  { name: 'Zapatos', image: '/zapatos.png' },
  { name: 'Accesorios', image: '/accesorios.png' },
  { name: 'Bolsos', image: '/bolsos.png' },
];

export const CategoryCarousel: React.FC = () => {
  return (
    <div className="flex gap-6 sm:gap-8 overflow-x-auto px-4 py-6 scrollbar-hide">
      {categories.map((cat) => (
        <div key={cat.name} className="flex-shrink-0 flex flex-col items-center text-base sm:text-lg font-semibold">
          <div className="w-22 h-22 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden shadow-md">
            <img src={cat.image} alt={cat.name} className="w-full h-full object-contain" />
          </div>
          <span className="mt-3 text-gray-700 text-center">{cat.name}</span>
        </div>
      ))}
    </div>
  );
};
