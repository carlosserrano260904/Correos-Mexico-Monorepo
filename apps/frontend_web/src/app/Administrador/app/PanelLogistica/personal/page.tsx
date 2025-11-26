"use client";

import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import {
  IoPersonOutline,
  IoSearchOutline,
  IoChevronDownOutline,
} from "react-icons/io5";

type EstadoLicencia = "Vigente" | "Vencida" | "Suspendida";
type EstatusConductor = "Activo" | "Inactivo";

type Conductor = {
  id: string;
  nombre: string;
  numeroLicencia: string;
  estadoLicencia: EstadoLicencia;
  rfc: string;
  curp: string;
  telefono: string;
  email: string;
  claveOficina: string;
  estatus: EstatusConductor;
};

type ConductorForm = Omit<Conductor, "id">;

type TabPersonal = "conductores" | "repartidores";

const CONDUCTORES_MOCK: Conductor[] = [
  {
    id: "1",
    nombre: "Mario Márquez",
    numeroLicencia: "LIC-1483",
    estadoLicencia: "Vigente",
    rfc: "CAGB001010XXX",
    curp: "CAGB001010HDFRRL01",
    telefono: "618-189-2626",
    email: "mario.marquez@gmail.com",
    claveOficina: "OF-12830",
    estatus: "Activo",
  },
  {
    id: "2",
    nombre: "Ana García",
    numeroLicencia: "LIC-2001",
    estadoLicencia: "Vigente",
    rfc: "GAAA900101XXX",
    curp: "GAAA900101MDFRRL02",
    telefono: "618-200-3344",
    email: "ana.garcia@correos.mx",
    claveOficina: "OF-12830",
    estatus: "Activo",
  },
  {
    id: "3",
    nombre: "Carlos Hernández",
    numeroLicencia: "LIC-1350",
    estadoLicencia: "Suspendida",
    rfc: "HECC880202XXX",
    curp: "HECC880202HDFRRL03",
    telefono: "618-555-7890",
    email: "carlos.hernandez@correos.mx",
    claveOficina: "OF-09010",
    estatus: "Inactivo",
  },
];

const ESTADOS_LICENCIA: EstadoLicencia[] = [
  "Vigente",
  "Vencida",
  "Suspendida",
];

const ESTATUS_CONDUCTOR: EstatusConductor[] = ["Activo", "Inactivo"];

const UNIDADES_DISPONIBLES = ["DG-591", "ID-460", "MT-221"];

