'use client'

import { Plantilla } from "@/app/Administrador/components/plantilla";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { IoSearchOutline, IoChevronDownOutline } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { useConductorStore } from "@/stores/conductorStore";
import { useState, useMemo } from "react";
import { useEffect } from "react";

// Datos de ejemplo para los conductores
/*
const conductores = [
  {
    id: "DG001",
    nombre: "Juan Carlos Méndez",
    curp: "MEMJ850623HDFRRN03",
    rfc: "MEMJ850623A1",
    licenciaVigente: "Sí",
    licencia: "A321456789"
  },
  {
    id: "DG002", 
    nombre: "María López Téllez",
    curp: "LOTM920315MDFRZR02",
    rfc: "LOTM920315AB4",
    licenciaVigente: "No",
    licencia: "B987654321"
  },
  {
    id: "DG003",
    nombre: "Alma Rivera Gómez", 
    curp: "RIGA870901MDFRTM06",
    rfc: "RIGA870901EF2",
    licenciaVigente: "Sí",
    licencia: "D456123789"
  }
];
*/

/*
export default function ConductoresPage() {
  const conductores = useConductorStore((state)=> state.conductores)
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Filtrado de conductores
  const filteredConductores = useMemo(() => {
    let filtered = conductores;
    
    // Filtro por búsqueda
    if (searchTerm) {
      filtered = filtered.filter((conductor) =>
        (conductor.claveOficina || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (conductor.nombre || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (conductor.curp || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (conductor.rfc || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (conductor.licencia || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro por status (case-insensitive)
    if (statusFilter) {
      filtered = filtered.filter((conductor) => {
        const licenciaStatus = (conductor.licenciaVigente || '').toLowerCase();
        return licenciaStatus === statusFilter.toLowerCase();
      });
    }

    return filtered;
  }, [conductores, searchTerm, statusFilter]);
  */

  export default function ConductoresPage() {
    const conductores = useConductorStore((state) => state.conductores)
    const fetchConductores = useConductorStore((state)=> state.fetchConductores)
    const router = useRouter();

    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("");

    useEffect(()=> {
      fetchConductores();
    }, [fetchConductores]);

    console.log("Conductores cargados:", conductores);

    const filteredConductores = useMemo(() => {
      let filtered = conductores;
      // Filtro por búsqueda solo en nombre, curp y rfc
      


      if (searchTerm) {
        filtered = filtered.filter((conductor) =>
          (conductor.nombreCompleto || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
          (conductor.curp || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
          (conductor.rfc || '').toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      // Filtro por estado de licencia
      if (statusFilter) {
        filtered = filtered.filter((conductor) =>
          conductor.licenciaVigente === (statusFilter === "true")
        );
      }
      return filtered;
    }, [conductores, searchTerm, statusFilter]);

    

    


  return (
    <div>
      <Plantilla title="">
        <div className="flex flex-col space-y-6">
          {/* Header con título y botón */}
          <div className="flex justify-between items-center -mt-2">
            <h1 className="text-2xl font-semibold text-gray-900">Conductores</h1>
            <Button 
              className="bg-slate-800 hover:bg-slate-700 text-white"
              onClick={() => router.push('/Administrador/app/Conductores/crear')}
            >
              Crear conductores
            </Button>
          </div>

          {/* Línea separadora */}
          <div className="border-t border-gray-200"></div>

          {/* Búsqueda y Status */}
          <div className="flex items-center gap-4">
            <div className="relative w-72">
              <IoSearchOutline className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input 
                type="text"
                placeholder="Buscar por clave, nombre, CURP, RFC o licencia"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
            
            {/* Dropdown de Status */}
            <div className="relative">
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-md px-4 py-2 pr-8 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Todos los estados</option>
                <option value="true">Vigente</option>
                <option value="false">No Vigente</option>
              </select>
              <IoChevronDownOutline className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
            </div>
          </div>

          {/* Tabla de conductores con nombre, curp, RFC, licencia y estado de licencia */}
          <div className="rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-white">
                  <TableHead className="font-medium text-gray-600 text-sm border-0">Nombre</TableHead>
                  <TableHead className="font-medium text-gray-600 text-sm border-0">CURP</TableHead>
                  <TableHead className="font-medium text-gray-600 text-sm border-0">RFC</TableHead>
                  <TableHead className="font-medium text-gray-600 text-sm border-0">Licencia</TableHead>
                  <TableHead className="font-medium text-gray-600 text-sm border-0">Estado Licencia</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredConductores.map((conductor, index) => (
                  <TableRow key={conductor.curp || index} className="hover:bg-gray-50 border-b border-gray-100">
                    <TableCell className="text-gray-700 text-sm border-0">{conductor.nombreCompleto}</TableCell>
                    <TableCell className="text-gray-700 text-sm border-0">{conductor.curp || conductor.CURP}</TableCell>
                    <TableCell className="text-gray-700 text-sm border-0">{conductor.rfc || conductor.RFC}</TableCell>
                    <TableCell className="text-gray-700 text-sm border-0">{conductor.licencia}</TableCell>
                    <TableCell>
                      {conductor.licenciaVigente  ? (
                        <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs">No Vigente</span>
                      ) : (
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">Vigente</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </Plantilla>
    </div>
  )
}
