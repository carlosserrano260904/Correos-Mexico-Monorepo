'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { IoCloudUploadOutline } from "react-icons/io5";
import { usePanelProductos } from "../../PanelProductosContext";

export default function CrearProductoPage() {
  const router = useRouter();
  const { addProducto } = usePanelProductos();

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [categoria, setCategoria] = useState("");
  const [marca, setMarca] = useState("");
  const [tipo, setTipo] = useState("MXN");
  const [valor, setValor] = useState("");
  const [inventario, setInventario] = useState("");
  const [sku, setSku] = useState("");

  const handleCrear = () => {
    addProducto({
      nombre: nombre || "Producto sin nombre",
      descripcion,
      categoria: categoria || "Ropa",
      marca: marca || "Genérico",
      tipo: tipo || "MXN",
      valor: valor || "$0",
      inventario: inventario ? Number(inventario) : 0,
      sku: sku || "SIN-SKU",
      vendedor: "Mi tienda",
      status: "activo",
    });

    // REGRESAR A LA LISTA después de crear
    router.push("/Administrador/app/PanelProductos/Productos");
  };

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">
          Crear nuevo producto
        </h1>
      </div>

      <div className="border-t border-gray-200" />

      {/* Formulario principal */}
      <div className="flex flex-col gap-4 max-w-3xl">
        {/* Nombre */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nombre
          </label>
          <input
            type="text"
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Nombre del producto"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>

        {/* Slug */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Slug
          </label>
          <div className="mt-1 flex gap-2">
            <input
              type="text"
              className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Identificador para el producto en el sitio"
            />
            <Button
              type="button"
              className="whitespace-nowrap bg-slate-800 hover:bg-slate-700 text-white"
            >
              Generar
            </Button>
          </div>
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Descripción
          </label>
          <textarea
            rows={4}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Breve resumen de las características y ventajas del producto."
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />
        </div>

        {/* Categoría */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Categoría
          </label>
          <div className="relative mt-1">
            <select
              className="w-full appearance-none rounded-md border border-gray-300 px-3 py-2 pr-8 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
            >
              <option value="">Categoría</option>
              <option value="Ropa">Ropa</option>
              <option value="Accesorios">Accesorios</option>
            </select>
            <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400 text-xs">
              ▼
            </span>
          </div>
        </div>

        {/* Marca */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Marca
          </label>
          <input
            type="text"
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Marca del producto"
            value={marca}
            onChange={(e) => setMarca(e.target.value)}
          />
        </div>
      </div>

      {/* Tarjeta de variante */}
      <div className="max-w-3xl">
        <div className="rounded-xl border border-gray-200 bg-white p-4 md:p-6 shadow-sm">
          <h2 className="text-sm font-medium text-gray-900 mb-4">
            Variante 1
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            {/* Tipo */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tipo
              </label>
              <div className="relative mt-1">
                <select
                  className="w-full appearance-none rounded-md border border-gray-300 px-3 py-2 pr-8 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value)}
                >
                  <option value="MXN">MXN</option>
                  <option value="USD">USD</option>
                </select>
                <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400 text-xs">
                  ▼
                </span>
              </div>
            </div>

            {/* Valor */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Valor
              </label>
              <input
                type="number"
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Precio"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
              />
            </div>

            {/* Inventario */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Inventario
              </label>
              <input
                type="number"
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Unidades en existencia"
                value={inventario}
                onChange={(e) => setInventario(e.target.value)}
              />
            </div>

            {/* SKU */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                SKU
              </label>
              <input
                type="text"
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Código interno"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
              />
            </div>
          </div>

          {/* Imágenes */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Imágenes
            </label>
            <div className="flex items-center justify-center rounded-md border border-dashed border-gray-300 bg-gray-50 px-4 py-6 text-center text-sm text-gray-500">
              <div className="flex flex-col items-center gap-2">
                <IoCloudUploadOutline className="h-6 w-6" />
                <p>
                  Arrastra y suelta los archivos o haz clic para seleccionarlos
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Botones */}
        <div className="mt-6 flex flex-col gap-3">
          <Button
            type="button"
            variant="outline"
            className="w-full border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            + Agregar nueva variante
          </Button>
          <Button
            type="button"
            className="w-full bg-slate-800 hover:bg-slate-700 text-white"
            onClick={handleCrear}
          >
            Crear producto
          </Button>
        </div>
      </div>
    </div>
  );
}