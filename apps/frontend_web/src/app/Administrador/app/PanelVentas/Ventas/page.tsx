"use client";

import { useState } from "react";
import type { ComponentType } from "react";
import {
  IoCartOutline,
  IoCashOutline,
  IoPeopleOutline,
  IoRibbonOutline,
  IoCalendarOutline,
  IoCubeOutline,
  IoChevronDownOutline,
} from "react-icons/io5";

type TabVentas = "globales" | "vendedor";

type MetricCard = {
  id: "ventas" | "ingresos";
  title: string;
  subtitle: string;
  iconBg: string;
  iconColor: string;
  icon: ComponentType<{ className?: string }>;
};

type Seller = {
  id: number;
  nombre: string;
  ventas: string; // para el ranking de vendedores
};

type Category = {
  id: number;
  nombre: string;
  total: string;
};

type MonthIndex = {
  id: string;
  label: string;
  total: string;
  status: "done" | "current" | "pending";
};

type Product = {
  id: number;
  nombre: string;
  descripcion: string;
  precio: string;
};

const metricCards: MetricCard[] = [
  {
    id: "ventas",
    title: "Ventas totales",
    subtitle: "Registradas durante los últimos 7 días.",
    iconBg: "bg-pink-50",
    iconColor: "text-pink-500",
    icon: IoCartOutline,
  },
  {
    id: "ingresos",
    title: "Ingresos totales",
    subtitle: "Registrados durante los últimos 7 días.",
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-500",
    icon: IoCashOutline,
  },
];

const sellers: Seller[] = [
  {
    id: 1,
    nombre: "Lucía Herrera",
    ventas: "$6000 MXN",
  },
  {
    id: 2,
    nombre: "Carlos López",
    ventas: "$5200 MXN",
  },
  {
    id: 3,
    nombre: "María González",
    ventas: "$4800 MXN",
  },
  {
    id: 4,
    nombre: "Juan Pérez",
    ventas: "$4500 MXN",
  },
  {
    id: 5,
    nombre: "Ana Martínez",
    ventas: "$4300 MXN",
  },
];

const categories: Category[] = [
  { id: 1, nombre: "Alfarería y cerámica", total: "$6000 MXN" },
  { id: 2, nombre: "FONART", total: "$6000 MXN" },
  { id: 3, nombre: "Ropa, moda y calzado", total: "$6000 MXN" },
  { id: 4, nombre: "Cocina", total: "$6000 MXN" },
  { id: 5, nombre: "Decoración para el hogar", total: "$6000 MXN" },
];

const months: MonthIndex[] = [
  { id: "ene", label: "Enero", total: "$6000 MXN", status: "done" },
  { id: "feb", label: "Febrero", total: "$6000 MXN", status: "done" },
  { id: "mar", label: "Marzo", total: "$6000 MXN", status: "done" },
  { id: "abr", label: "Abril", total: "$6000 MXN", status: "done" },
  { id: "may", label: "Mayo", total: "$6000 MXN", status: "done" },
  { id: "jun", label: "Junio", total: "$6000 MXN", status: "done" },
  { id: "jul", label: "Julio", total: "$6000 MXN", status: "done" },
  { id: "ago", label: "Agosto", total: "$6000 MXN", status: "done" },
  { id: "sep", label: "Septiembre", total: "$6000 MXN", status: "done" },
  { id: "oct", label: "Octubre", total: "En curso", status: "current" },
  { id: "nov", label: "Noviembre", total: "", status: "pending" },
  { id: "dic", label: "Diciembre", total: "", status: "pending" },
];

