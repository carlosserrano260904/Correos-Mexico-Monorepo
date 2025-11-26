import React from "react";
import Image from "next/image";
import Link from "next/link";

interface NavbarCorreosProps {
    transparent?: boolean;
}

export const NavbarCorreos = ({ transparent = false }: NavbarCorreosProps) => {
    return(
        <div className={`w-full ${transparent ? 'bg-transparent absolute top-0 left-0 z-10' : 'bg-white-100'}`}>
            <div className="flex items-center justify-between w-full px-4 py-2">
                
                <Image 
                    src="/logoCorreos.png" 
                    alt="Logo de correos" 
                    width={100} 
                    height={38}
                />

                {/* Links movidos completamente a la derecha */}
                <div className="flex items-center text-black-50 gap-16 ml-auto">
                    <Link href="/" className=" hover:text-pink-500 font-medium transition-colors text-sm">Inicio</Link>
                    <Link href="/mexposts" className=" hover:text-pink-500 font-medium transition-colors text-sm">MEXPOSTS</Link>
                    <Link href="/correos-clic" className=" hover:text-pink-500 font-medium transition-colors text-sm">Centro de ayuda</Link>
                    <Link href="/atencion-cliente" className=" hover:text-pink-500 font-medium transition-colors text-sm mr-18">Ubicaciones y horarios</Link>
                </div>
            </div>
        </div>
    )
}
