'use client';

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  IoSearchOutline,
  IoChevronDownOutline,
  IoCloseOutline,
} from "react-icons/io5";

type DiscountStatus = "activo" | "borrador" | "caducado";

type Descuento = {
  id: number;
  nombre: string;
  vecesUsado: number;
  status: DiscountStatus;
  fechaCreacion: string;
  fechaExpiracion: string;
  productos: string;
};

const descuentosIniciales: Descuento[] = [
  {
    id: 1,
    nombre: "VERANO30%",
    vecesUsado: 2,
    status: "activo",
    fechaCreacion: "10 de Marzo, 2025",
    fechaExpiracion: "10 de Septiembre, 2025",
    productos: "Todos los productos",
  },
  {
    id: 2,
    nombre: "PRIMAVERA15%",
    vecesUsado: 1,
    status: "borrador",
    fechaCreacion: "15 de Abril, 2025",
    fechaExpiracion: "18 de Abril, 2025",
    productos: "Ropa",
  },
  {
    id: 3,
    nombre: "AHORRA20%",
    vecesUsado: 1,
    status: "caducado",
    fechaCreacion: "01 de Marzo, 2025",
    fechaExpiracion: "18 de Abril, 2025",
    productos: "Playeras básicas",
  },
  {
    id: 4,
    nombre: "VIP25%",
    vecesUsado: 3,
    status: "activo",
    fechaCreacion: "20 de Abril, 2025",
    fechaExpiracion: "20 de Abril, 2026",
    productos: "Clientes VIP",
  },
  {
    id: 5,
    nombre: "GANAS",
    vecesUsado: 2,
    status: "activo",
    fechaCreacion: "18 de Abril, 2025",
    fechaExpiracion: "24 de Abril, 2025",
    productos: "Accesorios",
  },
];

function getStatusBadgeClasses(status: DiscountStatus) {
  if (status === "activo") {
    return "bg-green-100 text-green-700 hover:bg-green-100 text-xs px-2 py-1";
  }
  if (status === "borrador") {
    return "bg-yellow-100 text-yellow-700 hover:bg-yellow-100 text-xs px-2 py-1";
  }
  return "bg-red-100 text-red-700 hover:bg-red-100 text-xs px-2 py-1";
}

function getStatusLabel(status: DiscountStatus) {
  if (status === "activo") return "Activo";
  if (status === "borrador") return "Borrador";
  return "Caducado";
}

