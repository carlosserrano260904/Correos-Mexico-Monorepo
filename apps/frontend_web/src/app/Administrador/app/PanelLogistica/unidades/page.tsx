'use client';

import { useMemo, useState } from "react";
import {
  IoBusOutline,
  IoSearchOutline,
  IoChevronDownOutline,
} from "react-icons/io5";

type EstadoUnidad = "Activa" | "Mantenimiento" | "Fuera de servicio";

type Unidad = {
  idVehiculo: string;
  tipoVehiculo: string;
  claveOficina: string;
  estado: EstadoUnidad;
  numeroEjes: string;
  numeroLlantas: string;
  volumenCarga: string;
  tarjetaCirculacion: string;
  placas: string;
  zonaAsignada: string;
  curpConductor: string;
};

type RegistroDiario = {
  idVehiculo: string;
  tipoVehiculo: string;
  oficina: string;
  zona: string;
  conductor: string;
  fecha: string;
  estado: string;
};

// Mock inicial, luego lo puedes cambiar por datos del backend
const UNIDADES_MOCK: Unidad[] = [
  {
    idVehiculo: "DG-591",
    tipoVehiculo: "Camioneta",
    claveOficina: "CL-032",
    estado: "Activa",
    numeroEjes: "3",
    numeroLlantas: "4",
    volumenCarga: "8 paquetes",
    tarjetaCirculacion: "CL-032",
    placas: "FYK-515C",
    zonaAsignada: "Zona centro",
    curpConductor: "HEGS840427MVZ8RL04",
  },
  {
    idVehiculo: "ID-460",
    tipoVehiculo: "Camión",
    claveOficina: "CL-010",
    estado: "Mantenimiento",
    numeroEjes: "4",
    numeroLlantas: "8",
    volumenCarga: "20 paquetes",
    tarjetaCirculacion: "TC-874",
    placas: "DRY-649",
    zonaAsignada: "Zona norte",
    curpConductor: "ROBD900101HDFLNS01",
  },
  {
    idVehiculo: "MT-221",
    tipoVehiculo: "Moto",
    claveOficina: "CL-021",
    estado: "Activa",
    numeroEjes: "2",
    numeroLlantas: "2",
    volumenCarga: "2 paquetes",
    tarjetaCirculacion: "TC-125",
    placas: "MOT-221",
    zonaAsignada: "Zona centro",
    curpConductor: "GARA951212MDFLNL02",
  },
];

const REGISTROS_MOCK: RegistroDiario[] = [
  {
    idVehiculo: "VEH-1287",
    tipoVehiculo: "Camioneta",
    oficina: "Oficina Central",
    zona: "Zona centro",
    conductor: "Juan Pérez",
    fecha: "20/09/2025",
    estado: "Envios completados",
  },
  {
    idVehiculo: "VEH-1288",
    tipoVehiculo: "Moto",
    oficina: "Oficina Norte",
    zona: "Zona norte",
    conductor: "Ana García",
    fecha: "20/09/2025",
    estado: "En ruta",
  },
  {
    idVehiculo: "VEH-1289",
    tipoVehiculo: "Camión",
    oficina: "Oficina Oeste",
    zona: "Zona industrial",
    conductor: "Carlos Hernández",
    fecha: "20/09/2025",
    estado: "En carga",
  },
  {
    idVehiculo: "VEH-1290",
    tipoVehiculo: "Camioneta",
    oficina: "Oficina Central",
    zona: "Zona centro",
    conductor: "Juan Pérez",
    fecha: "20/09/2025",
    estado: "Envios completados",
  },
];

type ModalMode = "create" | "edit";

const ESTADOS: EstadoUnidad[] = ["Activa", "Mantenimiento", "Fuera de servicio"];

