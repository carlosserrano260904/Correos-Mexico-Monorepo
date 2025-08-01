import { create } from 'zustand';
import { persist } from 'zustand/middleware'; //esto para persistir

type Sucursal = {
  nombreEntidad: string;
  domicilio: string;
  municipio: string;
  claveOficinaPostal: string;
  claveCOU: string;
  claveInmueble: string;
  claveInegi: string;
  codigoPostal: string;
  telefono: string;
  latitud: string;
  longitud: string;
  nombreCUO: string;
  tipoCUO: string;
  activo: string;
};

type SucursalStore = {
  sucursales: Sucursal[];
  agregarSucursal: (sucursal: Sucursal) => void;
};

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