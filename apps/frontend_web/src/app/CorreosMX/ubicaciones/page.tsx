'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { NavbarCorreos } from '@/components/NavbarCorreos'; // Asegúrate que la ruta es correcta
import Foterr from '@/components/footerCorreos';     // Asegúrate que la ruta es correcta
import { IoArrowBackOutline, IoStorefrontOutline, IoInformationCircleOutline } from 'react-icons/io5';

// --- DATOS FICTICIOS ---
type Oficina = {
    id: number;
    nombre: string;
    direccion: string;
    telefono: string;
    horarioLV: string;
    horarioSab: string;
};

const OFICINAS_MOCK: Oficina[] = [
    {
        id: 1,
        nombre: 'Sucursal Centro',
        direccion: 'Calle Juárez #113, Zona Centro, Durango, Dgo.',
        telefono: '618-555-0101',
        horarioLV: '8:00 A.M - 8:00 P.M.',
        horarioSab: '8:00 A.M - 4:00 P.M.',
    },
    {
        id: 2,
        nombre: 'Sucursal Norte',
        direccion: 'Av. Norte #45, Col. Las Flores, Durango, Dgo.',
        telefono: '618-555-0102',
        horarioLV: '8:00 A.M - 8:00 P.M.',
        horarioSab: '9:00 A.M - 2:00 P.M.',
    },
    {
        id: 3,
        nombre: 'Sucursal Sur',
        direccion: 'Blvd. Sur #200, Col. El Parque, Durango, Dgo.',
        telefono: '618-555-0103',
        horarioLV: '9:00 A.M - 7:00 P.M.',
        horarioSab: '9:00 A.M - 1:00 P.M.',
    },
];

// --- COMPONENTE: Tarjeta de Resultado ---
type ResultadoOficinaCardProps = { oficina: Oficina };
const ResultadoOficinaCard: React.FC<ResultadoOficinaCardProps> = ({ oficina }) => (
    <div className="bg-white rounded-xl p-6 mb-4 border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-md">
        <h3 className="text-lg font-bold text-gray-800 mb-1">{oficina.nombre}</h3>
        <p className="text-gray-600 text-sm mb-2">
            <strong>Dirección:</strong> {oficina.direccion}
        </p>
        <p className="text-gray-600 text-sm mb-2">
            <strong>Número de teléfono:</strong> {oficina.telefono}
        </p>
        <p className="text-gray-600 text-sm">
            <strong>Horarios:</strong> <span className="font-semibold">{oficina.horarioLV}</span> <span className="text-pink-500">(Lunes - Viernes)</span>
        </p>
        <p className="text-gray-600 text-sm">
            <span className="font-semibold">{oficina.horarioSab}</span> <span className="text-pink-500">(Sábados)</span>
        </p>
    </div>
);

// --- COMPONENTE: Panel de Resultados (Lado Derecho) ---
type PanelResultadosProps = { resultados: Oficina[] };
const PanelResultados: React.FC<PanelResultadosProps> = ({ resultados }) => {
    if (resultados.length === 0) {
        // Vista predeterminada (Imagen 1)
        return (
            <div className="bg-gray-50 h-full p-8 rounded-xl flex flex-col items-center justify-center text-center text-gray-500 min-h-[500px] shadow-inner">
                <IoInformationCircleOutline className="w-10 h-10 mb-4" />
                <p className="text-lg">Realiza una búsqueda para ver los detalles aquí.</p>
            </div>
        );
    }

    // Vista con resultados (Imagen 2)
    return (
        <div className="bg-gray-50 h-full p-6 rounded-xl min-h-[500px] shadow-inner">
            <div className="flex items-center mb-6">
                <IoStorefrontOutline className="w-8 h-8 text-pink-500 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Sucursales Encontradas</h2>
            </div>
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                {resultados.map((oficina) => (
                    <ResultadoOficinaCard key={oficina.id} oficina={oficina} />
                ))}
            </div>
        </div>
    );
};

