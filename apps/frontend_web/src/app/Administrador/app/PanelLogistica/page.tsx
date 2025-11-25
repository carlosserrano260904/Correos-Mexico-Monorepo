'use client';

import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import {
  IoStorefrontOutline,
  IoSearchOutline,
  IoChevronDownOutline,
} from "react-icons/io5";

type EstadoSucursal = "Activa" | "Inactiva";
type TipoSucursal = "Administrativa" | "Ventanilla" | "Centro logístico";

type Sucursal = {
  id: string;
  nombre: string;
  tipo: TipoSucursal;
  claveOficina: string;
  estado: EstadoSucursal;
  municipio: string;
  telefono: string;
  direccion: string;
};

type SucursalForm = Omit<Sucursal, "id">;

type Envio = {
  idEnvio: string;
  conductor: string;
  idVehiculo: string;
  fechaTermino: string;
};

// Mock inicial, luego lo puedes cambiar por datos del backend
const SUCURSALES_MOCK: Sucursal[] = [
  {
    id: "1",
    nombre: "Oficina Central",
    tipo: "Administrativa",
    claveOficina: "CF-032",
    estado: "Activa",
    municipio: "Durango",
    telefono: "618-123-4849",
    direccion: "Av. Juárez 123, Zona Centro",
  },
  {
    id: "2",
    nombre: "Sucursal Norte",
    tipo: "Ventanilla",
    claveOficina: "CF-018",
    estado: "Activa",
    municipio: "Durango",
    telefono: "618-555-1100",
    direccion: "Blvd. Norte 456, Fracc. Industrial",
  },
  {
    id: "3",
    nombre: "Centro Logístico Oriente",
    tipo: "Centro logístico",
    claveOficina: "CF-089",
    estado: "Inactiva",
    municipio: "Gómez Palacio",
    telefono: "871-222-3344",
    direccion: "Carretera a Torreón km 12",
  },
  {
    id: "4",
    nombre: "Sucursal Poniente",
    tipo: "Ventanilla",
    claveOficina: "CF-045",
    estado: "Activa",
    municipio: "Lerdo",
    telefono: "871-333-2211",
    direccion: "Calle Hidalgo 45, Col. Centro",
  },
];

const ENVIOS_MOCK: Envio[] = [
  {
    idEnvio: "ENV-2819",
    conductor: "Juan Pérez",
    idVehiculo: "ID-460",
    fechaTermino: "21/09/2025",
  },
  {
    idEnvio: "ENV-2820",
    conductor: "Juan Pérez",
    idVehiculo: "ID-460",
    fechaTermino: "21/09/2025",
  },
  {
    idEnvio: "ENV-2821",
    conductor: "Ana García",
    idVehiculo: "MT-221",
    fechaTermino: "21/09/2025",
  },
  {
    idEnvio: "ENV-2822",
    conductor: "Carlos Hernández",
    idVehiculo: "DG-591",
    fechaTermino: "21/09/2025",
  },
];

const ESTADOS: EstadoSucursal[] = ["Activa", "Inactiva"];
const TIPOS: TipoSucursal[] = ["Administrativa", "Ventanilla", "Centro logístico"];