const productsBySeller: Record<number, Product[]> = {
  1: [
    {
      id: 1,
      nombre: "Camisa Caferpis",
      descripcion: "Tela suave antitranspirante",
      precio: "$2490 MXN",
    },
    {
      id: 2,
      nombre: "Camisa Caferpis",
      descripcion: "Tela suave antitranspirante",
      precio: "$2490 MXN",
    },
    {
      id: 3,
      nombre: "Camisa Caferpis",
      descripcion: "Tela suave antitranspirante",
      precio: "$2490 MXN",
    },
  ],
  2: [
    {
      id: 1,
      nombre: "Sudadera urbana",
      descripcion: "Edición limitada",
      precio: "$2100 MXN",
    },
    {
      id: 2,
      nombre: "Pantalón deportivo",
      descripcion: "Secado rápido",
      precio: "$1890 MXN",
    },
  ],
  3: [
    {
      id: 1,
      nombre: "Blusa floral",
      descripcion: "Colección primavera",
      precio: "$1690 MXN",
    },
  ],
  4: [
    {
      id: 1,
      nombre: "Playera básica",
      descripcion: "Algodón orgánico",
      precio: "$890 MXN",
    },
  ],
  5: [
    {
      id: 1,
      nombre: "Vestido midi",
      descripcion: "Corte elegante",
      precio: "$2790 MXN",
    },
  ],
};

function ProgressCircle({
  value,
  color,
}: {
  value: number;
  color: "pink" | "sky";
}) {
  const clamped = Math.min(Math.max(value, 0), 100);
  const angle = clamped * 3.6;
  const colorHex = color === "pink" ? "#ec4899" : "#0ea5e9";

  return (
    <div className="relative h-24 w-24">
      <div
        className="h-full w-full rounded-full"
        style={{
          backgroundImage: `conic-gradient(${colorHex} ${angle}deg, #e5e7eb 0deg)`,
        }}
      />
      <div className="absolute inset-2 flex items-center justify-center rounded-full bg-white">
        <span className="text-lg font-semibold text-gray-900">
          {clamped}%
        </span>
      </div>
    </div>
  );
}

/* ===================== VISTA GLOBALES ===================== */

