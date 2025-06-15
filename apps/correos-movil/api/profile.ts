import { ProfileUserSchema, SchemaProfileUser } from "../schemas/schemas"

export const idUser = 1


export async function usuarioPorId(id:Number):Promise<SchemaProfileUser>{
    const url = `http://192.168.1.10:3000/api/profile/${id}`
    const response = await fetch(url)
    const json = await response.json();
    const perfil = ProfileUserSchema.parse(json)
    return perfil

}

export async function actualizarUsuarioPorId(userData:SchemaProfileUser,id:number) {
    try {
      const response = await fetch(`http://192.168.1.10:3000/api/profile/${id}`,{
        method:'PATCH',
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify(userData)    
        })
        return response 
    } catch (error) {
      console.log(error)
    }
}