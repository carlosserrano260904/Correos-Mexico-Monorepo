'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation' // <-- NUEVA IMPORTACIÓN
import { IoArrowBackOutline } from 'react-icons/io5' // <-- NUEVA IMPORTACIÓN
import { NavbarCorreos } from '@/components/NavbarCorreos'

export default function TarifasPage() {
    // --- NUEVO HOOK ---
    const router = useRouter() 
    
    // --- ESTADOS ---
    const [origen, setOrigen] = useState('') 
    const [destino, setDestino] = useState('') 
    const [peso, setPeso] = useState('')
    const [alto, setAlto] = useState('')
    const [ancho, setAncho] = useState('')
    const [largo, setLargo] = useState('')
    const [resultado, setResultado] = useState<any>(null)

    const [fase, setFase] = useState('inicial'); // 'inicial', 'datos', 'resultado'
    const [incluirSeguro, setIncluirSeguro] = useState(false);
    const [incluirAcuse, setIncluirAcuse] = useState(false);

    // --- CONSTANTES ---
    const COSTO_SEGURO_ADICIONAL = 20.00;
    const COSTO_ACUSE_RECIBO = 15.00;

    // --- MANEJADORES DE FASE ---
    const handleConsultar = () => {
        if (!origen || !destino) {
            alert("Por favor, ingresa los Códigos Postales de origen y destino.");
            return;
        }
        // Simulación: Pasar a la fase 2 con datos preliminares
        setResultado({
            origen: 'Victoria Durango, Durango.',
            destino: 'Veracruz, Veracruz de Ignacio de la Llave',
            zona: 'Zona ""',
            iva: '0.16%',
            // Datos simulados (serían obtenidos del backend)
            tarifaBase: 250.00,
            pesoFisico: 1.00, // Ejemplo de peso que el CP podría devolver
            pesoVolumetrico: 3.00,
        });
        setFase('datos'); // Cambia a la fase de ingresar dimensiones
    };

    const handleCotizar = () => {
        const p = parseFloat(peso);
        const a = parseFloat(alto);
        const an = parseFloat(ancho);
        const l = parseFloat(largo);

        if (isNaN(p) || isNaN(a) || isNaN(an) || isNaN(l)) {
            alert('Completa todos los campos de dimensiones.');
            return;
        }

        const volumen = (a * an * l) / 5000;
        const pesoCobrado = Math.max(p, volumen);

        // Lógica de cálculo (similar a tu ejemplo anterior)
        const tarifaBruta = 50 + pesoCobrado * 10;
        const ivaMonto = tarifaBruta * 0.16;
        let costoTotal = tarifaBruta + ivaMonto;

        let costoAdicionales = 0;
        if (incluirSeguro) costoAdicionales += COSTO_SEGURO_ADICIONAL;
        if (incluirAcuse) costoAdicionales += COSTO_ACUSE_RECIBO;

        costoTotal += costoAdicionales;

        setResultado(prev => ({
            ...prev,
            pesoVolumetrico: volumen.toFixed(2),
            pesoFisico: p.toFixed(2),
            tarifa: tarifaBruta.toFixed(2),
            ivaMonto: ivaMonto.toFixed(2),
            costoAdicionales: costoAdicionales.toFixed(2),
            total: costoTotal.toFixed(2)
        }));
        setFase('resultado'); // Cambia a la fase de resultados finales
    };

    // La función principal de renderizado
    return (
        <>
            <NavbarCorreos transparent={true} />

            <div
                className="min-h-screen flex flex-col justify-between bg-cover bg-center relative"
                style={{ backgroundImage: 'url("/fondorosa.png")' }}
            >
                <main className="flex-grow px-6 lg:px-20 py-12 pt-54">
                    
                    {/* Contenido principal (Texto y Formulario Izquierda) */}
                    <div className="flex flex-col lg:flex-row gap-16 items-start">
                        
                        {/* LADO IZQUIERDO: Título y Formulario de CPs */}
                        <div className="w-full max-w-sm space-y-8">
                            
                            {/* --- BOTÓN REGRESAR --- */}
                            <button
                                onClick={() => router.back()}
                                className="flex items-center text-gray-600 hover:text-pink-600 transition-colors mb-4"
                            >
                                <IoArrowBackOutline className="w-5 h-5 mr-2" />
                                Regresar
                            </button>
                            {/* -------------------- */}

                            {/* Etiqueta */}
                            <p className="inline-block bg-pink-100 text-pink-600 px-3 py-1 rounded-full text-sm font-medium">
                                Cotizar un envío
                            </p>
                            
                            {/* Título Principal */}
                            <h1 className="text-5xl font-bold text-gray-900 leading-tight">
                                MEXPOST <span className="text-pink-600">Nacional</span>
                            </h1>

                            {/* Subtexto */}
                            <p className="text-gray-600">
                                Consulta los detalles de un paquete y cotiza su envío con los servicios de MEXPOST Nacional.
                            </p>

                            {/* Formulario de CPs */}
                            <div className="flex gap-4">
                                <div>
                                    <label className="block text-gray-700 mb-1">Código postal origen</label>
                                    <input
                                        type="text"
                                        value={origen}
                                        onChange={(e) => setOrigen(e.target.value)}
                                        placeholder="####"
                                        className="w-full px-4 py-3 border rounded-lg border-gray-300 bg-white shadow-sm focus:ring-pink-500 focus:border-pink-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 mb-1">Código postal destino</label>
                                    <input
                                        type="text"
                                        value={destino}
                                        onChange={(e) => setDestino(e.target.value)}
                                        placeholder="####"
                                        className="w-full px-4 py-3 border rounded-lg border-gray-300 bg-white shadow-sm focus:ring-pink-500 focus:border-pink-500"
                                    />
                                </div>
                            </div>
                            
                            {/* Botón Consultar / Realizar Búsqueda */}
                            <button
                                onClick={handleConsultar}
                                className="w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3 rounded-lg shadow-md transition"
                            >
                                {fase === 'inicial' ? 'Consultar detalles' : 'Realizar búsqueda'}
                            </button>
                        </div>

                        {/* LADO DERECHO: Tarjeta de Resultados (RENDERIZADO CONDICIONAL) */}
                        <div className="w-full lg:flex-1">
                            {/* ESTADO INICIAL (Inicial) */}
                            {fase === 'inicial' && (
                                <div className="bg-white rounded-2xl shadow-xl p-8 h-96 flex items-center justify-center">
                                    <div className="text-center text-gray-400 space-y-2">
                                        <span className="text-4xl text-gray-300">ⓘ</span>
                                        <p className="text-lg">Realiza una búsqueda para ver los detalles aquí.</p>
                                    </div>
                                </div>
                            )}

                            {/* ESTADO DATOS (Ingresar Dimensiones) */}
                            {fase === 'datos' && resultado && (
                                <div className="bg-white rounded-2xl shadow-xl p-8 w-full">
                                    <div className="flex items-center gap-3 mb-6">
                                        <h2 className="text-2xl font-semibold text-gray-800">Datos del Envío</h2>
                                    </div>
                                    
                                    {/* Información preliminar de CPs */}
                                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-700 mb-6 text-center border-b pb-4">
                                        <p><strong>Origen:</strong> {resultado.origen}</p>
                                        <p><strong>Destino:</strong> {resultado.destino}</p>
                                        <p><strong>Zona:</strong> {resultado.zona}</p>
                                        <p><strong>IVA:</strong> {resultado.iva}</p>
                                    </div>

                                    {/* Dimensiones y Peso */}
                                    <h3 className="text-xl font-medium mb-4 text-gray-800">Dimensiones</h3>
                                    <div className="grid grid-cols-2 gap-x-4 gap-y-6">
                                        
                                        {/* Peso */}
                                        <div className="space-y-1">
                                            <label className="text-sm text-gray-600">Peso en kilogramos</label>
                                            <input type="number" value={peso} onChange={(e) => setPeso(e.target.value)} placeholder="####" 
                                                className="w-full px-4 py-3 border rounded-lg bg-gray-50 border-gray-200 focus:border-pink-500" />
                                        </div>
                                        {/* Alto */}
                                        <div className="space-y-1">
                                            <label className="text-sm text-gray-600">Alto en centímetros</label>
                                            <input type="number" value={alto} onChange={(e) => setAlto(e.target.value)} placeholder="####" 
                                                className="w-full px-4 py-3 border rounded-lg bg-gray-50 border-gray-200 focus:border-pink-500" />
                                        </div>
                                        {/* Ancho */}
                                        <div className="space-y-1">
                                            <label className="text-sm text-gray-600">Ancho en centímetros</label>
                                            <input type="number" value={ancho} onChange={(e) => setAncho(e.target.value)} placeholder="####" 
                                                className="w-full px-4 py-3 border rounded-lg bg-gray-50 border-gray-200 focus:border-pink-500" />
                                        </div>
                                        {/* Largo */}
                                        <div className="space-y-1">
                                            <label className="text-sm text-gray-600">Largo en centímetros</label>
                                            <input type="number" value={largo} onChange={(e) => setLargo(e.target.value)} placeholder="####" 
                                                className="w-full px-4 py-3 border rounded-lg bg-gray-50 border-gray-200 focus:border-pink-500" />
                                        </div>
                                    </div>
                                    
                                    {/* Botón Cotizar */}
                                    <button
                                        onClick={handleCotizar}
                                        className="w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3 rounded-lg shadow-md transition mt-8"
                                    >
                                        Cotizar
                                    </button>
                                </div>
                            )}

                            {/* ESTADO RESULTADO (Precio y Opciones) */}
                            {fase === 'resultado' && resultado && (
                                <div className="bg-white rounded-2xl shadow-xl p-8 w-full">
                                    <div className="flex items-center gap-3 mb-6">
                                        <h2 className="text-2xl font-semibold text-gray-800">Detalles del Servicio</h2>
                                    </div>

                                    {/* Datos de Peso y Tarifa */}
                                    <div className="grid grid-cols-4 gap-8 mb-6 text-center">
                                        <div>
                                            <p className="text-sm text-gray-500">Peso físico</p>
                                            <p className="font-semibold text-lg">{resultado.pesoFisico} kg</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Peso volumétrico</p>
                                            <p className="font-semibold text-lg">{resultado.pesoVolumetrico} kg</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Tarifa (sin IVA)</p>
                                            <p className="font-semibold text-lg">${resultado.tarifa}</p>
                                        </div>
                                        {/* Seccion IVA */}
                                        <div className="col-span-1">
                                            <p className="text-sm text-gray-500">IVA</p>
                                            <p className="font-semibold text-lg">${resultado.ivaMonto}</p>
                                        </div>
                                    </div>

                                    {/* Opciones de Servicio (Seguro y Acuse) */}
                                    <div className="flex justify-between items-center py-2 border-b">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={incluirSeguro}
                                                onChange={() => setIncluirSeguro(!incluirSeguro)}
                                                className="form-checkbox text-pink-600 rounded"
                                            />
                                            <span className="text-gray-700">Incluir seguro</span>
                                        </label>
                                        <p className="text-sm text-gray-500">+ ${COSTO_SEGURO_ADICIONAL.toFixed(2)}</p>
                                    </div>
                                    
                                    <div className="flex justify-between items-center py-2 border-b mb-6">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={incluirAcuse}
                                                onChange={() => setIncluirAcuse(!incluirAcuse)}
                                                className="form-checkbox text-pink-600 rounded"
                                            />
                                            <span className="text-gray-700">Acuse de recibo</span>
                                        </label>
                                        <p className="text-sm text-gray-500">+ ${COSTO_ACUSE_RECIBO.toFixed(2)}</p>
                                    </div>

                                    {/* Costo Final */}
                                    <div className="bg-green-100/50 p-4 rounded-lg text-center mb-6">
                                        <p className="text-xl font-bold text-green-700">
                                            Costo del envío
                                        </p>
                                        <p className="text-3xl font-extrabold text-green-700">
                                            ${resultado.total}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">IVA: ${resultado.ivaMonto}</p>
                                    </div>

                                    {/* Botón de Nueva Cotización (Reinicia el proceso) */}
                                    <button
                                        onClick={() => setFase('inicial')}
                                        className="w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3 rounded-lg shadow-md transition"
                                    >
                                        Nueva cotización
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </main>

                {/* footer*/}
                <footer className="bg-gray-100 border-t border-gray-200 py-6 text-sm text-gray-600 text-center flex flex-wrap justify-center gap-6 px-4 font-semibold">
                    <span className="cursor-pointer hover:underline">Términos y condiciones</span>
                    <span className="cursor-pointer hover:underline">Promociones</span>
                    <span className="cursor-pointer hover:underline">Cómo cuidamos tu privacidad</span>
                    <span className="cursor-pointer hover:underline">Accesibilidad</span>
                    <span className="cursor-pointer hover:underline">Ayuda</span>
                </footer>
            </div>
        </>
    )
}