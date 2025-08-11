import {create} from 'zustand';
import { persist } from 'zustand/middleware';

type Conductor = {
    nombreCompleto: string;
    curp: string;
    rfc: string;
    licencia: string;
    telefono: string;
    correo: string;
    claveOficina: string;
    licenciaVigente: boolean; 
}

type ConductorStore = {
  conductores: Conductor[];
  fetchConductores: () => Promise <void>;
  agregarConductor: (conductor: Conductor) => Promise<void>;
};

export const useConductorStore = create<ConductorStore>((set,get) => ({
  conductores: [],
  fetchConductores: async () => {
    const res = await fetch('http://localhost:3000/api/conductores'); // Ajusta la URL según tu backend
    const data = await res.json();
    set({ conductores: data });
  },
  agregarConductor: async (conductor) => {
    await fetch ('http://localhost:3000/api/conductores', {
      method: 'POST',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify(conductor),
    });
    await get().fetchConductores();
  }
}));


/*
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
);*/