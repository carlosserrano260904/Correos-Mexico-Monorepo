//apps\frontend_web\src\components\primitivos\ProductStory.tsx
'use client';

import React from 'react';
import { SafeImage } from '../ui/SafeImage';

interface ProductStoryProps {
  title: string;
  description: string;
  imageUrl: string;
  imageAlt?: string;
  reversed?: boolean;
}

export const ProductStory: React.FC<ProductStoryProps> = ({ 
  title, 
  description, 
  imageUrl, 
  imageAlt,
  reversed = false 
}) => {
  return (
    <div className="w-full bg-gradient-to-br from-gray-50 to-white rounded-2xl overflow-hidden">
      <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center ${
        reversed ? 'lg:grid-flow-dense' : ''
      }`}>
        {/* Contenedor de Texto */}
        <div className={`px-6 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-16 space-y-6 ${
          reversed ? 'lg:col-start-2' : ''
        }`}>
          {/* Título */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
            {title}
          </h2>
          
          {/* Descripción */}
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 text-base sm:text-lg leading-relaxed text-justify">
              {description}
            </p>
          </div>

          {/* Elemento decorativo */}
          <div className="flex items-center gap-3 pt-4">
            <div className="w-12 h-1 bg-gradient-to-r from-[#DE1484] to-pink-300 rounded-full"></div>
            <div className="w-8 h-1 bg-gradient-to-r from-pink-300 to-gray-200 rounded-full"></div>
            <div className="w-4 h-1 bg-gray-200 rounded-full"></div>
          </div>
        </div>

        {/* Contenedor de Imagen */}
        <div className={`relative group ${
          reversed ? 'lg:col-start-1 lg:row-start-1' : ''
        }`}>
          {/* Imagen Principal */}
          <div className="relative aspect-square lg:aspect-[4/5] rounded-2xl overflow-hidden">
            <SafeImage
              src={imageUrl}
              alt={imageAlt || title}
              width={800}
              height={1000}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            
            {/* Overlay gradiente sutil */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </div>

          {/* Elemento decorativo de fondo */}
          <div className="absolute -z-10 top-4 -right-4 w-full h-full bg-gradient-to-br from-[#DE1484]/10 to-pink-200/10 rounded-2xl blur-xl"></div>
        </div>
      </div>
    </div>
  );
};