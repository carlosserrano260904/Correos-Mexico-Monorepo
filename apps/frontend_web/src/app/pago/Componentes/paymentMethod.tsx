import React, { useState } from "react";
import PaymentMethodPrim from "./Primitivos/paymentMethod";
import Link from 'next/link'

export default function PaymentMethod() {
    return (
        <div className="p-8 rounded-lg m-2 bg-[#f5f5f5]">
            <h1 className='font-semibold m-2'>Informacion del Metodo de pago</h1>
            <PaymentMethodPrim id={0} NombreDeTarjeta={"juan"} NumeroDeTarjeta={"0725432543"} FechaVencimiento={"02/25"} CodigoSeguridad={"798"} TipoTarjeta={"credito"} Banco={"Banamex"}></PaymentMethodPrim> 
        </div>
    )
}