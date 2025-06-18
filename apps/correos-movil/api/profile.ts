import { ProfileUserSchema, SchemaProfileUser } from "../schemas/schemas"
import { myIp } from "./miscompras";

export const idUser = 1


export async function usuarioPorId(id:Number):Promise<SchemaProfileUser>{
    const url = `http://${myIp}:3000/api/profile/${id}`
    const response = await fetch(url)
    const json = await response.json();
    const perfil = ProfileUserSchema.parse(json)
    return perfil

}

export async function actualizarUsuarioPorId(userData:SchemaProfileUser,id:number) {
    try {
      const response = await fetch(`http://${myIp}:3000/api/profile/${id}`,{
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

export async function uploadAvatar(uri: string, id: number): Promise<string> {
  const form = new FormData();
  form.append('imagen', {
    uri,
    name: 'avatar.jpg',
    type: 'image/jpeg',
  } as any);

  const res = await fetch(
    `http://${myIp}:3000/api/profile/${id}/avatar`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: form,
    }
  );
  if (!res.ok) throw new Error('Error subiendo avatar');
  const { avatarUrl } = await res.json();
  return avatarUrl;
}