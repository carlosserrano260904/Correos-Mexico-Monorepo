import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "./ui/carousel";
import { CategoryItem } from "./CategoryItem";
import { CategoriesCarouselProps } from "@/types/interface";
import Link from "next/link";

export const CategoriesCarousel = ({ categories }: CategoriesCarouselProps) => {
  return (
    <div className="w-full mx-auto p-6">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
        Categorías
      </h2>

      <Carousel
        opts={{
          align: "start",
          loop: false,
        }}
        className="relative"
      >
        <CarouselContent className="mx-12 flex gap-x-2">
          {categories.map((cat, idx) => (
            <Link href={`./categories?category=${encodeURIComponent(cat.label)}`} key={idx}>
            <CarouselItem
              className="md:basis-1/6 lg:basis-1/6 flex-shrink-0"
            >
              <CategoryItem imageSrc={cat.imageSrc} label={cat.label} />
            </CarouselItem>
            </Link>
          ))}
        </CarouselContent>

        
      </Carousel>
    </div>
  );
};
