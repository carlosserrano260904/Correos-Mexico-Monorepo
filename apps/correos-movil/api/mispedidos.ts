
import { MisPedidosSchemaDB, MisPedidosType } from "../schemas/schemas";


export async function obtenerMisPedidos(id: number): Promise<MisPedidosType[]> {
  const url = `${process.env.EXPO_PUBLIC_API_URL}/api/api/pedido/user/${id}`;
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Error ${res.status}: ${res.statusText}`);
  }

  const json = await res.json();
  const mispedidos = MisPedidosSchemaDB.parse(json);
  return mispedidos;
}
