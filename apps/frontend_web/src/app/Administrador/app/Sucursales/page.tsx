'use client'

import { Plantilla } from "@/app/Administrador/components/plantilla";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { IoSearchOutline, IoChevronDownOutline } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { useSucursalStore } from "@/stores/sucursalStore";
import { useState, useMemo, useEffect } from "react";
// Datos de ejemplo para las sucursales
/*
const sucursales = [
  {
    claveOficina: "2958",
    nombreEntidad: "Oficina Central",
    tipo: "Administrativa",
    estado: "Activo",
    direccion: "Av. Juares #123, zona Centro",
    municipio: "Victoria de Durango"
  },
  {
    claveOficina: "2959", 
    nombreEntidad: "Punto Norte",
    tipo: "Ventanilla",
    estado: "Inactivo",
    direccion: "Calle Hidalgo #45, Col. Guadalupe",
    municipio: "Lerdo"
  },
  {
    claveOficina: "2960",
    nombreEntidad: "Oficina Occidente",
    tipo: "Coordinación",
    estado: "Inactivo",
    direccion: "Blvd. De la Juventud #67",
    municipio: "Gómez Palacio"
  },
  {
    claveOficina: "2961",
    nombreEntidad: "Oficina Central",
    tipo: "Administrativa",
    estado: "Activo",
    direccion: "Av. Juares #123, zona Centro",
    municipio: "Victoria de Durango"
  },
  {
    claveOficina: "2962",
    nombreEntidad: "Oficina Central",
    tipo: "Administrativa",
    estado: "Inactivo",
    direccion: "Av. Juares #123, zona Centro",
    municipio: "Victoria de Durango"
  }
];
*/

export default function SucursalesPage() {
  const router = useRouter();
  const { sucursales } = useSucursalStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const fetchSucursales = useSucursalStore((state) => state.fetchSucursales);

  console.log("Sucursales cargadas:", sucursales);

 

  // Filtrado de sucursales
  const filteredSucursales = useMemo(() => {
    let filtered = sucursales;

    // Filtro por búsqueda
    if (searchTerm) {
      filtered = filtered.filter((sucursal) =>
        (sucursal.clave_oficina_postal || '').toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
        (sucursal.nombre_entidad || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (sucursal.tipo_cuo || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (sucursal.domicilio || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (sucursal.nombre_municipio || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro por status (case-insensitive)
    if (statusFilter) {
    filtered = filtered.filter((sucursal) => {
      if (statusFilter === "activo") return sucursal.activo === true;
      if (statusFilter === "inactivo") return sucursal.activo === false;
      return true;
    });

    
  }

    return filtered;
  }, [sucursales, searchTerm, statusFilter]);

 useEffect(() => {
    fetchSucursales();
  }, [fetchSucursales]);
  

  return (
    <div>
      <Plantilla title="">
        <div className="flex flex-col space-y-6">
          {/* Header con título y botón */}
          <div className="flex justify-between items-center -mt-2">
            <h1 className="text-2xl font-semibold text-gray-900">Sucursales</h1>
            <Button 
              className="bg-slate-800 hover:bg-slate-700 text-white"
              onClick={() => router.push('/Administrador/app/Sucursales/crear')}
            >
              Crear sucursales
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
                placeholder="Buscar por clave, nombre, tipo, dirección o municipio"
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
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </select>
              <IoChevronDownOutline className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
            </div>
          </div>

          {/* Tabla de sucursales */}
          <div className="rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-white">
                  <TableHead className="font-medium text-gray-600 text-sm border-0">Clave oficina</TableHead>
                  <TableHead className="font-medium text-gray-600 text-sm border-0">Nombre entidad</TableHead>
                  <TableHead className="font-medium text-gray-600 text-sm border-0">Tipo</TableHead>
                  <TableHead className="font-medium text-gray-600 text-sm border-0">Estado</TableHead>
                  <TableHead className="font-medium text-gray-600 text-sm border-0">Dirección</TableHead>
                  <TableHead className="font-medium text-gray-600 text-sm border-0">Municipio</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSucursales.map((sucursal, i) => (
                  <TableRow key={i} className="hover:bg-gray-50 border-b border-gray-100">
                    <TableCell className="font-medium text-gray-900 text-sm border-0">{sucursal.clave_oficina_postal}</TableCell>
                    <TableCell className="text-gray-700 text-sm border-0">{sucursal.nombre_entidad}</TableCell>
                    <TableCell className="text-gray-700 text-sm border-0">
                      {sucursal.tipo_cuo}
                    </TableCell>
                    <TableCell className="border-0">
                      <Badge 
                        variant={sucursal.activo ? "default" : "destructive"}
                        className={sucursal.activo
                          ? "bg-green-100 text-green-700 hover:bg-green-100 text-xs px-2 py-1" 
                          : "bg-red-100 text-red-700 hover:bg-red-100 text-xs px-2 py-1"
                        }
                      >
                        {sucursal.activo ? "Activo" : "Inactivo"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-700 text-sm border-0">{sucursal.domicilio}</TableCell>
                    <TableCell className="text-gray-700 text-sm border-0">{sucursal.nombre_municipio}</TableCell>
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

