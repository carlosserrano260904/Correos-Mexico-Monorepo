"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { IoCartOutline, IoBagHandleOutline, IoGridOutline, IoPersonOutline } from "react-icons/io5";

type CardProps = {
  children: ReactNode;
  className?: string;
};

type StatsCardProps = {
  title: string;
  value: number;
  description: string;
  icon: ReactNode;
};

type ProductoMasVendido = {
  id: number;
  nombre: string;
  vendedor: string;
  compras: number;
};

type CompraReciente = {
  id: number;
  producto: string;
  comprador: string;
  total: number;
};

export default function ComprasPage() {
  const totalProductos = 1525;
  const totalIngresos = 18950.5;
  const totalCategorias = 5;
  const totalCompradores = 12;

  const productosMasVendidos: ProductoMasVendido[] = [
    { id: 1, nombre: "Camiseta Café", vendedor: "Lucia Herrera", compras: 6000 },
    { id: 2, nombre: "Camiseta Negra", vendedor: "Lucia Herrera", compras: 6000 },
    { id: 3, nombre: "Camiseta Azul", vendedor: "Lucia Herrera", compras: 6000 },
    { id: 4, nombre: "Camiseta Rojo", vendedor: "Lucia Herrera", compras: 6000 },
  ];

  const comprasRecientes: CompraReciente[] = [
    { id: 1, producto: "Producto 1", comprador: "Juan Pérez", total: 1430 },
    { id: 2, producto: "Producto 2", comprador: "Carlos Gómez", total: 1430 },
    { id: 3, producto: "Producto 3", comprador: "Ana Torres", total: 1430 },
    { id: 4, producto: "Producto 4", comprador: "Linda López", total: 1430 },
  ];

  return (
    <div className="min-h-screen bg-[#f7f9fb]">
      {/* HEADER */}
      <header className="bg-white shadow-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            {/* Logo */}
            <div className="h-8 w-8 rounded-2xl bg-pink-500 flex items-center justify-center text-xs font-bold text-white">
              V
            </div>

            {/* Tabs */}
            <div className="flex rounded-full bg-gray-100 text-xs font-medium">
              <Link href="/Administrador/app/PanelVentas/Ventas" className="px-4 py-2 rounded-full text-gray-600 hover:text-gray-800">
                Ventas
              </Link>
              <Link href="/Administrador/app/PanelVentas/Compras" className="px-4 py-2 rounded-full bg-white shadow text-pink-500">
                Compras
              </Link>
            </div>
          </div>

          {/* Nueva categoría + Avatar */}
          <div className="flex items-center gap-4">
            <button className="rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50">
              Nueva categoría
            </button>
            <div className="h-9 w-9 rounded-full bg-gray-300" />
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-6xl mx-auto px-6 py-6 space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Resumen de Compras</h1>
          <p className="text-xs text-gray-500">Visualiza las compras registradas en el ecommerce durante el periodo reciente.</p>
        </div>

        {/* STATS CARDS */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Ventas Totales"
            value={1525}
            description="Registradas durante los últimos 7 días."
            icon={<div className="h-8 w-8 rounded-full bg-pink-100 flex items-center justify-center text-pink-500"><IoCartOutline /></div>}
          />
          <StatsCard
            title="Ingresos Totales"
            value={totalIngresos}
            description="Registrados durante los últimos 7 días."
            icon={<div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-500"><IoBagHandleOutline /></div>}
          />
          <StatsCard
            title="Categorías Principales"
            value={totalCategorias}
            description="Con mayor índice de ventas en el último mes."
            icon={<div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-500"><IoGridOutline /></div>}
          />
          <StatsCard
            title="Vendedores Destacados"
            value={totalCompradores}
            description="Registrados durante el último mes."
            icon={<div className="h-8 w-8 rounded-full bg-sky-100 flex items-center justify-center text-sky-500"><IoPersonOutline /></div>}
          />
        </div>

        {/* PRODUCTOS MÁS VENDIDOS + COMPRAS RECIENTES */}
        <div className="grid gap-4 lg:grid-cols-[2fr,1.2fr]">
          {/* PRODUCTOS MÁS VENDIDOS */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900">Productos Más Vendidos</h2>
            <p className="text-xs text-gray-500 mb-4">Conoce los productos principales durante el último mes.</p>

            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="text-xs text-gray-500">
                  <tr>
                    <th className="py-2 px-4 text-left">No.</th>
                    <th className="py-2 px-4 text-left">Producto</th>
                    <th className="py-2 px-4 text-left">Vendedor</th>
                    <th className="py-2 px-4 text-left">Compras</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {productosMasVendidos.map((p, index) => (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className="py-2 px-4 text-gray-500">{index + 1}</td>
                      <td className="py-2 px-4">{p.nombre}</td>
                      <td className="py-2 px-4 text-gray-700">{p.vendedor}</td>
                      <td className="py-2 px-4 text-emerald-600 font-semibold">{p.compras} unidades</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* COMPRAS RECIENTES */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900">Compras Recientes</h2>
            <p className="text-xs text-gray-500 mb-4">Visualiza las compras más recientes realizadas en el ecommerce.</p>

            <div className="space-y-2">
              {comprasRecientes.map((c) => (
                <div key={c.id} className="flex items-center justify-between rounded-lg bg-gray-50 p-3 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-gray-200" />
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-800">{c.producto}</span>
                      <span className="text-xs text-gray-500">{c.comprador}</span>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-pink-500">${c.total.toLocaleString("es-MX")} MXN</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}

/* COMPONENTES REUTILIZABLES */
function Card({ children, className }: CardProps) {
  return <div className={`rounded-2xl bg-white border border-gray-200 shadow-sm ${className ?? ""}`}>{children}</div>;
}

function StatsCard({ title, value, description, icon }: StatsCardProps) {
  return (
    <Card className="flex items-center justify-between p-4">
      <div>
        <p className="text-xs font-medium text-gray-500">{title}</p>
        <p className="mt-2 text-xl font-semibold text-gray-900">{value.toLocaleString("es-MX")}</p>
        <p className="mt-1 text-xs text-gray-400">{description}</p>
      </div>
      {icon}
    </Card>
  );
}