import React from "react";
import Link from "next/link"

const Footer: React.FC = () => {
  return (
    <footer className="bg-white text-gray-700 text-sm mt-10 border-t pt-10 pb-5">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Logo y nombre */}
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <img src="/logoCorreos.png" alt="Logo de Correos" width={150} 
                    height={58}  />
          </div>
          <p className="text-xs">SERVICIO POSTAL MEXICANO</p>
        </div>

        {/* Mi cuenta */}
        <div>
          <h3 className="font-semibold mb-2">Mi cuenta</h3>
          <ul className="space-y-1">
            <li>Mi cuenta</li>
            <li>Órdenes</li>
            <li>Direcciones</li>
            <li>Carrito de compras</li>
            <li>Solicitar cuenta de vendedor</li>
          </ul>
        </div>

        {/* Servicio al cliente */}
        <div>
          <h3 className="font-semibold mb-2">Servicio al cliente</h3>
          <ul className="space-y-1">
            <li>Búsqueda</li>
            <li>Productos vistos</li>
            <li>Nuevos productos</li>
            <li>Oficinas postales</li>
            <li>SolucionesClic vendedor</li>
          </ul>
        </div>

        {/* Contacto */}
        <div>
          <h3 className="font-semibold mb-2">Contáctenos</h3>
          <p>Atención a clientes:</p>
          <p className="text-pink-600">@contactocc@correosdemexico.gob.mx</p>
          <p className="mt-2">Horarios de atención:</p>
          <p>De Lunes a Viernes de 9:00 hrs a 18:00 hrs</p>
          <p className="text-pink-600 mt-1">Atención solo en días hábiles</p>
        </div>
      </div>

      {/* Footer inferior */}
      <div className="max-w-6xl mx-auto px-4 mt-10 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 border-t pt-4">
        <p>©2025 Correos Clic. Todos los derechos reservados</p>
        <div className="flex space-x-4 mt-2 md:mt-0">
          <Link href="/terminos-condiciones">Términos y condiciones</Link>
          <a href="#">Mapa del sitio</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
