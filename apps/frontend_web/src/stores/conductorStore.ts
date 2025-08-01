import {create} from 'zustand';
import { persist } from 'zustand/middleware';

type Conductor = {
    idConductor: string
    nombre: string
    curp: string
    rfc: string
    licencia: string
    telefono: string
    email: string
    claveOficina: string
    licenciaVigente: string
}

type ConductorStore = {
  conductores: Conductor[];
  agregarConductor: (conductor: Conductor) => void;
};

export const useConductorStore = create<ConductorStore>()(
  persist( // ← Envuelve el store con persist
    (set) => ({
      conductores: [],
      agregarConductor: (conductor) =>
        set((state) => ({
          conductores: [...state.conductores, conductor],
        })),
    }),
    {
      name: 'conductor-storage', // Clave para localStorage
    },
  ),
);