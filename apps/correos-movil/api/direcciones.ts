import { DireccionesSchemaDB, DireccionesType } from "../schemas/schemas";
import { Direccion } from "../screens/usuario/Direcciones/Direcciones"
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function obtenerDirecciones(obtenerusuarioId: number): Promise<DireccionesType> {
  
  const url = `${process.env.EXPO_PUBLIC_API_URL}/api/misdirecciones/usuario/${obtenerusuarioId}`;
  const response = await fetch(url);
  const json = await response.json();

  console.log('Respuesta cruda:', JSON.stringify(json, null, 2));

  if (Array.isArray(json)) {
    const direcciones = DireccionesSchemaDB.parse(json);
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

  const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/misdirecciones`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error('No se pudo guardar la dirección');
  }
}

export async function eliminarDireccionAPI(id: number): Promise<void> {
  const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/misdirecciones/${id}`, {
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

  const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/misdirecciones/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error('No se pudo actualizar la dirección');
  }
}

// ✅ NUEVA FUNCIÓN: Guardar dirección seleccionada COMPLETA
export async function guardarDireccionSeleccionada(direccion: any): Promise<void> {
  try {
    if (!direccion || !direccion.id) {
      throw new Error('Dirección inválida');
    }

    // ✅ GUARDAR DIRECCIÓN COMPLETA
    await AsyncStorage.setItem('direccionSeleccionada', JSON.stringify(direccion));
    await AsyncStorage.setItem('direccionSeleccionadaId', direccion.id.toString());
    
    console.log('💾 Dirección COMPLETA guardada:', {
      id: direccion.id,
      calle: direccion.calle,
      colonia: direccion.colonia_fraccionamiento
    });
  } catch (error) {
    console.error('❌ Error guardando dirección seleccionada:', error);
    throw error;
  }
}

// ✅ FUNCIÓN: Obtener dirección seleccionada
export async function obtenerDireccionSeleccionada(): Promise<any | null> {
  try {
    const direccionGuardada = await AsyncStorage.getItem('direccionSeleccionada');
    
    if (direccionGuardada && direccionGuardada !== 'null') {
      const direccion = JSON.parse(direccionGuardada);
      console.log('📦 Dirección seleccionada obtenida:', direccion);
      return direccion;
    }
    
    console.log('ℹ️ No hay dirección seleccionada guardada');
    return null;
  } catch (error) {
    console.error('❌ Error obteniendo dirección seleccionada:', error);
    return null;
  }
}

// ✅ FUNCIÓN: Limpiar dirección seleccionada
export async function limpiarDireccionSeleccionada(): Promise<void> {
  try {
    await AsyncStorage.removeItem('direccionSeleccionada');
    await AsyncStorage.removeItem('direccionSeleccionadaId');
    console.log('🧹 Dirección seleccionada limpiada');
  } catch (error) {
    console.error('❌ Error limpiando dirección seleccionada:', error);
    throw error;
  }
}