import { create } from "zustand";
import { persist } from "zustand/middleware";

type Unidad = {
  tipoVehiculo: string
  placas: string
  volumenCarga: string
  numeroEjes: string
  numeroLlantas: string
  claveOficina: string
  tarjetaCirculacion: string
  asignacionConductor: boolean
  curpConductor?: string
};

type UnidadStore = {
  unidades: Unidad[];
  agregarUnidad: (unidad: Unidad) => void;
};



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
