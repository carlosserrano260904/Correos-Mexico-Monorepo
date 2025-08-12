'use client'

import { Plantilla } from "@/app/Administrador/components/plantilla";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { IoSearchOutline, IoChevronDownOutline } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { useUnidadStore } from "@/stores/unidadStore";
import { useState, useMemo, useEffect } from "react";

// Datos de ejemplo para las unidades
/*
const unidades = [
  {
    claveOficina: "2959",
    tipoVehiculo: "Camioneta",
    numeroPlaca: "D456123789",
    asignacionConductor: "Sí",
    tarjetaCirculacion: "D456123789"
  },
  {
    claveOficina: "2960", 
    tipoVehiculo: "Automóvil",
    numeroPlaca: "D456123789",
    asignacionConductor: "No",
    tarjetaCirculacion: "D456123789"
  },
  {
    claveOficina: "2961",
    tipoVehiculo: "Camioneta",
    numeroPlaca: "D456123789",
    asignacionConductor: "Sí",
    tarjetaCirculacion: "D456123789"
  },
  {
    claveOficina: "2962",
    tipoVehiculo: "Automóvil",
    numeroPlaca: "D456123789",
    asignacionConductor: "No",
    tarjetaCirculacion: "D456123789"
  }
];
*/
export default function UnidadesPage() {
  const router = useRouter();
  const unidades = useUnidadStore((state) => state.unidades);
  const fetchUnidades = useUnidadStore((state) => state.fetchUnidades);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    fetchUnidades();
  }, [fetchUnidades]);

  // Filtrado de unidades
  const filteredUnidades = useMemo(() => {
    let filtered = unidades;

    // Filtro por búsqueda
    if (searchTerm) {
      filtered = filtered.filter((unidad) =>
        unidad.claveOficina.toLowerCase().includes(searchTerm.toLowerCase()) ||
        unidad.tipoVehiculo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        unidad.placas.toLowerCase().includes(searchTerm.toLowerCase()) ||
        unidad.tarjetaCirculacion.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro por status (asignación de conductor)
    if (statusFilter === "asignado") {
      filtered = filtered.filter((unidad) => unidad.conductor && unidad.conductor !== "S/C");
    } else if (statusFilter === "sin-asignar") {
      filtered = filtered.filter((unidad) => !unidad.conductor || unidad.conductor === "S/C");
    }

    return filtered;
  }, [unidades, searchTerm, statusFilter]); 

  return (
    <div>
      <Plantilla title="">
        <div className="flex flex-col space-y-6">
          {/* Header con título y botón */}
          <div className="flex justify-between items-center -mt-2">
            <h1 className="text-2xl font-semibold text-gray-900">Unidades</h1>
            <Button 
              className="bg-slate-800 hover:bg-slate-700 text-white"
              onClick={() => router.push('/Administrador/app/Unidades/crear')}
            >
              Crear unidades
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
                placeholder="Buscar por clave, tipo, placas, tarjeta o CURP"
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
                <option value="">Todas las asignaciones</option>
                <option value="asignado">Con conductor asignado</option>
                <option value="sin-asignar">Sin conductor</option>
              </select>
              <IoChevronDownOutline className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
            </div>
          </div>

          {/* Tabla de unidades */}
          <div className="rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-white">
                  <TableHead className="font-medium text-gray-600 text-sm border-0">Clave oficina</TableHead>
                  <TableHead className="font-medium text-gray-600 text-sm border-0">Tipo de vehículo</TableHead>
                  <TableHead className="font-medium text-gray-600 text-sm border-0">Número de placa</TableHead>
                  <TableHead className="font-medium text-gray-600 text-sm border-0">Asignación de conductor</TableHead>
                  <TableHead className="font-medium text-gray-600 text-sm border-0">Zona Asignada</TableHead>
                  <TableHead className="font-medium text-gray-600 text-sm border-0">Tarjeta de circulación</TableHead>
                  
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUnidades.map((unidad) => (
                  <TableRow key={unidad.placas} className="hover:bg-gray-50 border-b border-gray-100">
                    <TableCell className="font-medium text-gray-900 text-sm border-0">{unidad.claveOficina}</TableCell>
                    <TableCell className="text-gray-700 text-sm border-0">{unidad.tipoVehiculo}</TableCell>
                    <TableCell className="text-gray-700 text-sm border-0">{unidad.placas}</TableCell>
                    <TableCell className="text-gray-700 text-sm border-0">{unidad.conductor && unidad.conductor !== "S/C" ? unidad.conductor : "S/C"}
                    </TableCell>
                    <TableCell> {unidad.zonaAsignada}</TableCell>
                   {/* <TableCell className="border-0">
                      <Badge 
                        variant={unidad.conductor && unidad.conductor !== "S/C" ? "default" : "destructive"}
                        className={unidad.conductor && unidad.conductor !== "S/C"
                          ? "bg-green-100 text-green-700 hover:bg-green-100 text-xs px-2 py-1" 
                          : "bg-red-100 text-red-700 hover:bg-red-100 text-xs px-2 py-1"
                        }
                      >
                        {unidad.conductor !== "S/C" ? "Sí": "No"}  
                      </Badge>
                    </TableCell>*/}
                    <TableCell className="text-gray-700 text-sm border-0">{unidad.tarjetaCirculacion}</TableCell>
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
