import React from 'react';

export const HeroBanner: React.FC = () => {
  return (
    <div className="overflow-hidden">
      <img
        src="/banner.png"
        alt="Tenis"
        className="w-full max-w-6xl mx-auto object-contain z-10 relative rounded-2xl"
      />
    </div>
  );
};
