import React from "react";
import { UserAddressDeriveryProps } from "@/types/interface";


export default function AdressTable( {Nombre, Calle, Numero, NumeroInterior, CodigoPostal, Estado, Municipio, Colonia, NumeroDeTelefono, InstruccionesExtra}: UserAddressDeriveryProps) {
    
    return (
    <div className="max-w-3xl mx-auto p-6">
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
        {/* Columna Izquierda */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Nombre
            </label>
            <p className="text-gray-900 font-medium">{Nombre}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Teléfono
            </label>
            <p className="text-gray-900">{NumeroDeTelefono}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Dirección
            </label>
            <p className="text-gray-900">{Calle} #{Numero} {NumeroInterior ? `interior #${NumeroInterior}` : ''}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Código postal
            </label>
            <p className="text-gray-900">{CodigoPostal}</p>
          </div>
          
        </div>
        
        {/* Columna Derecha */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Colonia
            </label>
            <p className="text-gray-900">{Colonia}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Municipio
            </label>
            <p className="text-gray-900">{Municipio}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Estado
            </label>
            <p className="text-gray-900">{Estado}</p>
          </div>

          
        </div>
      </div>
      
      {/* Instrucciones Extra - Ancho completo */}
      {InstruccionesExtra && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Más información
          </label>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-700 leading-relaxed break-words">
              {InstruccionesExtra}
            </p>
          </div>
        </div>
      )}
    </div>
    )
}