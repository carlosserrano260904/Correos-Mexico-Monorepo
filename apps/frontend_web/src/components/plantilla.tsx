import React from "react";
import { Navbar } from "./navbar";
import Categories from "./Categories";
import Footer from "./footer";

export const Plantilla = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <>
      <Navbar />

      <div
        className="
          min-h-screen bg-white rounded-xl 
          m-1 px-3 py-2 pt-6     /* 📱 móviles: márgenes y padding más finos */
          
          sm:m-2 sm:px-6 sm:py-4 sm:pt-8   /* 📲 pantallas pequeñas */
          
          md:m-4 md:px-8 md:py-6 md:pt-10 /* 💻 pantallas medianas */
          
          lg:m-10 lg:px-24 lg:py-8 lg:pt-12 /* 🖥️ grandes */
        "
      >
        {children}
      </div>

      <Footer />
    </>
  );
};
