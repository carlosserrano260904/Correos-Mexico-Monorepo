import React from "react";
import   Footer   from "./footer";

export const Plantilla = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <>
    
    <div className='min-h-screen bg-white rounded-xl px-10 py-3 pt-9 m-2'>
        {children}
      </div>
      <Footer/>

    </>
  );
};
