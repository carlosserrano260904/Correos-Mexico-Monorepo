import { DireccionesSchemaDB, DireccionesType } from "../schemas/schemas";
import { Direccion } from "../screens/usuario/Direcciones/Direcciones"

const obtenerusuarioId= 1;

export async function obtenerDirecciones(obtenerusuarioId: number): Promise<DireccionesType> {
  
  const url = `http://192.168.1.20:3000/api/misdirecciones/usuario/${obtenerusuarioId}`;
  const response = await fetch(url);
  const json = await response.json();

  console.log('Respuesta cruda:', JSON.stringify(json, null, 2));

  if (Array.isArray(json)) {
    const direcciones = DireccionesSchemaDB.parse(json); // Validar como array
    return direcciones;
  }

  throw new Error("La respuesta no es un arreglo válido de direcciones.");
}

export async function agregarDireccionAPI(direccion: Direccion, usuarioId: number): Promise<void> {
  const body = {
    nombre: direccion.nombre,
    calle: direccion.direccion,
    colonia_fraccionamiento: direccion.colonia,
    numero_interior: direccion.numerointerior, 
    numero_exterior: direccion.numeroexterior,
    numero_celular: direccion.telefono,
    codigo_postal: direccion.codigoPostal,
    estado: direccion.estado,
    municipio: direccion.municipio,
    mas_info: direccion.masInfo,
    usuarioId: usuarioId,
  };

  const res = await fetch(`http://192.168.1.20:3000/api/misdirecciones`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error('No se pudo guardar la dirección');
  }
}

export async function eliminarDireccionAPI(id: number): Promise<void> {
  const res = await fetch(`http://192.168.1.20:3000/api/misdirecciones/${id}`, {
    method: 'DELETE',
  });

  if (!res.ok) {
    throw new Error('No se pudo eliminar la dirección');
  }
}

export async function actualizarDireccionAPI(id: number, direccion: Direccion): Promise<void> {
  const body = {
    nombre: direccion.nombre,
    calle: direccion.direccion,
    colonia_fraccionamiento: direccion.colonia,
    numero_interior: direccion.numerointerior,
    numero_exterior: direccion.numeroexterior,
    numero_celular: direccion.telefono,
    codigo_postal: direccion.codigoPostal,
    estado: direccion.estado,
    municipio: direccion.municipio,
    mas_info: direccion.masInfo,
  };

  const res = await fetch(`http://192.168.1.20:3000/api/misdirecciones/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error('No se pudo actualizar la dirección');
  }
}
