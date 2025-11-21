'use client'

import { useState } from 'react'
import { NavbarCorreos } from '@/components/NavbarCorreos'

export default function TarifasPage() {
const [origen, setOrigen] = useState('')
const [destino, setDestino] = useState('')
const [peso, setPeso] = useState('')
const [alto, setAlto] = useState('')
const [ancho, setAncho] = useState('')
const [largo, setLargo] = useState('')
const [resultado, setResultado] = useState<any>(null)

const handleBuscar = () => {
    const p = parseFloat(peso)
    const a = parseFloat(alto)
    const an = parseFloat(ancho)
    const l = parseFloat(largo)

    if (isNaN(p) || isNaN(a) || isNaN(an) || isNaN(l)) {
    alert('Completa todos los campos.')
    return
    }

    const volumen = (a * an * l) / 5000
    const pesoCobrado = Math.max(p, volumen)
    const total = (50 + pesoCobrado * 10) * 1.16

    setResultado({
    origen: 'Ciudad, Municipio, Estado.',
    destino: 'Ciudad, Municipio, Estado.',
    zona: 'X',
    iva: '0.16%',
    pesoCobrado: pesoCobrado.toFixed(2),
    total: total.toFixed(2)
    })
}

return (
    <>
    <NavbarCorreos transparent={true} />

    <div
        className="min-h-screen flex flex-col justify-between bg-cover bg-center relative"
        style={{ backgroundImage: 'url("/fondorosa.png")' }}
    >
        <main className="flex-grow px-6 lg:px-20 py-12 pt-54">
        {/* Título*/}
        <h1 className="text-6xl font-bold text-gray-900 mb-14">
            MexPost <span className="text-pink-600">Nacional</span><span className="text-gray-900">.</span>
        </h1>

          {/* Contenedor dividido */}
        <div className="flex flex-col lg:flex-row gap-16 items-start">
            {/* Formulario*/}
            <div className="w-full max-w-xs space-y-5">
            <div>
                <label className="block font-semibold text-sm text-gray-700 mb-1">Código postal origen:</label>
                <input
                type="text"
                value={origen}
                onChange={(e) => setOrigen(e.target.value)}
                placeholder="xxxx"
                className="w-full px-4 py-2 border rounded-full border-gray-300 bg-white shadow-sm"
                />
            </div>
            <div>
                <label className="block font-semibold text-sm text-gray-700 mb-1">Código postal destino:</label>
                <input
                type="text"
                value={destino}
                onChange={(e) => setDestino(e.target.value)}
                placeholder="xxxx"
                className="w-full px-4 py-2 border rounded-full border-gray-300 bg-white shadow-sm"
                />
            </div>
            <button
                onClick={handleBuscar}
                className="w-full bg-lime-500 hover:bg-lime-600 text-white font-bold py-2 rounded-full shadow-md transition"
            >
                Buscar
            </button>
            </div>

            {/* tarjeta de resultados */}
            <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-2xl">
            <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Datos de envío</h2>
            <div className="flex flex-col md:flex-row items-start gap-6">
                {/* texto de resultados */}
                <div className="flex-1 text-gray-800 space-y-1 text-sm">
                <p><strong>Origen:</strong> {resultado?.origen || 'Ciudad, Municipio, Estado.'}</p>
                <p><strong>Destino:</strong> {resultado?.destino || 'Ciudad, Municipio, Estado.'}</p>
                <p><strong>Zona:</strong> {resultado?.zona || 'X'}</p>
                <p><strong>IVA:</strong> {resultado?.iva || '0.16 %'}</p>

                  {/* campos de peso y dimensiones */}
                <div className="grid grid-cols-2 gap-2 mt-4 text-gray-700">
                    <label>Peso:</label>
                    <input type="number" value={peso} onChange={(e) => setPeso(e.target.value)} className="px-2 py-1 bg-gray-100 border rounded text-right" />
                    <label>Alto:</label>
                    <input type="number" value={alto} onChange={(e) => setAlto(e.target.value)} className="px-2 py-1 bg-gray-100 border rounded text-right" />
                    <label>Ancho:</label>
                    <input type="number" value={ancho} onChange={(e) => setAncho(e.target.value)} className="px-2 py-1 bg-gray-100 border rounded text-right" />
                    <label>Largo:</label>
                    <input type="number" value={largo} onChange={(e) => setLargo(e.target.value)} className="px-2 py-1 bg-gray-100 border rounded text-right" />
                </div>

                {resultado && (
                    <p className="mt-4 text-base font-bold text-pink-600">
                    Total: ${resultado.total} MXN
                    </p>
                )}
                </div>

                {/* imagen */}
                <div className="w-40 md:w-52">
                <img src="/caja.png" alt="Caja con dimensiones" className="w-full" />
                </div>
            </div>
            </div>
        </div>
        </main>

        {/* footer*/}
        <footer className="bg-white border-t border-gray-200 py-6 text-sm text-gray-600 text-center flex flex-wrap justify-center gap-6 px-4 font-semibold">
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
