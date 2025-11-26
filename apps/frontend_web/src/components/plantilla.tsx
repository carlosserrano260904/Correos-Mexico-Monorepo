'use client'
import React from "react";
import { Navbar } from "./navbar";
import Categories from "./Categories"; // Ajusta ruta si es necesario
import   Footer   from "./footer";

export const Plantilla = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <>
    <Navbar/>
    <div className='min-h-screen bg-white rounded-xl 
                px-4 sm:px-6 md:px-8 lg:px-10
                py-3 pt-9 
                m-1 sm:m-2 md:m-3 lg:m-4'>


        {children}
      </div>
      <Footer/>

    </>
  );
};
