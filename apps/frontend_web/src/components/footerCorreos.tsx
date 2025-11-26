import React from "react";

export default function Footer() {
  return (
    <footer className="w-full bg-gray-100 border-t mt-10 py-0">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-4 md:mb-0">
          <img  src="/logoCorreos.png" 
                alt="Logo de Correos" width={150} 
                height={40}  />
        </div>

        {/* Links */}
        <nav className="flex gap-6 text-m font-medium text-black-50 gap-12">
          <a href="/centro-de-ayuda" className="hover:text-black transition">Centro de Ayuda</a>
          <a href="/CorreosMX/cotizar" className="hover:text-black transition">Cotizar un envío</a>
          <a href="comentarios" className="hover:text-black transition mr-18">Comentarios</a>
        </nav>
      </div>
    </footer>
  );
}
