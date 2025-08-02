import React from "react";
import SumatoriaOrden from "./Primitivos/sumatoriaOrden";


export default function OrderReview() {
    
    return(
        <div id='OrderReview' className=''>
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Resumen de la Orden
            </h2>
            <SumatoriaOrden></SumatoriaOrden>
        </div>
    )
}