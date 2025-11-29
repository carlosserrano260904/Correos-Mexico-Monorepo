"use client";
import { Plantilla } from "@/components/plantilla";
import { CategoryCarousel } from "../Categoria/components/CategoryCarousel";
import { HeroBanner } from "../Categoria/components/HeroBanner";
import SummerTrends from "../Categoria/components/SummerTrends";
import CategoryGrid from "../Categoria/components/CategoryGrid";
import HeroVideoBanner from "../Categoria/components/HeroVideoBanner";
import { CarrouselProducts } from "@/components/CarouselProducts";
import { useProducts } from "@/hooks/useProduct";
import Promo from "../Categoria/components/promo";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function CategoriesPage() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const { products, loadProductsByCategory, loadProducts } = useProducts();

  useEffect(() => {
    if (category) {
      loadProductsByCategory(category);
    } else {
      loadProducts();
    }
  }, [category, loadProducts, loadProductsByCategory]);

  return (
    <Plantilla>
      <CategoryCarousel />
      <HeroBanner />
      <SummerTrends />
      <CarrouselProducts entradas={products} title="Tendencias de Verano" />
      <CategoryGrid />
      <Promo />
    </Plantilla>
  );
}
