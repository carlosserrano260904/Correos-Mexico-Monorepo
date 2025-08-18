import { create } from "zustand";
import { persist } from "zustand/middleware";

type Unidad = {
  tipoVehiculo: string
  placas: string
  volumenCarga: string
  numEjes: string
  numLlantas: string
  claveOficina: string
  tarjetaCirculacion: string
  conductor?:string;
  curpConductor?:string;
  zonaAsignada?:string;
};

type UnidadStore = {
  unidades: Unidad[];
  fetchUnidades:() => Promise<void>;
  agregarUnidad: (unidad: Unidad) => void;
  asignarConductor: (placas: string, curpConductor: string) => Promise<void>;
  actualizarZonaAsignada: (placas: string, zonaAsignada: string) => Promise<void>;
};

export const useUnidadStore = create<UnidadStore>((set, get) => ({
  unidades: [],
  fetchUnidades: async () => {
    const res = await fetch("http://localhost:3000/api/unidades");
    const data = await res.json();
    set({ unidades: data });
  },
  agregarUnidad: async (unidad) => {
    const payload = {
      tipoVehiculo: unidad.tipoVehiculo,
      placas: unidad.placas,
      volumenCarga: Number(unidad.volumenCarga),
      numEjes: Number(unidad.numEjes),
      numLlantas: Number(unidad.numLlantas),
      claveOficina: unidad.claveOficina,
      tarjetaCirculacion: unidad.tarjetaCirculacion,
    };
    await fetch("http://localhost:3000/api/unidades", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    // recargar unidades después de agregar
     await get().fetchUnidades();
  },
  asignarConductor: async (placas, curpConductor) => {
    try {
      const res = await fetch(`http://localhost:3000/api/unidades/${placas}/asignar`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ curpConductor }),
      });
      if (!res.ok) {
        const error = await res.text();
        throw new Error(error);
      }
       set((state) => ({
      unidades: state.unidades.map((unidad) =>
        unidad.placas === placas
          ? { ...unidad, curpConductor, conductor: curpConductor }
          : unidad
      ),
    }));
      } catch (err) {
        console.error("Error asignando conductor:", err);
        alert("Error asignando conductor: " + err);
      }
  },
  actualizarZonaAsignada: async (placas: string, zonaAsignada: string) => {
  try {
    const res = await fetch(`http://localhost:3000/api/unidades/${placas}/asignar-zona`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ claveCuoDestino: zonaAsignada }),
    });
    if (!res.ok) {
      const error = await res.text();
      throw new Error(error);
    }
    // Actualiza el estado local
    set((state) => ({
      unidades: state.unidades.map((unidad) =>
        unidad.placas === placas
          ? { ...unidad, zonaAsignada }
          : unidad
      ),
    }));
  } catch (err) {
    console.error("Error actualizando zona asignada:", err);
    alert("Error actualizando zona asignada: " + err);
  }
},
}));
/*
export const useUnidadStore = create<UnidadStore>()(
  persist(
    (set) => ({
      unidades: [],
      agregarUnidad: (unidad) =>
        set((state) => ({
          unidades: [...state.unidades, unidad],
        })),
    }),
    {
      name: "unidad-storage", // clave en localStorage
      partialize: (state) => ({ unidades: state.unidades }), // solo persistimos unidades
    }
  )
);
*/