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
    <div className='min-h-screen bg-white rounded-xl px-10 py-3 pt-9 m-2'>
        {children}
      </div>
      <Footer/>

    </>
  );
};