export default function DescuentosPage() {
  const [descuentos, setDescuentos] = useState<Descuento[]>(descuentosIniciales);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"" | DiscountStatus>("");
  const [descuentoSeleccionado, setDescuentoSeleccionado] =
    useState<Descuento | null>(null);
  const [mostrarCrear, setMostrarCrear] = useState(false);

  // estado del formulario nuevo descuento
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [nuevaFechaExpiracion, setNuevaFechaExpiracion] = useState("");
  const [nuevosProductos, setNuevosProductos] = useState("");
  const [nuevoStatus, setNuevoStatus] = useState<"" | DiscountStatus>("");

  const descuentosFiltrados = useMemo(() => {
    let data = [...descuentos];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      data = data.filter((d) => d.nombre.toLowerCase().includes(term));
    }

    if (statusFilter) {
      data = data.filter((d) => d.status === statusFilter);
    }

    return data;
  }, [descuentos, searchTerm, statusFilter]);

  const abrirDetalle = (d: Descuento) => {
    setMostrarCrear(false);
    setDescuentoSeleccionado(d);
  };

  const cerrarDetalle = () => setDescuentoSeleccionado(null);

  const abrirCrear = () => {
    setDescuentoSeleccionado(null);
    setMostrarCrear(true);
  };

  const cerrarCrear = () => setMostrarCrear(false);

  const handleCrearDescuento = () => {
    if (!nuevoNombre) return;

    const nuevo: Descuento = {
      id: descuentos.length > 0 ? Math.max(...descuentos.map((d) => d.id)) + 1 : 1,
      nombre: nuevoNombre,
      vecesUsado: 0,
      status: (nuevoStatus || "activo") as DiscountStatus,
      fechaCreacion: new Date().toLocaleDateString("es-MX", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }),
      fechaExpiracion:
        nuevaFechaExpiracion ||
        new Date().toLocaleDateString("es-MX", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }),
      productos: nuevosProductos || "Todos los productos",
    };

    setDescuentos((prev) => [...prev, nuevo]);
    setNuevoNombre("");
    setNuevaFechaExpiracion("");
    setNuevosProductos("");
    setNuevoStatus("");
    setMostrarCrear(false);
  };

  return (
    <div className="relative flex flex-col space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Descuentos</h1>
        <Button
          className="bg-slate-800 hover:bg-slate-700 text-white"
          onClick={abrirCrear}
        >
          Crear descuento
        </Button>
      </div>

      {/* Línea separadora */}
      <div className="border-t border-gray-200" />

      {/* Filtros */}
      <div className="flex flex-wrap items-center gap-4">
        {/* Buscar descuento */}
        <div className="relative w-72">
          <IoSearchOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Buscar descuento"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>

        {/* Filtro status */}
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as "" | DiscountStatus)
            }
            className="appearance-none bg-white border border-gray-300 rounded-md px-4 py-2 pr-8 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Status</option>
            <option value="activo">Activo</option>
            <option value="borrador">Borrador</option>
            <option value="caducado">Caducado</option>
          </select>
          <IoChevronDownOutline className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
        </div>
      </div>

      {/* Tabla de descuentos */}
      <div className="rounded-lg overflow-hidden border border-gray-100 bg-white">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-medium text-gray-600 text-sm border-0">
                Descuento
              </TableHead>
              <TableHead className="font-medium text-gray-600 text-sm border-0">
                Veces usado
              </TableHead>
              <TableHead className="font-medium text-gray-600 text-sm border-0">
                Status
              </TableHead>
              <TableHead className="font-medium text-gray-600 text-sm border-0">
                Fecha de expiración
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {descuentosFiltrados.map((d) => (
              <TableRow
                key={d.id}
                className="hover:bg-gray-50 border-b border-gray-100 cursor-pointer"
                onClick={() => abrirDetalle(d)}
              >
                <TableCell className="text-sm text-gray-900 border-0">
                  {d.nombre}
                </TableCell>
                <TableCell className="text-sm text-gray-700 border-0">
                  {d.vecesUsado}
                </TableCell>
                <TableCell className="border-0">
                  <Badge className={getStatusBadgeClasses(d.status)}>
                    {getStatusLabel(d.status)}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-gray-700 border-0">
                  {d.fechaExpiracion}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Overlay CREAR DESCUENTO */}
      {mostrarCrear && (
        <div className="fixed inset-0 z-40 flex justify-end bg-black/20 backdrop-blur-sm">
          <div className="flex-1" onClick={cerrarCrear} />
          <div className="w-full max-w-md h-full bg-white shadow-2xl border-l border-gray-200 flex flex-col">
            {/* Header */}
            <div className="flex items-start justify-between px-6 py-4 border-b border-gray-200">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Nuevo descuento
                </h2>
                <p className="text-xs text-gray-500">
                  Crea y asigna un nuevo descuento
                </p>
              </div>
              <button
                onClick={cerrarCrear}
                className="p-1 rounded-full hover:bg-gray-100 text-gray-500"
              >
                <IoCloseOutline className="h-5 w-5" />
              </button>
            </div>

            {/* Contenido formulario */}
            <div className="flex-1 overflow-y-auto px-6 py-4 text-sm space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Nombre del descuento
                </label>
                <input
                  type="text"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ej. VERANO30%"
                  value={nuevoNombre}
                  onChange={(e) => setNuevoNombre(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Fecha de expiración
                </label>
                <input
                  type="date"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={nuevaFechaExpiracion}
                  onChange={(e) => setNuevaFechaExpiracion(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Productos
                </label>
                <select
                  className="w-full rounded-md border border-gray-300 px-3 py-2 pr-8 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={nuevosProductos}
                  onChange={(e) => setNuevosProductos(e.target.value)}
                >
                  <option value="">Productos</option>
                  <option value="Todos los productos">Todos los productos</option>
                  <option value="Playeras básicas">Playeras básicas</option>
                  <option value="Accesorios">Accesorios</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  className="w-full rounded-md border border-gray-300 px-3 py-2 pr-8 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={nuevoStatus}
                  onChange={(e) =>
                    setNuevoStatus(e.target.value as "" | DiscountStatus)
                  }
                >
                  <option value="">Status</option>
                  <option value="activo">Activo</option>
                  <option value="borrador">Borrador</option>
                  <option value="caducado">Caducado</option>
                </select>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 px-6 py-3 flex justify-end">
              <Button
                className="bg-slate-800 hover:bg-slate-700 text-white"
                onClick={handleCrearDescuento}
              >
                Crear descuento
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Overlay DETALLE DESCUENTO */}
      {descuentoSeleccionado && (
        <div className="fixed inset-0 z-40 flex justify-end bg-black/20 backdrop-blur-sm">
          <div className="flex-1" onClick={cerrarDetalle} />
          <div className="w-full max-w-md h-full bg-white shadow-2xl border-l border-gray-200 flex flex-col">
            {/* Header */}
            <div className="flex items-start justify-between px-6 py-4 border-b border-gray-200">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {descuentoSeleccionado.nombre}
                </h2>
                <p className="text-xs text-gray-500">
                  Detalles del descuento
                </p>
              </div>
              <button
                onClick={cerrarDetalle}
                className="p-1 rounded-full hover:bg-gray-100 text-gray-500"
              >
                <IoCloseOutline className="h-5 w-5" />
              </button>
            </div>

            {/* Contenido */}
            <div className="flex-1 overflow-y-auto px-6 py-4 text-sm space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-500">Veces usado</span>
                <span className="text-gray-900">
                  {descuentoSeleccionado.vecesUsado}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Status</span>
                <Badge
                  className={getStatusBadgeClasses(descuentoSeleccionado.status)}
                >
                  {getStatusLabel(descuentoSeleccionado.status)}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Fecha de creación</span>
                <span className="text-gray-900">
                  {descuentoSeleccionado.fechaCreacion}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Fecha de expiración</span>
                <span className="text-gray-900">
                  {descuentoSeleccionado.fechaExpiracion}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Productos</span>
                <span className="text-gray-900">
                  {descuentoSeleccionado.productos}
                </span>
              </div>
            </div>

            <div className="border-t border-gray-200 px-6 py-3 flex justify-end">
              <Button
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-100"
                onClick={cerrarDetalle}
              >
                Cerrar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}