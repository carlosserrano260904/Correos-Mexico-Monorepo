'use client';

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
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
import {
  usePanelProductos,
  Producto,
  ProductoStatus,
} from "../PanelProductosContext";

// Productos de ejemplo SOLO para el diseño de la tabla
const productosMock: Producto[] = [
  {
    id: 1,
    nombre: "Playera básica negra",
    marca: "Nike",
    status: "activo",
    inventario: 5,
    categoria: "Ropa",
    vendedor: "Mi tienda",
    sku: "154258",
    descripcion:
      "Lorem ipsum es simplemente el texto de relleno de las imprentas...",
    tipo: "MXN",
    valor: "$200",
  },
  {
    id: 2,
    nombre: "Playera básica negra",
    marca: "Nike",
    status: "archivado",
    inventario: 0,
    categoria: "Ropa",
    vendedor: "Mi tienda",
    sku: "154259",
    descripcion: "Descripción de ejemplo del producto archivado.",
    tipo: "MXN",
    valor: "$200",
  },
  {
    id: 3,
    nombre: "Playera básica negra",
    marca: "Nike",
    status: "activo",
    inventario: 0,
    categoria: "Ropa",
    vendedor: "Mi tienda",
    sku: "154260",
    descripcion: "Descripción de ejemplo con inventario agotado.",
    tipo: "MXN",
    valor: "$200",
  },
  {
    id: 4,
    nombre: "Playera básica negra",
    marca: "Nike",
    status: "activo",
    inventario: 21,
    categoria: "Ropa",
    vendedor: "Mi tienda",
    sku: "154261",
    descripcion: "Otra variante del mismo producto.",
    tipo: "MXN",
    valor: "$200",
  },
];

export default function ProductosPage() {
  const router = useRouter();
  const { productosExtra } = usePanelProductos();

  // Combinamos: productos de ejemplo + productos agregados por ti
  const todosLosProductos = useMemo(
    () => [...productosMock, ...productosExtra],
    [productosExtra]
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"" | ProductoStatus>("");
  const [categoriaFilter, setCategoriaFilter] = useState("");
  const [productoSeleccionado, setProductoSeleccionado] =
    useState<Producto | null>(null);

  const filteredProductos = useMemo(() => {
    let data = [...todosLosProductos];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      data = data.filter((p) =>
        `${p.nombre} ${p.marca}`.toLowerCase().includes(term)
      );
    }

    if (statusFilter) {
      data = data.filter((p) => p.status === statusFilter);
    }

    if (categoriaFilter) {
      data = data.filter((p) => p.categoria === categoriaFilter);
    }

    return data;
  }, [todosLosProductos, searchTerm, statusFilter, categoriaFilter]);

  const abrirDetalle = (producto: Producto) => setProductoSeleccionado(producto);
  const cerrarDetalle = () => setProductoSeleccionado(null);

  return (
    <div className="relative flex flex-col space-y-6">
      {/* Header con título y botón */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Productos</h1>
        <Button
          className="bg-slate-800 hover:bg-slate-700 text-white"
          onClick={() =>
            router.push("/Administrador/app/PanelProductos/Productos/crear")
          }
        >
          Crear producto
        </Button>
      </div>

      {/* Línea separadora */}
      <div className="border-t border-gray-200" />

      {/* Filtros */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative w-72">
          <IoSearchOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Buscar producto"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>

        <div className="relative">
          <select
            value={categoriaFilter}
            onChange={(e) => setCategoriaFilter(e.target.value)}
            className="appearance-none bg-white border border-gray-300 rounded-md px-4 py-2 pr-8 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Categoría</option>
            <option value="Ropa">Ropa</option>
          </select>
          <IoChevronDownOutline className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
        </div>

        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as "" | ProductoStatus)
            }
            className="appearance-none bg-white border border-gray-300 rounded-md px-4 py-2 pr-8 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Status</option>
            <option value="activo">Activo</option>
            <option value="archivado">Archivado</option>
          </select>
          <IoChevronDownOutline className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
        </div>
      </div>

      {/* Tabla */}
      <div className="rounded-lg overflow-hidden border border-gray-100 bg-white">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-medium text-gray-600 text-sm border-0">
                Producto
              </TableHead>
              <TableHead className="font-medium text-gray-600 text-sm border-0">
                Status
              </TableHead>
              <TableHead className="font-medium text-gray-600 text-sm border-0">
                Inventario
              </TableHead>
              <TableHead className="font-medium text-gray-600 text-sm border-0">
                Categoría
              </TableHead>
              <TableHead className="font-medium text-gray-600 text-sm border-0">
                Vendedor
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProductos.map((p) => (
              <TableRow
                key={p.id}
                className="hover:bg-gray-50 border-b border-gray-100 cursor-pointer"
                onClick={() => abrirDetalle(p)}
              >
                <TableCell className="text-sm text-gray-900 border-0">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-md bg-gray-200" />
                    <div className="flex flex-col">
                      <span className="font-medium">{p.nombre}</span>
                      <span className="text-xs text-gray-500">{p.marca}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="border-0">
                  <Badge
                    className={
                      p.status === "activo"
                        ? "bg-green-100 text-green-700 hover:bg-green-100 text-xs px-2 py-1"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-200 text-xs px-2 py-1"
                    }
                  >
                    {p.status === "activo" ? "Activo" : "Archivado"}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm border-0">
                  {p.inventario === 0 ? (
                    <span className="text-red-500 font-medium">
                      0 en existencia
                    </span>
                  ) : (
                    <span className="text-gray-800">
                      {p.inventario} en existencia
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-sm text-gray-700 border-0">
                  {p.categoria}
                </TableCell>
                <TableCell className="text-sm text-gray-700 border-0">
                  {p.vendedor}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Panel lateral detalle */}
      {productoSeleccionado && (
        <div className="fixed inset-0 z-40 flex justify-end bg-black/20 backdrop-blur-sm">
          <div className="flex-1" onClick={cerrarDetalle} />
          <div className="w-full max-w-md h-full bg-white shadow-2xl border-l border-gray-200 flex flex-col">
            <div className="flex items-start justify-between px-6 py-4 border-b border-gray-200">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {productoSeleccionado.nombre}
                </h2>
                <p className="text-xs text-gray-500">Detalles del producto</p>
              </div>
              <button
                onClick={cerrarDetalle}
                className="p-1 rounded-full hover:bg-gray-100 text-gray-500"
              >
                <IoCloseOutline className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4 text-sm space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-500">SKU</span>
                <span className="text-gray-900">{productoSeleccionado.sku}</span>
              </div>
              <div>
                <span className="block text-gray-500">Descripción</span>
                <p className="mt-1 text-gray-900">
                  {productoSeleccionado.descripcion}
                </p>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Categoría</span>
                <span className="text-gray-900">
                  {productoSeleccionado.categoria}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Marca</span>
                <span className="text-gray-900">
                  {productoSeleccionado.marca}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Tipo</span>
                <span className="text-gray-900">
                  {productoSeleccionado.tipo}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Valor</span>
                <span className="text-gray-900">
                  {productoSeleccionado.valor}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Inventario</span>
                <span className="text-gray-900">
                  {productoSeleccionado.inventario} en existencia
                </span>
              </div>
              <div className="mt-4">
                <span className="block text-gray-500 mb-2">Imágenes</span>
                <div className="h-40 w-32 rounded-lg border border-gray-200 bg-gray-100 flex items-center justify-center">
                  <span className="text-xs text-gray-400">
                    Imagen de ejemplo
                  </span>
                </div>
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