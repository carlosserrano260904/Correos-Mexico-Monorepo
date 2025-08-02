import React from "react";
import Image from "next/image";
import Link from "next/link";

interface NavbarCorreosProps {
    transparent?: boolean;
}

export const NavbarCorreos = ({ transparent = false }: NavbarCorreosProps) => {
    return(
        <div className={`w-full ${transparent ? 'bg-transparent absolute top-0 left-0 z-10' : 'bg-gray-50'}`}>
            <div className="flex items-center justify-between w-full px-4 py-2">
                {/* Logo y Links de navegación */}
                <div className="flex items-center gap-12">
                    <Image 
                        src="/logoCorreos.png" 
                        alt="Logo de correos" 
                        width={100} 
                        height={38}
                    />
                    
                    {/* Links de navegación */}
                    <div className="flex items-center gap-6">
                        <Link 
                            href="/" 
                            className="text-gray-700 hover:text-pink-500 font-medium transition-colors text-sm"
                        >
                            Inicio
                        </Link>
                        <Link 
                            href="/mexposts" 
                            className="text-gray-700 hover:text-pink-500 font-medium transition-colors text-sm"
                        >
                            MEXPOSTS
                        </Link>
                        <Link 
                            href="/correos-clic" 
                            className="text-gray-700 hover:text-pink-500 font-medium transition-colors text-sm"
                        >
                            CorreosClic
                        </Link>
                        <Link 
                            href="/atencion-cliente" 
                            className="text-gray-700 hover:text-pink-500 font-medium transition-colors text-sm"
                        >
                            Atención al cliente
                        </Link>
                    </div>
                </div>

                {/* Espacio vacío para mantener el layout */}
                <div></div>
            </div>
        </div>
    )
}
