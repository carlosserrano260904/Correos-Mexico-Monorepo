// api/miscompras.ts
import { MisComprasSchemaDB, MisComprasType } from "../schemas/schemas";


export const myIp = process.env.EXPO_PUBLIC_API_URL || "";

export async function obtenerMisCompras(id: number): Promise<MisComprasType[]> {
  const url = `${process.env.EXPO_PUBLIC_API_URL}/api/transactions/user/${id}`;
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Error ${res.status}: ${res.statusText}`);
  }

  const json = await res.json();
  const miscompras = MisComprasSchemaDB.parse(json);
  return miscompras;
}



// src/api/pedidos.ts
import axios from 'axios';
import Constants from 'expo-constants';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

// src/api/miscompras.ts (o donde tengas PedidoBackend)
export type PedidoBackend = {
  id: number;
  fecha: string;
  total: number | string;
  productos: Array<{
    id: number;
    cantidad: number;
    producto: {
      id: number;
      nombre: string;
      descripcion?: string;
      categoria?: string;
      precio: number | string;
      imagen?: string; // por si existía este campo
      images?: { id: number; url: string; orden: number }[];
    };
  }>;
};

// src/api/pedidos.ts
const API_ROOT = Constants.expoConfig?.extra?.IP_LOCAL
  ? `http://${Constants.expoConfig.extra.IP_LOCAL}:3000/api`
  : `${(BASE_URL || '').replace(/\/$/, '')}/api`;

// 👇 añade el 'api/' extra del controlador
const PEDIDOS_PREFIX = 'api/pedido';

export async function obtenerPedidosPorUsuario(profileId: number) {
  const { data } = await axios.get(`${API_ROOT}/${PEDIDOS_PREFIX}/user/${profileId}`);
  return data;
}

