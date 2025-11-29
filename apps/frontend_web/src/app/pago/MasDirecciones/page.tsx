'use client'
import { Plantilla } from "@/components/plantilla";
import { SeleccionarDireccion } from "@/components/SeleccionarDireccion";
import React, { useState } from "react";
import SumatoriaOrden from "../Componentes/Primitivos/sumatoriaOrden";
import AdressTable from "../Componentes/Primitivos/UserDirection";
import { Dialog, DialogContent, DialogTitle, DialogTrigger, } from "@/components/ui/dialog"
import FormularioAgregarDireccion from "../Componentes/Primitivos/formularioDireccion";
import { UserAddressDeriveryProps } from "@/types/interface";
import { ResumenCompra } from '@/components/resumenCompra';
import { useCart } from '@/hooks/useCart'
import { CartCard } from '../../../components/cartcard'
import { BotonRegresar } from "@/components/BotonRegresar";

export default function MasDirecciones() {
    const [direccionSeleccionada, setDireccionSeleccionada] = useState<number | null>(null);
    const { items } = useCart();
    // Datos de ejemplo para las direcciones
    const direcciones = [
        {
            id: 1,
            Nombre: "Juan",
            Apellido: "Pérez",
            Calle: "Av. Principal",
            Numero: "123",
            CodigoPostal: "34000",
            Estado: "Durango",
            Municipio: "Durango",
            Ciudad: "Durango",
            Colonia: "Centro",
            NumeroDeTelefono: "618 123 4567",
            InstruccionesExtra: "Casa de dos pisos, portón azul"
        },
        {
            id: 2,
            Nombre: "María",
            Apellido: "González",
            Calle: "Calle Secundaria",
            Numero: "456",
            CodigoPostal: "34100",
            Estado: "Durango",
            Municipio: "Durango",
            Ciudad: "Durango",
            Colonia: "San José",
            NumeroDeTelefono: "618 987 6543",
            InstruccionesExtra: "Departamento 3B, edificio blanco"
        },
        {
            id: 3,
            Nombre: "Carlos",
            Apellido: "Rodríguez",
            Calle: "Blvd. Norte",
            Numero: "789",
            CodigoPostal: "34200",
            Estado: "Durango",
            Municipio: "Durango",
            Ciudad: "Durango",
            Colonia: "Las Flores",
            NumeroDeTelefono: "618 555 0123",
            InstruccionesExtra: "Frente al parque, casa con jardín"
        }
    ];

    const handleSeleccionarDireccion = (id: number) => {
        setDireccionSeleccionada(id);
    };

    const handleConfirmarSeleccion = () => {
        if (direccionSeleccionada) {
            const direccion = direcciones.find(d => d.id === direccionSeleccionada);
            console.log('Dirección seleccionada:', direccion);
            // Aquí puedes agregar la lógica para proceder con la dirección seleccionada
            alert(`Dirección de ${direccion?.Nombre} ${direccion?.Apellido} seleccionada correctamente`);
        }
    };

    return (
        <Plantilla>
            <BotonRegresar className="ml-5" redirectTo="/pago"/>
            <div id='mainPage' className='flex'>
                <SeleccionarDireccion id='leftContent' direcciones={direcciones} className='w-3/4 rounded-lg mr-2 ml-2 mb-2 p-4' />
 
                <div id='rightContent' className='w-1/4'>
                    <ResumenCompra className='lg:basis-1/3 h-fit mt-19' />
                </div>
            </div>
            <CartCard className='lg:basis-2/3  ml-2 mt-6' items={items}/>
        </Plantilla>
    )
}