// Código completo de la página con la sección de servicios integrada
"use client";
import React from "react";
import { NavbarCorreos } from "@/components/NavbarCorreos";
import FooterCorreos from "@/components/footerCorreos";

type CategoriaKey = "cartas" | "paqueteria" | "impresos" | "publicaciones";

const menuItems = ["cartas", "paqueteria", "impresos", "publicaciones"] as const;

export default function Oficinas() {
  const [categoria, setCategoria] = React.useState<CategoriaKey>("cartas");
  const [menuAbierto, setMenuAbierto] = React.useState(false);

  const categorias: Record<CategoriaKey, {
    descripcion: string;
    tarifas: {
      titulo: string;
      color: string;
      desde: string;
      hasta: string;
      detalles: string[];
    }[];
  }> = {
    cartas: {
      descripcion:
        "Envío masivo de cartas, documentos o tarjetas postales por todo México.",
      tarifas: [
        {
          titulo: "Envío pequeño",
          color: "linear-gradient(to right, #9b174c, #db2777, #f472b6)",
          desde: "$3.24 MXN",
          hasta: "$15.95 MXN",
          detalles: [
            "De 500 a 10,000 piezas.",
            "Peso máximo: 1 kg por pieza.",
          ],
        },
        {
          titulo: "Envío mediano",
          color: "#d7b98e",
          desde: "$3.18 MXN",
          hasta: "$15.83 MXN",
          detalles: [
            "De 10,001 a 50,000 piezas.",
            "Peso máximo: 1 kg por pieza.",
          ],
        },
        {
          titulo: "Envío grande",
          color: "#5bbf46",
          desde: "$3.14 MXN",
          hasta: "$14.95 MXN",
          detalles: [
            "Más de 50,000 hasta 5 millones de piezas.",
            "Peso máximo: 1 kg por pieza.",
            "Incluye contrato de Garantía de Volumen.",
          ],
        },
      ],
    },

    paqueteria: {
      descripcion:
        "Envío masivo de productos y mercancías empaquetadas por todo México.",
      tarifas: [
        {
          titulo: "Envío pequeño",
          color: "linear-gradient(to right, #9b174c, #db2777, #f472b6)",
          desde: "$33.06 MXN",
          hasta: "$94.15 MXN",
          detalles: [
            "De 250 a 500 piezas.",
            "Peso máximo: 25 kg por paquete.",
          ],
        },
        {
          titulo: "Envío mediano",
          color: "#d7b98e",
          desde: "$31.32 MXN",
          hasta: "$79.70 MXN",
          detalles: [
            "De 501 a 10,000 piezas.",
            "Peso máximo: 25 kg por paquete.",
            "Incluye servicio de Correo Registrado.",
          ],
        },
        {
          titulo: "Envío grande",
          color: "#5bbf46",
          desde: "$25.52 MXN",
          hasta: "$70.84 MXN",
          detalles: [
            "De 10,001 piezas a más de 15,000 piezas.",
            "Peso máximo: 25 kg por paquete.",
            "Incluye servicio de Correo Registrado.",
          ],
        },
      ],
    },

    impresos: {
      descripcion:
        "Incrementa la difusión de tus servicios enviando folletos, gacetas, boletines, carteles y más a través de nuestra red postal.",
      tarifas: [
        {
          titulo: "Envío pequeño",
          color: "#b6203a",
          desde: "$9.76 MXN",
          hasta: "$29.10 MXN",
          detalles: [
            "De 50 a 250 piezas.",
            "Peso máximo: 2 kg por pieza."
          ]
        },
        {
          titulo: "Envío mediano",
          color: "#d5b78f",
          desde: "$8.06 MXN",
          hasta: "$19.74 MXN",
          detalles: [
            "De 251 hasta 5,000 piezas.",
            "Peso máximo: 2 kg por pieza."
          ]
        },
        {
          titulo: "Envío grande",
          color: "#4caf50",
          desde: "$3.72 MXN",
          hasta: "$18.73 MXN",
          detalles: [
            "Más de 5,001 hasta 30,000 piezas.",
            "Peso máximo: 2 kg por pieza.",
            "A partir de este envío se puede celebrar un contrato de Garantía de Volumen."
          ]
        }
      ]
    },

    publicaciones: {
      descripcion:
        "Incrementa la difusión de tus servicios enviando folletos, gacetas, boletines, carteles y más a través de nuestra red postal.",
      tarifas: [
        {
          titulo: "Envío Pequeño",
          color: "#b6203a",
          desde: "$3.32 MXN",
          hasta: "$9.38 MXN",
          detalles: [
            "De 500 a 1,000 piezas.",
            "Peso máximo: 1.5 kg por pieza."
          ]
        },
        {
          titulo: "Envío Mediano",
          color: "#d5b78f",
          desde: "$3.24 MXN",
          hasta: "$9.21 MXN",
          detalles: [
            "De 1,001 hasta 15,000 piezas.",
            "Peso máximo: 1.5 kg por pieza."
          ]
        },
        {
          titulo: "Envío Grande",
          color: "#4caf50",
          desde: "$3.72 MXN",
          hasta: "$18.73 MXN",
          detalles: [
            "De 15,001 a 250,000 piezas.",
            "Peso máximo: 1 kg por pieza.",
            "A partir de este envío se puede celebrar un contrato de Garantía de Volumen."
          ]
        },
        {
          titulo: "Envío Jumbo",
          color: "#e91e63",
          desde: "$3.72 MXN",
          hasta: "$18.73 MXN",
          detalles: [
            "A partir de más de 250,000 piezas.",
            "Peso máximo: 1.5 kg por pieza."
          ]
        }
      ]
    },
  };

  return (
    <div className="bg-white min-h-screen flex flex-col font-sans">
      <NavbarCorreos />

      {/* --- HERO CON IMAGEN RESPONSIVE --- */}
      <section className="w-full px-4 pt-6 pb-8 md:pb-12 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="relative w-full h-[300px] sm:h-[400px] md:h-[450px] lg:h-[500px] rounded-2xl md:rounded-[2.5rem] overflow-hidden shadow-2xl">
            <div
              className="absolute inset-0 w-full h-full transition-transform duration-700 hover:scale-105"
              style={{
                backgroundImage: "url('/bgServEmpresas.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            ></div>

            <div className="absolute inset-0 bg-gradient-to-r from-pink-600/90 via-pink-500/80 to-pink-400/70"></div>

            <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-4 sm:px-6">
              <a href="/centro-de-ayuda">
                <div className="bg-white text-black-600 text-xs sm:text-sm md:text-base font-bold px-4 sm:px-6 py-1.5 sm:py-2 rounded-full mb-4 sm:mb-6 shadow-sm inline-block tracking-wide">
                  Centro de Ayuda
                </div>
              </a>

              <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-extrabold text-white mb-2 sm:mb-4 drop-shadow-lg">
                Servicios para Empresas
              </h1>

              <p className="text-pink-50 text-sm sm:text-base md:text-lg lg:text-xl font-medium max-w-xs sm:max-w-md md:max-w-2xl">
                Conoce las formas en las que puedes enviar distintos paquetes con nuestros servicios.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- SECCIÓN DE SERVICIOS RESPONSIVE --- */}
      <section className="w-full px-4 md:px-6 lg:px-8 pb-12 md:pb-20">
        <div className="max-w-7xl mx-auto">
          {/* --- SELECTOR MÓVIL (Dropdown) --- */}
          <div className="lg:hidden mb-6">
            <button
              onClick={() => setMenuAbierto(!menuAbierto)}
              className="w-full bg-pink-600 text-white px-4 py-3 rounded-xl font-medium flex items-center justify-between shadow-lg"
            >
              <span className="flex items-center gap-2">
                ✉️ {categoria.charAt(0).toUpperCase() + categoria.slice(1)}
              </span>
              <svg
                className={`w-5 h-5 transform transition-transform ${menuAbierto ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {menuAbierto && (
              <div className="mt-2 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                {menuItems.map((item) => (
                  <button
                    key={item}
                    onClick={() => {
                      setCategoria(item);
                      setMenuAbierto(false);
                    }}
                    className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors ${
                      categoria === item
                        ? "bg-pink-50 text-pink-600"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    ✉️ {item.charAt(0).toUpperCase() + item.slice(1)}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-6 lg:gap-10">
            {/* --- MENÚ LATERAL DESKTOP --- */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <h2 className="text-lg font-semibold mb-4 text-gray-700">
                Navegación por Servicios
              </h2>

              <div className="flex flex-col gap-2">
                {menuItems.map((item) => (
                  <button
                    key={item}
                    onClick={() => setCategoria(item)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      categoria === item
                        ? "bg-pink-600 text-white shadow"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    ✉️ {item.charAt(0).toUpperCase() + item.slice(1)}
                  </button>
                ))}
              </div>
            </aside>

            {/* --- CONTENIDO DINÁMICO --- */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <span className="text-2xl sm:text-3xl">📮</span>
                <h1 className="text-2xl sm:text-3xl font-bold capitalize">{categoria}</h1>
              </div>

              <p className="text-gray-600 text-sm sm:text-base mb-6 sm:mb-8 md:mb-10">
                {categorias[categoria].descripcion}
              </p>

              <div className="flex flex-col gap-6 sm:gap-8">
                {categorias[categoria].tarifas.map((tarifa, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl sm:rounded-3xl shadow-lg overflow-hidden border border-gray-200"
                  >
                    <div
                      className="px-4 sm:px-6 py-2.5 sm:py-3 text-white font-bold text-base sm:text-lg"
                      style={{ background: tarifa.color }}
                    >
                      {tarifa.titulo}
                    </div>

                    <div className="bg-white px-4 sm:px-6 py-4 sm:py-6">
                      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6">
                        <div>
                          <p className="text-gray-500 text-xs sm:text-sm mb-1">Desde</p>
                          <p className="bg-green-100 text-green-700 px-2 sm:px-3 py-2 rounded-lg font-semibold text-center text-xs sm:text-base">
                            {tarifa.desde}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs sm:text-sm mb-1">Hasta</p>
                          <p className="bg-pink-100 text-pink-600 px-2 sm:px-3 py-2 rounded-lg font-semibold text-center text-xs sm:text-base">
                            {tarifa.hasta}
                          </p>
                        </div>
                      </div>

                      <ul className="space-y-2">
                        {tarifa.detalles.map((d, i) => (
                          <li key={i} className="flex gap-2 text-sm sm:text-base">
                            <span className="text-pink-500 text-lg flex-shrink-0">•</span>
                            <span className="text-gray-700">{d}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <FooterCorreos />
    </div>
  );
}