import React from "react";
import Image from "next/image";

const PromoComponent = () => {
  return (
    <div className="flex gap-4 p-4 justify-center">
      <div className="basis-1/2 flex items-center justify-center">
        <Image
          src="/promo.png" 
          alt="Green high heels"
          width={400}
          height={400}
          className="w-full h-auto"
        />
      </div>

      <div className="basis-1/2 flex items-center justify-center">
        <Image
          src="/promod.png" 
          alt="Cute cartoon character"
          width={400}
          height={400}
          className="w-full h-auto" 
        />
      </div>
    </div>
  );
};

export default PromoComponent;