export default function UnidadesLogisticaPage() {
  const [unidades, setUnidades] = useState<Unidad[]>(UNIDADES_MOCK);
  const [searchUnidad, setSearchUnidad] = useState("");
  const [filtroTipo, setFiltroTipo] = useState<string>("");
  const [filtroEstado, setFiltroEstado] = useState<string>("");

  const [selectedUnidad, setSelectedUnidad] = useState<Unidad | null>(null);
  const [detailUnidad, setDetailUnidad] = useState<Unidad | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>("create");
  const [form, setForm] = useState<Unidad>({
    idVehiculo: "",
    tipoVehiculo: "",
    claveOficina: "",
    estado: "Activa",
    numeroEjes: "",
    numeroLlantas: "",
    volumenCarga: "",
    tarjetaCirculacion: "",
    placas: "",
    zonaAsignada: "",
    curpConductor: "",
  });

  const [searchRegistro, setSearchRegistro] = useState("");

  const unidadesFiltradas = useMemo(() => {
    return unidades.filter((u) => {
      const matchSearch =
        !searchUnidad ||
        u.idVehiculo.toLowerCase().includes(searchUnidad.toLowerCase());
      const matchTipo = !filtroTipo || u.tipoVehiculo === filtroTipo;
      const matchEstado = !filtroEstado || u.estado === filtroEstado;
      return matchSearch && matchTipo && matchEstado;
    });
  }, [unidades, searchUnidad, filtroTipo, filtroEstado]);

  const registrosFiltrados = useMemo(() => {
    return REGISTROS_MOCK.filter((r) =>
      !searchRegistro ||
      r.conductor.toLowerCase().includes(searchRegistro.toLowerCase())
    );
  }, [searchRegistro]);

  function openCreateModal() {
    setModalMode("create");
    setForm({
      idVehiculo: "",
      tipoVehiculo: "",
      claveOficina: "",
      estado: "Activa",
      numeroEjes: "",
      numeroLlantas: "",
      volumenCarga: "",
      tarjetaCirculacion: "",
      placas: "",
      zonaAsignada: "",
      curpConductor: "",
    });
    setIsModalOpen(true);
    setSelectedUnidad(null);
  }

  function openEditModal(unidad: Unidad) {
    setModalMode("edit");
    setForm(unidad);
    setIsModalOpen(true);
    setSelectedUnidad(unidad);
  }

  function closeModal() {
    setIsModalOpen(false);
  }

  function handleFormChange<K extends keyof Unidad>(
    key: K,
    value: Unidad[K]
  ) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.idVehiculo || !form.tipoVehiculo) {
      // Front sencillo: mínimo ID y tipo
      alert("Completa al menos el tipo de vehículo y el ID del vehículo.");
      return;
    }

    if (modalMode === "create") {
      setUnidades((prev) => [...prev, form]);
    } else if (modalMode === "edit" && selectedUnidad) {
      setUnidades((prev) =>
        prev.map((u) =>
          u.idVehiculo === selectedUnidad.idVehiculo ? form : u
        )
      );
      setDetailUnidad(form);
    }

    setIsModalOpen(false);
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Unidades</h1>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 rounded-full bg-pink-500 px-4 py-2 text-sm font-medium text-white shadow hover:bg-pink-600"
        >
          <span className="hidden sm:inline">+ Crear una unidad</span>
          <span className="sm:hidden">+ Nueva</span>
        </button>
      </div>

      {/* PARTE SUPERIOR: VISUALIZADOR + PANEL DETALLE */}
      <section className="grid gap-4 lg:grid-cols-3">
        {/* Visualizador */}
        <article className="lg:col-span-2 rounded-2xl bg-white border border-gray-100 shadow-sm p-4 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold text-gray-900">
                Visualizador de unidades
              </h2>
              <p className="text-xs text-gray-500">
                Busca por ID o filtra por tipo y estado.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Buscar por ID */}
              <div className="relative">
                <IoSearchOutline className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por ID de unidad"
                  className="w-48 rounded-full border border-gray-300 bg-gray-50 pl-9 pr-3 py-1.5 text-xs focus:border-pink-400 focus:outline-none focus:ring-1 focus:ring-pink-300"
                  value={searchUnidad}
                  onChange={(e) => setSearchUnidad(e.target.value)}
                />
              </div>

              {/* Tipo de vehículo */}
              <div className="relative">
                <select
                  className="w-36 appearance-none rounded-full border border-gray-300 bg-gray-50 px-3 py-1.5 pr-8 text-xs text-gray-700 focus:border-pink-400 focus:outline-none focus:ring-1 focus:ring-pink-300"
                  value={filtroTipo}
                  onChange={(e) => setFiltroTipo(e.target.value)}
                >
                  <option value="">Tipo de vehículo</option>
                  <option value="Camioneta">Camioneta</option>
                  <option value="Camión">Camión</option>
                  <option value="Moto">Moto</option>
                </select>
                <IoChevronDownOutline className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-gray-400" />
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
            </div>
          </div>

          {/* Lista de unidades */}
          <div className="mt-2 rounded-xl border border-gray-100 bg-gray-50">
            <div className="grid grid-cols-4 gap-2 border-b border-gray-100 px-4 py-2 text-[11px] font-medium text-gray-500">
              <span>Tipo de vehículo</span>
              <span>ID del vehículo</span>
              <span>Clave oficina</span>
              <span className="text-right">Estado</span>
            </div>
            <div className="divide-y divide-gray-100">
              {unidadesFiltradas.map((u) => (
                <button
                  key={u.idVehiculo}
                  type="button"
                  onClick={() => setDetailUnidad(u)}
                  className="grid grid-cols-4 gap-2 w-full items-center px-4 py-2 text-xs hover:bg-white"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="flex h-7 w-7 items-center justify-center rounded-full bg-pink-50 text-pink-500"
                    >
                      <IoBusOutline className="h-4 w-4" />
                    </span>
                    <div className="flex flex-col items-start">
                      <span className="font-medium text-gray-900">
                        {u.tipoVehiculo}
                      </span>
                      <span className="text-[11px] text-gray-500">
                        {u.zonaAsignada}
                      </span>
                    </div>
                  </div>

                  <span className="text-gray-800">{u.idVehiculo}</span>
                  <span className="text-gray-800">{u.claveOficina}</span>
                  <span className="text-right text-[11px]">
                    {u.estado === "Activa" && (
                      <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-600">
                        Activa
                      </span>
                    )}
                    {u.estado === "Mantenimiento" && (
                      <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-600">
                        En mantenimiento
                      </span>
                    )}
                    {u.estado === "Fuera de servicio" && (
                      <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-0.5 text-[11px] font-medium text-red-600">
                        Fuera de servicio
                      </span>
                    )}
                  </span>
                </button>
              ))}

              {unidadesFiltradas.length === 0 && (
                <div className="px-4 py-4 text-xs text-gray-500">
                  No se encontraron unidades con esos filtros.
                </div>
              )}
            </div>
          </div>
        </article>

        {/* Panel de detalle */}
        <article className="rounded-2xl bg-white border border-dashed border-gray-200 shadow-sm flex items-center justify-center text-center px-4">
          {detailUnidad ? (
            <div className="w-full space-y-3 text-sm text-left">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-pink-50 text-pink-500">
                    <IoBusOutline className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-xs text-gray-500">ID del vehículo</p>
                    <p className="text-base font-semibold text-gray-900">
                      {detailUnidad.idVehiculo}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => openEditModal(detailUnidad)}
                  className="rounded-full border border-pink-200 px-3 py-1 text-xs font-medium text-pink-600 hover:bg-pink-50"
                >
                  Editar
                </button>
              </div>

              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                <div>
                  <p className="text-gray-500">Tipo de vehículo</p>
                  <p className="font-medium text-gray-900">
                    {detailUnidad.tipoVehiculo}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Clave oficina</p>
                  <p className="font-medium text-gray-900">
                    {detailUnidad.claveOficina}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Número de ejes</p>
                  <p className="font-medium text-gray-900">
                    {detailUnidad.numeroEjes}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Número de llantas</p>
                  <p className="font-medium text-gray-900">
                    {detailUnidad.numeroLlantas}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Volumen de carga</p>
                  <p className="font-medium text-gray-900">
                    {detailUnidad.volumenCarga}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Tarjeta de circulación</p>
                  <p className="font-medium text-gray-900">
                    {detailUnidad.tarjetaCirculacion}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Placas</p>
                  <p className="font-medium text-gray-900">
                    {detailUnidad.placas}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Estado</p>
                  <p className="font-medium text-gray-900">
                    {detailUnidad.estado}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Zona asignada</p>
                  <p className="font-medium text-gray-900">
                    {detailUnidad.zonaAsignada}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-gray-500">CURP del conductor</p>
                  <p className="font-medium text-gray-900">
                    {detailUnidad.curpConductor}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-2 text-xs text-gray-500">
              <p className="font-medium text-gray-700">
                Haz clic en{" "}
                <span className="text-pink-500 font-semibold">
                  una unidad
                </span>{" "}
                para ver sus detalles.
              </p>
              <p>O usa el botón “Crear una unidad” para registrar una nueva.</p>
            </div>
          )}
        </article>
      </section>

      {/* REGISTROS POR DÍA */}
      <section className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold text-gray-900">
              Registros por día
            </h2>
            <p className="text-xs text-gray-500">
              Vehículos operando o que pasaron operaciones en el día seleccionado.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <IoSearchOutline className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por conductor"
                className="w-56 rounded-full border border-gray-300 bg-gray-50 pl-9 pr-3 py-1.5 text-xs focus:border-pink-400 focus:outline-none focus:ring-1 focus:ring-pink-300"
                value={searchRegistro}
                onChange={(e) => setSearchRegistro(e.target.value)}
              />
            </div>

            <button
              type="button"
              className="inline-flex items-center rounded-full border border-pink-200 px-4 py-1.5 text-xs font-medium text-pink-600 hover:bg-pink-50"
            >
              + Nueva asignación
            </button>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {registrosFiltrados.map((r, idx) => (
            <article
              key={idx}
              className="rounded-2xl bg-white border border-gray-100 shadow-sm p-3 text-xs space-y-1"
            >
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-medium text-gray-500">
                  ID del vehículo
                </p>
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] text-gray-600">
                  {r.tipoVehiculo}
                </span>
              </div>
              <p className="text-base font-semibold text-gray-900">
                {r.idVehiculo}
              </p>
              <p className="mt-1 text-[11px] text-gray-500">
                Sucursal:{" "}
                <span className="font-medium text-gray-900">
                  {r.oficina}
                </span>
              </p>
              <p className="text-[11px] text-gray-500">
                Zona:{" "}
                <span className="font-medium text-gray-900">
                  {r.zona}
                </span>
              </p>
              <p className="mt-1 text-[11px] text-gray-500">
                Conductor:{" "}
                <span className="font-medium text-gray-900">
                  {r.conductor}
                </span>
              </p>
              <p className="text-[11px] text-gray-500">
                Fecha:{" "}
                <span className="font-medium text-gray-900">
                  {r.fecha}
                </span>
              </p>
              <p className="mt-1 text-[11px] text-pink-500 font-medium">
                {r.estado}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* MODAL CREAR / EDITAR UNIDAD */}
      {isModalOpen && (
        <div className="fixed inset-0 z-40 flex items-start justify-center bg-black/20 backdrop-blur-sm">
          <div
            className="absolute inset-0"
            onClick={closeModal}
          />
          <div className="relative mt-16 w-full max-w-5xl rounded-2xl bg-white shadow-2xl border border-gray-100">
            {/* Header modal */}
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <div className="flex items-center gap-2">
                <IoBusOutline className="h-5 w-5 text-gray-700" />
                <h2 className="text-sm font-semibold text-gray-900">
                  {modalMode === "create"
                    ? "Registrar una unidad"
                    : form.idVehiculo}
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
                    Número de ejes
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-full border border-gray-300 px-3 py-2 text-xs focus:border-pink-400 focus:outline-none focus:ring-1 focus:ring-pink-300"
                    value={form.numeroEjes}
                    onChange={(e) =>
                      handleFormChange("numeroEjes", e.target.value)
                    }
                    placeholder="Número de ejes"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-gray-500">
                    Número de llantas
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-full border border-gray-300 px-3 py-2 text-xs focus:border-pink-400 focus:outline-none focus:ring-1 focus:ring-pink-300"
                    value={form.numeroLlantas}
                    onChange={(e) =>
                      handleFormChange("numeroLlantas", e.target.value)
                    }
                    placeholder="Número de llantas"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-gray-500">
                    Volumen de carga
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-full border border-gray-300 px-3 py-2 text-xs focus:border-pink-400 focus:outline-none focus:ring-1 focus:ring-pink-300"
                    value={form.volumenCarga}
                    onChange={(e) =>
                      handleFormChange("volumenCarga", e.target.value)
                    }
                    placeholder="Volumen de carga"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-gray-500">
                    Tarjeta de circulación
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-full border border-gray-300 px-3 py-2 text-xs focus:border-pink-400 focus:outline-none focus:ring-1 focus:ring-pink-300"
                    value={form.tarjetaCirculacion}
                    onChange={(e) =>
                      handleFormChange("tarjetaCirculacion", e.target.value)
                    }
                    placeholder="Tarjeta de circulación"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-gray-500">
                    Placas
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-full border border-gray-300 px-3 py-2 text-xs focus:border-pink-400 focus:outline-none focus:ring-1 focus:ring-pink-300"
                    value={form.placas}
                    onChange={(e) => handleFormChange("placas", e.target.value)}
                    placeholder="Placas"
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
                      handleFormChange("estado", e.target.value as EstadoUnidad)
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
                    Tipo de vehículo
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-full border border-gray-300 px-3 py-2 text-xs focus:border-pink-400 focus:outline-none focus:ring-1 focus:ring-pink-300"
                    value={form.tipoVehiculo}
                    onChange={(e) =>
                      handleFormChange("tipoVehiculo", e.target.value)
                    }
                    placeholder="Tipo de vehículo"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-gray-500">
                    ID del vehículo
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-full border border-gray-300 px-3 py-2 text-xs focus:border-pink-400 focus:outline-none focus:ring-1 focus:ring-pink-300"
                    value={form.idVehiculo}
                    onChange={(e) =>
                      handleFormChange("idVehiculo", e.target.value)
                    }
                    placeholder="ID del vehículo"
                    disabled={modalMode === "edit"}
                  />
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
                    Zona asignada
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-full border border-gray-300 px-3 py-2 text-xs focus:border-pink-400 focus:outline-none focus:ring-1 focus:ring-pink-300"
                    value={form.zonaAsignada}
                    onChange={(e) =>
                      handleFormChange("zonaAsignada", e.target.value)
                    }
                    placeholder="Zona asignada"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="mb-1 block text-gray-500">
                    CURP del conductor
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-full border border-gray-300 px-3 py-2 text-xs focus:border-pink-400 focus:outline-none focus:ring-1 focus:ring-pink-300"
                    value={form.curpConductor}
                    onChange={(e) =>
                      handleFormChange("curpConductor", e.target.value)
                    }
                    placeholder="CURP del conductor"
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