function GlobalesView() {
  return (
    <div className="space-y-5">
      {/* Fila superior */}
      <section className="grid gap-4 xl:grid-cols-[1.1fr,1.5fr,1.3fr]">
        {/* Métricas izquierda */}
        <div className="space-y-4">
          {metricCards.map((card) => {
            const Icon = card.icon;
            const value =
              card.id === "ventas" ? "1525" : "$18,950.5";

            return (
              <article
                key={card.id}
                className="flex flex-col justify-between rounded-2xl border border-gray-100 bg-white px-4 py-4 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${card.iconBg}`}
                  >
                    <Icon className={`h-5 w-5 ${card.iconColor}`} />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xs font-semibold text-gray-900">
                      {card.title}
                    </h3>
                    <p className="text-3xl font-semibold text-gray-900">
                      {value}
                    </p>
                    <p className="text-xs text-gray-500">
                      {card.subtitle}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Vendedores destacados */}
        <article className="rounded-2xl border border-gray-100 bg-white px-4 py-4 shadow-sm">
          <header className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-50">
              <IoPeopleOutline className="h-4 w-4 text-sky-500" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-gray-900">
                Vendedores destacados
              </h2>
              <p className="text-[11px] text-gray-500">
                Conoce a los vendedores que tuvieron las mayores ventas
                en el último mes.
              </p>
            </div>
          </header>
          <ul className="mt-4 space-y-3 text-sm">
            {sellers.map((seller, index) => (
              <li
                key={seller.id}
                className="flex items-center justify-between rounded-lg px-2"
              >
                <div className="flex items-center gap-3">
                  <span className="w-4 text-xs font-semibold text-gray-400">
                    {index + 1}
                  </span>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-[11px] font-semibold text-gray-700">
                    {seller.nombre
                      .split(" ")
                      .map((p) => p[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>
                  <span className="text-xs font-medium text-gray-800">
                    {seller.nombre}
                  </span>
                </div>
                <span className="text-xs font-semibold text-emerald-500">
                  {seller.ventas}
                </span>
              </li>
            ))}
          </ul>
        </article>

        {/* Categorías principales */}
        <article className="rounded-2xl border border-gray-100 bg-white px-4 py-4 shadow-sm">
          <header className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-50">
              <IoRibbonOutline className="h-4 w-4 text-amber-500" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-gray-900">
                Categorías principales
              </h2>
              <p className="text-[11px] text-gray-500">
                Visualiza las categorías que tuvieron un mayor índice de
                ventas en el último mes.
              </p>
            </div>
          </header>
          <ul className="mt-4 space-y-2 text-xs">
            {categories.map((category) => (
              <li
                key={category.id}
                className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-3 py-2"
              >
                <div className="flex items-center gap-3">
                  <span className="w-4 text-[11px] font-semibold text-gray-400">
                    {category.id}
                  </span>
                  <span className="font-medium text-gray-800">
                    {category.nombre}
                  </span>
                </div>
                <span className="text-[11px] font-semibold text-emerald-500">
                  {category.total}
                </span>
              </li>
            ))}
          </ul>
        </article>
      </section>

      {/* Fila inferior */}
      <section className="grid gap-4 lg:grid-cols-[2fr,1.1fr]">
        {/* Índices de ventas mensuales */}
        <article className="rounded-2xl border border-gray-100 bg-white px-4 py-4 shadow-sm">
          <header className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-50">
              <IoCalendarOutline className="h-4 w-4 text-amber-500" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-gray-900">
                Índices de ventas mensuales
              </h2>
              <p className="text-[11px] text-gray-500">
                Visualiza el índice de ventas que se tuvo durante los
                meses.
              </p>
            </div>
          </header>
          <div className="mt-4 grid gap-3 md:grid-cols-4">
            {months.map((month) => {
              const isDone = month.status === "done";
              const isCurrent = month.status === "current";

              return (
                <div
                  key={month.id}
                  className={[
                    "flex flex-col justify-between rounded-xl border px-3 py-2",
                    isDone && "border-emerald-100 bg-emerald-50",
                    isCurrent && "border-sky-400 bg-white",
                    month.status === "pending" &&
                      "border-gray-100 bg-gray-50",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  <p className="text-xs font-semibold text-gray-700">
                    {month.label}
                  </p>
                  <p
                    className={[
                      "mt-1 text-[11px] font-semibold",
                      isDone && "text-emerald-500",
                      isCurrent && "text-sky-500",
                      month.status === "pending" && "text-gray-400",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    {month.total || "—"}
                  </p>
                </div>
              );
            })}
          </div>
        </article>

        {/* Columna derecha: tarjetas circulares */}
        <div className="space-y-4">
          {/* Nuevos productos */}
          <article className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white px-4 py-4 shadow-sm">
            <div className="max-w-[60%]">
              <h2 className="text-sm font-semibold text-gray-900">
                Nuevos productos
              </h2>
              <p className="mt-1 text-[11px] text-gray-500">
                En comparación con el mes pasado.
              </p>
            </div>
            <ProgressCircle value={63} color="sky" />
          </article>

          {/* Crecimiento en ventas */}
          <article className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white px-4 py-4 shadow-sm">
            <div className="max-w-[60%]">
              <h2 className="text-sm font-semibold text-gray-900">
                Crecimiento en ventas
              </h2>
              <p className="mt-1 text-[11px] text-gray-500">
                En comparación con el mes anterior.
              </p>
            </div>
            <ProgressCircle value={63} color="pink" />
          </article>
        </div>
      </section>
    </div>
  );
}

/* ===================== VISTA POR VENDEDOR ===================== */

function PorVendedorView({
  selectedSellerId,
  onChangeSellerId,
}: {
  selectedSellerId: number;
  onChangeSellerId: (id: number) => void;
}) {
  const selectedSeller =
    sellers.find((s) => s.id === selectedSellerId) ?? sellers[0];

  const products: Product[] =
    productsBySeller[selectedSeller.id] ?? [];

  return (
    <div className="space-y-5">
      {/* Selector de vendedor */}
      <div className="max-w-xs">
        <div className="relative">
          <select
            value={selectedSellerId}
            onChange={(e) => onChangeSellerId(Number(e.target.value))}
            className="w-full appearance-none rounded-xl border border-gray-200 bg-white px-3 py-2 pr-8 text-xs font-medium text-gray-700 shadow-sm focus:border-pink-400 focus:outline-none focus:ring-1 focus:ring-pink-400"
          >
            {sellers.map((seller) => (
              <option key={seller.id} value={seller.id}>
                {seller.nombre}
              </option>
            ))}
          </select>
          <IoChevronDownOutline className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {/* Fila superior */}
      <section className="grid gap-4 xl:grid-cols-[1.1fr,1.5fr,1.3fr]">
        {/* Métricas izquierda (por vendedor, pero con los mismos valores de ejemplo) */}
        <div className="space-y-4">
          {metricCards.map((card) => {
            const Icon = card.icon;
            const value =
              card.id === "ventas" ? "1525" : "$18,950.5";

            return (
              <article
                key={card.id}
                className="flex flex-col justify-between rounded-2xl border border-gray-100 bg-white px-4 py-4 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${card.iconBg}`}
                  >
                    <Icon className={`h-5 w-5 ${card.iconColor}`} />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xs font-semibold text-gray-900">
                      {card.title}
                    </h3>
                    <p className="text-3xl font-semibold text-gray-900">
                      {value}
                    </p>
                    <p className="text-xs text-gray-500">
                      {card.subtitle}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Productos destacados del vendedor */}
        <article className="rounded-2xl border border-gray-100 bg-white px-4 py-4 shadow-sm">
          <header className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-50">
              <IoCubeOutline className="h-4 w-4 text-sky-500" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-gray-900">
                Productos destacados
              </h2>
              <p className="text-[11px] text-gray-500">
                Visualiza los productos del vendedor que tuvieron un
                mayor índice de ventas en el último mes.
              </p>
            </div>
          </header>

          <ul className="mt-4 space-y-3 text-xs">
            {products.map((product) => (
              <li
                key={product.id}
                className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 px-3 py-2"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-gray-200" />
                  <div className="space-y-0.5">
                    <p className="font-semibold text-gray-800">
                      {product.nombre}
                    </p>
                    <p className="text-[11px] text-gray-400">
                      {product.descripcion}
                    </p>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-pink-500">
                  {product.precio}
                </span>
              </li>
            ))}
            {products.length === 0 && (
              <li className="rounded-xl border border-dashed border-gray-200 bg-gray-50 px-3 py-4 text-center text-[11px] text-gray-400">
                Aún no hay productos destacados para este vendedor.
              </li>
            )}
          </ul>
        </article>

        {/* Categorías principales (puedes filtrarlas por vendedor más adelante) */}
        <article className="rounded-2xl border border-gray-100 bg-white px-4 py-4 shadow-sm">
          <header className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-50">
              <IoRibbonOutline className="h-4 w-4 text-amber-500" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-gray-900">
                Categorías principales
              </h2>
              <p className="text-[11px] text-gray-500">
                Visualiza las categorías que tuvieron un mayor índice de
                ventas en el último mes.
              </p>
            </div>
          </header>
          <ul className="mt-4 space-y-2 text-xs">
            {categories.map((category) => (
              <li
                key={category.id}
                className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-3 py-2"
              >
                <div className="flex items-center gap-3">
                  <span className="w-4 text-[11px] font-semibold text-gray-400">
                    {category.id}
                  </span>
                  <span className="font-medium text-gray-800">
                    {category.nombre}
                  </span>
                </div>
                <span className="text-[11px] font-semibold text-emerald-500">
                  {category.total}
                </span>
              </li>
            ))}
          </ul>
        </article>
      </section>

      {/* Fila inferior (igual que en globales) */}
      <section className="grid gap-4 lg:grid-cols-[2fr,1.1fr]">
        {/* Índices de ventas mensuales */}
        <article className="rounded-2xl border border-gray-100 bg-white px-4 py-4 shadow-sm">
          <header className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-50">
              <IoCalendarOutline className="h-4 w-4 text-amber-500" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-gray-900">
                Índices de ventas mensuales
              </h2>
              <p className="text-[11px] text-gray-500">
                Visualiza el índice de ventas que se tuvo durante los
                meses.
              </p>
            </div>
          </header>
          <div className="mt-4 grid gap-3 md:grid-cols-4">
            {months.map((month) => {
              const isDone = month.status === "done";
              const isCurrent = month.status === "current";

              return (
                <div
                  key={month.id}
                  className={[
                    "flex flex-col justify-between rounded-xl border px-3 py-2",
                    isDone && "border-emerald-100 bg-emerald-50",
                    isCurrent && "border-sky-400 bg-white",
                    month.status === "pending" &&
                      "border-gray-100 bg-gray-50",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  <p className="text-xs font-semibold text-gray-700">
                    {month.label}
                  </p>
                  <p
                    className={[
                      "mt-1 text-[11px] font-semibold",
                      isDone && "text-emerald-500",
                      isCurrent && "text-sky-500",
                      month.status === "pending" && "text-gray-400",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    {month.total || "—"}
                  </p>
                </div>
              );
            })}
          </div>
        </article>

        {/* Columna derecha: tarjetas circulares */}
        <div className="space-y-4">
          {/* Nuevos productos */}
          <article className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white px-4 py-4 shadow-sm">
            <div className="max-w-[60%]">
              <h2 className="text-sm font-semibold text-gray-900">
                Nuevos productos
              </h2>
              <p className="mt-1 text-[11px] text-gray-500">
                En comparación con el mes pasado.
              </p>
            </div>
            <ProgressCircle value={63} color="sky" />
          </article>

          {/* Crecimiento en ventas */}
          <article className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white px-4 py-4 shadow-sm">
            <div className="max-w-[60%]">
              <h2 className="text-sm font-semibold text-gray-900">
                Crecimiento en ventas
              </h2>
              <p className="mt-1 text-[11px] text-gray-500">
                En comparación con el mes anterior.
              </p>
            </div>
            <ProgressCircle value={63} color="pink" />
          </article>
        </div>
      </section>
    </div>
  );
}

/* ===================== PÁGINA PRINCIPAL ===================== */

export default function ResumenVentasPage() {
  const [tab, setTab] = useState<TabVentas>("globales");
  const [selectedSellerId, setSelectedSellerId] = useState<number>(
    sellers[0]?.id ?? 1
  );

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Resumen de Ventas
          </h1>
          <p className="text-sm text-gray-500">
            Revisa rápidamente el desempeño general de tus ventas.
          </p>
        </div>

        {/* Tabs Globales / Por vendedor */}
        <div className="flex items-center gap-2 rounded-full bg-white p-1 shadow-sm">
          <button
            type="button"
            onClick={() => setTab("globales")}
            className={[
              "rounded-full px-4 py-1.5 text-xs font-semibold transition",
              tab === "globales"
                ? "bg-gray-900 text-white shadow-sm"
                : "text-gray-500 hover:bg-gray-100",
            ].join(" ")}
          >
            Globales
          </button>
          <button
            type="button"
            onClick={() => setTab("vendedor")}
            className={[
              "rounded-full px-4 py-1.5 text-xs font-semibold transition",
              tab === "vendedor"
                ? "bg-pink-500 text-white shadow-sm"
                : "text-gray-500 hover:bg-gray-100",
            ].join(" ")}
          >
            Por vendedor
          </button>
        </div>
      </header>

      {tab === "globales" ? (
        <GlobalesView />
      ) : (
        <PorVendedorView
          selectedSellerId={selectedSellerId}
          onChangeSellerId={setSelectedSellerId}
        />
      )}
    </div>
  );
}