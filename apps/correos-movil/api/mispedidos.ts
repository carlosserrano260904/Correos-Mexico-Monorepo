//mispedidos.ts
// Este archivo define la función para obtener los pedidos de un usuario específico desde el backend.
import { MisPedidosSchemaDB, MisPedidosType } from "../schemas/schemas";

export const myIp = "192.168.0.174";

export async function obtenerMisPedidos(id: number): Promise<MisPedidosType[]> {
  const url = `${process.env.EXPO_PUBLIC_API_URL}/api/api/pedidos/user/${id}`;
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Error ${res.status}: ${res.statusText}`);
  }

  const json = await res.json();
  const mispedidos = MisPedidosSchemaDB.parse(json);
  return mispedidos;
}