// --- COMPONENTE PRINCIPAL ---
export default function UbicacionOficinas() {
    const router = useRouter();
    const [estadoSeleccionado, setEstadoSeleccionado] = useState('');
    const [municipioSeleccionado, setMunicipioSeleccionado] = useState('');
    const [resultados, setResultados] = useState<Oficina[]>([]); // Inicia vacío para mostrar la vista 1

    // Simula la acción de búsqueda
    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        // Simulación: Solo muestra resultados si ambos campos están seleccionados
        if (estadoSeleccionado && municipioSeleccionado) {
            setResultados(OFICINAS_MOCK); // Muestra la lista mock (Vista 2)
        } else {
            setResultados([]); // Muestra la vista de información (Vista 1)
        }
    };

    return (
        <div className="bg-white min-h-screen flex flex-col">
            <NavbarCorreos />
            
            <main className="flex-grow">
                <div className="max-w-7xl mx-auto px-6 py-16">
                    
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        
                        {/* --- Panel Izquierdo: Formulario --- */}
                        <div className="lg:col-span-1">
                            
                            {/* --- FLECHA REGRESAR --- */}
                            <button
                                onClick={() => router.back()}
                                className="flex items-center text-gray-600 hover:text-pink-500 transition-colors mb-8"
                            >
                                <IoArrowBackOutline className="w-5 h-5 mr-2" />
                                <span className="font-semibold">Regresar</span>
                            </button>
                            {/* -------------------- */}

                            <span className="inline-block px-4 py-1 text-sm font-medium text-pink-500 bg-pink-50 rounded-full mb-4">
                                Encuentra una oficina
                            </span>
                            
                            <h1 className="text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
                                Ubicación de Oficinas Postales
                            </h1>
                            <p className="text-lg text-gray-600 mb-10">
                                Obtén fácilmente la ubicación de las oficinas postales en tu ciudad.
                            </p>

                            <form onSubmit={handleSearch} className="space-y-6">
                                {/* Select de Estado */}
                                <div>
                                    <label htmlFor="estado" className="sr-only">Estado</label>
                                    <div className="relative">
                                        <select
                                            id="estado"
                                            value={estadoSeleccionado}
                                            onChange={(e) => setEstadoSeleccionado(e.target.value)}
                                            className="w-full pl-4 pr-10 py-3 border border-gray-300 rounded-md shadow-sm bg-white appearance-none cursor-pointer focus:outline-none focus:ring-pink-500 focus:border-pink-500 text-gray-500"
                                        >
                                            <option value="">Selecciona un estado</option>
                                            <option value="Durango">Durango</option>
                                            <option value="Jalisco">Jalisco</option>
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                                        </div>
                                    </div>
                                </div>

                                {/* Select de Municipio */}
                                <div>
                                    <label htmlFor="municipio" className="sr-only">Municipio</label>
                                    <div className="relative">
                                        <select
                                            id="municipio"
                                            value={municipioSeleccionado}
                                            onChange={(e) => setMunicipioSeleccionado(e.target.value)}
                                            className="w-full pl-4 pr-10 py-3 border border-gray-300 rounded-md shadow-sm bg-white appearance-none cursor-pointer focus:outline-none focus:ring-pink-500 focus:border-pink-500 text-gray-500"
                                        >
                                            <option value="">Selecciona un municipio</option>
                                            <option value="Durango">Durango</option>
                                            <option value="Gomez Palacio">Gómez Palacio</option>
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                                        </div>
                                    </div>
                                </div>

                                {/* Botón de Búsqueda */}
                                <button
                                    type="submit"
                                    className="w-full flex items-center justify-center px-8 py-3 mt-4 text-white bg-pink-500 hover:bg-pink-600 rounded-lg font-bold shadow-lg transition-all duration-300 ease-in-out transform hover:scale-[1.005] active:scale-[0.99] focus:outline-none focus:ring-4 focus:ring-pink-300"
                                >
                                    Realizar búsqueda
                                </button>
                            </form>
                        </div>
                        
                        {/* --- Panel Derecho: Resultados --- */}
                        <div className="lg:col-span-2">
                            <PanelResultados resultados={resultados} />
                        </div>
                    </div>
                </div>
            </main>

            <Foterr />
        </div>
    );
}