"use client";
   import React from "react";
   import { useRouter } from "next/navigation";
   import { Plantilla } from '@/components/plantilla';
   import Link from "next/link";

   const BecomeSeller: React.FC = () => {
     const router = useRouter();

     return (
       <Plantilla>
         <div className="relative overflow-hidden bg-white">
           {/* Sección superior justo debajo del navbar */}
           <div className="w-full flex justify-between items-center px-6 py-4 bg-gray-50">
             <p className="text-gray-700 text-sm md:text-base">
               Disfruta los beneficios de vender en CorreosClick ¡A toda la república!
             </p>
             <button className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 px-5 rounded-full text-sm">
               Vender
             </button>
           </div>

           {/* Triángulos decorativos SVG - Aumenté opacidad y agregué z-index para visibilidad */}
           <svg className="absolute top-10 left-0 w-32 h-32 opacity-40 fill-pink-300 rotate-12 z-0" viewBox="0 0 100 100">
             <polygon points="0,0 100,0 50,100" />
           </svg>
           <svg className="absolute top-1/2 right-0 w-24 h-24 opacity-40 fill-pink-300 rotate-45 z-0" viewBox="0 0 100 100">
             <polygon points="0,0 100,0 50,100" />
           </svg>
           <svg className="absolute bottom-10 left-10 w-28 h-28 opacity-40 fill-pink-300 -rotate-12 z-0" viewBox="0 0 100 100">
             <polygon points="0,0 100,0 50,100" />
           </svg>

           {/* Sección principal */}
           <div className="relative z-10 max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
             {/* Lado Izquierdo: Texto */}
             <div className="space-y-6">
               <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                 Solicita ser vendedor y comienza a{" "}
                 <span className="text-pink-500">ganar dinero</span>
               </h1>
               <button
                 className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 px-6 rounded-full text-base"
                 onClick={() => router.push("/registro_vendedor")}
               >
                 Comenzar la solicitud
               </button>
               <Link href="/seguimiento_cuenta">
                 <p className="text-pink-600 underline text-gray-400 opacity-50">
                   Seguimiento de solicitud
                 </p>
               </Link>
               
               <p className="text-pink-600 font-semibold"><br/>Requisitos: </p>

               <p className="text-sm text-gray-600">
                 Verifica que tu publicación cumpla con nuestras{" "}
                 <a href="terminos-condiciones" className="text-pink-600 underline">
                   políticas de MexPost
                 </a>.
               </p>
             </div>

             {/* Lado Derecho: Imagen */}
             <div className="flex justify-center">
               <img
                 src="/solicitar.png"
                 alt="Entrega de paquete"
                 className="rounded-lg shadow-lg w-full max-w-sm"
               />
             </div>
           </div>
         </div>
       </Plantilla>
     );
   };

   export default BecomeSeller;