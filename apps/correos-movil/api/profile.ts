import { ProfileUserSchema, SchemaProfileUser } from "../schemas/schemas"

export const idUser = 5


export async function usuarioPorId(id:Number):Promise<SchemaProfileUser>{
    const url = `http://192.168.1.10:3000/api/profile/${id}`
    const response = await fetch(url)
    const json = await response.json();
    const perfil = ProfileUserSchema.parse(json)
    return perfil

}