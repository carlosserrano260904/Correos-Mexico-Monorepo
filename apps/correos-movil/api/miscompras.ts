import { MisComprasSchemaDB, MisComprasType } from "../schemas/schemas";

export const myIp = "192.168.1.6";


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