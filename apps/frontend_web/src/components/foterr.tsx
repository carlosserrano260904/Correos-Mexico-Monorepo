'use client';

import React, { useState } from 'react';

const Ubicaciones = () => {
  const [estado, setEstado] = useState('');
  const [municipio, setMunicipio] = useState('');
  const [mostrarTabla, setMostrarTabla] = useState(false);

  const limpiarFormulario = () => {
    setEstado('');
    setMunicipio('');
    setMostrarTabla(false);
  };

  const handleSubmit = () => {
    if (!mostrarTabla) {
      setMostrarTabla(true);
    } else {
      limpiarFormulario();
    }
  };

  const registros = [
    {
      oficina: 'Canatlán, Dgo.',
      tipo: 'Sucursal',
      ubicacion: 'Puente Sur 502',
      colonia: 'Colonia de las Manzanas',
      municipio: 'Canatlán',
    },
    {
      oficina: 'Correos del Centro, Dgo.',
      tipo: 'Administración Postal',
      ubicacion: 'Correo Correos 300',
      colonia: 'Correos Centro',
      municipio: 'Durango',
    },
    {
      oficina: 'Guillermina, Dgo.',
      tipo: 'Administración Postal',
      ubicacion: '20 de Noviembre 108',
      colonia: 'Guillermina',
      municipio: 'Durango',
    },
    {
      oficina: 'Guadalupe, Victoria, Dgo.',
      tipo: 'Sucursal',
      ubicacion: 'Montevideo 6',
      colonia: 'Guadalupe',
      municipio: 'Durango',
    },
    {
      oficina: 'Tierra Blanca, Durango, Dgo.',
      tipo: 'Sucursal',
      ubicacion: 'Durango #5 y No 8',
      colonia: 'Barrio Tierra Blanca',
      municipio: 'Durango',
    },
    {
      oficina: 'Gómez Palacio, Dgo.',
      tipo: 'Administración Fiscal',
      ubicacion: 'Generalísimo Pino',
      colonia: 'Gómez Palacio Centro',
      municipio: 'Gómez Palacio',
    },
  ];

  return (
    // <div className="min-h-screen bg-white flex flex-col justify-between relative overflow-hidden px-4 md:px-16 lg:px-24 py-10">
      
    //   {/* Título */}
    //   <div className="mb-10 z-10">
    //     <h1 className="text-4xl font-bold text-gray-900 leading-tight">
    //       Ubicación de Oficinas<br />Postales
    //     </h1>
    //   </div>

    //   {/* Formulario y tabla */}
    //   <div className="flex flex-col lg:flex-row items-center justify-between gap-10 z-10">
    //     {/* Formulario */}
    //     <div className="flex flex-col gap-6 w-full max-w-md">
    //       <div>
    //         <label className="text-gray-800 mb-1 block">Estado</label>
    //         <input
    //           type="text"
    //           placeholder="Ej. Durango"
    //           value={estado}
    //           onChange={(e) => setEstado(e.target.value)}
    //           className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm"
    //         />
    //       </div>
    //       <div>
    //         <label className="text-gray-800 mb-1 block">Municipio</label>
    //         <input
    //           type="text"
    //           placeholder="Ej. Gomez Palacio"
    //           value={municipio}
    //           onChange={(e) => setMunicipio(e.target.value)}
    //           className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm"
    //         />
    //       </div>
    //       <button
    //         className="w-fit px-8 py-2 rounded-full bg-fuchsia-600 text-white hover:bg-fuchsia-700 transition"
    //         onClick={handleSubmit}
    //       >
    //         {mostrarTabla ? 'Limpiar' : 'Buscar'}
    //       </button>
    //     </div>

    //     {/* Tabla solo si se activa mostrarTabla */}
    //     {mostrarTabla && (
    //       <div className="bg-gray-100 rounded-xl p-4 shadow-lg overflow-x-auto max-w-full">
    //         <table className="text-sm text-left min-w-[600px]">
    //           <thead className="text-gray-700 uppercase">
    //             <tr>
    //               <th className="px-3 py-2">Oficina</th>
    //               <th className="px-3 py-2">Tipo</th>
    //               <th className="px-3 py-2">Ubicación</th>
    //               <th className="px-3 py-2">Colonia</th>
    //               <th className="px-3 py-2">Municipio</th>
    //               <th className="px-3 py-2">Acción</th>
    //             </tr>
    //           </thead>
    //           <tbody className="text-gray-800">
    //             {registros.map((row, index) => (
    //               <tr key={index} className="border-t">
    //                 <td className="px-3 py-2">{row.oficina}</td>
    //                 <td className="px-3 py-2">{row.tipo}</td>
    //                 <td className="px-3 py-2">{row.ubicacion}</td>
    //                 <td className="px-3 py-2">{row.colonia}</td>
    //                 <td className="px-3 py-2">{row.municipio}</td>
    //                 <td className="px-3 py-2">
    //                   <button className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300">
    //                     Detalle
    //                   </button>
    //                 </td>
    //               </tr>
    //             ))}
    //           </tbody>
    //         </table>
    //       </div>
    //     )}
    //   </div>

    //   {/* Fondos decorativos */}
    //   <div className="absolute w-96 h-96 bg-rose-100 rounded-full left-[-120px] bottom-[-80px] z-0"></div>
    //   <div className="absolute w-72 h-72 bg-rose-200 rounded-full right-[-80px] top-[60%] z-0"></div>
    // </div>
    <footer className="bg-white border-t border-gray-200 py-6 text-sm text-gray-600 text-center flex flex-wrap justify-center gap-6 px-4 font-semibold">
        <span className="cursor-pointer hover:underline">Términos y condiciones</span>
        <span className="cursor-pointer hover:underline">Promociones</span>
        <span className="cursor-pointer hover:underline">Cómo cuidamos tu privacidad</span>
        <span className="cursor-pointer hover:underline">Accesibilidad</span>
        <span className="cursor-pointer hover:underline">Ayuda</span>
        </footer>
  );
};

export default Ubicaciones;
