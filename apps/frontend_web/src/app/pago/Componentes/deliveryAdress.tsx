import React, { useState } from "react";
import AdressTable from "./Primitivos/UserDirection";
import Link from 'next/link'

export default function DeliveryAdress() {
    return (
        <div className="p-8 rounded-lg m-2 bg-[#f5f5f5]">
            <h1 className='font-semibold m-2'>Direccion de Envio</h1>
            <AdressTable Nombre={"luis"} Apellido={"Gonzalez"} Calle={"20 de noviembre"} Numero={"342"} CodigoPostal={"46543"} Estado={"Durango"} Municipio={"durango"} Ciudad={"Victoria de Durango"} Colonia={"centro"} NumeroDeTelefono={"3424232345"} InstruccionesExtra={"Es una casa de color morado situada en contra esquina del super 'toñito' tiene un proton negro"}></AdressTable> 
        </div>
    )
}