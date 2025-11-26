import React from 'react';

interface Category {
  name: string;
  image: string;
}

const categories: Category[] = [
  { name: 'Mujer', image: '/mujer.png' },
  { name: 'Hombre', image: '/hombre.png' },
  { name: 'Niños', image: '/ninos.png' },
  { name: 'Bebés', image: '/bebes.png' },
];

const CategoryGrid: React.FC = () => {
  return (
    <section className="mx-auto px-4 py-10">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map((category) => (
          <div
            key={category.name}
            className="relative overflow-hidden shadow-sm group cursor-pointer"
          >
            <img
              src={category.image}
              alt={category.name}
              className="w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute bottom-0 w-full bg-black/40 text-white text-center py-2 text-sm font-medium">
              {category.name}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CategoryGrid;
