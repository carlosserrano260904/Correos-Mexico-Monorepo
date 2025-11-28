import React from "react";
import Link from "next/link";

// 🔗 Aquí centralizamos las rutas solo cambiar los strings si hace falta
const ROUTES = {
  account: {
    myAccount: "/Perfil",               // Mi cuenta
    orders: "/historial-de-compras",    // Órdenes PARA DONDE?
    addresses: "/direcciones",          // TODO: ajusta cuando tengas esta página PARA DONDE?x2
    cart: "/Carrito",                   // Carrito de compras
    sellerRequest: "/registro_vendedor", // Solicitar cuenta de vendedor
  },
  customerService: {
    viewedProducts: "/productos-vistos",// Productos vistos (ajusta si usas otro path) PARA DONDE?x3
    newProducts: "/nuevos-productos",   // Nuevos productos PARA DONDE?4
    offices: "/CorreosMX/ubicaciones",  // Oficinas postales
    sellerSolutions: "/Vendedor/app",   // SolucionesClic vendedor (panel vendedor)
    mexpost: "/CorreosMX",              // MEXPOST
  },
  legal: {
    terms: "/terminos-condiciones",
    sitemap: "/mapa-sitio",             // Ajusta cuando tengas esta vista
  },
};

const Footer: React.FC = () => {
  return (
    <footer className="bg-white text-gray-700 text-sm mt-10 border-t pt-10 pb-5">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Logo y nombre */}
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <img
              src="/logoCorreos.png"
              alt="Logo de Correos"
              width={150}
              height={58}
            />
          </div>
          <p className="text-xs">SERVICIO POSTAL MEXICANO</p>
        </div>

        {/* Mi cuenta */}
        <div>
          <h3 className="font-semibold mb-2">Mi cuenta</h3>
          <ul className="space-y-1">
            <li>
              <Link
                href={ROUTES.account.myAccount}
                className="hover:text-pink-600 transition-colors"
              >
                Mi cuenta
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
                href={ROUTES.account.addresses}
                className="hover:text-pink-600 transition-colors"
              >
                Direcciones
              </Link>
            </li>
            <li>
              <Link
                href={ROUTES.account.cart}
                className="hover:text-pink-600 transition-colors"
              >
                Carrito de compras
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
          <h3 className="font-semibold mb-2">Servicio al cliente</h3>
          <ul className="space-y-1">
            <li>
              <Link
                href={ROUTES.customerService.viewedProducts}
                className="hover:text-pink-600 transition-colors"
              >
                Productos vistos
              </Link>
            </li>
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
                href={ROUTES.customerService.offices}
                className="hover:text-pink-600 transition-colors"
              >
                Oficinas postales
              </Link>
            </li>
            <li>
              <Link
                href={ROUTES.customerService.sellerSolutions}
                className="hover:text-pink-600 transition-colors"
              >
                SolucionesClic vendedor
              </Link>
            </li>
            <li>
              <Link
                href={ROUTES.customerService.mexpost}
                className="text-pink-600 hover:text-pink-700 font-medium transition-colors inline-block mt-1"
              >
                MEXPOST
              </Link>
            </li>
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
          <Link
            href={ROUTES.legal.terms}
            className="hover:text-pink-600 transition-colors"
          >
            Términos y condiciones 
          </Link>
          <Link
            href={ROUTES.legal.sitemap}
            className="hover:text-pink-600 transition-colors"
          >
            Mapa del sitio
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
