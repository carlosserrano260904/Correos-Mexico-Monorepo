import { MisComprasSchemaDB, MisComprasType } from "../schemas/schemas"


export async function obtenerMisCompras(id:number):Promise<MisComprasType> {
        const url = `http://192.168.1.10:3000/api/transactions/${id}` 
        const data = await fetch(url)
        const json = await data.json()
        const miscompras = MisComprasSchemaDB.parse(json)
        return miscompras       
}