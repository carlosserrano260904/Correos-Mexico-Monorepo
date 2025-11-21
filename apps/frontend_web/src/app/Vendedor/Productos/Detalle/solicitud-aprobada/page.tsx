'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export default function SolicitudAprobadaPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // ID del producto que llega desde:
  // /Vendedor/Productos/Detalle/solicitud-aprobada?id=XXX
  // TODO (backend): usar este ID para pedir los datos reales de la solicitud
  const productId = searchParams.get('id') ?? 'p1';

  // MOCK temporal – reemplazar cuando haya API
  const producto = {
    id: productId,
    nombre: 'Jarrón artesanal',
    fechaCreacion: '29/10/2025',
    descripcion:
      'Descripción del producto aquí. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam feugiat justo quis magna tempor.',
    precio: 800,
    moneda: 'MXN',
    imagenes: [
      // 3 imágenes que sí cargan (mismos placeholders que Detalle de Producto)
      'https://images.pexels.com/photos/1005058/pexels-photo-1005058.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/102129/pexels-photo-102129.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/1021295/pexels-photo-1021295.jpeg?auto=compress&cs=tinysrgb&w=400',
    ],
  };

  const precioFormateado = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: producto.moneda,
  }).format(producto.precio);

  // Fecha que se muestra en la sección Progreso (mock)
  const fechaProgreso = '25/10/2025';

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto max-w-md px-4 py-6 sm:max-w-lg lg:max-w-3xl lg:py-8">
        {/* Regresar */}
        <button
          onClick={() => router.back()}
          className="mb-3 flex items-center gap-1 text-sm text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft size={18} /> Regresar
        </button>

        <h1 className="text-xl font-semibold text-slate-900 lg:text-2xl">
          Detalles de la Solicitud
        </h1>

        {/* CARD PRINCIPAL – misma estructura visual que el diseño */}
        <Card className="mt-4 rounded-2xl border border-slate-100 bg-[#F5F7FA] p-4 shadow-sm">
          {/* Título dentro de la card */}
          <h2 className="text-base font-semibold text-slate-900 sm:text-lg">
            {producto.nombre}
          </h2>

          {/* Estatus + fecha de creación */}
          <div className="mt-3 grid gap-3 text-xs text-slate-600 sm:grid-cols-2">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                Estatus
              </p>
              <div className="mt-1 inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-100 px-3 py-0.5 text-[11px] font-medium text-emerald-700">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Aprobada
              </div>
            </div>
            <div className="sm:text-right">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                Fecha de creación
              </p>
              <p className="mt-1 flex items-center gap-1 text-xs text-slate-700 sm:justify-end">
                <Calendar size={14} className="hidden sm:inline" />
                {producto.fechaCreacion}
              </p>
            </div>
          </div>

          {/* Descripción */}
          <div className="mt-4">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              Descripción
            </p>
            <p className="mt-1 text-sm leading-relaxed text-slate-700">
              {producto.descripcion}
            </p>
          </div>

          {/* Precio */}
          <div className="mt-4">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              Precio
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-900">
              {precioFormateado} {producto.moneda}
            </p>
          </div>

          {/* Imágenes añadidas */}
          <div className="mt-4">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              Imágenes añadidas
            </p>
            <div className="mt-2 flex gap-3 overflow-x-auto pb-1">
              {producto.imagenes.map((img, i) => (
                <div
                  key={i}
                  className="flex h-24 w-24 flex-none items-center justify-center overflow-hidden rounded-xl bg-slate-100 sm:h-28 sm:w-28"
                >
                  {/* 
                    TODO (frontend): cuando definan dominios remotos, 
                    se puede cambiar por <Image> de Next para mejor performance.
                  */}
                  <img
                    src={img}
                    alt={`Imagen ${i + 1}`}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* CARD PROGRESO – iconos, colores y textos similares al diseño */}
        <Card className="mt-4 rounded-2xl border border-slate-100 bg-[#F5F7FA] p-4 shadow-sm mb-8">
          <h3 className="mb-3 text-sm font-medium text-slate-800">
            Progreso
          </h3>

          <div className="space-y-4">
            {/* Paso 1: Solicitud en revisión */}
            <div className="flex items-start gap-3">
              {/* Círculo azul con icono de revisión */}
              <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full border border-blue-100 bg-blue-50">
                <Loader2 className="h-4 w-4 text-blue-500" />
              </div>
              <div className="flex-1">
                <p className="text-[11px] text-slate-400">{fechaProgreso}</p>
                <p className="text-sm font-semibold text-slate-800">
                  Solicitud en revisión
                </p>
                <p className="text-xs text-slate-600">
                  Tu solicitud fue enviada correctamente y será revisada
                  pronto por un administrador.
                </p>
              </div>
            </div>

            <Separator className="my-1" />

            {/* Paso 2: Solicitud aprobada */}
            <div className="flex items-start gap-3">
              {/* Círculo verde con icono de aprobado */}
              <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full border border-emerald-100 bg-emerald-50">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              </div>
              <div className="flex-1">
                <p className="text-[11px] text-slate-400">{fechaProgreso}</p>
                <p className="text-sm font-semibold text-slate-800">
                  Solicitud aprobada
                </p>
                <p className="text-xs text-slate-600">
                  Un administrador aprobó tu solicitud y puedes comenzar a
                  vender tu producto.
                </p>
              </div>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}

