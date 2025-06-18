import { MisComprasSchemaDB, MisComprasType } from "../schemas/schemas"

export const myIp="192.168.0.149"

export async function obtenerMisCompras(id:number):Promise<MisComprasType> {
        const url = `http://${myIp}:3000/api/transactions/${id}` 
        const data = await fetch(url)
        const json = await data.json()
        const miscompras = MisComprasSchemaDB.parse(json)
        return miscompras       
}