import React from "react";
import Image from "next/image";
import Link from "next/link";

const PromoComponent = () => {
  return (
    <div className="flex gap-4 p-4 justify-center">
      
      {/* Promo izquierda */}
      <Link 
        href={`/categories?category=${encodeURIComponent("Mujer")}`}
        className="basis-1/2 flex items-center justify-center cursor-pointer"
      >
        <Image
          src="/promo.png"
          alt="Green high heels"
          width={400}
          height={400}
          className="w-full h-auto transition-transform duration-300 hover:scale-105"
        />
      </Link>

      {/* Promo derecha */}
      <Link 
        href={`/categories?category=${encodeURIComponent("Hombre")}`}
        className="basis-1/2 flex items-center justify-center cursor-pointer"
      >
        <Image
          src="/promod.png"
          alt="Cute cartoon character"
          width={400}
          height={400}
          className="w-full h-auto transition-transform duration-300 hover:scale-105"
        />
      </Link>

    </div>
  );
};

export default PromoComponent;
