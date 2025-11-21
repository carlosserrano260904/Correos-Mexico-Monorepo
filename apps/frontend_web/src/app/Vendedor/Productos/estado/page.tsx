'use client';

import Link from 'next/link';

const BRAND_PINK_FROM = '#FF2AAF';
const BRAND_PINK_TO = '#E50071';

type EstadoSolicitud = 'Aprobada' | 'En revisión' | 'Rechazada';

type Solicitud = {
  id: string;
  nombre: string;
  fecha: string;   // dd/mm/aaaa
  imagenes: number;
  precio: number;
  estado: EstadoSolicitud;
};

const DATA: Solicitud[] = [
  { id: 's1', nombre: 'Nombre del producto', fecha: '29/10/2025', imagenes: 3, precio: 480, estado: 'Aprobada' },
  { id: 's2', nombre: 'Nombre del producto', fecha: '29/10/2025', imagenes: 3, precio: 480, estado: 'En revisión' },
  { id: 's3', nombre: 'Nombre del producto', fecha: '29/10/2025', imagenes: 3, precio: 480, estado: 'Rechazada' },
];

function chipTone(s: EstadoSolicitud) {
  if (s === 'Aprobada') return 'bg-green-50 text-green-700 ring-green-200/60';
  if (s === 'En revisión') return 'bg-sky-50 text-sky-700 ring-sky-200/60';
  return 'bg-rose-50 text-rose-700 ring-rose-200/60';
}
function chipIcon(s: EstadoSolicitud) {
  if (s === 'Aprobada')
    return (
      <span className="grid h-6 w-6 place-items-center rounded-full bg-green-600 text-white">
        <svg viewBox="0 0 24 24" className="h-4 w-4"><path fill="currentColor" d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z"/></svg>
      </span>
    );
  if (s === 'En revisión')
    return (
      <span className="grid h-6 w-6 place-items-center rounded-full bg-sky-500 text-white">
        <svg viewBox="0 0 24 24" className="h-4 w-4"><path fill="currentColor" d="M12 17.5 9.5 15l1.4-1.4L12 14.7l3.6-3.6 1.4 1.4L12 17.5z"/></svg>
      </span>
    );
  return (
    <span className="grid h-6 w-6 place-items-center rounded-full bg-rose-500 text-white">
      <svg viewBox="0 0 24 24" className="h-4 w-4"><path fill="currentColor" d="M18.3 5.71 12 12l6.3 6.29-1.41 1.42L10.59 13.4 4.3 19.71 2.89 18.3 9.17 12 2.89 5.71 4.3 4.29l6.29 6.3 6.29-6.3z"/></svg>
    </span>
  );
}

export default function Page() {
  return (
    <div className="mx-auto w-full max-w-[1600px] px-8 lg:px-12 2xl:px-16 py-10 space-y-8">
      {/* Barra superior */}
      <div className="flex items-center justify-between gap-6">
        <img src="/logoCorreos.png" alt="Logo Correos" className="h-16 w-auto md:h-20" />
        <Link
          href="/Vendedor/Productos"
          className="inline-flex items-center gap-2 rounded-full bg-neutral-100 px-5 py-3 text-base text-neutral-700 ring-1 ring-black/5 shadow-sm hover:bg-neutral-200"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5">
            <path fill="currentColor" d="M11 11V6h2v5h5v2h-5v5h-2v-5H6v-2h5Z"/>
          </svg>
          Crear producto
        </Link>
      </div>

      {/* Título */}
      <h1 className="text-4xl font-semibold md:text-5xl">Mis Solicitudes</h1>

      {/* Tabs (Solicitudes activo) */}
      <div className="flex flex-wrap items-center gap-3">
        <Link href="/Vendedor/Productos/mis-productos" className="rounded-full bg-neutral-100 px-5 py-2.5 text-base text-neutral-700 ring-1 ring-black/5 hover:bg-neutral-200">Todos</Link>
        <Link href="/Vendedor/Productos/mis-productos" className="rounded-full bg-neutral-100 px-5 py-2.5 text-base text-neutral-700 ring-1 ring-black/5 hover:bg-neutral-200">Activos</Link>
        <Link href="/Vendedor/Productos/mis-productos" className="rounded-full bg-neutral-100 px-5 py-2.5 text-base text-neutral-700 ring-1 ring-black/5 hover:bg-neutral-200">Pausados</Link>
        <Link href="/Vendedor/Productos/mis-productos" className="rounded-full bg-neutral-100 px-5 py-2.5 text-base text-neutral-700 ring-1 ring-black/5 hover:bg-neutral-200">Sin stock</Link>
        <span
          className="rounded-full px-5 py-2.5 text-base text-white"
          style={{ background: `linear-gradient(90deg, ${BRAND_PINK_FROM}, ${BRAND_PINK_TO})` }}
        >
          Solicitudes
        </span>
      </div>

      {/* Lista: 1 col móvil, 2 cols en desktop para ocupar ancho */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {DATA.map((s) => (
          <div key={s.id} className="rounded-3xl bg-white p-7 ring-1 ring-black/5 shadow-md hover:shadow-lg transition-shadow">
            <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm ring-1 ring-inset ${chipTone(s.estado)}`}>
              {chipIcon(s.estado)}
              {s.estado}
            </div>

            <div className="mt-3 text-2xl font-semibold md:text-3xl">{s.nombre}</div>

            <div className="mt-2 flex items-center gap-2 text-base text-neutral-600">
              <svg viewBox="0 0 24 24" className="h-5 w-5"><path fill="currentColor" d="M19 3H5a2 2 0 0 0-2 2v14l4-4h12a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Z"/></svg>
              Solicitud creada el {s.fecha}
            </div>

            <div className="mt-5 grid grid-cols-2 gap-4">
              <div className="flex items-center justify-between rounded-2xl bg-neutral-50 px-4 py-3 text-sm ring-1 ring-black/5">
                <span>Imágenes añadidas</span>
                <span className="text-base font-semibold">{s.imagenes}</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-neutral-50 px-4 py-3 text-sm ring-1 ring-black/5">
                <span>Precio del producto</span>
                <span className="text-base font-semibold">${s.precio.toFixed(2)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
