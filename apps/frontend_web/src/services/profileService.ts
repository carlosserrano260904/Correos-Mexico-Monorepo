// services/profileService.ts
import { SchemaProfileUser } from '@/schemas/schemas';

// Obtener perfil por ID (igual que en tu app)
export async function usuarioPorId(id: number): Promise<SchemaProfileUser> {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/profile/${id}`;

  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error("Error al obtener perfil");
  }

  const json = await response.json();
  return json;
}

// Actualizar campos del perfil (PATCH) - igual que en tu app
export async function actualizarUsuarioPorId(userData: SchemaProfileUser, id: number) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/profile/${id}`, {
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

// Subir avatar (adaptado para web)
export async function uploadAvatar(file: File, id: number): Promise<string> {
  const form = new FormData();
  form.append("imagen", file);

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/profile/${id}/avatar`, {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Error subiendo avatar:", res.status, errorText);
    throw new Error("Error subiendo avatar");
  }

  const { url } = await res.json();
  return url;
}