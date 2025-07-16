
export async function obtenerDatosPorCodigoPostal(cp: string) {
  try {
    const url = `${process.env.EXPO_PUBLIC_API_URL}/api/postal/${cp}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Código postal no encontrado');
    }
    const data = await response.json();
    return data; // { estado, ciudad, fraccionamiento }
  } catch (error) {
    console.error('Error al obtener datos de código postal:', error);
    return null;
  }
}