'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import {
  ArrowLeft,
  PencilLine,
  PauseCircle,
  TrendingUp,
  MessageCircle,
  ShoppingBag,
  ShoppingCart,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

type ProductStatus = 'Activo' | 'Pausado' | 'Agotado';

/**
 * MOCKS TEMPORALES
 * ------------------------------------------------------------------
 * Cuando el backend esté listo:
 * - Usar `pid` (id de la URL) para pedir el detalle de producto.
 * - Rellenar estos datos con la respuesta real.
 */
const MOCK_PRODUCT = {
  id: 'p1',
  nombre: 'Jarrón artesanal',
  precio: 800,
  moneda: 'MXN',
  estatus: 'Activo' as ProductStatus,
  descripcion:
    'Descripción del producto aquí. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam feugiat justo quis magna tempor.',
  imagenes: [
    'https://images.pexels.com/photos/1005058/pexels-photo-1005058.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/102129/pexels-photo-102129.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1021295/pexels-photo-1021295.jpeg?auto=compress&cs=tinysrgb&w=400',
  ],
  ventasTotales: 6000,
  ejemplaresVendidos: 100,
};

const MOCK_COMMENTS = [
  {
    id: 1,
    nombre: 'María Belén',
    fecha: '27 Sep 2025',
    avatar:
      'https://images.pexels.com/photos/3760852/pexels-photo-3760852.jpeg?auto=compress&cs=tinysrgb&w=200',
    comentario:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut ultricies dictum elementum.',
  },
];

const MOCK_HISTORY = [
  {
    id: 1,
    comprador: 'María Belén',
    fecha: '11/06/2025',
    pedidoId: 'AWC401',
  },
  {
    id: 2,
    comprador: 'Jesús Pérez',
    fecha: '15/08/2025',
    pedidoId: 'QTY651',
  },
  {
    id: 3,
    comprador: 'Luis Ortega',
    fecha: '21/10/2025',
    pedidoId: 'EOT801',
  },
];

// -----------------------------------------------------------------------------
// COMPONENTES PEQUEÑOS
// -----------------------------------------------------------------------------

function StatusBadge({ status }: { status: ProductStatus }) {
  if (status === 'Activo') {
    return (
      <Badge className="bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-full px-3 py-0.5 text-xs">
        Activo
      </Badge>
    );
  }
  if (status === 'Pausado') {
    return (
      <Badge className="bg-amber-100 text-amber-700 border border-amber-200 rounded-full px-3 py-0.5 text-xs">
        Pausado
      </Badge>
    );
  }
  return (
    <Badge className="bg-rose-100 text-rose-700 border border-rose-200 rounded-full px-3 py-0.5 text-xs">
      Agotado
    </Badge>
  );
}

function historyIconClasses(index: number) {
  const variants = [
    'bg-pink-100 text-pink-500',
    'bg-indigo-100 text-indigo-500',
    'bg-emerald-100 text-emerald-500',
  ];
  return variants[index % variants.length];
}

// -----------------------------------------------------------------------------
// PÁGINA
// -----------------------------------------------------------------------------

