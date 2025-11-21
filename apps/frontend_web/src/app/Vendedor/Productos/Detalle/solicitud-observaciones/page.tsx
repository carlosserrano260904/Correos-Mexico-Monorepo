'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import {
  ArrowLeft,
  Calendar,
  Edit,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';

export default function SolicitudObservacionesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // ID del producto que llega por query:
  // /Vendedor/Productos/Detalle/solicitud-observaciones?id=XXX
  // Cuando se conecte backend, este ID servirá para pedir el detalle real.
  const productId = searchParams.get('id') ?? 'p3';

  // MOCK temporal – sustituir por datos reales del backend usando productId
  const producto = {
    id: productId,
    nombre: 'Jarrón artesanal',
    estatus: 'Observaciones',
    fechaCreacion: '29/10/2025',
    descripcion:
      'Descripción del producto aquí. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    precio: 800,
    observaciones:
      'Observaciones de un administrador aquí. El administrador ha indicado que faltan detalles de materiales y medidas en la descripción.',
    // Solo 2 imágenes para evitar rotas en el demo
    imagenes: [
      'https://images.pexels.com/photos/1005058/pexels-photo-1005058.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/102129/pexels-photo-102129.jpeg?auto=compress&cs=tinysrgb&w=400',
    ],
  };

  const precioFormateado = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(producto.precio);

  // Fecha que aparece en la línea de progreso (mock)
  const fechaProgreso = '25/10/2025';

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto max-w-md px-4 py-6 sm:max-w-lg lg:max-w-3xl lg:py-8">
        {/* Botón regresar */}
        <button
          onClick={() => router.back()}
          className="mb-3 flex items-center gap-1 text-sm text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft size={18} /> Regresar
        </button>

        <h1 className="text-xl font-semibold text-slate-900 lg:text-2xl">
          Detalles de la Solicitud
        </h1>

        {/* Card principal: info del producto y estado */}
        <Card className="mt-4 rounded-2xl border border-slate-100 bg-[#F5F7FA] p-4 shadow-sm">
          <div className="flex items-start justify-between">
            <h2 className="text-lg font-semibold text-slate-900">
              {producto.nombre}
            </h2>
            <Badge className="rounded-full border border-amber-200 bg-amber-100 px-3 py-0.5 text-xs text-amber-700">
              Observaciones
            </Badge>
          </div>

          <div className="mt-3 text-sm text-slate-700">
            <p className="flex items-center gap-1 text-xs text-slate-500">
              <Calendar size={14} />
              Fecha de creación: {producto.fechaCreacion}
            </p>
            <p className="mt-3">{producto.descripcion}</p>
          </div>

          <div className="mt-4">
            <p className="text-xs font-semibold uppercase text-slate-400">
              Precio
            </p>
            <p className="text-base font-semibold text-slate-900">
              {precioFormateado} MXN
            </p>
          </div>

          {/* Imágenes añadidas – placeholders bonitos, listos para reemplazar */}
          <div className="mt-4">
            <p className="text-xs font-semibold uppercase text-slate-400">
              Imágenes añadidas
            </p>
            <div className="mt-2 flex gap-3 overflow-x-auto pb-1">
              {producto.imagenes.map((img, i) => (
                <div
                  key={i}
                  className="flex h-24 w-24 flex-none items-center justify-center overflow-hidden rounded-xl bg-slate-100 sm:h-28 sm:w-28"
                >
                  {/* TODO: cambiar a <Image> de Next cuando se definan dominios remotos */}
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

        {/* Card Progreso: dos pasos, iconos cercanos al diseño original */}
        <Card className="mt-4 rounded-2xl border border-slate-100 bg-[#F5F7FA] p-4 shadow-sm">
          <h3 className="mb-3 text-sm font-medium text-slate-800">Progreso</h3>

          <div className="space-y-4">
            {/* Paso 1: Solicitud en revisión */}
            <div className="flex items-start gap-3">
              {/* Icono azul dentro de círculo, similar al diseño */}
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-blue-100 bg-blue-50">
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

            {/* Paso 2: Con observaciones */}
            <div className="flex items-start gap-3">
              {/* Icono naranja dentro de círculo, similar al diseño */}
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-amber-100 bg-amber-50">
                <AlertCircle className="h-4 w-4 text-amber-500" />
              </div>
              <div className="flex-1">
                <p className="text-[11px] text-slate-400">{fechaProgreso}</p>
                <p className="text-sm font-semibold text-slate-800">
                  Con observaciones
                </p>
                <p className="text-xs text-slate-600">
                  Tu solicitud fue revisada y es necesario que atiendas las
                  siguientes observaciones.
                </p>
                {/* Caja blanca con texto del admin */}
                <div className="mt-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700">
                  {producto.observaciones}
                </div>
              </div>
            </div>

            {/* Botón: estilo gris, pero funcional y redirigiendo al editor */}
            <Button
              variant="outline"
              className="mt-3 w-full rounded-full border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900"
              // Cuando edites realmente, este push ya te lleva al formulario correcto
              onClick={() =>
                router.push(
                  `/Vendedor/Productos/Editar?id=${encodeURIComponent(
                    producto.id,
                  )}`,
                )
              }
            >
              <Edit className="mr-2 h-4 w-4" />
              Realizar modificaciones
            </Button>
          </div>
        </Card>
      </main>
    </div>
  );
}


