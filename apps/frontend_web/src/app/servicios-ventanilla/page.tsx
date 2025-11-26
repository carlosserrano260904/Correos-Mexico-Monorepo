import React from "react";
import { NavbarCorreos } from "@/components/NavbarCorreos";
import Footer from "@/components/footer";

export default function ServiciosVentanilla() {
    return (
        <>
            <NavbarCorreos />
            <div className="font-sans bg-white min-h-screen">
                <header className="bg-pink-100 p-14 flex flex-col md:flex-row justify-between items-center min-h-[400px] max-h-[400px]">
                    <div className="flex flex-col p-22 items-start justify-center flex-1">
                        <span className="text-4xl font-bold md:text-6xl text-gray-800">Servicios en</span>
                        <span className="text-4xl font-bold text-pink-600 md:text-6xl">ventanilla.</span>
                    </div>
                    <div className="flex items-center justify-end flex-1 pr-4 -my-8 h-[400px]">
                        <img
                            src="/ventanilla.png"
                            alt="Servicios en ventanilla"
                            className="h-full w-auto object-cover rounded-lg"
                        />
                    </div>
                </header>

                <main className="w-full px-16 py-28 space-y-18">
                    <div className="text-left space-y-4 px-4">
                        <h2 className="text-3xl font-bold text-gray-800 md:text-4xl">
                            En nuestras más de 1, 100 Oficinas Postales podrás tener acceso a los siguientes servicios principales:
                        </h2>
                    </div>

                    <ul className="space-y-4 max-w-4xl mx-auto">
                        {/* Servicio 1 */}
                        <li className="flex items-start gap-4 p-4">
                            <div className="flex-shrink-0 w-6 h-6 bg-pink-600 rounded-full flex items-center justify-center">
                                <div className="w-3 h-3 bg-white rounded-full"></div>
                            </div>
                            <div className="flex-grow">
                                <p className="text-gray-800 font-medium">
                                    Depósito de cartas y paquetes para envío nacional e internacional.
                                </p>
                            </div>
                        </li>

                        {/* Servicio 2 */}
                        <li className="flex items-start gap-4 p-4">
                            <div className="flex-shrink-0 w-6 h-6 bg-pink-600 rounded-full flex items-center justify-center">
                                <div className="w-3 h-3 bg-white rounded-full"></div>
                            </div>
                            <div className="flex-grow">
                                <p className="text-gray-800 font-medium">
                                    Recepción de cartas y paquetes.
                                </p>
                            </div>
                        </li>

                        {/* Servicio 3 */}
                        <li className="flex items-start gap-4 p-4">
                            <div className="flex-shrink-0 w-6 h-6 bg-pink-600 rounded-full flex items-center justify-center">
                                <div className="w-3 h-3 bg-white rounded-full"></div>
                            </div>
                            <div className="flex-grow">
                                <p className="text-gray-800 font-medium">
                                    Compra de Guías prepagadas MEXPOST.
                                </p>
                            </div>
                        </li>

                        {/* Servicio 4 */}
                        <li className="flex items-start gap-4 p-4">
                            <div className="flex-shrink-0 w-6 h-6 bg-pink-600 rounded-full flex items-center justify-center">
                                <div className="w-3 h-3 bg-white rounded-full"></div>
                            </div>
                            <div className="flex-grow">
                                <p className="text-gray-800 font-medium">
                                    Envío de Giros Postales.
                                </p>
                            </div>
                        </li>

                        {/* Servicio 5 */}
                        <li className="flex items-start gap-4 p-4">
                            <div className="flex-shrink-0 w-6 h-6 bg-pink-600 rounded-full flex items-center justify-center">
                                <div className="w-3 h-3 bg-white rounded-full"></div>
                            </div>
                            <div className="flex-grow">
                                <p className="text-gray-800 font-medium">
                                    Arrendamiento de Cajas de Apartado.
                                </p>
                            </div>
                        </li>

                        {/* Servicio 6 */}
                        <li className="flex items-start gap-4 p-4">
                            <div className="flex-shrink-0 w-6 h-6 bg-pink-600 rounded-full flex items-center justify-center">
                                <div className="w-3 h-3 bg-white rounded-full"></div>
                            </div>
                            <div className="flex-grow">
                                <p className="text-gray-800 font-medium">
                                    Expedición de Cartilla de Identidad Postal.
                                </p>
                            </div>
                        </li>

                        {/* Servicio 7 */}
                        <li className="flex items-start gap-4 p-4">
                            <div className="flex-shrink-0 w-6 h-6 bg-pink-600 rounded-full flex items-center justify-center">
                                <div className="w-3 h-3 bg-white rounded-full"></div>
                            </div>
                            <div className="flex-grow">
                                <p className="text-gray-800 font-medium">
                                    Almacenaje.
                                </p>
                            </div>
                        </li>

                        {/* Servicio 8 */}
                        <li className="flex items-start gap-4 p-4">
                            <div className="flex-shrink-0 w-6 h-6 bg-pink-600 rounded-full flex items-center justify-center">
                                <div className="w-3 h-3 bg-white rounded-full"></div>
                            </div>
                            <div className="flex-grow">
                                <p className="text-gray-800 font-medium">
                                    Presentación a la Aduana.
                                </p>
                            </div>
                        </li>

                        {/* Servicio 9 */}
                        <li className="flex items-start gap-4 p-4">
                            <div className="flex-shrink-0 w-6 h-6 bg-pink-600 rounded-full flex items-center justify-center">
                                <div className="w-3 h-3 bg-white rounded-full"></div>
                            </div>
                            <div className="flex-grow">
                                <p className="text-gray-800 font-medium">
                                    Servicios adicionales.
                                </p>
                            </div>
                        </li>
                    </ul>
                </main>

                <Footer />
            </div>
        </>
    );
}
