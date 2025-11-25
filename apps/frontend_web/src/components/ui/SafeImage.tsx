// components/ui/SafeImage.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';

const DEFAULT_PLACEHOLDER = 'https://via.placeholder.com/300x300/cccccc/969696?text=Imagen+No+Disponible';

export const SafeImage = ({ 
  src, 
  alt, 
  width = 300, 
  height = 300, 
  className = '',
}: {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
}) => {
  const [imgSrc, setImgSrc] = useState(() => {
    // Validar src inicial
    if (!src || src === '' || src === '""') {
      return DEFAULT_PLACEHOLDER;
    }
    return src;
  });

  const handleError = () => {
    setImgSrc(DEFAULT_PLACEHOLDER);
  };

  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={handleError}
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
    />
  );
};