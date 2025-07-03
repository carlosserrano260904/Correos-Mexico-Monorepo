// api/miscompras.ts
import { MisComprasSchemaDB, MisComprasType } from "../schemas/schemas";

export const myIp = "192.168.0.121";


export async function obtenerMisCompras(id: number): Promise<MisComprasType[]> {
  const url = `http://${myIp}:3000/api/transactions/user/${id}`;
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Error ${res.status}: ${res.statusText}`);
  }

  const json = await res.json();
  const miscompras = MisComprasSchemaDB.parse(json);
  return miscompras;
}