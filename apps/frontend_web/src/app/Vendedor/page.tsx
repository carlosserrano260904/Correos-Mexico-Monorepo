// apps/frontend_web/src/app/Vendedor/page.tsx
// UI web adaptada del diseño móvil: tarjetas y botón en gris, logo grande, íconos replicados.
// Requiere Tailwind.

import Link from "next/link";

const BRAND_PINK_FROM = "#FF2AAF";
const BRAND_PINK_TO = "#E50071";
const BRAND_PINK_SOLID = "#E50071";

type Coupon = {
  id: string;
  name: string;
  used: number;
  percent: number;
  status: "activo" | "expirado";
  color: "blue" | "green" | "orange";
};

const stats = [
  {
    key: "activos",
    label: "Activos",
    value: 17,
    tone: "indigo",
    // Ícono: grid 2×2
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
        <path
          fill="currentColor"
          d="M3 3h8v8H3V3Zm10 0h8v8h-8V3ZM3 13h8v8H3v-8Zm10 8v-8h8v8h-8Z"
        />
      </svg>
    ),
    color: "#4F46E5",
  },
  {
    key: "pausados",
    label: "Pausados",
    value: 24,
    tone: "orange",
    // Ícono: pausa
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
        <path fill="currentColor" d="M7 5h3v14H7zM14 5h3v14h-3z" />
      </svg>
    ),
    color: "#F59E0B",
  },
  {
    key: "vendidos",
    label: "Vendidos",
    value: 35,
    tone: "green",
    // Ícono: tarjeta
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
        <path
          fill="currentColor"
          d="M20 4H4a2 2 0 0 0-2 2v2h20V6a2 2 0 0 0-2-2ZM2 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V10H2v8Zm6-5h8v2H8v-2Z"
        />
      </svg>
    ),
    color: "#10B981",
  },
  {
    key: "sin_stock",
    label: "Sin stock",
    value: 28,
    tone: "rose",
    // Ícono: triángulo alerta
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
        <path
          fill="currentColor"
          d="M1 21h22L12 2 1 21Zm12-3h-2v-2h2v2Zm0-4h-2v-4h2v4Z"
        />
      </svg>
    ),
    color: "#F43F5E",
  },
] as const;

const coupons: Coupon[] = [
  { id: "c1", name: "Verano 25", used: 3, percent: 20, status: "activo", color: "blue" },
  { id: "c2", name: "Tech15", used: 27, percent: 30, status: "expirado", color: "green" },
  { id: "c3", name: "Compra1", used: 23, percent: 20, status: "activo", color: "orange" },
];

function toneCls(t: string) {
  // chips superiores suaves tipo móvil
  const map: Record<string, string> = {
    indigo: "bg-indigo-50 text-indigo-700 ring-indigo-200/60",
    orange: "bg-orange-50 text-orange-700 ring-orange-200/60",
    green: "bg-emerald-50 text-emerald-700 ring-emerald-200/60",
    rose: "bg-rose-50 text-rose-700 ring-rose-200/60",
  };
  return map[t] ?? map.indigo;
}

function grad(color: Coupon["color"]) {
  const map: Record<Coupon["color"], string> = {
    blue: "from-sky-400 to-blue-600",
    green: "from-emerald-400 to-green-600",
    orange: "from-amber-400 to-orange-600",
  };
  return map[color];
}

