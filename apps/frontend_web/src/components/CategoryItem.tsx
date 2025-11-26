import React, { useState } from "react";
import { CategoryItemProps } from "@/types/interface";

export const CategoryItem = ({ imageSrc, label }: CategoryItemProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="flex flex-col items-center p-6 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative mb-4">
        <div className={`
          w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden
          shadow-lg transition-all duration-500 ease-out
          ${isHovered ? 'scale-110 shadow-xl' : 'scale-100 shadow-md'}
        `}>
          {imageSrc ? (
            <img
              src={imageSrc}
              alt={label}
              className={`w-20 h-20 object-contain transition-all duration-500 ${
                isHovered ? 'scale-110' : 'scale-100'
              }`}
            />
          ) : null}
        </div>

        <div className={`absolute inset-0 rounded-full border-2 transition-all duration-300 ${
          isHovered ? 'border-pink-300 scale-105' : 'border-transparent scale-100'
        }`} />

        <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-pink-500 transition-all duration-300 ${
          isHovered ? 'opacity-100 scale-125' : 'opacity-0 scale-100'
        }`} />
      </div>

      <span className={`
        text-lg font-medium transition-all duration-300 text-center
        ${isHovered ? 'text-pink-600 scale-105 font-semibold' : 'text-gray-700 scale-100'}
      `}>
        {label}
      </span>
    </div>
  );
};