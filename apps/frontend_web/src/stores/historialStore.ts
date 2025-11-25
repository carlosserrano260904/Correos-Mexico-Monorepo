import { create } from "zustand";

type HistorialAsignacion = {
  id: number;
  nombreConductor: string;
  curp: string;
  placasUnidad: string;
  oficinaSalida: string;
  claveCuoDestino: string;
  claveOficinaActual: string;
  fechaAsignacion: string;
  fechaLlegadaDestino?: string;
  fechaFinalizacion?: string;
};

type HistorialStore = {
  historial: HistorialAsignacion[];
  loading: boolean;
  fetchHistorial: () => Promise<void>;
  registrarLlegadaDestino: (curp: string, placas: string, oficinaActual: string) => Promise<void>;
  registrarRetornoOrigen: (curp: string, placas: string) => Promise<void>;
};

export const useHistorialStore = create<HistorialStore>((set, get) => ({
  historial: [],
  loading: false,
  fetchHistorial: async () => {
    set({ loading: true });
    try {
      const res = await fetch("http://localhost:3000/api/historial-asignaciones");
      const data = await res.json();
      set({ historial: data, loading: false });
    } catch {
      set({ loading: false });
    }
  },
  registrarLlegadaDestino: async (curp, placas, oficinaActual) => {
    try {
      const res = await fetch("http://localhost:3000/api/historial-asignaciones/llegada-destino", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ curp, placas, oficinaActual }),
      });
      if (!res.ok) throw new Error("Error registrando llegada a destino");
      // Opcional: recargar historial después de registrar
      await get().fetchHistorial();
    } catch (err) {
      console.error(err);
    }
  },
  registrarRetornoOrigen: async (curp, placas) => {
    try {
      const res = await fetch("http://localhost:3000/api/historial-asignaciones/retorno-origen", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ curp, placas }),
      });
      if (!res.ok) throw new Error("Error registrando retorno a origen");
      // Opcional: recargar historial después de registrar
      await get().fetchHistorial();
    } catch (err) {
      console.error(err);
    }
  },
}));
