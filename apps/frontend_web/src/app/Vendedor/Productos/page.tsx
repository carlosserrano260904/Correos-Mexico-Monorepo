'use client';

import { useRouter } from 'next/navigation';
import { useState, ChangeEvent } from 'react';

const BRAND_PINK_FROM = '#FF2AAF';
const BRAND_PINK_TO = '#E50071';

type ImgSlot = { preview?: string | null };

export default function Page() {
  const router = useRouter();
  const [imgs, setImgs] = useState<ImgSlot[]>([{},{},{}]);

  function onPick(i: number, e: ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      const next = [...imgs];
      next[i] = { preview: String(reader.result) };
      setImgs(next);
    };
    reader.readAsDataURL(f);
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push('/Vendedor')}
          className="grid h-9 w-9 place-items-center rounded-full bg-neutral-100 text-neutral-700 ring-1 ring-black/5 hover:bg-neutral-200"
          aria-label="Volver"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5"><path fill="currentColor" d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>
        </button>

        <h1 className="flex items-center gap-2 text-2xl font-semibold">
          <span className="grid h-7 w-7 place-items-center rounded-full bg-neutral-100 text-neutral-700 ring-1 ring-black/5">
            <svg viewBox="0 0 24 24" className="h-4 w-4"><path fill="currentColor" d="M12 17a2 2 0 0 0 2-2v-3a2 2 0 0 0-4 0v3a2 2 0 0 0 2 2Zm6-6h-1V9a5 5 0 0 0-10 0v2H6a2 2 0 0 0-2 2v7h16v-7a2 2 0 0 0-2-2Zm-7 0V9a3 3 0 0 1 6 0v2h-6Z"/></svg>
          </span>
          Crear un producto
        </h1>
      </div>

      <form className="space-y-5">
        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700">Nombre</label>
          <input className="h-11 w-full rounded-xl bg-neutral-50 px-3 text-sm placeholder-neutral-400 ring-1 ring-black/10 outline-none focus:ring-2 focus:ring-neutral-300" placeholder="Nombre de tu producto"/>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700">Descripción</label>
          <textarea className="min-h-[120px] w-full rounded-xl bg-neutral-50 p-3 text-sm placeholder-neutral-400 ring-1 ring-black/10 outline-none focus:ring-2 focus:ring-neutral-300" placeholder="Escribe una descripción de tu producto, no mayor a 200 caracteres." maxLength={200}/>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">Precio</label>
            <input type="number" className="h-11 w-full rounded-xl bg-neutral-50 px-3 text-sm placeholder-neutral-400 ring-1 ring-black/10 outline-none focus:ring-2 focus:ring-neutral-300" placeholder="Cantidad" min="0"/>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">Cantidad en stock</label>
            <input type="number" className="h-11 w-full rounded-xl bg-neutral-50 px-3 text-sm placeholder-neutral-400 ring-1 ring-black/10 outline-none focus:ring-2 focus:ring-neutral-300" placeholder="Cantidad" min="0"/>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700">Categoría</label>
          <div className="relative">
            <select className="h-11 w-full appearance-none rounded-xl bg-neutral-50 px-3 pr-10 text-sm text-neutral-800 ring-1 ring-black/10 outline-none focus:ring-2 focus:ring-neutral-300" defaultValue="">
              <option value="" disabled>Selecciona una categoría</option>
              <option>Accesorios</option><option>Electrónica</option><option>Hogar</option><option>Ropa</option>
            </select>
            <span className="pointer-events-none absolute inset-y-0 right-3 grid place-items-center text-neutral-500">
              <svg viewBox="0 0 24 24" className="h-5 w-5"><path fill="currentColor" d="M7 10l5 5 5-5z"/></svg>
            </span>
          </div>
        </div>

        <div>
          <div className="mb-2 text-sm font-medium text-neutral-700">Imágenes del producto</div>
          <div className="grid grid-cols-3 gap-3">
            {imgs.map((slot, i) => (
              <label key={i} className="flex aspect-square cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-neutral-300 bg-neutral-50 ring-1 ring-black/5 hover:bg-neutral-100" title="Subir imagen">
                {slot.preview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={slot.preview} alt={`Imagen ${i+1}`} className="h-full w-full rounded-xl object-cover"/>
                ) : (
                  <div className="flex flex-col items-center gap-1 text-neutral-400">
                    <svg viewBox="0 0 24 24" className="h-8 w-8"><path fill="currentColor" d="M21 19V5a2 2 0 0 0-2-2H5C3.9 3 3 3.9 3 5v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2ZM8.5 13l2.5 3.01L13.5 12l4.5 6H6l2.5-5Z"/></svg>
                    <span className="text-xs">Agregar</span>
                  </div>
                )}
                <input type="file" accept="image/*" className="hidden" onChange={(e)=>onPick(i, e)} />
              </label>
            ))}
          </div>
        </div>

        <div className="pt-2">
          <button type="button" className="flex w-full items-center justify-center gap-2 rounded-full py-3 text-white shadow-lg" style={{ backgroundImage: `linear-gradient(90deg, ${BRAND_PINK_FROM}, ${BRAND_PINK_TO})` }}>
            <svg viewBox="0 0 24 24" className="h-5 w-5"><path fill="currentColor" d="M11 11V6h2v5h5v2h-5v5h-2v-5H6v-2h5Z"/></svg>
            Crear producto
          </button>
        </div>
      </form>
    </div>
  );
}