export default function PersonalLogisticaPage() {
  const [tab, setTab] = useState<TabPersonal>("conductores");

  const [conductores, setConductores] =
    useState<Conductor[]>(CONDUCTORES_MOCK);
  const [search, setSearch] = useState("");
  const [filtroEstado, setFiltroEstado] = useState<string>("");
  const [filtroLicencia, setFiltroLicencia] = useState<string>("");

  const [detailConductor, setDetailConductor] = useState<Conductor | null>(
    null
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedConductor, setSelectedConductor] =
    useState<Conductor | null>(null);
  const [form, setForm] = useState<ConductorForm>({
    nombre: "",
    numeroLicencia: "",
    estadoLicencia: "Vigente",
    rfc: "",
    curp: "",
    telefono: "",
    email: "",
    claveOficina: "",
    estatus: "Activo",
  });

  const [isAsignacionModalOpen, setIsAsignacionModalOpen] = useState(false);
  const [unidadAsignacion, setUnidadAsignacion] = useState<string>("");

  const conductoresFiltrados = useMemo(() => {
    return conductores.filter((c) => {
      const q = search.toLowerCase().trim();
      const matchSearch =
        !q ||
        c.nombre.toLowerCase().includes(q) ||
        c.telefono.includes(q) ||
        c.email.toLowerCase().includes(q);
      const matchEstado = !filtroEstado || c.estatus === filtroEstado;
      const matchLicencia =
        !filtroLicencia || c.estadoLicencia === filtroLicencia;
      return matchSearch && matchEstado && matchLicencia;
    });
  }, [conductores, search, filtroEstado, filtroLicencia]);

  function abrirModalCrear() {
    setModalMode("create");
    setSelectedConductor(null);
    setForm({
      nombre: "",
      numeroLicencia: "",
      estadoLicencia: "Vigente",
      rfc: "",
      curp: "",
      telefono: "",
      email: "",
      claveOficina: "",
      estatus: "Activo",
    });
    setIsModalOpen(true);
  }

  function abrirModalEditar(conductor: Conductor) {
    setModalMode("edit");
    setSelectedConductor(conductor);
    setForm({
      nombre: conductor.nombre,
      numeroLicencia: conductor.numeroLicencia,
      estadoLicencia: conductor.estadoLicencia,
      rfc: conductor.rfc,
      curp: conductor.curp,
      telefono: conductor.telefono,
      email: conductor.email,
      claveOficina: conductor.claveOficina,
      estatus: conductor.estatus,
    });
    setIsModalOpen(true);
  }

  function cerrarModal() {
    setIsModalOpen(false);
  }

  function handleFormChange<K extends keyof ConductorForm>(
    key: K,
    value: ConductorForm[K]
  ) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.nombre || !form.numeroLicencia) {
      alert("Completa al menos el nombre y el número de licencia.");
      return;
    }

    if (modalMode === "create") {
      const nuevo: Conductor = {
        id: Date.now().toString(),
        ...form,
      };
      setConductores((prev) => [...prev, nuevo]);
      setDetailConductor(nuevo);
    } else if (modalMode === "edit" && selectedConductor) {
      const actualizado: Conductor = {
        id: selectedConductor.id,
        ...form,
      };
      setConductores((prev) =>
        prev.map((c) => (c.id === selectedConductor.id ? actualizado : c))
      );
      setDetailConductor(actualizado);
    }

    setIsModalOpen(false);
  }

  function abrirModalAsignacion() {
    setUnidadAsignacion("");
    setIsAsignacionModalOpen(true);
  }

  function cerrarModalAsignacion() {
    setIsAsignacionModalOpen(false);
  }

  function handleGuardarAsignacion(e: FormEvent) {
    e.preventDefault();
    if (!unidadAsignacion) {
      alert("Selecciona una unidad disponible.");
      return;
    }
    // solo frontend: aquí luego puedes llamar al backend
    setIsAsignacionModalOpen(false);
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Personal</h1>
        <button
          onClick={abrirModalCrear}
          className="inline-flex items-center gap-2 rounded-full bg-pink-500 px-4 py-2 text-sm font-medium text-white shadow hover:bg-pink-600"
        >
          + Registrar un conductor
        </button>
      </div>

      {/* VISUALIZADOR + DETALLE */}
      <section className="grid gap-4 lg:grid-cols-3">
        {/* Visualizador */}
        <article className="lg:col-span-2 rounded-2xl bg-white border border-gray-100 shadow-sm p-4 space-y-4">
          {/* Título + tabs internos */}
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold text-gray-900">
                Visualizador del personal
              </h2>
              <p className="text-xs text-gray-500">
                Busca y filtra el personal operativo y administrativo.
              </p>
            </div>
            <div className="inline-flex rounded-full bg-gray-100 p-1 text-xs">
              <button
                type="button"
                onClick={() => setTab("conductores")}
                className={`px-3 py-1 rounded-full ${
                  tab === "conductores"
                    ? "bg-white shadow text-pink-500 font-semibold"
                    : "text-gray-600"
                }`}
              >
                Conductores
              </button>
              <button
                type="button"
                onClick={() => setTab("repartidores")}
                className={`px-3 py-1 rounded-full ${
                  tab === "repartidores"
                    ? "bg-white shadow text-pink-500 font-semibold"
                    : "text-gray-600"
                }`}
              >
                Repartidores
              </button>
            </div>
          </div>

          {/* Filtros */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <IoSearchOutline className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nombre, correo, teléfono..."
                className="w-64 rounded-full border border-gray-300 bg-gray-50 pl-9 pr-3 py-1.5 text-xs focus:border-pink-400 focus:outline-none focus:ring-1 focus:ring-pink-300"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Estado (activo/inactivo) */}
            <div className="relative">
              <select
                className="w-32 appearance-none rounded-full border border-gray-300 bg-gray-50 px-3 py-1.5 pr-8 text-xs text-gray-700 focus:border-pink-400 focus:outline-none focus:ring-1 focus:ring-pink-300"
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
              >
                <option value="">Estado</option>
                {ESTATUS_CONDUCTOR.map((e) => (
                  <option key={e} value={e}>
                    {e}
                  </option>
                ))}
              </select>
              <IoChevronDownOutline className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-gray-400" />
            </div>

            {/* Estado de licencia */}
            <div className="relative">
              <select
                className="w-40 appearance-none rounded-full border border-gray-300 bg-gray-50 px-3 py-1.5 pr-8 text-xs text-gray-700 focus:border-pink-400 focus:outline-none focus:ring-1 focus:ring-pink-300"
                value={filtroLicencia}
                onChange={(e) => setFiltroLicencia(e.target.value)}
              >
                <option value="">Estado de la licencia</option>
                {ESTADOS_LICENCIA.map((e) => (
                  <option key={e} value={e}>
                    {e}
                  </option>
                ))}
              </select>
              <IoChevronDownOutline className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* Lista */}
          {tab === "conductores" ? (
            <div className="mt-2 rounded-xl border border-gray-100 bg-gray-50">
              <div className="grid grid-cols-5 gap-2 border-b border-gray-100 px-4 py-2 text-[11px] font-medium text-gray-500">
                <span>Nombre y apellido</span>
                <span>Estado</span>
                <span>Clave de oficina</span>
                <span>Teléfono</span>
                <span className="text-right">Acción</span>
              </div>
              <div className="divide-y divide-gray-100">
                {conductoresFiltrados.map((c) => (
                  <div
                    key={c.id}
                    className="grid grid-cols-5 gap-2 items-center px-4 py-2 text-xs bg-white/0 hover:bg-white"
                  >
                    {/* Nombre + icono */}
                    <div className="flex items-center gap-2">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-pink-50 text-pink-500">
                        <IoPersonOutline className="h-4 w-4" />
                      </span>
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900">
                          {c.nombre}
                        </span>
                        <span className="text-[11px] text-gray-500">
                          Licencia: {c.numeroLicencia}
                        </span>
                      </div>
                    </div>

                    {/* Estado */}
                    <span className="text-[11px]">
                      {c.estatus === "Activo" ? (
                        <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-600">
                          Activo
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600">
                          Inactivo
                        </span>
                      )}
                    </span>

                    {/* Clave oficina */}
                    <span className="text-gray-800">{c.claveOficina}</span>

                    {/* Teléfono */}
                    <span className="text-gray-800">{c.telefono}</span>

                    {/* Ver detalles */}
                    <button
                      type="button"
                      onClick={() => setDetailConductor(c)}
                      className="text-right text-[11px] font-medium text-pink-500 hover:text-pink-600"
                    >
                      Ver detalles
                    </button>
                  </div>
                ))}

                {conductoresFiltrados.length === 0 && (
                  <div className="px-4 py-4 text-xs text-gray-500">
                    No se encontraron conductores con esos filtros.
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="mt-4 rounded-xl border border-dashed border-gray-200 bg-gray-50 px-4 py-6 text-xs text-gray-500 text-center">
              Próximamente se mostrará aquí el listado de repartidores.
            </div>
          )}
        </article>

        {/* Panel de detalle */}
        <article className="rounded-2xl bg-white border border-dashed border-gray-200 shadow-sm flex items-center justify-center text-center px-4">
          {detailConductor ? (
            <div className="w-full space-y-3 text-sm text-left">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-pink-50 text-pink-500">
                    <IoPersonOutline className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-xs text-gray-500">Nombre y apellido</p>
                    <p className="text-base font-semibold text-gray-900">
                      {detailConductor.nombre}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={abrirModalAsignacion}
                    className="hidden sm:inline-flex rounded-full border border-pink-200 px-3 py-1 text-xs font-medium text-pink-600 hover:bg-pink-50"
                  >
                    Nueva asignación
                  </button>
                  <button
                    type="button"
                    onClick={() => abrirModalEditar(detailConductor)}
                    className="rounded-full border border-pink-200 px-3 py-1 text-xs font-medium text-pink-600 hover:bg-pink-50"
                  >
                    Editar
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                <div>
                  <p className="text-gray-500">Número de licencia</p>
                  <p className="font-medium text-gray-900">
                    {detailConductor.numeroLicencia}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Estado de la licencia</p>
                  <p className="font-medium">
                    {detailConductor.estadoLicencia === "Vigente" ? (
                      <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-600">
                        Vigente
                      </span>
                    ) : detailConductor.estadoLicencia === "Vencida" ? (
                      <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-600">
                        Vencida
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-0.5 text-[11px] font-medium text-red-600">
                        Suspendida
                      </span>
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">RFC</p>
                  <p className="font-medium text-gray-900">
                    {detailConductor.rfc}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">CURP</p>
                  <p className="font-medium text-gray-900">
                    {detailConductor.curp}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Teléfono</p>
                  <p className="font-medium text-gray-900">
                    {detailConductor.telefono}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Correo electrónico</p>
                  <p className="font-medium text-gray-900">
                    {detailConductor.email}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-gray-500">Clave de oficina</p>
                  <p className="font-medium text-gray-900">
                    {detailConductor.claveOficina}
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
              <p>
                O usa el botón “Registrar un conductor” para crear un nuevo
                registro.
              </p>
            </div>
          )}
        </article>
      </section>

      {/* MODAL REGISTRAR / EDITAR CONDUCTOR */}
      {isModalOpen && (
        <div className="fixed inset-0 z-40 flex items-start justify-center bg-black/20 backdrop-blur-sm">
          <div className="absolute inset-0" onClick={cerrarModal} />
          <div className="relative mt-16 w-full max-w-5xl rounded-2xl bg-white shadow-2xl border border-gray-100">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <div className="flex items-center gap-2">
                <IoPersonOutline className="h-5 w-5 text-gray-700" />
                <h2 className="text-sm font-semibold text-gray-900">
                  {modalMode === "create"
                    ? "Registrar un conductor"
                    : form.nombre}
                </h2>
              </div>
              <button
                type="button"
                onClick={cerrarModal}
                className="rounded-full border border-gray-200 px-3 py-1 text-xs font-medium text-gray-500 hover:bg-gray-50"
              >
                Cancelar
              </button>
            </div>

            {/* Formulario */}
            <form
              onSubmit={handleSubmit}
              className="px-6 py-5 space-y-4 text-xs"
            >
              <div className="grid gap-3 md:grid-cols-3">
                <div>
                  <label className="mb-1 block text-gray-500">
                    Nombre y Apellido
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-full border border-gray-300 px-3 py-2 text-xs focus:border-pink-400 focus:outline-none focus:ring-1 focus:ring-pink-300"
                    value={form.nombre}
                    onChange={(e) =>
                      handleFormChange("nombre", e.target.value)
                    }
                    placeholder="Nombre y Apellido"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-gray-500">
                    Número de licencia
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-full border border-gray-300 px-3 py-2 text-xs focus:border-pink-400 focus:outline-none focus:ring-1 focus:ring-pink-300"
                    value={form.numeroLicencia}
                    onChange={(e) =>
                      handleFormChange("numeroLicencia", e.target.value)
                    }
                    placeholder="Número de licencia"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-gray-500">
                    Estado de la licencia
                  </label>
                  <select
                    className="w-full appearance-none rounded-full border border-gray-300 bg-white px-3 py-2 pr-8 text-xs text-gray-700 focus:border-pink-400 focus:outline-none focus:ring-1 focus:ring-pink-300"
                    value={form.estadoLicencia}
                    onChange={(e) =>
                      handleFormChange(
                        "estadoLicencia",
                        e.target.value as EstadoLicencia
                      )
                    }
                  >
                    {ESTADOS_LICENCIA.map((e) => (
                      <option key={e} value={e}>
                        {e}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-gray-500">RFC</label>
                  <input
                    type="text"
                    className="w-full rounded-full border border-gray-300 px-3 py-2 text-xs focus:border-pink-400 focus:outline-none focus:ring-1 focus:ring-pink-300"
                    value={form.rfc}
                    onChange={(e) =>
                      handleFormChange("rfc", e.target.value)
                    }
                    placeholder="RFC"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-gray-500">CURP</label>
                  <input
                    type="text"
                    className="w-full rounded-full border border-gray-300 px-3 py-2 text-xs focus:border-pink-400 focus:outline-none focus:ring-1 focus:ring-pink-300"
                    value={form.curp}
                    onChange={(e) =>
                      handleFormChange("curp", e.target.value)
                    }
                    placeholder="CURP"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-gray-500">Teléfono</label>
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

                <div>
                  <label className="mb-1 block text-gray-500">
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    className="w-full rounded-full border border-gray-300 px-3 py-2 text-xs focus:border-pink-400 focus:outline-none focus:ring-1 focus:ring-pink-300"
                    value={form.email}
                    onChange={(e) =>
                      handleFormChange("email", e.target.value)
                    }
                    placeholder="Correo electrónico"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-gray-500">
                    Clave de oficina
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-full border border-gray-300 px-3 py-2 text-xs focus:border-pink-400 focus:outline-none focus:ring-1 focus:ring-pink-300"
                    value={form.claveOficina}
                    onChange={(e) =>
                      handleFormChange("claveOficina", e.target.value)
                    }
                    placeholder="Clave de oficina"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-gray-500">
                    Estatus del conductor
                  </label>
                  <select
                    className="w-full appearance-none rounded-full border border-gray-300 bg-white px-3 py-2 pr-8 text-xs text-gray-700 focus:border-pink-400.focus:outline-none focus:ring-1 focus:ring-pink-300"
                    value={form.estatus}
                    onChange={(e) =>
                      handleFormChange(
                        "estatus",
                        e.target.value as EstatusConductor
                      )
                    }
                  >
                    {ESTATUS_CONDUCTOR.map((e) => (
                      <option key={e} value={e}>
                        {e}
                      </option>
                    ))}
                  </select>
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

      {/* MODAL NUEVA ASIGNACIÓN */}
      {isAsignacionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/20 backdrop-blur-sm">
          <div
            className="absolute inset-0"
            onClick={cerrarModalAsignacion}
          />
          <div className="relative mt-24 w-full max-w-md rounded-2xl bg-white shadow-2xl border border-gray-100">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <div className="flex items-center gap-2">
                <IoPersonOutline className="h-5 w-5 text-gray-700" />
                <h2 className="text-sm font-semibold text-gray-900">
                  Nueva asignación
                </h2>
              </div>
              <button
                type="button"
                onClick={cerrarModalAsignacion}
                className="rounded-full border border-gray-200 px-3 py-1 text-xs font-medium text-gray-500 hover:bg-gray-50"
              >
                Cancelar
              </button>
            </div>

            <form
              onSubmit={handleGuardarAsignacion}
              className="px-6 py-5 space-y-4 text-xs"
            >
              <div>
                <label className="mb-1 block text-gray-500">
                  Selecciona una unidad disponible
                </label>
                <select
                  className="w-full appearance-none rounded-full border border-gray-300 bg-white px-3 py-2 pr-8 text-xs text-gray-700 focus:border-pink-400 focus:outline-none focus:ring-1 focus:ring-pink-300"
                  value={unidadAsignacion}
                  onChange={(e) => setUnidadAsignacion(e.target.value)}
                >
                  <option value="">Selecciona una unidad</option>
                  {UNIDADES_DISPONIBLES.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="inline-flex items-center rounded-full bg-pink-500 px-6 py-2 text-sm font-medium text-white shadow hover:bg-pink-600"
                >
                  ✓ Guardar asignación
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}