"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface NavbarCorreosProps {
  transparent?: boolean;
}

export const NavbarCorreos = ({ transparent = false }: NavbarCorreosProps) => {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`w-full ${
        transparent ? "bg-transparent absolute top-0 left-0 z-10" : "bg-white"
      }`}
    >
      <div className="flex items-center justify-between w-full px-4 py-3">
        
      
        <Link href="/CorreosMX">
          <Image
            src="/logoCorreos.png"
            alt="Logo de correos"
            width={100}
            height={38}
            className="cursor-pointer"
          />
        </Link>

        {/* BOTÓN HAMBURGUESA */}
        <button
          className="md:hidden text-black text-3xl mr-6"
          onClick={() => setOpen(!open)}
        >
          ☰
        </button>

        {/* LINKS - Desktop */}
        <div className="hidden md:flex items-center text-black gap-16 ml-auto">
          <Link href="/CorreosMX" className="hover:text-pink-500 font-medium transition-colors text-sm">
            Inicio
          </Link>
          <Link href="/" className="hover:text-pink-500 font-medium transition-colors text-sm">
            CorreosClic
          </Link>
          <Link href="/CorreosMX/ubicaciones" className="hover:text-pink-500 font-medium transition-colors text-sm">
            Ubicaciones y horarios
          </Link>
        </div>
      </div>

      {/* MENÚ MOBILE */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          open ? "max-h-64" : "max-h-0"
        }`}
      >
        <div className="flex flex-col bg-white px-4 pb-4 text-black gap-4">
          <Link href="/" className="hover:text-pink-500 font-medium">
            Inicio
          </Link>
          <Link href="/CorreosMX" className="hover:text-pink-500 font-medium">
            MEXPOSTS
          </Link>
          <Link href="/centro-de-ayuda" className="hover:text-pink-500 font-medium">
            Centro de ayuda
          </Link>
          <Link href="/CorreosMX/ubicaciones" className="hover:text-pink-500 font-medium">
            Ubicaciones y horarios
          </Link>
        </div>
      </div>
    </div>
  );
};
