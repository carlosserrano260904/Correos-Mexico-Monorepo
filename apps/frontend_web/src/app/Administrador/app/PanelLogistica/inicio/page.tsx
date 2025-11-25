'use client';

import {
  IoStorefrontOutline,
  IoCubeOutline,
  IoPersonOutline,
  IoBusOutline,
} from "react-icons/io5";

type SummaryCard = {
  id: string;
  label: string;
  value: number;
  accentColor: string;
  iconBg: string;
  icon: React.ComponentType<{ className?: string }>;
};

type Shipment = {
  idEnvio: string;
  conductor: string;
  idVehiculo: string;
  fechaTermino: string;
};

type Assignment = {
  id: number;
  nombre: string;
  vehiculo: string;
  placas: string;
  color: "green" | "pink" | "yellow";
};

const summaryCards: SummaryCard[] = [
  {
    id: "sucursales",
    label: "Sucursales activas",
    value: 184,
    accentColor: "text-pink-500",
    iconBg: "bg-pink-50",
    icon: IoStorefrontOutline,
  },
  {
    id: "envios",
    label: "Envíos en curso",
    value: 275,
    accentColor: "text-emerald-500",
    iconBg: "bg-emerald-50",
    icon: IoCubeOutline,
  },
  {
    id: "personal",
    label: "Total de personal",
    value: 850,
    accentColor: "text-sky-500",
    iconBg: "bg-sky-50",
    icon: IoPersonOutline,
  },
  {
    id: "unidades",
    label: "Total de unidades",
    value: 1600,
    accentColor: "text-amber-500",
    iconBg: "bg-amber-50",
    icon: IoBusOutline,
  },
];

// Datos de ejemplo, listos para que luego se reemplacen por datos reales del back
const recentShipments: Shipment[] = [
  { idEnvio: "ENV-2819", conductor: "Juan Pérez", idVehiculo: "ID-460", fechaTermino: "21/09/2025" },
  { idEnvio: "ENV-2820", conductor: "Juan Pérez", idVehiculo: "ID-460", fechaTermino: "21/09/2025" },
  { idEnvio: "ENV-2821", conductor: "Juan Pérez", idVehiculo: "ID-460", fechaTermino: "21/09/2025" },
  { idEnvio: "ENV-2822", conductor: "Juan Pérez", idVehiculo: "ID-460", fechaTermino: "21/09/2025" },
];

const assignments: Assignment[] = [
  {
    id: 1,
    nombre: "Juan Pérez",
    vehiculo: "Camioneta",
    placas: "DRY-649",
    color: "pink",
  },
  {
    id: 2,
    nombre: "Daniel Robles",
    vehiculo: "Camioneta",
    placas: "DRY-649",
    color: "green",
  },
  {
    id: 3,
    nombre: "Ana García",
    vehiculo: "Moto",
    placas: "DRY-213",
    color: "yellow",
  },
];

const vehiculosActivos = 63;
const pedidosCompletados = 63;

function ProgressCircle({ value, color }: { value: number; color: "pink" | "sky" }) {
  const angle = Math.min(Math.max(value, 0), 100) * 3.6;
  const colorHex = color === "pink" ? "#ec4899" : "#0ea5e9";

  return (
    <div className="relative h-24 w-24">
      <div
        className="h-full w-full rounded-full"
        style={{
          backgroundImage: `conic-gradient(${colorHex} ${angle}deg, #e5e7eb 0deg)`,
        }}
      />
      <div className="absolute inset-2 rounded-full bg-white flex items-center justify-center">
        <span className="text-lg font-semibold text-gray-900">
          {value}%
        </span>
      </div>
    </div>
  );
}

