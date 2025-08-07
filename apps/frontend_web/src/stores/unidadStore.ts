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
};

type UnidadStore = {
  unidades: Unidad[];
  fetchUnidades:() => Promise<void>;
  agregarUnidad: (unidad: Unidad) => void;
  
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