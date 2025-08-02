'use client'
import React from 'react';
import { Plantilla } from '../../../components/plantilla';
import { Formulario } from '../Componentes/Formulario';

export default function Agregar() {
  return (
    <Plantilla title="Crear nuevo producto">
      <div className="space-y-6 p-6 w-1/2 mx-auto">
        <Formulario />
 
      </div>
    </Plantilla>
  );
}
