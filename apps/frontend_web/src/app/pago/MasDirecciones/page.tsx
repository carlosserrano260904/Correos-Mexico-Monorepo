'use client'
import { Plantilla } from "@/components/plantilla";

import { SeleccionarDireccion } from "@/components/SeleccionarDireccion";
import React, { useState, useEffect } from "react";
import SumatoriaOrden from "../Componentes/Primitivos/sumatoriaOrden";
import AdressTable from "../Componentes/Primitivos/UserDirection";
import { Dialog, DialogContent, DialogTitle, DialogTrigger, } from "@/components/ui/dialog"
import FormularioAgregarDireccion from "../Componentes/Primitivos/formularioDireccion";
import { actualizarDireccionAPI, agregarDireccionAPI, eliminarDireccionAPI, obtenerDirecciones } from '@/api/direcciones';
import { UserAddressDeriveryProps } from "@/types/interface";
import { ResumenCompra } from '@/components/resumenCompra';
import { useCart } from '@/hooks/useCart'
import { CartCard } from '../../../components/cartcard'
import { DireccionesSchema } from '@/schemas/addresses';
import { BotonRegresar } from "@/components/BotonRegresar";
// import { useMyAuth } from '../../../context/AuthContext'; este debe ser reemplazado cuando se agregue ya que no existe aun a fecha de 11/28/2025 para que funcione
    // const { userId } = useMyAuth();

import { useRouter } from "next/navigation";

export interface Direccion {
    id?: number;
    nombre: string;
    telefono: string;
    direccion: string;
    numerointerior: number | null;
    numeroexterior: number | null;
    masInfo?: string;
    codigoPostal: string;
    municipio: string;
    colonia: string;
    estado: string;
}

interface ListaDireccionesProps {
    direcciones: Direccion[];
    onAgregarNueva: () => void;
    onEditar: (index: number) => void;
    onEliminar: (index: number) => void;
    navigation: any;
    direccionSeleccionada: number | null;
    setDireccionSeleccionada: (id: number) => void;
    modoSeleccion: boolean;
}

function adaptarDireccion(apiDir: typeof DireccionesSchema._type) {
    return {
        id: apiDir.id,
        Nombre: apiDir.nombre,
        Calle: apiDir.calle,
        NumeroInterior: apiDir.numero_interior ?? null,
        Numero: apiDir.numero_exterior ?? null,
        CodigoPostal: apiDir.codigo_postal,
        Estado: apiDir.estado,
        Municipio: apiDir.municipio,
        Colonia: apiDir.colonia_fraccionamiento,
        NumeroDeTelefono: String(apiDir.numero_celular),
        InstruccionesExtra: apiDir.mas_info ?? "",
    };
}


export default function MasDirecciones() {
    const router = useRouter();
    const [direcciones, setDirecciones] = useState<any[]>([]);
    const [direccionSeleccionada, setDireccionSeleccionada] = useState<number | null>(null);
    const { items } = useCart();
    const userId = 102; // remplazo temporal hasta integrar el contexto de autenticación 

    

    useEffect(() => {
        async function cargar() {
            try {
                const resultado = await obtenerDirecciones(userId);
                const adaptadas = resultado.map(adaptarDireccion);
                setDirecciones(adaptadas);
            } catch (err) {
                console.error('Error cargando direcciones:', err);
                window.alert('Error: No se pudieron cargar las direcciones');
            }
        }

        cargar();
    }, [userId]);

    const handleSeleccionarDireccion = (id: number) => {
        setDireccionSeleccionada(id);
    };

    const confirmarSeleccion = async () => {
        if (direccionSeleccionada === null) {
            window.alert('Selecciona una dirección');
            return;
        }

        const direccion = direcciones.find(d => d.id === direccionSeleccionada);
        if (!direccion) {
            window.alert('Error: La dirección seleccionada no existe');
            return;
        }

        try {
            await localStorage.setItem('direccionSeleccionadaId', String(direccion.id));
            router.back();
        } catch (error) {
            console.error('Error al guardar dirección:', error);
            window.alert('Error: No se pudo guardar la dirección seleccionada');
        }
    };

    return (
        <Plantilla>
            <BotonRegresar className="ml-5" redirectTo="/pago" />

            <div
                id="mainPage"
                className="
                    flex 
                    flex-col gap-4
                    md:flex-row md:gap-0
                "
            >
                {/* IZQUIERDA */}
                <SeleccionarDireccion
                    id="leftContent"
                    direcciones={direcciones}
                    className="
                        w-full md:w-3/4 
                        rounded-lg mr-0 md:mr-2 ml-0 md:ml-2 mb-2 p-4
                    "
                />

                {/* DERECHA */}
                <div
                    id="rightContent"
                    className="w-full md:w-1/4"
                >
                    <ResumenCompra className="lg:basis-1/3 h-fit mt-19" />
                </div>
            </div>

            {/* CART CARD — se pone abajo en mobile */}
            <CartCard
                className="w-full mt-6 px-2"
                items={items}
            />
        </Plantilla>
    )

}