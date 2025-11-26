'use client';

import { useState, useEffect } from 'react';
import Image, { ImageProps } from 'next/image';

const DEFAULT_PLACEHOLDER = 'https://via.placeholder.com/300x300/cccccc/969696?text=Imagen+No+Disponible';

// Usamos ImageProps para heredar TODAS las propiedades de next/image (incluyendo priority)
export const SafeImage = (props: ImageProps) => {
  const [imgSrc, setImgSrc] = useState<string | any>(() => {
    // Validar src inicial
    if (!props.src || props.src === '' || props.src === '""') {
      return DEFAULT_PLACEHOLDER;
    }
    return props.src;
  });

  // Si el src cambia desde fuera, actualizamos el estado
  useEffect(() => {
    if (!props.src || props.src === '' || props.src === '""') {
      setImgSrc(DEFAULT_PLACEHOLDER);
    } else {
      setImgSrc(props.src);
    }
  }, [props.src]);

  const handleError = () => {
    setImgSrc(DEFAULT_PLACEHOLDER);
  };

  return (
    <Image
      {...props} // Esto pasa priority, fill, sizes, etc. automáticamente
      src={imgSrc}
      onError={handleError}
      // Mantenemos tus defaults, pero permitimos sobreescribirlos si vienen en props
      placeholder={props.placeholder || "blur"}
      blurDataURL={props.blurDataURL || "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="}
    />
  );
};