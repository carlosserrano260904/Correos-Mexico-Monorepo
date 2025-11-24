"use client";

import React from "react";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import {
Carousel,
CarouselContent,
CarouselItem,
} from "@/components/ui/carousel";

const CarruselLogin = () => {
const images = [
    "/imgen.jpg",
    "/imgen (1).jpg",
    "/imgen (2).jpg",
    "/image.jpeg",
];

return (
    <div className="hidden md:block md:w-1/2 relative">
    <Carousel
        opts={{ loop: true }}
        plugins={[Autoplay({ delay: 2000 })]} 
        className="w-full h-full"
    >
        <CarouselContent>
        {images.map((src, i) => (
            <CarouselItem key={i}>
            <div className="relative w-full h-[800px]">
                <Image
                src={src}
                alt={`Imagen ${i + 1}`}
                fill
                className="object-cover w-full h-full rounded-r-xl"
                />
            </div>
            </CarouselItem>
        ))}
        </CarouselContent>
    </Carousel>
    </div>
);
};

export default CarruselLogin;
