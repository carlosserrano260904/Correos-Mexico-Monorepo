import React from "react";
import { CategoriesCarousel } from "./CategoriesCarousel";

const categories = [
  {
    imageSrc: "/ropa.png",
    label: "Ropa, moda y calzado",
  },
  {
    imageSrc: "/sillon2.png",
    label: "Hogar",
  },
  {
    imageSrc: "/anillos.png",
    label: "Joyería y Bisutería",
  },
  {
    imageSrc: "/bebida.png",
    label: "Alimentos y Bebidas",
  },
  {
    imageSrc: "/cosmeticos.png",
    label: "Belleza y Cuidado Personal",
  },
  {
    imageSrc: "/sarten.png",
    label: "Cocina",
  },
    {
    imageSrc: "planta.png",
    label: "Decoración para el Hogar",
  },
    {
    imageSrc: "libros.png",
    label: "Libros",
  },
    {
    imageSrc: "Elefante.png",
    label: "Juegos y Jueguetes", 
  },
    {
    imageSrc: "/muneca.png",
    label: "Artesanías Mexicanas",
  },
    {
    imageSrc: "voleto.png",
    label: "Filatelia Mexicana",
  },
    {
    imageSrc: "cosa.png",
    label: "FONART",
  },
    {
    imageSrc: "/monos.png",
    label: "Jovenes Constryendo El Futuro",
  },
    {
    imageSrc: "/Orgien.png",
    label: "SEDECO Michoacán",
  },
    {
    imageSrc: "/Tamaulipas.png",
    label: "Hecho en Tamaulipas",
  },
];

export default function CategoriesPage() {
  return <CategoriesCarousel categories={categories} />;
}
