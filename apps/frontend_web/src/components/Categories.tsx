import React from "react";
import { CategoriesCarousel } from "./CategoriesCarousel";

const categories = [
  {
    imageSrc: "/ropa.png",
    label: "Ropa",
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
    imageSrc: "",
    label: "Electronica",
  },
    {
    imageSrc: "",
    label: "Herramienta",
  },
    {
    imageSrc: "/muneca.png",
    label: "Artesanal",
  },
];

export default function CategoriesPage() {
  return <CategoriesCarousel categories={categories} />;
}
