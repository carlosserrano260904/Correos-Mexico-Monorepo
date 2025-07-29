import { ProfileUserSchema, SchemaProfileUser } from "../schemas/schemas";

//Obtener perfil con la imagen ya firmada (desde el backend con ?signed=true)
export async function usuarioPorId(id: number): Promise<SchemaProfileUser> {
  const url = `${process.env.EXPO_PUBLIC_API_URL}/api/profile/${id}?signed=true`;
  const response = await fetch(url);
  const json = await response.json();
  const perfil = ProfileUserSchema.parse(json);
  return perfil;
}

//Actualizar campos del usuario
export async function actualizarUsuarioPorId(userData: SchemaProfileUser, id: number) {
  const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/profile/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  const responseBody = await response.json();

  if (!response.ok) {
    console.error("Error actualizando perfil:", responseBody);
    throw new Error(responseBody?.message || "Error actualizando perfil");
  }

  return responseBody;
}

//Subir avatar: devuelve solo la "key" que se guarda en la BD
export async function uploadAvatar(uri: string, id: number): Promise<string> {
  const form = new FormData();
  form.append("imagen", {
    uri,
    name: "avatar.jpg",
    type: "image/jpeg",
  } as any);

  const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/profile/${id}/avatar`, {
    method: "POST",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    body: form,
  });

  if (!res.ok) throw new Error("Error subiendo avatar");

  const { key } = await res.json();
  return key;
}

//Obtener una URL firmada desde la key (por separado)
export async function obtenerUrlFirmada(key: string): Promise<string> {
  const res = await fetch(
    `${process.env.EXPO_PUBLIC_API_URL}/api/upload-image/signed-url?key=${encodeURIComponent(key)}`
  );
  const { signedUrl } = await res.json();
  return signedUrl;
}