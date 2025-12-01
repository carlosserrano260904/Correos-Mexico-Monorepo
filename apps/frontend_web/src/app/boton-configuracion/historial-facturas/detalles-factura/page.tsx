'use client'
import React, { useState, useEffect } from 'react';
import { Plantilla } from '@/components/plantilla';
// Usamos iconos de react-icons que se parecen al diseño
import { IoDocumentText, IoDownloadOutline } from "react-icons/io5";
import BotonRegresar from '@/components/BotonRegresar';

// --- 1. INTERFACES (El contrato con el Backend) ---
// Definimos la estructura de un ítem individual
interface InvoiceItem {
    id: number | string;
    description: string;
    price: number;
}

// Definimos la estructura principal de la factura
interface InvoiceDetails {
    id: string; // ID interno de base de datos
    invoiceNumber: string; // El número visible (ej: FAC-1001)
    issueDateFormatted: string; // Fecha ya formateada (ej: "10 Oct 2025")
    clientName: string;
    clientEmail: string;
    clientAddress: string;
    items: InvoiceItem[]; // Array de productos
    total: number;
    pdfUrl?: string; // URL opcional para descargar
}

export default function FacturaVisualPage() {
    // --- 2. ESTADOS ---
    // data inicializado en null esperando datos
    const [data, setData] = useState<InvoiceDetails | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    // --- 3. SIMULACIÓN DE FETCH AL BACKEND ---
    useEffect(() => {
        const fetchInvoiceDetails = async () => {
            setLoading(true);
            
            // TODO BACKEND: Reemplazar esto con fetch real:
            // const res = await fetch('/api/invoices/FAC-1001');
            // const mockResponse = await res.json();

            // SIMULACIÓN DE RETRASO DE RED (1 segundo)
            await new Promise(resolve => setTimeout(resolve, 1000));

            // DATOS MOCK (Idénticos a la imagen)
            const mockResponse: InvoiceDetails = {
                id: "12345",
                invoiceNumber: "FAC-1001",
                issueDateFormatted: "10 Oct 2025",
                clientName: "Juan Lopez",
                clientEmail: "juan@example.com",
                clientAddress: "Calle Reforma #123, Durango",
                items: [
                    { id: 1, description: "Audífonos Bluetooth", price: 599.00 },
                    { id: 2, description: "Teclado mecánico", price: 899.00 },
                    { id: 3, description: "Envío estándar", price: 49.00 },
                ],
                total: 1499.00,
                pdfUrl: "#" // Link dummy
            };

            setData(mockResponse);
            setLoading(false);
        };

        fetchInvoiceDetails();
    }, []);

    // Helper para formatear moneda (MXN)
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-MX', { 
            style: 'currency', 
            currency: 'MXN',
            minimumFractionDigits: 0, // Según diseño no muestra centavos si son 00
            maximumFractionDigits: 2
        }).format(amount);
    };


    // --- RENDERIZADO ---
    return (
        <Plantilla>
            <div className="w-full min-h-screen bg-[#F8F9FA] font-sans text-slate-800 p-4 md:p-8">
                <div className="max-w-4xl mx-auto">

                    <BotonRegresar />

                    {/* Título Principal */}
                    <h1 className="text-3xl font-bold text-black mb-8">
                        {loading ? "Cargando factura..." : `Factura ${data?.invoiceNumber}`}
                    </h1>

                    {/* Tarjeta Principal */}
                    <div className="bg-white rounded-[16px] border border-gray-200 shadow-sm p-6 md:p-10">
                        
                        {loading ? (
                            // --- SKELETON LOADING (Esqueleto mientras carga) ---
                            <div className="animate-pulse space-y-8">
                                <div className="flex gap-4 items-center">
                                    <div className="w-16 h-16 bg-pink-100 rounded-lg"></div>
                                    <div className="space-y-3">
                                        <div className="h-6 bg-gray-200 rounded w-48"></div>
                                        <div className="h-4 bg-gray-200 rounded w-32"></div>
                                    </div>
                                </div>
                                <div className="border-b border-gray-100 my-6"></div>
                                <div className="space-y-4">
                                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                </div>
                                <div className="h-48 bg-gray-100 rounded"></div>
                            </div>
                        ) : data ? (
                            // --- CONTENIDO REAL ---
                            <>
                                {/* Cabecera de la Tarjeta */}
                                <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
                                    {/* Icono Rosado */}
                                    <div className="bg-pink-100 p-4 rounded-xl shrink-0">
                                        <IoDocumentText className="text-[#E91E63]" size={40} />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900 mb-1">
                                            Factura #{data.invoiceNumber}
                                        </h2>
                                        <p className="text-gray-500 text-lg">
                                            Emitida el {data.issueDateFormatted}
                                        </p>
                                    </div>
                                </div>

                                {/* Línea divisoria */}
                                <hr className="border-gray-200 my-8" />

                                {/* Datos del Cliente */}
                                <div className="space-y-3 text-lg mb-10">
                                    <div className="flex flex-col md:flex-row">
                                        <span className="font-bold text-gray-900 w-32">Cliente:</span>
                                        <span className="text-gray-600">{data.clientName}</span>
                                    </div>
                                    <div className="flex flex-col md:flex-row">
                                        <span className="font-bold text-gray-900 w-32">Correo:</span>
                                        <span className="text-gray-600">{data.clientEmail}</span>
                                    </div>
                                    <div className="flex flex-col md:flex-row">
                                        <span className="font-bold text-gray-900 w-32">Direccion:</span>
                                        <span className="text-gray-600">{data.clientAddress}</span>
                                    </div>
                                </div>

                                {/* Detalles de Compra */}
                                <div className="mb-10">
                                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                                        Detalles de compra
                                    </h3>
                                    <ul className="space-y-3 pl-5 list-disc marker:text-gray-400 text-lg text-gray-600">
                                        {data.items.map((item) => (
                                            <li key={item.id} className="pl-2">
                                                {item.description} - <span className="font-medium text-gray-800">{formatCurrency(item.price)}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Total */}
                                <div className="flex justify-between items-center mb-10">
                                    <span className="text-xl font-bold text-gray-900">Total:</span>
                                    <span className="text-3xl font-bold text-gray-900">
                                        {formatCurrency(data.total)}
                                    </span>
                                </div>

                                {/* Botón Descargar */}
                                <div>
                                    <button 
                                        onClick={() => window.open(data.pdfUrl, '_blank')}
                                        className="w-full bg-[#E91E63] hover:bg-[#D81557] text-white font-bold text-lg py-4 px-6 rounded-[12px] flex items-center justify-center gap-3 transition-colors shadow-sm"
                                    >
                                        <IoDownloadOutline size={28} />
                                        Descargar PDF
                                    </button>
                                </div>
                            </>
                        ) : (
                           // Estado de error si no hay datos
                           <p className="text-red-500">Error al cargar la factura.</p>
                        )}

                    </div>
                </div>
            </div>
        </Plantilla>
    );
}