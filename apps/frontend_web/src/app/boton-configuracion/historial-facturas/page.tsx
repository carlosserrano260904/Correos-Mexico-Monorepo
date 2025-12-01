'use client'
import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Plantilla } from '@/components/plantilla';
import { 
  IoDocumentTextOutline, 
  IoEyeOutline, 
  IoDownloadOutline,
  IoCheckmarkCircleOutline,
  IoTimeOutline,
  IoAlertCircleOutline,
  IoSearchOutline,
  IoRefreshOutline
} from "react-icons/io5";
import BotonRegresar from '@/components/BotonRegresar';

// --- 1. DEFINICIÓN DE TIPOS (CONTRATO DE DATOS) ---
interface Factura {
  id: string | number;
  numero: string;       
  fecha: string;        
  monto: number;        
  estado: 'pagada' | 'pendiente' | 'vencida'; 
  sucursal: string;     
  urlPdf?: string;      
}

export default function HistorialFacturasPage() {
  // --- ESTADOS ---
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'todas' | 'pagadas' | 'pendientes'>('todas');

  // --- 2. FUNCIÓN DE CARGA DE DATOS (SIMULANDO BACKEND) ---
  const fetchFacturas = async () => {
    try {
      setLoading(true);
      setError(null);

      // SIMULACIÓN DE RETRASO DE RED
      await new Promise(resolve => setTimeout(resolve, 800));

      // SIMULACIÓN DE DATOS
      const mockData: Factura[] = [
        { id: 1, numero: '000245', fecha: '2025-08-11', monto: 1200.00, estado: 'pagada', sucursal: 'CorreosClic' },
        { id: 2, numero: '000248', fecha: '2025-08-05', monto: 550.50, estado: 'pagada', sucursal: 'CorreosClic' },
        { id: 3, numero: '000245', fecha: '2025-07-11', monto: 1800.00, estado: 'pendiente', sucursal: 'CorreosClic' },
        { id: 4, numero: '000242', fecha: '2025-07-01', monto: 1800.00, estado: 'vencida', sucursal: 'CorreosClic' },
        { id: 5, numero: '000100', fecha: '2025-06-20', monto: 200.00, estado: 'pagada', sucursal: 'Sucursal Centro' },
      ];

      setFacturas(mockData);

    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar las facturas. Intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFacturas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- 3. LÓGICA DE FILTRADO ---
  const filteredData = useMemo(() => {
    return facturas.filter(f => {
      const matchText = f.numero.includes(searchTerm) || f.sucursal.toLowerCase().includes(searchTerm.toLowerCase());
      
      let matchStatus = true;
      if (statusFilter === 'pagadas') matchStatus = f.estado === 'pagada';
      if (statusFilter === 'pendientes') matchStatus = f.estado === 'pendiente' || f.estado === 'vencida'; 

      return matchText && matchStatus;
    });
  }, [facturas, searchTerm, statusFilter]);

  // --- 4. AGRUPACIÓN POR FECHA ---
  const groupedFacturas = useMemo(() => {
    const groups: Record<string, Factura[]> = {};
    const sorted = [...filteredData].sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

    sorted.forEach(factura => {
      const date = new Date(factura.fecha + 'T00:00:00'); 
      const monthName = date.toLocaleString('es-MX', { month: 'long' });
      const year = date.getFullYear();
      const groupKey = `${monthName} de ${year}`; 
      const capitalizedKey = groupKey.charAt(0).toUpperCase() + groupKey.slice(1);

      if (!groups[capitalizedKey]) groups[capitalizedKey] = [];
      groups[capitalizedKey].push(factura);
    });
    return groups;
  }, [filteredData]);

  // --- HELPERS VISUALES ---
  const formatCurrency = (val: number) => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(val);
  const formatDate = (iso: string) => {
    const d = new Date(iso + 'T00:00:00');
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  };

  const getStatusConfig = (estado: string) => {
    switch (estado) {
      case 'pagada': return { color: 'text-[#6BC146]', icon: <IoCheckmarkCircleOutline className="text-xl mr-1"/>, label: 'Pagada' };
      case 'pendiente': return { color: 'text-[#D4AF37]', icon: <IoTimeOutline className="text-xl mr-1"/>, label: 'Pendiente' };
      case 'vencida': return { color: 'text-[#E91E63]', icon: <IoAlertCircleOutline className="text-xl mr-1"/>, label: 'Vencida' };
      default: return { color: 'text-gray-500', icon: null, label: estado };
    }
  };

  const countAll = facturas.length;
  const countPaid = facturas.filter(f => f.estado === 'pagada').length;
  const countPending = facturas.filter(f => f.estado === 'pendiente' || f.estado === 'vencida').length;

  return (
    <Plantilla>
      <div className="w-full min-h-screen bg-white font-sans text-slate-800">
        <div className="max-w-6xl mx-auto px-4 py-10">

            <BotonRegresar />
          
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-black">Historial de Facturas</h1>
            <button onClick={fetchFacturas} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors" title="Recargar datos">
              <IoRefreshOutline size={24}/>
            </button>
          </div>

          {/* --- BARRA DE CONTROL --- */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-10">
            <div className="relative w-full lg:w-[450px]">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                <IoSearchOutline size={20}/>
              </div>
              <input 
                type="text"
                placeholder="Buscar por número o sucursal..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#F5F5F5] text-gray-800 rounded-lg py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-pink-200 transition-all placeholder-gray-400"
              />
            </div>

            <div className="flex gap-2 bg-white p-1 overflow-x-auto w-full lg:w-auto">
              {[
                { key: 'todas', label: 'Todas', count: countAll, activeClass: 'bg-pink-50 border-pink-200 text-[#E91E63]', badge: 'bg-[#E91E63]' },
                { key: 'pagadas', label: 'Pagadas', count: countPaid, activeClass: 'bg-green-50 border-green-200 text-green-700', badge: 'bg-green-600' },
                { key: 'pendientes', label: 'Pendientes', count: countPending, activeClass: 'bg-yellow-50 border-yellow-200 text-yellow-700', badge: 'bg-yellow-600' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setStatusFilter(tab.key as any)}
                  className={`
                    flex items-center px-5 py-2 rounded-full text-sm font-medium transition-all border whitespace-nowrap
                    ${statusFilter === tab.key ? tab.activeClass : 'bg-[#F3F3F3] border-transparent text-gray-500 hover:bg-gray-200'}
                  `}
                >
                  {tab.label}
                  <span className={`ml-2 text-[10px] py-0.5 px-2 rounded-full text-white ${statusFilter === tab.key ? tab.badge : 'bg-gray-400'}`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* --- CONTENIDO --- */}
          {loading ? (
             <div className="py-20 text-center text-gray-400 animate-pulse">
                <p>Cargando facturas...</p>
             </div>
          ) : error ? (
            <div className="py-10 text-center text-red-500 bg-red-50 rounded-xl border border-red-100">
              <p>{error}</p>
            </div>
          ) : Object.keys(groupedFacturas).length === 0 ? (
            <div className="py-20 text-center text-gray-400 bg-[#F9F9F9] rounded-2xl border border-dashed border-gray-200">
              <p>No se encontraron facturas con esos criterios.</p>
            </div>
          ) : (
            <div className="space-y-12">
              {Object.entries(groupedFacturas).map(([mesAnio, listaFacturas]) => (
                <div key={mesAnio} className="animate-fade-in-up">
                  <h2 className="text-xl font-bold text-black mb-5">{mesAnio}</h2>
                  
                  <div className="space-y-4">
                    {listaFacturas.map((factura) => {
                       const statusStyle = getStatusConfig(factura.estado);
                       return (
                        <div 
                          key={factura.id}
                          className="group w-full bg-[#F9F9F9] hover:bg-white hover:shadow-md border border-transparent hover:border-gray-100 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 transition-all duration-200"
                        >
                          {/* Info Principal */}
                          <div className="flex items-start gap-4 w-full md:w-1/3">
                            <div className="p-3 bg-white border border-gray-200 rounded-lg text-black shrink-0">
                              <IoDocumentTextOutline size={28} />
                            </div>
                            <div>
                              <h3 className="text-lg font-bold text-gray-900">Factura #{factura.numero}</h3>
                              <p className="text-sm text-gray-500">{formatDate(factura.fecha)}</p>
                              <p className="md:hidden font-bold text-black mt-1">{formatCurrency(factura.monto)}</p>
                            </div>
                          </div>

                          {/* Precio y Estado */}
                          <div className="flex-1 w-full md:w-1/3 flex flex-row md:flex-col lg:flex-row items-center justify-between md:justify-center gap-4">
                            <p className="hidden md:block font-bold text-lg text-black w-28">
                              {formatCurrency(factura.monto)}
                            </p>
                            
                            <div className={`flex items-center font-semibold ${statusStyle.color}`}>
                              {statusStyle.icon}
                              <span>{statusStyle.label}</span>
                            </div>
                          </div>

                          {/* Acciones */}
                          <div className="w-full md:w-1/3 flex flex-row md:flex-col lg:flex-row items-center justify-between lg:justify-end gap-4 mt-2 md:mt-0">
                             <div className="flex gap-2">
                                {/* AQUÍ ESTÁ EL CAMBIO SOLICITADO: REDIRECCIÓN */}
                                <Link 
                                  href="/boton-configuracion/historial-facturas/detalles-factura"
                                  className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-full transition-colors flex items-center justify-center"
                                  title="Ver detalle"
                                >
                                  <IoEyeOutline size={24} />
                                </Link>

                                <button className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-full transition-colors" title="Descargar PDF">
                                  <IoDownloadOutline size={24} />
                                </button>
                             </div>
                             <span className="text-xs text-gray-400 font-medium">
                               {factura.sucursal}
                             </span>
                          </div>
                        </div>
                       );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </Plantilla>
  );
}