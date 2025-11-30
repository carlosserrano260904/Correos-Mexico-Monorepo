'use client'
import { useState } from 'react';
import { Plantilla } from '@/components/plantilla';
import BotonRegresar from '@/components/BotonRegresar';
import BotonAnadir from '@/components/Botonañadirdireccion';
import {ModalAnadirDireccion} from '@/app/boton-configuracion/mis-direcciones/modales-components/ModalAñadirDireccion';
import {ModalEditarDireccion} from '@/app/boton-configuracion/mis-direcciones/modales-components/ModalEditarDireccion';
import {ModalEliminarDireccion} from '@/app/boton-configuracion/mis-direcciones/modales-components/ModalEliminarDireccion';

export default function MisDireccionesPage() {
    const [modalEliminar, setModalEliminar] = useState(false);
    const [modalAnadir, setModalAnadir] = useState(false);
    const [modalEditar, setModalEditar] = useState(false);
    const [direccionSeleccionada, setDireccionSeleccionada] = useState<any>(null);

    const [direcciones, setDirecciones] = useState([
        {
            id: 1,
            tipo: 'Casa',
            direccion: 'Calle "Nombre Calle" #122, Fraccionamiento o Colonia.',
            codigoPostal: '34162'
        },
        {
            id: 2,
            tipo: 'Oficina',
            direccion: 'Calle "Nombre Calle" #122, Fraccionamiento o Colonia.',
            codigoPostal: '34162'
        },
        {
            id: 3,
            tipo: 'Casa',
            direccion: 'Calle "Nombre Calle" #122, Fraccionamiento o Colonia.',
            codigoPostal: '34162'
        }
    ]);

    const handleDelete = (id: number) => {
        setDireccionSeleccionada(id);
        setModalEliminar(true);
    };

    const handleConfirmDelete = () => {
        setDirecciones(direcciones.filter(dir => dir.id !== direccionSeleccionada));
        setModalEliminar(false);
        setDireccionSeleccionada(null);
    };

    const handleEdit = (direccion: any) => {
        setDireccionSeleccionada(direccion);
        setModalEditar(true);
    };

    const handleAddDireccion = () => {
        setModalAnadir(true);
    };

    const handleSaveNewDireccion = (data: any) => {
        const nuevaDireccion = {
            id: direcciones.length + 1,
            tipo: data.nombreLugar,
            direccion: `${data.calle} #${data.numero}, ${data.colonia}`,
            codigoPostal: '34162' // Puedes agregar este campo al formulario
        };
        setDirecciones([...direcciones, nuevaDireccion]);
        setModalAnadir(false);
    };

    const handleSaveEditDireccion = (data: any) => {
        setDirecciones(direcciones.map(dir => 
            dir.id === direccionSeleccionada.id 
                ? {
                    ...dir,
                    tipo: data.nombreLugar,
                    direccion: `${data.calle} #${data.numero}, ${data.colonia}`
                  }
                : dir
        ));
        setModalEditar(false);
        setDireccionSeleccionada(null);
    };

    return (
        <Plantilla>
            <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    
                    {/* Header con Botón Regresar y Botón Añadir */}
                    <div className="flex items-center justify-between mb-6 sm:mb-8">
                        <BotonRegresar />
                        <BotonAnadir onClick={handleAddDireccion} />
                    </div>

                    {/* Título */}
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8">
                        Mis Direcciones
                    </h1>

                    {/* Lista de Direcciones */}
                    <div className="space-y-4">
                        {direcciones.map((direccion) => (
                            <div 
                                key={direccion.id}
                                className="bg-white rounded-lg border-2 border-blue-400 p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow"
                            >
                                {/* Encabezado con tipo e iconos */}
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <h2 className="text-lg sm:text-xl font-bold text-gray-900">{direccion.tipo}</h2>
                                    </div>
                                    
                                    {/* Iconos de acción */}
                                    <div className="flex items-center gap-3">
                                        <button 
                                            onClick={() => handleEdit(direccion)}
                                            className="text-pink-600 hover:text-pink-700 transition-colors cursor-pointer"
                                            aria-label="Editar dirección"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(direccion.id)}
                                            className="text-pink-600 hover:text-pink-700 transition-colors cursor-pointer"
                                            aria-label="Eliminar dirección"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                {/* Dirección */}
                                <p className="text-gray-700 text-sm sm:text-base mb-2">
                                    {direccion.direccion}
                                </p>

                                {/* Código Postal */}
                                <p className="text-gray-900 font-semibold text-sm sm:text-base">
                                    C.P. {direccion.codigoPostal}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* MODALES */}
            <ModalEliminarDireccion
                isOpen={modalEliminar}
                onClose={() => setModalEliminar(false)}
                onConfirm={handleConfirmDelete}
            />

            <ModalAnadirDireccion
                isOpen={modalAnadir}
                onClose={() => setModalAnadir(false)}
                onSave={handleSaveNewDireccion}
            />

            <ModalEditarDireccion
                isOpen={modalEditar}
                onClose={() => setModalEditar(false)}
                onSave={handleSaveEditDireccion}
                direccion={direccionSeleccionada}
            />
        </Plantilla>
    );
}