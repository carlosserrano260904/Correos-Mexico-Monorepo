'use client';

import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState, ChangeEvent } from 'react';

const BRAND_PINK_FROM = '#FF2AAF';
const BRAND_PINK_TO = '#E50071';

type Product = {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  categoria: string;
  imagenes: string[]; // urls base64 o absolutas
};

type ImgSlot = { preview?: string | null };

const MOCK_DB: Record<string, Product> = {
  p1: {
    id: 'p1',
    nombre: 'Caja chica',
    descripcion: 'Caja de cartón resistente para envíos.',
    precio: 199,
    stock: 24,
    categoria: 'Accesorios',
    imagenes: [],
  },
};

export default function Page() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const pid = params?.id ?? 'p1';

  const base = MOCK_DB[pid] ?? {
    id: pid,
    nombre: '',
    descripcion: '',
    precio: 0,
    stock: 0,
    categoria: '',
    imagenes: [],
  };

  const [nombre, setNombre] = useState(base.nombre);
  const [descripcion, setDescripcion] = useState(base.descripcion);
  const [precio, setPrecio] = useState<number | ''>(base.precio || '');
  const [stock, setStock] = useState<number | ''>(base.stock || '');
  const [categoria, setCategoria] = useState(base.categoria);
  const [imgs, setImgs] = useState<ImgSlot[]>(
    [0, 1, 2].map((i) => ({ preview: base.imagenes[i] ?? null }))
  );

  useEffect(() => {
    // en un real, aquí fetch al backend con pid
  }, [pid]);

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

  function onSave() {
    const payload: Product = {
      id: pid,
      nombre,
      descripcion,
      precio: Number(precio || 0),
      stock: Number(stock || 0),
      categoria,
      imagenes: imgs.map((s) => s.preview || '').filter(Boolean),
    };
    // sin backend: solo log
    console.log('UPDATE', payload);
    alert('Cambios guardados (mock).');
    router.push('/Vendedor');
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="grid h-9 w-9 place-items-center rounded-full bg-neutral-100 text-neutral-700 ring-1 ring-black/5 hover:bg-neutral-200"
          aria-label="Volver"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5">
            <path fill="currentColor" d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
          </svg>
        </button>

        <h1 className="flex items-center gap-2 text-2xl font-semibold">
          <span className="grid h-7 w-7 place-items-center rounded-full bg-neutral-100 text-neutral-700 ring-1 ring-black/5">
            <svg viewBox="0 0 24 24" className="h-4 w-4">
              <path
                fill="currentColor"
                d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25Zm18-11.5a1 1 0 0 0 0-1.41l-1.59-1.59a1 1 0 0 0-1.41 0l-1.34 1.34 3.75 3.75 1.59-1.59Z"
              />
            </svg>
          </span>
          Editar/Actualizar Producto
        </h1>
      </div>

      <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
        {/* Nombre */}
        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700">Nombre</label>
          <input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="h-11 w-full rounded-xl bg-neutral-50 px-3 text-sm placeholder-neutral-400 ring-1 ring-black/10 outline-none focus:ring-2 focus:ring-neutral-300"
            placeholder="Nombre de tu producto"
          />
        </div>

        {/* Descripción */}
        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700">Descripción</label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="min-h-[120px] w-full rounded-xl bg-neutral-50 p-3 text-sm placeholder-neutral-400 ring-1 ring-black/10 outline-none focus:ring-2 focus:ring-neutral-300"
            placeholder="Escribe una descripción de tu producto, no mayor a 200 caracteres."
            maxLength={200}
          />
        </div>

        {/* Precio y Stock */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">Precio</label>
            <input
              type="number"
              value={precio}
              onChange={(e) => setPrecio(e.target.value === '' ? '' : Number(e.target.value))}
              className="h-11 w-full rounded-xl bg-neutral-50 px-3 text-sm placeholder-neutral-400 ring-1 ring-black/10 outline-none focus:ring-2 focus:ring-neutral-300"
              placeholder="Cantidad"
              min="0"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">Cantidad en stock</label>
            <input
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value === '' ? '' : Number(e.target.value))}
              className="h-11 w-full rounded-xl bg-neutral-50 px-3 text-sm placeholder-neutral-400 ring-1 ring-black/10 outline-none focus:ring-2 focus:ring-neutral-300"
              placeholder="Cantidad"
              min="0"
            />
          </div>
        </div>

        {/* Categoría */}
        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700">Categoría</label>
          <div className="relative">
            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="h-11 w-full appearance-none rounded-xl bg-neutral-50 px-3 pr-10 text-sm text-neutral-800 ring-1 ring-black/10 outline-none focus:ring-2 focus:ring-neutral-300"
            >
              <option value="" disabled>
                Selecciona una categoría
              </option>
              <option>Accesorios</option>
              <option>Electrónica</option>
              <option>Hogar</option>
              <option>Ropa</option>
            </select>
            <span className="pointer-events-none absolute inset-y-0 right-3 grid place-items-center text-neutral-500">
              <svg viewBox="0 0 24 24" className="h-5 w-5">
                <path fill="currentColor" d="M7 10l5 5 5-5z" />
              </svg>
            </span>
          </div>
        </div>

        {/* Imágenes */}
        <div>
          <div className="mb-2 text-sm font-medium text-neutral-700">Imágenes del producto</div>
          <div className="grid grid-cols-3 gap-3">
            {imgs.map((slot, i) => (
              <label
                key={i}
                className="flex aspect-square cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-neutral-300 bg-neutral-50 ring-1 ring-black/5 hover:bg-neutral-100"
                title="Subir imagen"
              >
                {slot.preview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={slot.preview}
                    alt={`Imagen ${i + 1}`}
                    className="h-full w-full rounded-xl object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-1 text-neutral-400">
                    <svg viewBox="0 0 24 24" className="h-8 w-8">
                      <path
                        fill="currentColor"
                        d="M21 19V5a2 2 0 0 0-2-2H5C3.9 3 3 3.9 3 5v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2ZM8.5 13l2.5 3.01L13.5 12l4.5 6H6l2.5-5Z"
                      />
                    </svg>
                    <span className="text-xs">Agregar</span>
                  </div>
                )}
                <input type="file" accept="image/*" className="hidden" onChange={(e) => onPick(i, e)} />
              </label>
            ))}
          </div>
        </div>

        {/* Botones */}
        <div className="flex flex-col gap-3 pt-2">
          <button
            type="button"
            onClick={onSave}
            className="flex w-full items-center justify-center gap-2 rounded-full py-3 text-white shadow-lg"
            style={{ backgroundImage: `linear-gradient(90deg, ${BRAND_PINK_FROM}, ${BRAND_PINK_TO})` }}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5">
              <path fill="currentColor" d="M5 13h14v-2H5v2Zm0 6h14v-2H5v2ZM5 7h14V5H5v2Z" />
            </svg>
            Guardar cambios
          </button>

          <button
            type="button"
            onClick={() => router.back()}
            className="w-full rounded-full bg-neutral-100 py-3 text-sm text-neutral-700 ring-1 ring-black/5 hover:bg-neutral-200"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
