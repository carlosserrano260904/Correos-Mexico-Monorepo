import { ProfileUserSchema, SchemaProfileUser } from "../schemas/schemas";

// ✅ Obtener perfil por ID
export async function usuarioPorId(id: number): Promise<SchemaProfileUser> {
  const url = `${process.env.EXPO_PUBLIC_API_URL}/api/profile/${id}`;
  console.log("📡 Fetching perfil desde:", url);

  const response = await fetch(url);
  const text = await response.text();

  console.log("📥 Status:", response.status);
  console.log("📥 Response body:", text);

  if (!response.ok) {
    throw new Error("Error al obtener perfil");
  }

  const json = JSON.parse(text);
  const perfil = ProfileUserSchema.parse(json); // Valida estructura
  return perfil;
}

// ✅ Actualizar campos del perfil (PATCH)
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

export async function uploadAvatar(uri: string, id: number): Promise<string> {
  const form = new FormData();
  form.append("imagen", {
    uri,
    name: "avatar.jpg",
    type: "image/jpeg",
  } as any);

  const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/profile/${id}/avatar`, {
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

// ✅ Construir URL pública
export function buildPublicImageUrl(key: string): string {
  const bucketName = process.env.EXPO_PUBLIC_GCS_BUCKET_NAME;
  return `https://storage.googleapis.com/${bucketName}/${key}`;
}