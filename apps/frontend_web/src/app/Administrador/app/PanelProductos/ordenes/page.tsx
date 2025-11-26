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

type OrderStatus = "completado" | "pendiente" | "cancelado";

type OrdenProducto = {
  id: number;
  nombre: string;
  variante: string;
  cantidad: number;
  precio: string;
  imagen?: string;
};

type Orden = {
  id: string;                // #2963
  info: string;              // "1 Playera básica negra, 1 Playera blanca..."
  numProductos: number;
  status: OrderStatus;
  total: string;
  fechaCorta: string;        // "18 Abril, 2025"
  fechaDetallada: string;    // "10 de Marzo, 2025, 7:02 am"
  metodoPago: string;
  clienteNombre: string;
  clienteCorreo: string;
  clienteTelefono: string;
  productos: OrdenProducto[];
};

const ordenesMock: Orden[] = [
  {
    id: "#2963",
    info: "1 Playera básica blanca, 1 Playera básica negra",
    numProductos: 2,
    status: "completado",
    total: "$1,450",
    fechaCorta: "18 Abril, 2025",
    fechaDetallada: "10 de Marzo, 2025, 7:02 am",
    metodoPago: "Tarjeta de crédito",
    clienteNombre: "Daniel Robles",
    clienteCorreo: "danielrobles@gmail.com",
    clienteTelefono: "618 125 32 21",
    productos: [
      {
        id: 1,
        nombre: "Playera básica blanca",
        variante: "M / Hombre",
        cantidad: 1,
        precio: "$128.80",
      },
      {
        id: 2,
        nombre: "Playera básica negra",
        variante: "M / Hombre",
        cantidad: 1,
        precio: "$173.20",
      },
    ],
  },
  {
    id: "#2959",
    info: "1 Playera básica negra",
    numProductos: 1,
    status: "pendiente",
    total: "$740",
    fechaCorta: "10 Abril, 2025",
    fechaDetallada: "10 de Abril, 2025, 5:21 pm",
    metodoPago: "Tarjeta de crédito",
    clienteNombre: "Ana García",
    clienteCorreo: "ana@example.com",
    clienteTelefono: "555 123 45 67",
    productos: [
      {
        id: 1,
        nombre: "Playera básica negra",
        variante: "M / Hombre",
        cantidad: 1,
        precio: "$740",
      },
    ],
  },
  {
    id: "#2930",
    info: "1 Playera básica negra",
    numProductos: 1,
    status: "cancelado",
    total: "$740",
    fechaCorta: "18 Marzo, 2025",
    fechaDetallada: "18 de Marzo, 2025, 9:10 am",
    metodoPago: "Transferencia bancaria",
    clienteNombre: "José Pérez",
    clienteCorreo: "jose@example.com",
    clienteTelefono: "555 222 11 00",
    productos: [
      {
        id: 1,
        nombre: "Playera básica negra",
        variante: "L / Hombre",
        cantidad: 1,
        precio: "$740",
      },
    ],
  },
  {
    id: "#2901",
    info: "2 Playera básica negra",
    numProductos: 2,
    status: "completado",
    total: "$1,200",
    fechaCorta: "28 Abril, 2025",
    fechaDetallada: "28 de Abril, 2025, 3:47 pm",
    metodoPago: "Tarjeta de crédito",
    clienteNombre: "Lucía Hernández",
    clienteCorreo: "lucia@example.com",
    clienteTelefono: "555 333 88 99",
    productos: [
      {
        id: 1,
        nombre: "Playera básica negra",
        variante: "S / Mujer",
        cantidad: 2,
        precio: "$1,200",
      },
    ],
  },
];

