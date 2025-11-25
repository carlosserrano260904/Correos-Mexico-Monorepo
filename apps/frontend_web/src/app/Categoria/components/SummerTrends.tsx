import React from 'react';

interface TrendItem {
  image: string;
  alt: string;
  description?: string;
}

const trends: TrendItem[] = [
  {
    image: '/vestidop.png',
    alt: 'Mujer con vestido de playa claro',
  },
  {
    image: '/sombrero.png',
    alt: 'Hombre con sombrero y toalla de colores',
  },
  {
    image: '/traje.png',
    alt: 'Mujer con traje de baño negro',
  },
];

const SummerTrends: React.FC = () => {
  return (
    <section className="w-full mx-auto py-10 text-center">
      <h2 className="text-2xl font-semibold mb-8">Tendencias de verano</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {trends.map((trend, index) => (
          <div key={index} className="overflow-hidden shadow-md">
            <img
              src={trend.image}
              alt={trend.alt}
              className="w-full object-cover"
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default SummerTrends;