export default function DetalleProductoPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // ID del producto que viene en la URL: /Vendedor/Productos/Detalle?id=xxx
  const pid = searchParams.get('id') ?? MOCK_PRODUCT.id;

  // TODO: usar pid para pedir datos reales
  const product = MOCK_PRODUCT;

  const precioFormateado = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: product.moneda,
  }).format(product.precio);

  const ventasFormateadas = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: product.moneda,
  }).format(product.ventasTotales);

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto flex w-full max-w-5xl flex-col px-4 py-4 sm:px-6 lg:px-8 lg:py-8">
        {/* Header */}
        <header className="mb-4 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1 text-sm text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft size={18} />
            <span>Regresar</span>
          </button>

          <div className="flex flex-wrap gap-2 sm:justify-end">
            <Button
              variant="outline"
              size="sm"
              className="rounded-full border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              onClick={() =>
                router.push(
                  `/Vendedor/Productos/Editar?id=${encodeURIComponent(pid)}`
                )
              }
            >
              <PencilLine className="mr-1 h-4 w-4" />
              Editar
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              // TODO: integrar acción real de pausar producto
              onClick={() =>
                alert('Acción de pausar producto (pendiente de backend).')
              }
            >
              <PauseCircle className="mr-1 h-4 w-4" />
              Pausar
            </Button>
          </div>
        </header>

        {/* Título principal */}
        <h1 className="mb-4 text-xl font-semibold text-slate-900 sm:text-2xl">
          Detalles del Producto
        </h1>

        <section className="flex flex-col gap-4 sm:gap-5">
          {/* Card: información del producto */}
          <Card className="rounded-2xl border border-slate-100 bg-[#F5F7FA] p-4 shadow-sm sm:p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  {product.nombre}
                </h2>
                <div className="mt-2">
                  <StatusBadge status={product.estatus} />
                </div>
              </div>
              <div className="text-right">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  Precio
                </p>
                <p className="text-base font-semibold text-slate-900">
                  {precioFormateado}
                </p>
              </div>
            </div>

            <div className="mt-4 grid gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  Descripción
                </p>
                <p className="mt-1 text-sm leading-relaxed text-slate-700">
                  {product.descripcion}
                </p>
              </div>

              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  Imágenes añadidas
                </p>
                <div className="mt-2 flex gap-3 overflow-x-auto pb-1">
                  {product.imagenes.map((img, idx) => (
                    <div
                      key={idx}
                      className="flex h-24 w-24 flex-none items-center justify-center overflow-hidden rounded-xl bg-slate-100 sm:h-28 sm:w-28"
                    >
                      {/* 
                        TODO: cambiar a <Image> de Next si el proyecto ya tiene configurados los dominios remotos.
                      */}
                      <img
                        src={img}
                        alt={`Imagen ${idx + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Card: Ventas */}
          <Card className="rounded-2xl border border-slate-100 bg-[#F5F7FA] p-4 shadow-sm sm:p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-slate-800">Ventas</p>
                <p className="mt-2 text-3xl font-semibold text-slate-900">
                  {ventasFormateadas}
                </p>
                <p className="mt-1 flex items-center gap-1 text-xs text-emerald-600">
                  <ShoppingBag className="h-3 w-3" />
                  {product.ejemplaresVendidos} ejemplares vendidos
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-50">
                <TrendingUp className="h-6 w-6 text-violet-500" />
              </div>
            </div>
          </Card>

          {/* Card: Comentarios */}
          <Card className="rounded-2xl border border-slate-100 bg-[#F5F7FA] p-4 shadow-sm sm:p-5">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm font-medium text-slate-800">Comentarios</p>
              <MessageCircle className="h-4 w-4 text-slate-400" />
            </div>
            <Separator className="my-2" />

            {MOCK_COMMENTS.length === 0 ? (
              <p className="text-sm text-slate-500">
                Aún no tienes comentarios en este producto.
              </p>
            ) : (
              <ul className="space-y-4">
                {MOCK_COMMENTS.map((c) => (
                  <li key={c.id} className="flex gap-3">
                    <img
                      src={c.avatar}
                      alt={c.nombre}
                      className="mt-1 h-10 w-10 flex-none rounded-full object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-sm font-semibold text-slate-900">
                          {c.nombre}
                        </p>
                        <span className="text-xs text-slate-400">
                          {c.fecha}
                        </span>
                      </div>
                      <p className="mt-1 text-sm leading-relaxed text-slate-700">
                        {c.comentario}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          {/* Card: Historial de compras */}
          <Card className="mb-8 rounded-2xl border border-slate-100 bg-[#F5F7FA] p-4 shadow-sm sm:p-5">
            <p className="text-sm font-medium text-slate-800">
              Historial de compras
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Comprado {MOCK_HISTORY.length} veces
            </p>

            <div className="mt-3 space-y-3">
              {MOCK_HISTORY.map((h, idx) => (
                <div key={h.id}>
                  {idx > 0 && <Separator className="mb-3" />}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div
                        className={`mt-0.5 flex h-9 w-9 items-center justify-center rounded-full ${historyIconClasses(
                          idx,
                        )}`}
                      >
                        <ShoppingCart className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">
                          Por {h.comprador}
                        </p>
                        <p className="text-xs text-slate-500">
                          ID del pedido:{' '}
                          <span className="font-semibold">{h.pedidoId}</span>
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-slate-400">{h.fecha}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </section>
      </main>
    </div>
  );
}