function Tag({
  children,
  tone = "default",
}: {
  children: React.ReactNode;
  tone?: "default" | "success" | "warn" | "danger";
}) {
  const map: Record<string, string> = {
    default: "bg-neutral-100 text-neutral-700 ring-neutral-200/60",
    success: "bg-green-50 text-green-700 ring-green-200/60",
    warn: "bg-amber-50 text-amber-800 ring-amber-200/60",
    danger: "bg-rose-50 text-rose-700 ring-rose-200/60",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs ring-1 ring-inset ${map[tone]}`}>
      {children}
    </span>
  );
}

function ActionBar() {
  const Item = ({
    active = false,
    label,
    children,
  }: {
    active?: boolean;
    label: string;
    children: React.ReactNode;
  }) => (
    <button
      aria-label={label}
      className={[
        "inline-flex h-10 w-10 items-center justify-center rounded-full",
        active ? "text-white shadow" : "text-neutral-600 hover:bg-neutral-200",
      ].join(" ")}
      style={active ? { backgroundColor: BRAND_PINK_SOLID } : { backgroundColor: "#E5E7EB" }} // gris suave para no activos
    >
      {children}
    </button>
  );

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="rounded-full bg-neutral-100 px-2 py-1 ring-1 ring-black/5 shadow-sm">
        <div className="flex items-center justify-around gap-1">
          <Item label="Inicio" active>
            <svg viewBox="0 0 24 24" className="h-5 w-5"><path fill="currentColor" d="M12 3 3 10h3v10h12V10h3L12 3Z" /></svg>
          </Item>
          <Item label="Inventario">
            <svg viewBox="0 0 24 24" className="h-5 w-5"><path fill="currentColor" d="M20 7H4V4h16v3Zm0 3H4v10h16V10ZM8 12h8v2H8v-2Z" /></svg>
          </Item>
          <Item label="Borrar">
            <svg viewBox="0 0 24 24" className="h-5 w-5"><path fill="currentColor" d="M9 4h6l1 2h4v2H4V6h4l1-2Zm1 6h2v8h-2v-8Zm4 0h2v8h-2v-8Zm-8 0h2v8H6v-8Z" /></svg>
          </Item>
          <Item label="Enviar">
            <svg viewBox="0 0 24 24" className="h-5 w-5"><path fill="currentColor" d="m2 21 21-9L2 3v7l15 2-15 2v7Z" /></svg>
          </Item>
        </div>
      </div>
    </div>
  );
}

function CouponCard({ c }: { c: Coupon }) {
  return (
    <div className="rounded-2xl bg-neutral-50 p-5 ring-1 ring-black/5 shadow-sm">
      <div className="mb-2">
        {c.status === "activo" ? <Tag tone="success">Cupón activo</Tag> : <Tag tone="danger">Cupón expirado</Tag>}
      </div>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-base font-semibold leading-tight">{c.name}</div>
          <div className="text-sm text-neutral-500">Usado {c.used} {c.used === 1 ? "ocasión" : "veces"}</div>
        </div>
        <div
          className={`grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br ${grad(c.color)} text-white shadow`}
        >
          <div className="text-center text-xs leading-tight">
            <div className="text-xl font-bold">{c.percent}%</div>
            <div>Off</div>
          </div>
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        {/* Editar -> Editar producto */}
        <Link
          href={`/Vendedor/Productos/Editar?id=${encodeURIComponent(c.id)}`}
          className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-3 py-1.5 text-xs ring-1 ring-black/5 hover:bg-neutral-200"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4"><path fill="currentColor" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25Zm18-11.5a1 1 0 0 0 0-1.41l-1.59-1.59a1 1 0 0 0-1.41 0l-1.34 1.34 3.75 3.75 1.59-1.59Z"/></svg>
          Editar
        </Link>

        {/* Ver (lo dejamos igual; si quieres que también navegue, dime a dónde) */}
        <button className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-3 py-1.5 text-xs ring-1 ring-black/5 hover:bg-neutral-200">
          <svg viewBox="0 0 24 24" className="h-4 w-4"><path fill="currentColor" d="M12 7a5 5 0 0 0-5 5 5 5 0 0 0 10 0 5 5 0 0 0-5-5Zm0-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2Z"/></svg>
          Ver
        </button>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-6 lg:py-8 space-y-6">
      {/* Barra superior: logo grande y botones */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/logoCorreos.png" alt="Logo Correos" className="h-20 sm:h-26 w-auto" />
        </div>

        <div className="flex items-center gap-2">
          {/* NUEVO: Mis productos */}
          <Link
            href="/Vendedor/Productos/mis-productos"
            className="inline-flex items-center gap-2 rounded-full bg-neutral-100 px-4 py-2 text-sm text-neutral-700 ring-1 ring-black/5 shadow-sm hover:bg-neutral-200"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4"><path fill="currentColor" d="M7 4h10v2H7V4Zm0 4h10v2H7V8Zm0 4h10v2H7v-2Zm0 4h10v2H7v-2Z"/></svg>
            Mis productos
          </Link>

          {/* Crear producto */}
          <Link
            href="/Vendedor/Productos"
            className="inline-flex items-center gap-2 rounded-full bg-neutral-100 px-4 py-2 text-sm text-neutral-700 ring-1 ring-black/5 shadow-sm hover:bg-neutral-200"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4"><path fill="currentColor" d="M11 11V6h2v5h5v2h-5v5h-2v-5H6v-2h5Z"/></svg>
            Crear producto
          </Link>
        </div>
      </div>

      {/* Encabezado */}
      <header>
        <h1 className="text-3xl font-semibold">¡Hola, Juan!</h1>
        <p className="mt-1 text-sm text-neutral-600">Conoce el resumen de tus ventas a continuación.</p>
      </header>

      {/* KPIs en gris con chip e ícono de color */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.key} className="rounded-2xl bg-neutral-50 p-5 ring-1 ring-black/5 shadow-sm">
            <div className={`inline-flex items-center gap-2 rounded-full px-2 py-1 text-xs ring-1 ring-inset ${toneCls(s.tone)}`}>
              <span
                className="grid h-6 w-6 place-items-center rounded-full text-white"
                style={{ backgroundColor: s.color }}
              >
                {s.icon}
              </span>
              {s.label}
            </div>
            <div className="mt-3 text-3xl font-semibold leading-none">{s.value}</div>
          </div>
        ))}
      </section>

      {/* Ventas del mes con gradiente de marca */}
      <section>
        <div className="rounded-2xl shadow-lg">
          <div
            className="rounded-2xl p-6 text-white"
            style={{ backgroundImage: `linear-gradient(90deg, ${BRAND_PINK_FROM}, ${BRAND_PINK_TO})` }}
          >
            <div className="text-sm">Ventas del Mes</div>
            <div className="mt-1 text-4xl font-bold">$12,540</div>
            <div className="mt-1 text-xs text-white/90">15% más que el mes pasado.</div>
          </div>
        </div>
      </section>

      {/* Cupones en gris */}
      <section className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {coupons.map((c) => <CouponCard key={c.id} c={c} />)}
      </section>
    </div>
  );
}




