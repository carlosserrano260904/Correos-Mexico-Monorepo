import { create } from 'zustand';
import { persist } from 'zustand/middleware'; //esto para persistir

export type Sucursal = {
  clave_oficina_postal: string;
  clave_cuo: string;
  clave_inmueble: string;
  clave_inegi: string;
  clave_entidad: string;
  nombre_entidad: string;
  nombre_municipio: string;
  tipo_cuo: 
    | 'Centro Operativo Mexpost'
    | 'Centro de Distribución'
    | 'Administración Postal'
    | 'Gerencia Postal Estatal'
    | 'Oficina de Servicios Directos'
    | 'Sucursal'
    | 'Módulo de Depósitos Masivos'
    | 'Centro Operativo de Reparto'
    | 'Gerencia'
    | 'Centro de Atención al Público'
    | 'Oficina de Transbordo'
    | 'Coordinación Operativa'
    | 'Oficina Operativa'
    | 'Consol. de Ingresos y Egresos'
    | 'Coordinación Mexpost'
    | 'Puerto Maritimo'
    | 'Agencia Municipal'
    | 'Centro de Atención Integral'
    | 'Aeropuerto'
    | 'Subdirección'
    | 'Dirección'
    | 'Otros'
    | 'Módulo de Servicios'
    | 'Coordinación Administrativa'
    | 'Almacen'
    | 'Dirección General'
    | 'Tienda Filatélica'
    | 'Oficina de Cambio'
    | 'Of. Sindicato'
    | 'Centro de Depósitos Masivos'; // Ajusta según tus enums reales

  nombre_cuo: string;
  domicilio: string;
  codigo_postal: string;
  telefono: string;
  pais?: string; // Default: 'México'
  latitud?: number;
  longitud?: number;
  horario_atencion?: string | null;
  activo: boolean;
};

type SucursalStore = {
  sucursales: Sucursal[];
  fetchSucursales: () => Promise<void>;
  agregarSucursal: (sucursal: Sucursal) => Promise<void>;
};



export const useSucursalStore = create<SucursalStore>((set) => ({
  sucursales: [],
  fetchSucursales: async () => {
    const res = await fetch('http://localhost:3000/api/oficinas');
    const data = await res.json();
    set({ sucursales: data });
  },
  agregarSucursal: async (sucursal) => {
    await fetch('http://localhost:3000/api/oficinas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sucursal),
    }); // Refresh the list after adding
  },
}));


/*
export const useSucursalStore = create<SucursalStore>()(
  persist( 
    (set) => ({
      sucursales: [],
      agregarSucursal: (sucursal) =>
        set((state) => ({
          sucursales: [...state.sucursales, sucursal],
        })),
    }),
    { name: 'sucursal-storage' }, // Clave para localStorage
  ),
);
*/