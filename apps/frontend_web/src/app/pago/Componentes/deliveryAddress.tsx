import React, { useState, useEffect } from "react";
import AdressTable from "./Primitivos/UserDirection";
import { obtenerDirecciones } from "@/api/direcciones";
import { DireccionesSchema } from "@/schemas/addresses";
import Link from 'next/link'

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


export default function DeliveryAdress() {
    const [direccion, setDireccion] = useState<any | null>(null);
    const userId = 102; // temporal hasta integrar auth

    useEffect(() => {
        async function cargar() {
            try {
                const idGuardado = localStorage.getItem("direccionSeleccionadaId");
                if (!idGuardado) return;

                const resultado = await obtenerDirecciones(userId);
                const adaptadas = resultado.map(adaptarDireccion);

                const seleccionada = adaptadas.find(d => d.id === Number(idGuardado));

                if (seleccionada) setDireccion(seleccionada);

            } catch (err) {
                console.error("Error cargando dirección:", err);
                window.alert("Error: No se pudo cargar la dirección seleccionada");
            }
        }

        cargar();
    }, [userId]);

    return (
        <div className="p-8 rounded-lg m-2 bg-[#f5f5f5]">
            <h1 className='font-semibold m-2'>Direccion de Envio</h1>
            <AdressTable {...direccion} />
        </div>
    )
}