export default function InicioLogisticaPage() {
  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <header className="space-y-1">
        <h1 className="text-3xl font-semibold text-gray-900">
          Bienvenido, Juan
        </h1>
        <p className="text-sm text-gray-500">
          Resumen general del desempeño de la logística hoy.
        </p>
      </header>

      {/* Tarjetas resumen */}
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => {
          const Icon = card.icon;
          return (
            <article
              key={card.id}
              className="flex flex-col justify-between rounded-2xl bg-white border border-gray-100 shadow-sm px-4 py-4"
            >
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-gray-500">
                    {card.label}
                  </p>
                  <p className="text-3xl font-semibold text-gray-900">
                    {card.value.toLocaleString("es-MX")}
                  </p>
                </div>
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full ${card.iconBg}`}
                >
                  <Icon className={`h-5 w-5 ${card.accentColor}`} />
                </div>
              </div>
              <button
                type="button"
                className="mt-3 text-xs font-medium text-pink-500 hover:text-pink-600 text-left"
              >
                Ver más
              </button>
            </article>
          );
        })}
      </section>

      {/* Zona inferior: tabla + métricas de progreso + asignaciones */}
      <section className="grid gap-4 lg:grid-cols-3">
        {/* Tabla de envíos completados */}
        <article className="lg:col-span-2 rounded-2xl bg-white border border-gray-100 shadow-sm">
          <header className="px-4 py-3 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-900">
              Envíos completados recientemente
            </h2>
          </header>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-xs text-gray-500">
                  <th className="px-4 py-2 text-left font-medium">ID del envío</th>
                  <th className="px-4 py-2 text-left font-medium">Conductor</th>
                  <th className="px-4 py-2 text-left font-medium">ID del vehículo</th>
                  <th className="px-4 py-2 text-left font-medium">Fecha de término</th>
                </tr>
              </thead>
              <tbody>
                {recentShipments.map((shipment, index) => (
                  <tr
                    key={`${shipment.idEnvio}-${index}`}
                    className="border-t border-gray-100 hover:bg-gray-50"
                  >
                    <td className="px-4 py-2 text-gray-900">
                      {shipment.idEnvio}
                    </td>
                    <td className="px-4 py-2 text-gray-700">
                      {shipment.conductor}
                    </td>
                    <td className="px-4 py-2 text-gray-700">
                      {shipment.idVehiculo}
                    </td>
                    <td className="px-4 py-2 text-gray-700">
                      {shipment.fechaTermino}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        {/* Columna derecha: métricas circulares + asignaciones */}
        <div className="space-y-4">
          {/* Vehículos activos */}
          <article className="rounded-2xl bg-white border border-gray-100 shadow-sm px-4 py-4">
            <h2 className="text-sm font-semibold text-gray-900">
              Vehículos activos
            </h2>
            <p className="mt-1 text-xs text-gray-500">
              Vehículos que están completando un pedido en el momento.
            </p>
            <div className="mt-4 flex items-center gap-4">
              <ProgressCircle value={vehiculosActivos} color="sky" />
              <div className="space-y-1 text-sm text-gray-700">
                <p>
                  <span className="font-semibold text-gray-900">
                    {vehiculosActivos}%{" "}
                  </span>
                  de la flota activa.
                </p>
                <p className="text-xs text-gray-500">
                  Esta semana se ha mantenido dentro del rango esperado.
                </p>
              </div>
            </div>
          </article>

          {/* Pedidos completados */}
          <article className="rounded-2xl bg-white border border-gray-100 shadow-sm px-4 py-4">
            <h2 className="text-sm font-semibold text-gray-900">
              Pedidos completados
            </h2>
            <p className="mt-1 text-xs text-gray-500">
              Porcentaje de pedidos completados hasta el momento.
            </p>
            <div className="mt-4 flex items-center gap-4">
              <ProgressCircle value={pedidosCompletados} color="pink" />
              <div className="space-y-1 text-sm text-gray-700">
                <p>
                  <span className="font-semibold text-gray-900">
                    {pedidosCompletados}%{" "}
                  </span>
                  de cumplimiento en la jornada.
                </p>
                <p className="text-xs text-gray-500">
                  Revisa incidencias si el porcentaje baja de 50%.
                </p>
              </div>
            </div>
          </article>

          {/* Asignaciones recientes */}
          <article className="rounded-2xl bg-white border border-gray-100 shadow-sm px-4 py-4">
            <h2 className="text-sm font-semibold text-gray-900">
              Asignaciones recientes
            </h2>
            <ul className="mt-3 space-y-3 text-sm">
              {assignments.map((item) => (
                <li key={item.id} className="flex items-start gap-3">
                  <span
                    className={`mt-1 h-2.5 w-2.5 rounded-full ${
                      item.color === "green"
                        ? "bg-emerald-500"
                        : item.color === "yellow"
                        ? "bg-amber-400"
                        : "bg-pink-500"
                    }`}
                  />
                  <div className="space-y-0.5">
                    <p className="font-medium text-gray-900">{item.nombre}</p>
                    <p className="text-xs text-gray-500">
                      Vehículo: {item.vehiculo}
                    </p>
                    <p className="text-xs text-gray-500">
                      Número de placas: {item.placas}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </section>
    </div>
  );
}