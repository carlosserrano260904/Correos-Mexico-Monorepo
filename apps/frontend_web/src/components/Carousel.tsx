import React, { useRef } from "react";
import {
  CarouselProps,
  CarouselContentProps,
  CarouselItemProps,
  CarouselButtonProps,
} from "@/types/interface";

export const Carousel = ({ children, className = "" }: CarouselProps) => {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={ref}
      className={`overflow-x-auto whitespace-nowrap scroll-smooth relative ${className}`}
    >
      {children}
    </div>
  );
};

export const CarouselContent = ({ children, className = "" }: CarouselContentProps) => {
  return <div className={`inline-flex ${className}`}>{children}</div>;
};

export const CarouselItem = ({ children, className = "" }: CarouselItemProps) => {
  return <div className={`inline-block ${className}`}>{children}</div>;
};

export const CarouselNext = (props: CarouselButtonProps) => {
  return <button {...props}>›</button>;
};

export const CarouselPrevious = (props: CarouselButtonProps) => {
  return <button {...props}>‹</button>;
};
