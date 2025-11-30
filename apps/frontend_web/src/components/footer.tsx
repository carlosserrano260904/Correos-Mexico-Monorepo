import React from "react";
import Link from "next/link";
import Image from "next/image";

// Rutas simplificadas para que coincidan con el diseño
const ROUTES = {
  account: {
    profile: "/Perfil",                 // Mi perfil
    orders: "/historial-de-compras",    // Órdenes
    sellerRequest: "/registro_vendedor" // Solicitar cuenta de vendedor
  },
  customerService: {
    newProducts: "/nuevos-productos",   // Nuevos productos
    terms: "/terminos-condiciones",     // Términos y condiciones
    mexpost: "/CorreosMX"               // MEXPOST
  }
};

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#f6f6f6] text-gray-800 text-sm">
      <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Logo */}
        <div className="flex items-start">
          <Image
            src="/logoCorreos.png"
            alt="Logo de Correos"
            width={170}
            height={60}
          />
        </div>

        {/* Mi cuenta */}
        <div>
          <h3 className="font-semibold mb-3">Mi cuenta</h3>
          <ul className="space-y-2">
            <li>
              <Link
                href={ROUTES.account.profile}
                className="hover:text-pink-600 transition-colors"
              >
                Mi perfil
              </Link>
            </li>
            <li>
              <Link
                href={ROUTES.account.orders}
                className="hover:text-pink-600 transition-colors"
              >
                Órdenes
              </Link>
            </li>
            <li>
              <Link
                href={ROUTES.account.sellerRequest}
                className="hover:text-pink-600 transition-colors"
              >
                Solicitar cuenta de vendedor
              </Link>
            </li>
          </ul>
        </div>

        {/* Servicio al cliente */}
        <div>
          <h3 className="font-semibold mb-3">Servicio al cliente</h3>
          <ul className="space-y-2">
            <li>
              <Link
                href={ROUTES.customerService.newProducts}
                className="hover:text-pink-600 transition-colors"
              >
                Nuevos productos
              </Link>
            </li>
            <li>
              <Link
                href={ROUTES.customerService.terms}
                className="hover:text-pink-600 transition-colors"
              >
                Términos y condiciones
              </Link>
            </li>
            <li>
              <Link
                href={ROUTES.customerService.mexpost}
                className="text-pink-600 font-medium hover:text-pink-700 transition-colors"
              >
                MEXPOST
              </Link>
            </li>
          </ul>
        </div>

        {/* Contáctenos */}
        <div>
          <h3 className="font-semibold mb-3">Contáctenos</h3>
          <p className="mb-1">Atención a clientes:</p>
          <p className="text-pink-600 mb-3">
            @contactocc@correosdemexico.gob.mx
          </p>

          <p className="mb-1">Horarios de atención:</p>
          <p className="mb-3">Lunes a Viernes de 9:00 hrs a 18:00 hrs</p>

          <p className="text-pink-600 font-semibold">
            Atención solo en días hábiles
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