export default function SucursalesLogisticaPage() {
  const [sucursales, setSucursales] = useState<Sucursal[]>(SUCURSALES_MOCK);
  const [search, setSearch] = useState("");
  const [filtroEstado, setFiltroEstado] = useState<string>("");
  const [filtroTipo, setFiltroTipo] = useState<string>("");

  const [detailSucursal, setDetailSucursal] = useState<Sucursal | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedSucursal, setSelectedSucursal] = useState<Sucursal | null>(
    null
  );
  const [form, setForm] = useState<SucursalForm>({
    nombre: "",
    tipo: "Administrativa",
    claveOficina: "",
    estado: "Activa",
    municipio: "",
    telefono: "",
    direccion: "",
  });

  const sucursalesFiltradas = useMemo(() => {
    return sucursales.filter((s) => {
      const q = search.toLowerCase().trim();
      const matchSearch =
        !q ||
        s.nombre.toLowerCase().includes(q) ||
        s.claveOficina.toLowerCase().includes(q) ||
        s.municipio.toLowerCase().includes(q);
      const matchEstado = !filtroEstado || s.estado === filtroEstado;
      const matchTipo = !filtroTipo || s.tipo === filtroTipo;
      return matchSearch && matchEstado && matchTipo;
    });
  }, [sucursales, search, filtroEstado, filtroTipo]);

  function openCreateModal() {
    setModalMode("create");
    setSelectedSucursal(null);
    setForm({
      nombre: "",
      tipo: "Administrativa",
      claveOficina: "",
      estado: "Activa",
      municipio: "",
      telefono: "",
      direccion: "",
    });
    setIsModalOpen(true);
  }

  function openEditModal(sucursal: Sucursal) {
    setModalMode("edit");
    setSelectedSucursal(sucursal);
    setForm({
      nombre: sucursal.nombre,
      tipo: sucursal.tipo,
      claveOficina: sucursal.claveOficina,
      estado: sucursal.estado,
      municipio: sucursal.municipio,
      telefono: sucursal.telefono,
      direccion: sucursal.direccion,
    });
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
  }

  function handleFormChange<K extends keyof SucursalForm>(
    key: K,
    value: SucursalForm[K]
  ) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!form.nombre || !form.claveOficina) {
      alert("Completa al menos el nombre de la sucursal y la clave de oficina.");
      return;
    }

    if (modalMode === "create") {
      const nueva: Sucursal = {
        id: Date.now().toString(),
        ...form,
      };
      setSucursales((prev) => [...prev, nueva]);
      setDetailSucursal(nueva);
    } else if (modalMode === "edit" && selectedSucursal) {
      const actualizada: Sucursal = {
        id: selectedSucursal.id,
        ...form,
      };
      setSucursales((prev) =>
        prev.map((s) => (s.id === selectedSucursal.id ? actualizada : s))
      );
      setDetailSucursal(actualizada);
    }

    setIsModalOpen(false);
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Sucursales</h1>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 rounded-full bg-pink-500 px-4 py-2 text-sm font-medium text-white shadow hover:bg-pink-600"
        >
          + Crear una sucursal
        </button>
      </div>

      {/* PARTE SUPERIOR: VISUALIZADOR + PANEL DETALLE */}
      <section className="grid gap-4 lg:grid-cols-3">
        {/* Visualizador */}
        <article className="lg:col-span-2 rounded-2xl bg-white border border-gray-100 shadow-sm p-4 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold text-gray-900">
                Visualizador de sucursales
              </h2>
              <p className="text-xs text-gray-500">
                Busca por nombre, clave o municipio.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Buscar */}
              <div className="relative">
                <IoSearchOutline className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por nombre, clave..."
                  className="w-56 rounded-full border border-gray-300 bg-gray-50 pl-9 pr-3 py-1.5 text-xs focus:border-pink-400 focus:outline-none focus:ring-1 focus:ring-pink-300"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              {/* Estado */}
              <div className="relative">
                <select
                  className="w-32 appearance-none rounded-full border border-gray-300 bg-gray-50 px-3 py-1.5 pr-8 text-xs text-gray-700 focus:border-pink-400 focus:outline-none focus:ring-1 focus:ring-pink-300"
                  value={filtroEstado}
                  onChange={(e) => setFiltroEstado(e.target.value)}
                >
                  <option value="">Estado</option>
                  {ESTADOS.map((e) => (
                    <option key={e} value={e}>
                      {e}
                    </option>
                  ))}
                </select>
                <IoChevronDownOutline className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-gray-400" />
              </div>

              {/* Tipo sucursal */}
              <div className="relative">
                <select
                  className="w-40 appearance-none rounded-full border border-gray-300 bg-gray-50 px-3 py-1.5 pr-8 text-xs text-gray-700 focus:border-pink-400 focus:outline-none focus:ring-1 focus:ring-pink-300"
                  value={filtroTipo}
                  onChange={(e) => setFiltroTipo(e.target.value)}
                >
                  <option value="">Tipo de sucursal</option>
                  {TIPOS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                <IoChevronDownOutline className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Lista de sucursales */}
          <div className="mt-2 rounded-xl border border-gray-100 bg-gray-50">
            <div className="grid grid-cols-5 gap-2 border-b border-gray-100 px-4 py-2 text-[11px] font-medium text-gray-500">
              <span>Nombre</span>
              <span>Estado</span>
              <span>Clave oficina</span>
              <span>Municipio</span>
              <span className="text-right">Acción</span>
            </div>
            <div className="divide-y divide-gray-100">
              {sucursalesFiltradas.map((s) => (
                <div
                  key={s.id}
                  className="grid grid-cols-5 gap-2 items-center px-4 py-2 text-xs bg-white/0 hover:bg-white"
                >
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-pink-50 text-pink-500">
                      <IoStorefrontOutline className="h-4 w-4" />
                    </span>
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-900">
                        {s.nombre}
                      </span>
                      <span className="text-[11px] text-gray-500">
                        {s.tipo}
                      </span>
                    </div>
                  </div>

                  <span className="text-[11px]">
                    {s.estado === "Activa" ? (
                      <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-600">
                        Activa
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600">
                        Inactiva
                      </span>
                    )}
                  </span>

                  <span className="text-gray-800">{s.claveOficina}</span>
                  <span className="text-gray-800">{s.municipio}</span>
                  <button
                    type="button"
                    onClick={() => setDetailSucursal(s)}
                    className="text-right text-[11px] font-medium text-pink-500 hover:text-pink-600"
                  >
                    Ver detalles
                  </button>
                </div>
              ))}

              {sucursalesFiltradas.length === 0 && (
                <div className="px-4 py-4 text-xs text-gray-500">
                  No se encontraron sucursales con esos filtros.
                </div>
              )}
            </div>
          </div>
        </article>

        {/* Panel de detalle */}
        <article className="rounded-2xl bg-white border border-dashed border-gray-200 shadow-sm flex items-center justify-center text-center px-4">
          {detailSucursal ? (
            <div className="w-full space-y-3 text-sm text-left">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-pink-50 text-pink-500">
                    <IoStorefrontOutline className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-xs text-gray-500">Nombre de la sucursal</p>
                    <p className="text-base font-semibold text-gray-900">
                      {detailSucursal.nombre}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => openEditModal(detailSucursal)}
                  className="rounded-full border border-pink-200 px-3 py-1 text-xs font-medium text-pink-600 hover:bg-pink-50"
                >
                  Editar
                </button>
              </div>

              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                <div>
                  <p className="text-gray-500">Tipo de sucursal</p>
                  <p className="font-medium text-gray-900">
                    {detailSucursal.tipo}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Clave oficina</p>
                  <p className="font-medium text-gray-900">
                    {detailSucursal.claveOficina}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Estado</p>
                  <p className="font-medium text-gray-900">
                    {detailSucursal.estado}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Municipio</p>
                  <p className="font-medium text-gray-900">
                    {detailSucursal.municipio}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Teléfono</p>
                  <p className="font-medium text-gray-900">
                    {detailSucursal.telefono}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-gray-500">Dirección</p>
                  <p className="font-medium text-gray-900">
                    {detailSucursal.direccion}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-2 text-xs text-gray-500">
              <p className="font-medium text-gray-700">
                Haz clic en{" "}
                <span className="text-pink-500 font-semibold">
                  “Ver detalles”
                </span>{" "}
                en un elemento de la lista para ver más información.
              </p>
              <p>O usa el botón “Crear una sucursal” para registrar una nueva.</p>
            </div>
          )}
        </article>
      </section>

      {/* TABLA DE ENVIOS COMPLETADOS */}
      <section className="rounded-2xl bg-white border border-gray-100 shadow-sm mt-2">
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
                <th className="px-4 py-2 text-left font-medium">
                  ID del vehículo
                </th>
                <th className="px-4 py-2 text-left font-medium">
                  Fecha de término
                </th>
              </tr>
            </thead>
            <tbody>
              {ENVIOS_MOCK.map((envio) => (
                <tr
                  key={envio.idEnvio}
                  className="border-t border-gray-100 hover:bg-gray-50"
                >
                  <td className="px-4 py-2 text-gray-900">
                    {envio.idEnvio}
                  </td>
                  <td className="px-4 py-2 text-gray-700">
                    {envio.conductor}
                  </td>
                  <td className="px-4 py-2 text-gray-700">
                    {envio.idVehiculo}
                  </td>
                  <td className="px-4 py-2 text-gray-700">
                    {envio.fechaTermino}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* MODAL CREAR / EDITAR SUCURSAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-40 flex items-start justify-center bg-black/20 backdrop-blur-sm">
          <div
            className="absolute inset-0"
            onClick={closeModal}
          />
          <div className="relative mt-16 w-full max-w-4xl rounded-2xl bg-white shadow-2xl border border-gray-100">
            {/* Header modal */}
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <div className="flex items-center gap-2">
                <IoStorefrontOutline className="h-5 w-5 text-gray-700" />
                <h2 className="text-sm font-semibold text-gray-900">
                  {modalMode === "create"
                    ? "Registrar una sucursal"
                    : form.nombre}
                </h2>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="rounded-full border border-gray-200 px-3 py-1 text-xs font-medium text-gray-500 hover:bg-gray-50"
              >
                Cancelar
              </button>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4 text-xs">
              <div className="grid gap-3 md:grid-cols-3">
                <div>
                  <label className="mb-1 block text-gray-500">
                    Nombre de la sucursal
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-full border border-gray-300 px-3 py-2 text-xs focus:border-pink-400 focus:outline-none focus:ring-1 focus:ring-pink-300"
                    value={form.nombre}
                    onChange={(e) =>
                      handleFormChange("nombre", e.target.value)
                    }
                    placeholder="Nombre de la sucursal"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-gray-500">
                    Tipo de sucursal
                  </label>
                  <select
                    className="w-full appearance-none rounded-full border border-gray-300 bg-white px-3 py-2 pr-8 text-xs text-gray-700 focus:border-pink-400 focus:outline-none focus:ring-1 focus:ring-pink-300"
                    value={form.tipo}
                    onChange={(e) =>
                      handleFormChange("tipo", e.target.value as TipoSucursal)
                    }
                  >
                    {TIPOS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-gray-500">
                    Clave oficina
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-full border border-gray-300 px-3 py-2 text-xs focus:border-pink-400 focus:outline-none focus:ring-1 focus:ring-pink-300"
                    value={form.claveOficina}
                    onChange={(e) =>
                      handleFormChange("claveOficina", e.target.value)
                    }
                    placeholder="Clave oficina"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-gray-500">
                    Estado
                  </label>
                  <select
                    className="w-full appearance-none rounded-full border border-gray-300 bg-white px-3 py-2 pr-8 text-xs text-gray-700 focus:border-pink-400 focus:outline-none focus:ring-1 focus:ring-pink-300"
                    value={form.estado}
                    onChange={(e) =>
                      handleFormChange("estado", e.target.value as EstadoSucursal)
                    }
                  >
                    {ESTADOS.map((e) => (
                      <option key={e} value={e}>
                        {e}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-gray-500">
                    Municipio
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-full border border-gray-300 px-3 py-2 text-xs focus:border-pink-400 focus:outline-none focus:ring-1 focus:ring-pink-300"
                    value={form.municipio}
                    onChange={(e) =>
                      handleFormChange("municipio", e.target.value)
                    }
                    placeholder="Municipio"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-gray-500">
                    Teléfono
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-full border border-gray-300 px-3 py-2 text-xs focus:border-pink-400 focus:outline-none focus:ring-1 focus:ring-pink-300"
                    value={form.telefono}
                    onChange={(e) =>
                      handleFormChange("telefono", e.target.value)
                    }
                    placeholder="Teléfono"
                  />
                </div>

                <div className="md:col-span-3">
                  <label className="mb-1 block text-gray-500">
                    Dirección
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-full border border-gray-300 px-3 py-2 text-xs focus:border-pink-400 focus:outline-none focus:ring-1 focus:ring-pink-300"
                    value={form.direccion}
                    onChange={(e) =>
                      handleFormChange("direccion", e.target.value)
                    }
                    placeholder="Dirección"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="inline-flex items-center rounded-full bg-pink-500 px-6 py-2 text-sm font-medium text-white shadow hover:bg-pink-600"
                >
                  {modalMode === "create"
                    ? "✓ Terminar registro"
                    : "✓ Guardar cambios"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}