"use client";

import { useMemo, useState } from "react";
import {
  IoCubeOutline,
  IoSearchOutline,
  IoChevronDownOutline,
} from "react-icons/io5";

type EstadoPaquete = "En tránsito" | "Entregado" | "Pendiente";

type Paquete = {
  idPaquete: string;
  calle: string;
  colonia: string;
  codigoPostal: string;
  numeroGuia: string;
  longitud: string;
  latitud: string;
  sku: string;
  evidencia: string;
  indicaciones: string;
  estado: EstadoPaquete;
  fechaEnvio: string;
  unidad: string;
};

type PaqueteForm = Omit<Paquete, "idPaquete" | "fechaEnvio" | "unidad"> & {
  idPaquete?: string;
  fechaEnvio?: string;
  unidad?: string;
};

type Asignacion = {
  id: string;
  idPaquete: string;
  unidad: string;
  conductor: string;
  zona: string;
  fecha: string;
  estado: string;
};

// Mock de paquetes
const PAQUETES_MOCK: Paquete[] = [
  {
    idPaquete: "ENV-8126",
    calle: "Avenida Reforma",
    colonia: "Benito Juárez",
    codigoPostal: "31426",
    numeroGuia: "ID-2150",
    longitud: "22°20'42''",
    latitud: "102°28'22''",
    sku: "ZAP-COH-8LN-42",
    evidencia: "Evidencia",
    indicaciones: "Indicaciones aquí",
    estado: "En tránsito",
    fechaEnvio: "21/09/2025",
    unidad: "DG-591",
  },
  {
    idPaquete: "ENV-8127",
    calle: "Calle Hidalgo",
    colonia: "Centro",
    codigoPostal: "34000",
    numeroGuia: "ID-2151",
    longitud: "23°20'42''",
    latitud: "101°18'22''",
    sku: "CAM-NEG-M",
    evidencia: "Foto",
    indicaciones: "Entregar en recepción",
    estado: "Pendiente",
    fechaEnvio: "21/09/2025",
    unidad: "ID-460",
  },
  {
    idPaquete: "ENV-8128",
    calle: "Blvd. del Sol",
    colonia: "Industrial",
    codigoPostal: "35010",
    numeroGuia: "ID-2152",
    longitud: "24°10'12''",
    latitud: "102°05'10''",
    sku: "BOX-STD-01",
    evidencia: "Firma digital",
    indicaciones: "Horario de 9 a 14 hrs",
    estado: "Entregado",
    fechaEnvio: "20/09/2025",
    unidad: "MT-221",
  },
];

const ASIGNACIONES_MOCK: Asignacion[] = [
  {
    id: "1",
    idPaquete: "PAQ-1729",
    unidad: "DG-591",
    conductor: "Juan Pérez",
    zona: "Zona centro",
    fecha: "21/09/2025",
    estado: "En ruta",
  },
  {
    id: "2",
    idPaquete: "PAQ-1730",
    unidad: "ID-460",
    conductor: "Ana García",
    zona: "Zona norte",
    fecha: "21/09/2025",
    estado: "Asignado",
  },
  {
    id: "3",
    idPaquete: "PAQ-1731",
    unidad: "MT-221",
    conductor: "Carlos Hernández",
    zona: "Zona industrial",
    fecha: "21/09/2025",
    estado: "En ruta",
  },
  {
    id: "4",
    idPaquete: "PAQ-1732",
    unidad: "DG-591",
    conductor: "Juan Pérez",
    zona: "Zona centro",
    fecha: "20/09/2025",
    estado: "Completado",
  },
];

const UNIDADES_DISPONIBLES = ["DG-591", "ID-460", "MT-221"];

const ESTADOS: EstadoPaquete[] = ["En tránsito", "Entregado", "Pendiente"];

