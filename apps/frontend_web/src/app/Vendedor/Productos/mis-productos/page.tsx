'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

const BRAND_PINK_FROM = '#FF2AAF';
const BRAND_PINK_TO = '#E50071';
const BRAND_PINK_SOLID = '#E50071';

type Estado = 'Activo' | 'Pausado' | 'Sin stock';
type Prod = { id: string; nombre: string; precio: number; vendidos: number; stock: number; estado: Estado };

const DATA: Prod[] = [
  { id: 'p1', nombre: 'Jarrón Artesanal', precio: 120, vendidos: 25, stock: 40, estado: 'Activo' },
  { id: 'p2', nombre: 'Jarrón Artesanal', precio: 120, vendidos: 25, stock: 35, estado: 'Activo' },
  { id: 'p3', nombre: 'Jarrón Artesanal', precio: 120, vendidos: 25, stock: 25, estado: 'Pausado' },
  { id: 'p4', nombre: 'Jarrón Artesanal', precio: 120, vendidos: 25, stock: 5,  estado: 'Pausado' },
  { id: 'p5', nombre: 'Jarrón Artesanal', precio: 120, vendidos: 25, stock: 15, estado: 'Sin stock' },
  { id: 'p6', nombre: 'Jarrón Artesanal', precio: 120, vendidos: 25, stock: 60, estado: 'Activo' },
];

function chipTone(e: Estado) {
  if (e === 'Activo') return 'bg-green-50 text-green-700 ring-green-200/60';
  if (e === 'Pausado') return 'bg-amber-50 text-amber-700 ring-amber-200/60';
  return 'bg-rose-50 text-rose-700 ring-rose-200/60';
}
function ringColor(p: number) {
  if (p >= 70) return '#16A34A';
  if (p >= 30) return '#F59E0B';
  return '#E11D48';
}
function ProgressRing({ percent }: { percent: number }) {
  const c = ringColor(percent);
  return (
    <div className="flex flex-col items-center justify-center">
      <div
        className="grid h-24 w-24 place-items-center rounded-full md:h-28 md:w-28"
        style={{ background: `conic-gradient(${c} ${percent}%, #e5e7eb ${percent}%)` }}
        aria-label={`Stock ${percent}%`}
      >
        <div className="grid h-18 w-18 place-items-center rounded-full bg-white text-lg font-bold text-neutral-800 md:h-20 md:w-20 md:text-xl">
          {percent}%
        </div>
      </div>
      <div className="mt-2 text-xs text-neutral-500 md:text-sm">Porcentaje en stock</div>
    </div>
  );
}

export default function Page() {
  const [tab, setTab] = useState<'Todos' | Estado>('Todos');

  const prods = useMemo(() => {
    return DATA.map(p => {
      const total = p.vendidos + p.stock || 1;
      const percent = Math.max(0, Math.min(100, Math.round((p.stock / total) * 100)));
      return { ...p, percent };
    }).filter(p => (tab === 'Todos' ? true : p.estado === tab));
  }, [tab]);

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
            <path fill="currentColor" d="M11 11V6h2v5h5v2h-5v5h-2v-5H6v-2h5Z" />
          </svg>
          Crear producto
        </Link>
      </div>

      {/* Título */}
      <h1 className="text-4xl font-semibold md:text-5xl">Mis Productos</h1>

      {/* Tabs + Estado */}
      <div className="flex flex-wrap items-center gap-3">
        {(['Todos', 'Activo', 'Pausado', 'Sin stock'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t as any)}
            className={[
              'rounded-full px-5 py-2.5 text-base',
              tab === t
                ? 'text-white'
                : 'bg-neutral-100 text-neutral-700 ring-1 ring-black/5 hover:bg-neutral-200',
            ].join(' ')}
            style={tab === t ? { background: `linear-gradient(90deg, ${BRAND_PINK_FROM}, ${BRAND_PINK_TO})` } : {}}
          >
            {t}
          </button>
        ))}

        {/* Nuevo botón Estado que navega a la vista /estado */}
        <Link
          href="/Vendedor/Productos/estado"
          className="rounded-full bg-neutral-100 px-5 py-2.5 text-base text-neutral-700 ring-1 ring-black/5 hover:bg-neutral-200"
        >
          Estado
        </Link>
      </div>

      {/* Grid: 3 por fila en desktop */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3">
        {prods.map(p => (
          <div
            key={p.id}
            className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-8 rounded-3xl bg-white p-7 ring-1 ring-black/5 shadow-md min-h-[220px] hover:shadow-lg transition-shadow"
          >
            {/* Info */}
            <div>
              <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm ring-1 ring-inset ${chipTone(p.estado)}`}>
                {p.estado === 'Activo' ? (
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-green-600 text-white">
                    <svg viewBox="0 0 24 24" className="h-4 w-4"><path fill="currentColor" d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z"/></svg>
                  </span>
                ) : p.estado === 'Pausado' ? (
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-amber-500 text-white">
                    <svg viewBox="0 0 24 24" className="h-4 w-4"><path fill="currentColor" d="M7 5h3v14H7zM14 5h3v14h-3z"/></svg>
                  </span>
                ) : (
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-rose-500 text-white">
                    <svg viewBox="0 0 24 24" className="h-4 w-4"><path fill="currentColor" d="M1 21h22L12 2 1 21Zm12-3h-2v-2h2v2Zm0-4h-2v-4h2v4Z"/></svg>
                  </span>
                )}
                {p.estado}
              </div>

              <Link
                href={`/Vendedor/Productos/Editar/${p.id}`}
                className="mt-3 block text-lg font-medium hover:underline"
                style={{ color: BRAND_PINK_SOLID }}
              >
                {p.nombre}
              </Link>

              <div className="mt-1 text-3xl font-semibold">${p.precio} MXN</div>
              <div className="mt-2 text-base text-neutral-600">
                Vendidos: {p.vendidos} · Stock: {p.stock}
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href={`/Vendedor/Productos/Editar/${p.id}`}
                  className="inline-flex items-center gap-2 rounded-full bg-neutral-100 px-4 py-2 text-sm ring-1 ring-black/5 hover:bg-neutral-200"
                  title="Editar"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5"><path fill="currentColor" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25Zm18-11.5a1 1 0 0 0 0-1.41l-1.59-1.59a1 1 0 0 0-1.41 0l-1.34 1.34 3.75 3.75 1.59-1.59Z"/></svg>
                  Editar
                </Link>
                <button className="inline-flex items-center gap-2 rounded-full bg-neutral-100 px-4 py-2 text-sm ring-1 ring-black/5 hover:bg-neutral-200" title="Pausar">
                  <svg viewBox="0 0 24 24" className="h-5 w-5"><path fill="currentColor" d="M7 5h3v14H7zM14 5h3v14h-3z"/></svg>
                  Pausar
                </button>
                <button className="inline-flex items-center gap-2 rounded-full bg-neutral-100 px-4 py-2 text-sm ring-1 ring-black/5 hover:bg-neutral-200" title="Eliminar">
                  <svg viewBox="0 0 24 24" className="h-5 w-5"><path fill="currentColor" d="M9 4h6l1 2h4v2H4V6h4l1-2Zm1 6h2v8h-2v-8Zm4 0h2v8h-2v-8Zm-8 0h2v8H6v-8Z"/></svg>
                  Eliminar
                </button>
              </div>
            </div>

            {/* Indicador */}
            <ProgressRing percent={(p as any).percent} />
          </div>
        ))}
      </div>
    </div>
  );
}