export default function OrdenesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"" | OrderStatus>("");
  const [ordenSeleccionada, setOrdenSeleccionada] = useState<Orden | null>(
    null
  );

  const filteredOrders = useMemo(() => {
    let data = [...ordenesMock];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      data = data.filter(
        (o) =>
          o.id.toLowerCase().includes(term) ||
          o.info.toLowerCase().includes(term) ||
          o.clienteNombre.toLowerCase().includes(term)
      );
    }

    if (statusFilter) {
      data = data.filter((o) => o.status === statusFilter);
    }

    return data;
  }, [searchTerm, statusFilter]);

  const abrirDetalle = (orden: Orden) => setOrdenSeleccionada(orden);
  const cerrarDetalle = () => setOrdenSeleccionada(null);

  const getStatusBadgeClasses = (status: OrderStatus) => {
    if (status === "completado") {
      return "bg-green-100 text-green-700 hover:bg-green-100 text-xs px-2 py-1";
    }
    if (status === "pendiente") {
      return "bg-yellow-100 text-yellow-700 hover:bg-yellow-100 text-xs px-2 py-1";
    }
    return "bg-red-100 text-red-700 hover:bg-red-100 text-xs px-2 py-1";
  };

  const getStatusLabel = (status: OrderStatus) => {
    if (status === "completado") return "Completado";
    if (status === "pendiente") return "Pendiente";
    return "Cancelado";
  };

  return (
    <div className="relative flex flex-col space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Órdenes</h1>
      </div>

      {/* Línea separadora */}
      <div className="border-t border-gray-200" />

      {/* Filtros */}
      <div className="flex flex-wrap items-center gap-4">
        {/* Buscar orden */}
        <div className="relative w-72">
          <IoSearchOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Buscar orden"
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
              setStatusFilter(e.target.value as "" | OrderStatus)
            }
            className="appearance-none bg-white border border-gray-300 rounded-md px-4 py-2 pr-8 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Status</option>
            <option value="completado">Completado</option>
            <option value="pendiente">Pendiente</option>
            <option value="cancelado">Cancelado</option>
          </select>
          <IoChevronDownOutline className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
        </div>
      </div>

      {/* Tabla de órdenes */}
      <div className="rounded-lg overflow-hidden border border-gray-100 bg-white">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-medium text-gray-600 text-sm border-0">
                ID de orden
              </TableHead>
              <TableHead className="font-medium text-gray-600 text-sm border-0">
                Información del producto
              </TableHead>
              <TableHead className="font-medium text-gray-600 text-sm border-0">
                No. de productos
              </TableHead>
              <TableHead className="font-medium text-gray-600 text-sm border-0">
                Status
              </TableHead>
              <TableHead className="font-medium text-gray-600 text-sm border-0">
                Total
              </TableHead>
              <TableHead className="font-medium text-gray-600 text-sm border-0">
                Fecha
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((o) => (
              <TableRow
                key={o.id}
                className="hover:bg-gray-50 border-b border-gray-100 cursor-pointer"
                onClick={() => abrirDetalle(o)}
              >
                <TableCell className="text-sm text-gray-900 border-0">
                  {o.id}
                </TableCell>
                <TableCell className="text-sm text-gray-700 border-0">
                  {o.info}
                </TableCell>
                <TableCell className="text-sm text-gray-700 border-0">
                  {o.numProductos}
                </TableCell>
                <TableCell className="border-0">
                  <Badge className={getStatusBadgeClasses(o.status)}>
                    {getStatusLabel(o.status)}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-gray-700 border-0">
                  {o.total}
                </TableCell>
                <TableCell className="text-sm text-gray-700 border-0">
                  {o.fechaCorta}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Panel lateral de detalle */}
      {ordenSeleccionada && (
        <div className="fixed inset-0 z-40 flex justify-end bg-black/20 backdrop-blur-sm">
          {/* Zona clicable para cerrar */}
          <div className="flex-1" onClick={cerrarDetalle} />

          {/* Panel */}
          <div className="w-full max-w-xl h-full bg-white shadow-2xl border-l border-gray-200 flex flex-col">
            {/* Header */}
            <div className="flex items-start justify-between px-6 py-4 border-b border-gray-200">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {ordenSeleccionada.id}
                </h2>
                <p className="text-xs text-gray-500">Detalles de la orden</p>
              </div>
              <button
                onClick={cerrarDetalle}
                className="p-1 rounded-full hover:bg-gray-100 text-gray-500"
              >
                <IoCloseOutline className="h-5 w-5" />
              </button>
            </div>

            {/* Contenido */}
            <div className="flex-1 overflow-y-auto px-6 py-4 text-sm space-y-6">
              {/* Productos */}
              <div>
                <h3 className="text-xs font-semibold text-gray-500 mb-2">
                  Productos
                </h3>
                <div className="space-y-3">
                  {ordenSeleccionada.productos.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-md bg-gray-200" />
                        <div className="flex flex-col">
                          <span className="text-gray-900">{p.nombre}</span>
                          <span className="text-xs text-gray-500">
                            {p.variante}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="block text-gray-700">
                          {p.precio}
                        </span>
                        <span className="block text-xs text-gray-500">
                          {p.cantidad} pza(s)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Info de orden */}
              <div className="grid grid-cols-1 gap-4">
                <div className="flex justify-between">
                  <span className="text-gray-500">Ordenado el</span>
                  <span className="text-gray-900">
                    {ordenSeleccionada.fechaDetallada}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Método de pago</span>
                  <span className="text-gray-900">
                    {ordenSeleccionada.metodoPago}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Status</span>
                  <span className="text-gray-900">
                    {getStatusLabel(ordenSeleccionada.status)}
                  </span>
                </div>
              </div>

              {/* Info del cliente */}
              <div className="space-y-1">
                <h3 className="text-xs font-semibold text-gray-500 mb-1">
                  Cliente
                </h3>
                <div className="flex justify-between">
                  <span className="text-gray-500">Nombre del cliente</span>
                  <span className="text-gray-900">
                    {ordenSeleccionada.clienteNombre}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Correo electrónico</span>
                  <span className="text-blue-600">
                    {ordenSeleccionada.clienteCorreo}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Teléfono</span>
                  <span className="text-gray-900">
                    {ordenSeleccionada.clienteTelefono}
                  </span>
                </div>
              </div>

              {/* Línea de tiempo / estado del paquete (mock simple) */}
              <div>
                <h3 className="text-xs font-semibold text-gray-500 mb-2">
                  Estado del paquete
                </h3>
                <div className="space-y-2">
                  {[
                    "Orden procesada",
                    "Pago confirmado",
                    "Paquete enviado",
                    "Paquete en camino",
                    "Paquete entregado",
                  ].map((etapa, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="flex flex-col items-center">
                        <div className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                        {index < 4 && (
                          <div className="h-4 w-px bg-blue-500" />
                        )}
                      </div>
                      <span className="text-gray-700 text-xs">{etapa}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totales */}
              <div className="pt-2 border-t border-gray-200 flex justify-between">
                <span className="text-gray-500">Subtotal</span>
                <span className="text-gray-900">
                  {ordenSeleccionada.total}
                </span>
              </div>
            </div>

            {/* Footer (si quieres botones después) */}
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