export default function PaquetesLogisticaPage() {
  const [paquetes, setPaquetes] = useState<Paquete[]>(PAQUETES_MOCK);
  const [search, setSearch] = useState("");
  const [filtroEstado, setFiltroEstado] = useState<string>("");
  const [filtroUnidad, setFiltroUnidad] = useState<string>("");

  const [detailPaquete, setDetailPaquete] = useState<Paquete | null>(null);

  const [isPaqueteModalOpen, setIsPaqueteModalOpen] = useState(false);
  const [paqueteModalMode, setPaqueteModalMode] = useState<
    "create" | "edit"
  >("create");
  const [selectedPaquete, setSelectedPaquete] = useState<Paquete | null>(
    null
  );
  const [paqueteForm, setPaqueteForm] = useState<PaqueteForm>({
    calle: "",
    colonia: "",
    codigoPostal: "",
    numeroGuia: "",
    longitud: "",
    latitud: "",
    sku: "",
    evidencia: "",
    indicaciones: "",
    estado: "Pendiente",
  });

  const [asignaciones, setAsignaciones] =
    useState<Asignacion[]>(ASIGNACIONES_MOCK);
  const [searchAsignacion, setSearchAsignacion] = useState("");

  const [isAsignacionModalOpen, setIsAsignacionModalOpen] = useState(false);
  const [unidadSeleccionada, setUnidadSeleccionada] = useState<string>("");
  const [busquedaPaqueteAsignacion, setBusquedaPaqueteAsignacion] =
    useState("");
  const [paquetesSeleccionados, setPaquetesSeleccionados] = useState<
    string[]
  >([]);

  const paquetesFiltrados = useMemo(() => {
    return paquetes.filter((p) => {
      const q = search.toLowerCase().trim();
      const matchSearch =
        !q ||
        p.idPaquete.toLowerCase().includes(q) ||
        p.numeroGuia.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q);
      const matchEstado = !filtroEstado || p.estado === filtroEstado;
      const matchUnidad = !filtroUnidad || p.unidad === filtroUnidad;
      return matchSearch && matchEstado && matchUnidad;
    });
  }, [paquetes, search, filtroEstado, filtroUnidad]);

  const asignacionesFiltradas = useMemo(() => {
    const q = searchAsignacion.toLowerCase().trim();
    return asignaciones.filter(
      (a) =>
        !q ||
        a.idPaquete.toLowerCase().includes(q) ||
        a.unidad.toLowerCase().includes(q) ||
        a.conductor.toLowerCase().includes(q)
    );
  }, [asignaciones, searchAsignacion]);

  const paquetesDisponiblesParaAsignar = useMemo(() => {
    const q = busquedaPaqueteAsignacion.toLowerCase().trim();
    return paquetes
      .filter((p) =>
        !q ? true : p.idPaquete.toLowerCase().includes(q)
      )
      .map((p) => p.idPaquete);
  }, [paquetes, busquedaPaqueteAsignacion]);

  function abrirModalCrearPaquete() {
    setPaqueteModalMode("create");
    setSelectedPaquete(null);
    setPaqueteForm({
      calle: "",
      colonia: "",
      codigoPostal: "",
      numeroGuia: "",
      longitud: "",
      latitud: "",
      sku: "",
      evidencia: "",
      indicaciones: "",
      estado: "Pendiente",
    });
    setIsPaqueteModalOpen(true);
  }

  function abrirModalEditarPaquete(paquete: Paquete) {
    setPaqueteModalMode("edit");
    setSelectedPaquete(paquete);
    setPaqueteForm({
      idPaquete: paquete.idPaquete,
      calle: paquete.calle,
      colonia: paquete.colonia,
      codigoPostal: paquete.codigoPostal,
      numeroGuia: paquete.numeroGuia,
      longitud: paquete.longitud,
      latitud: paquete.latitud,
      sku: paquete.sku,
      evidencia: paquete.evidencia,
      indicaciones: paquete.indicaciones,
      estado: paquete.estado,
    });
    setIsPaqueteModalOpen(true);
  }

  function cerrarModalPaquete() {
    setIsPaqueteModalOpen(false);
  }

  function handlePaqueteFormChange<K extends keyof PaqueteForm>(
    key: K,
    value: PaqueteForm[K]
  ) {
    setPaqueteForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  function handleSubmitPaquete(e: React.FormEvent) {
    e.preventDefault();

    if (!paqueteForm.calle || !paqueteForm.numeroGuia) {
      alert("Completa al menos la calle y el número de guía.");
      return;
    }

    if (paqueteModalMode === "create") {
      const nuevo: Paquete = {
        idPaquete: paqueteForm.idPaquete || `ENV-${Date.now()}`,
        calle: paqueteForm.calle,
        colonia: paqueteForm.colonia,
        codigoPostal: paqueteForm.codigoPostal,
        numeroGuia: paqueteForm.numeroGuia,
        longitud: paqueteForm.longitud,
        latitud: paqueteForm.latitud,
        sku: paqueteForm.sku,
        evidencia: paqueteForm.evidencia,
        indicaciones: paqueteForm.indicaciones,
        estado: paqueteForm.estado,
        fechaEnvio: new Date().toLocaleDateString("es-MX"),
        unidad: paqueteForm.unidad || "",
      };
      setPaquetes((prev) => [...prev, nuevo]);
      setDetailPaquete(nuevo);
    } else if (paqueteModalMode === "edit" && selectedPaquete) {
      const actualizado: Paquete = {
        ...selectedPaquete,
        calle: paqueteForm.calle,
        colonia: paqueteForm.colonia,
        codigoPostal: paqueteForm.codigoPostal,
        numeroGuia: paqueteForm.numeroGuia,
        longitud: paqueteForm.longitud,
        latitud: paqueteForm.latitud,
        sku: paqueteForm.sku,
        evidencia: paqueteForm.evidencia,
        indicaciones: paqueteForm.indicaciones,
        estado: paqueteForm.estado,
      };
      setPaquetes((prev) =>
        prev.map((p) =>
          p.idPaquete === selectedPaquete.idPaquete ? actualizado : p
        )
      );
      setDetailPaquete(actualizado);
    }

    setIsPaqueteModalOpen(false);
  }

  function abrirModalAsignacion() {
    setUnidadSeleccionada("");
    setBusquedaPaqueteAsignacion("");
    setPaquetesSeleccionados([]);
    setIsAsignacionModalOpen(true);
  }

  function cerrarModalAsignacion() {
    setIsAsignacionModalOpen(false);
  }

  function togglePaqueteSeleccionado(id: string) {
    setPaquetesSeleccionados((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  }

  function handleCrearAsignacion(e: React.FormEvent) {
    e.preventDefault();
    if (!unidadSeleccionada || paquetesSeleccionados.length === 0) {
      alert("Selecciona una unidad y al menos un paquete.");
      return;
    }

    const nuevas: Asignacion[] = paquetesSeleccionados.map((idP, idx) => ({
      id: `${Date.now()}-${idx}`,
      idPaquete: idP,
      unidad: unidadSeleccionada,
      conductor: "Conductor asignado",
      zona: "Zona por definir",
      fecha: new Date().toLocaleDateString("es-MX"),
      estado: "Asignado",
    }));

    setAsignaciones((prev) => [...nuevas, ...prev]);
    setIsAsignacionModalOpen(false);
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Paquetes</h1>
        <button
          onClick={abrirModalCrearPaquete}
          className="inline-flex items-center gap-2 rounded-full bg-pink-500 px-4 py-2 text-sm font-medium text-white shadow hover:bg-pink-600"
        >
          + Registrar un paquete
        </button>
      </div>

      {/* PARTE SUPERIOR: VISUALIZADOR + PANEL DETALLE */}
      <section className="grid gap-4 lg:grid-cols-3">
        {/* Visualizador */}
        <article className="lg:col-span-2 rounded-2xl bg-white border border-gray-100 shadow-sm p-4 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold text-gray-900">
                Visualizador de paquetes
              </h2>
              <p className="text-xs text-gray-500">
                Busca por ID, guía o SKU y filtra por estado y unidad.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Buscar */}
              <div className="relative">
                <IoSearchOutline className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por ID o guía"
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

              {/* Unidad */}
              <div className="relative">
                <select
                  className="w-36 appearance-none rounded-full border border-gray-300 bg-gray-50 px-3 py-1.5 pr-8 text-xs text-gray-700 focus:border-pink-400 focus:outline-none focus:ring-1 focus:ring-pink-300"
                  value={filtroUnidad}
                  onChange={(e) => setFiltroUnidad(e.target.value)}
                >
                  <option value="">Unidad</option>
                  {UNIDADES_DISPONIBLES.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
                <IoChevronDownOutline className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Lista de paquetes */}
          <div className="mt-2 rounded-xl border border-gray-100 bg-gray-50">
            <div className="grid grid-cols-6 gap-2 border-b border-gray-100 px-4 py-2 text-[11px] font-medium text-gray-500">
              <span>Tipo</span>
              <span>ID paquete</span>
              <span>Fecha</span>
              <span>Estado</span>
              <span>Unidad</span>
              <span className="text-right">Acción</span>
            </div>
            <div className="divide-y divide-gray-100">
              {paquetesFiltrados.map((p) => (
                <div
                  key={p.idPaquete}
                  className="grid grid-cols-6 gap-2 items-center px-4 py-2 text-xs bg-white/0 hover:bg-white"
                >
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-pink-50 text-pink-500">
                      <IoCubeOutline className="h-4 w-4" />
                    </span>
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-900">
                        Paquete
                      </span>
                      <span className="text-[11px] text-gray-500">
                        {p.colonia}
                      </span>
                    </div>
                  </div>

                  <span className="text-gray-800">{p.idPaquete}</span>
                  <span className="text-gray-800">{p.fechaEnvio}</span>
                  <span className="text-[11px]">
                    {p.estado === "En tránsito" && (
                      <span className="inline-flex items-center rounded-full bg-sky-50 px-2 py-0.5 text-[11px] font-medium text-sky-600">
                        En tránsito
                      </span>
                    )}
                    {p.estado === "Pendiente" && (
                      <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-600">
                        Pendiente
                      </span>
                    )}
                    {p.estado === "Entregado" && (
                      <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-600">
                        Entregado
                      </span>
                    )}
                  </span>
                  <span className="text-gray-800">{p.unidad || "-"}</span>
                  <button
                    type="button"
                    onClick={() => setDetailPaquete(p)}
                    className="text-right text-[11px] font-medium text-pink-500 hover:text-pink-600"
                  >
                    Ver detalles
                  </button>
                </div>
              ))}

              {paquetesFiltrados.length === 0 && (
                <div className="px-4 py-4 text-xs text-gray-500">
                  No se encontraron paquetes con esos filtros.
                </div>
              )}
            </div>
          </div>
        </article>

        {/* Panel de detalle */}
        <article className="rounded-2xl bg-white border border-dashed border-gray-200 shadow-sm flex items-center justify-center text-center px-4">
          {detailPaquete ? (
            <div className="w-full space-y-3 text-sm text-left">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-pink-50 text-pink-500">
                    <IoCubeOutline className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-xs text-gray-500">ID del paquete</p>
                    <p className="text-base font-semibold text-gray-900">
                      {detailPaquete.idPaquete}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => abrirModalEditarPaquete(detailPaquete)}
                  className="rounded-full border border-pink-200 px-3 py-1 text-xs font-medium text-pink-600 hover:bg-pink-50"
                >
                  Editar
                </button>
              </div>

              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                <div>
                  <p className="text-gray-500">Calle</p>
                  <p className="font-medium text-gray-900">
                    {detailPaquete.calle}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Colonia</p>
                  <p className="font-medium text-gray-900">
                    {detailPaquete.colonia}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Código postal</p>
                  <p className="font-medium text-gray-900">
                    {detailPaquete.codigoPostal}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Número guía</p>
                  <p className="font-medium text-gray-900">
                    {detailPaquete.numeroGuia}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Longitud</p>
                  <p className="font-medium text-gray-900">
                    {detailPaquete.longitud}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Latitud</p>
                  <p className="font-medium text-gray-900">
                    {detailPaquete.latitud}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">SKU</p>
                  <p className="font-medium text-gray-900">
                    {detailPaquete.sku}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Evidencia</p>
                  <p className="font-medium text-gray-900">
                    {detailPaquete.evidencia}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-gray-500">Indicaciones</p>
                  <p className="font-medium text-gray-900">
                    {detailPaquete.indicaciones}
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
                O usa el botón “Registrar un paquete” para crear un nuevo
                registro.
              </p>
            </div>
          )}
        </article>
      </section>

      {/* ASIGNACIONES POR DÍA */}
      <section className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold text-gray-900">
              Asignaciones por día
            </h2>
            <p className="text-xs text-gray-500">
              Paquetes asignados a unidades y rutas en el día seleccionado.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <IoSearchOutline className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por ID de paquete o unidad"
                className="w-64 rounded-full border border-gray-300 bg-gray-50 pl-9 pr-3 py-1.5 text-xs focus:border-pink-400 focus:outline-none focus:ring-1 focus:ring-pink-300"
                value={searchAsignacion}
                onChange={(e) => setSearchAsignacion(e.target.value)}
              />
            </div>

            <button
              type="button"
              onClick={abrirModalAsignacion}
              className="inline-flex items-center rounded-full border border-pink-200 px-4 py-1.5 text-xs font-medium text-pink-600 hover:bg-pink-50"
            >
              + Nueva asignación
            </button>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {asignacionesFiltradas.map((a) => (
            <article
              key={a.id}
              className="rounded-2xl bg-white border border-gray-100 shadow-sm p-3 text-xs space-y-1"
            >
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-medium text-gray-500">
                  ID paquete
                </p>
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] text-gray-600">
                  {a.estado}
                </span>
              </div>
              <p className="text-base font-semibold text-gray-900">
                {a.idPaquete}
              </p>
              <p className="mt-1 text-[11px] text-gray-500">
                Unidad:{" "}
                <span className="font-medium text-gray-900">
                  {a.unidad}
                </span>
              </p>
              <p className="text-[11px] text-gray-500">
                Conductor:{" "}
                <span className="font-medium text-gray-900">
                  {a.conductor}
                </span>
              </p>
              <p className="text-[11px] text-gray-500">
                Zona:{" "}
                <span className="font-medium text-gray-900">
                  {a.zona}
                </span>
              </p>
              <p className="text-[11px] text-gray-500">
                Fecha:{" "}
                <span className="font-medium text-gray-900">
                  {a.fecha}
                </span>
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* MODAL REGISTRAR / EDITAR PAQUETE */}
      {isPaqueteModalOpen && (
        <div className="fixed inset-0 z-40 flex items-start justify-center bg-black/20 backdrop-blur-sm">
          <div className="absolute inset-0" onClick={cerrarModalPaquete} />
          <div className="relative mt-16 w-full max-w-5xl rounded-2xl bg-white shadow-2xl border border-gray-100">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <div className="flex items-center gap-2">
                <IoCubeOutline className="h-5 w-5 text-gray-700" />
                <h2 className="text-sm font-semibold text-gray-900">
                  {paqueteModalMode === "create"
                    ? "Registrar un paquete"
                    : paqueteForm.idPaquete}
                </h2>
              </div>
              <button
                type="button"
                onClick={cerrarModalPaquete}
                className="rounded-full border border-gray-200 px-3 py-1 text-xs font-medium text-gray-500 hover:bg-gray-50"
              >
                Cancelar
              </button>
            </div>

            {/* Formulario */}
            <form
              onSubmit={handleSubmitPaquete}
              className="px-6 py-5 space-y-4 text-xs"
            >
              <div className="grid gap-3 md:grid-cols-3">
                <div>
                  <label className="mb-1 block text-gray-500">Calle</label>
                  <input
                    type="text"
                    className="w-full rounded-full border border-gray-300 px-3 py-2 text-xs focus:border-pink-400 focus:outline-none focus:ring-1 focus:ring-pink-300"
                    value={paqueteForm.calle}
                    onChange={(e) =>
                      handlePaqueteFormChange("calle", e.target.value)
                    }
                    placeholder="Nombre de la calle"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-gray-500">Colonia</label>
                  <input
                    type="text"
                    className="w-full rounded-full border border-gray-300 px-3 py-2 text-xs focus:border-pink-400 focus:outline-none focus:ring-1 focus:ring-pink-300"
                    value={paqueteForm.colonia}
                    onChange={(e) =>
                      handlePaqueteFormChange("colonia", e.target.value)
                    }
                    placeholder="Colonia"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-gray-500">
                    Código postal
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-full border border-gray-300 px-3 py-2 text-xs focus:border-pink-400 focus:outline-none focus:ring-1 focus:ring-pink-300"
                    value={paqueteForm.codigoPostal}
                    onChange={(e) =>
                      handlePaqueteFormChange("codigoPostal", e.target.value)
                    }
                    placeholder="Código postal"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-gray-500">
                    Número guía
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-full border border-gray-300 px-3 py-2 text-xs focus:border-pink-400 focus:outline-none focus:ring-1 focus:ring-pink-300"
                    value={paqueteForm.numeroGuia}
                    onChange={(e) =>
                      handlePaqueteFormChange("numeroGuia", e.target.value)
                    }
                    placeholder="Número guía"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-gray-500">Longitud</label>
                  <input
                    type="text"
                    className="w-full rounded-full border border-gray-300 px-3 py-2 text-xs focus:border-pink-400 focus:outline-none focus:ring-1 focus:ring-pink-300"
                    value={paqueteForm.longitud}
                    onChange={(e) =>
                      handlePaqueteFormChange("longitud", e.target.value)
                    }
                    placeholder="Longitud"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-gray-500">Latitud</label>
                  <input
                    type="text"
                    className="w-full rounded-full border border-gray-300 px-3 py-2 text-xs focus:border-pink-400 focus:outline-none focus:ring-1 focus:ring-pink-300"
                    value={paqueteForm.latitud}
                    onChange={(e) =>
                      handlePaqueteFormChange("latitud", e.target.value)
                    }
                    placeholder="Latitud"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-gray-500">SKU</label>
                  <input
                    type="text"
                    className="w-full rounded-full border border-gray-300 px-3 py-2 text-xs focus:border-pink-400 focus:outline-none focus:ring-1 focus:ring-pink-300"
                    value={paqueteForm.sku}
                    onChange={(e) =>
                      handlePaqueteFormChange("sku", e.target.value)
                    }
                    placeholder="SKU"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-gray-500">
                    Evidencia
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-full border border-gray-300 px-3 py-2 text-xs focus:border-pink-400 focus:outline-none focus:ring-1 focus:ring-pink-300"
                    value={paqueteForm.evidencia}
                    onChange={(e) =>
                      handlePaqueteFormChange("evidencia", e.target.value)
                    }
                    placeholder="Escribe el formato de evidencia"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-gray-500">Estado</label>
                  <select
                    className="w-full appearance-none rounded-full border border-gray-300 bg-white px-3 py-2 pr-8 text-xs text-gray-700 focus:border-pink-400 focus:outline-none focus:ring-1 focus:ring-pink-300"
                    value={paqueteForm.estado}
                    onChange={(e) =>
                      handlePaqueteFormChange(
                        "estado",
                        e.target.value as EstadoPaquete
                      )
                    }
                  >
                    {ESTADOS.map((e) => (
                      <option key={e} value={e}>
                        {e}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-3">
                  <label className="mb-1 block text-gray-500">
                    Indicaciones
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-full border border-gray-300 px-3 py-2 text-xs focus:border-pink-400 focus:outline-none focus:ring-1 focus:ring-pink-300"
                    value={paqueteForm.indicaciones}
                    onChange={(e) =>
                      handlePaqueteFormChange("indicaciones", e.target.value)
                    }
                    placeholder="Escribe aquí las indicaciones de envío"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="inline-flex items-center rounded-full bg-pink-500 px-6 py-2 text-sm font-medium text-white shadow hover:bg-pink-600"
                >
                  {paqueteModalMode === "create"
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
        <div className="fixed inset-0 z-40 flex items-start justify-center bg-black/20 backdrop-blur-sm">
          <div className="absolute inset-0" onClick={cerrarModalAsignacion} />
          <div className="relative mt-20 w-full max-w-5xl rounded-2xl bg-white shadow-2xl border border-gray-100">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <div className="flex items-center gap-2">
                <IoCubeOutline className="h-5 w-5 text-gray-700" />
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

            {/* Contenido */}
            <form
              onSubmit={handleCrearAsignacion}
              className="px-6 py-5 grid gap-6 md:grid-cols-2 text-xs"
            >
              {/* Columna izquierda */}
              <div className="space-y-3">
                <label className="block text-gray-500 text-[11px]">
                  Selecciona una unidad disponible
                </label>
                <select
                  className="w-full appearance-none rounded-full border border-gray-300 bg-white px-3 py-2 pr-8 text-xs text-gray-700 focus:border-pink-400 focus:outline-none focus:ring-1 focus:ring-pink-300"
                  value={unidadSeleccionada}
                  onChange={(e) => setUnidadSeleccionada(e.target.value)}
                >
                  <option value="">Selecciona una unidad</option>
                  {UNIDADES_DISPONIBLES.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-gray-500">
                  Capacidad máxima de la unidad:{" "}
                  <span className="font-semibold text-gray-900">
                    6 paquetes
                  </span>
                  .
                </p>
              </div>

              {/* Columna derecha */}
              <div className="space-y-3">
                <label className="block text-gray-500 text-[11px]">
                  Agrega paquetes
                </label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <IoSearchOutline className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Buscar paquete por ID..."
                      className="w-full rounded-full border border-gray-300 bg-gray-50 pl-9 pr-3 py-1.5 text-xs focus:border-pink-400 focus:outline-none focus:ring-1 focus:ring-pink-300"
                      value={busquedaPaqueteAsignacion}
                      onChange={(e) =>
                        setBusquedaPaqueteAsignacion(e.target.value)
                      }
                    />
                  </div>
                  <button
                    type="button"
                    className="rounded-full bg-pink-500 px-4 py-1.5 text-xs font-medium text-white hover:bg-pink-600"
                  >
                    + Agregar
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto mt-1">
                  {paquetesDisponiblesParaAsignar.map((id) => {
                    const selected = paquetesSeleccionados.includes(id);
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => togglePaqueteSeleccionado(id)}
                        className={`rounded-full border px-3 py-1 text-[11px] ${
                          selected
                            ? "bg-pink-500 border-pink-500 text-white"
                            : "bg-gray-50 border-gray-200 text-gray-700"
                        }`}
                      >
                        {id}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Footer */}
              <div className="md:col-span-2 flex justify-end pt-2">
                <button
                  type="submit"
                  className="inline-flex items-center rounded-full bg-pink-500 px-6 py-2 text-sm font-medium text-white shadow hover:bg-pink-600"
                >
                  ✓ Crear asignación
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}