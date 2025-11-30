import { DireccionesSchemaDB, DireccionesType } from "../schemas/addresses";

import { Direccion } from "../app/pago/Componentes/Primitivos/formularioDireccion"; 

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// -----------------------------------------------------
// 1. OBTENER DIRECCIONES
// -----------------------------------------------------
export async function obtenerDirecciones(usuarioId: number): Promise<DireccionesType> {
  const url = `${API_URL}/api/misdirecciones/usuario/${usuarioId}`;
  const response = await fetch(url);

  const json = await response.json();

  console.log("Respuesta cruda (WEB):", JSON.stringify(json, null, 2));

  if (Array.isArray(json)) {
    const direcciones = DireccionesSchemaDB.parse(json);
    return direcciones;
  }

  throw new Error("La respuesta no es un arreglo válido de direcciones.");
}

// -----------------------------------------------------
// 2. AGREGAR DIRECCIÓN
// -----------------------------------------------------
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

  const res = await fetch(`${API_URL}/api/misdirecciones`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  console.log("📤 Enviando dirección (WEB):", body);

  if (!res.ok) {
    throw new Error("No se pudo guardar la dirección");
  }
}

// -----------------------------------------------------
// 3. ELIMINAR DIRECCIÓN
// -----------------------------------------------------
export async function eliminarDireccionAPI(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/api/misdirecciones/${id}`, {
    method: "DELETE",
  });

  console.log(`🗑️ Eliminando dirección (WEB): ID ${id}`);

  if (!res.ok) {
    throw new Error("No se pudo eliminar la dirección");
  }
}

// -----------------------------------------------------
// 4. ACTUALIZAR DIRECCIÓN
// -----------------------------------------------------
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

  const res = await fetch(`${API_URL}/api/misdirecciones/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  console.log("✏️ Actualizando dirección (WEB):", { id, body });

  if (!res.ok) {
    throw new Error("No se pudo actualizar la dirección");
  }
}

// -----------------------------------------------------
// 5. GUARDAR DIRECCIÓN SELECCIONADA (WEB)
//    → Usa localStorage en lugar de AsyncStorage
// -----------------------------------------------------
export async function guardarDireccionSeleccionada(direccion: any): Promise<void> {
  try {
    if (!direccion || !direccion.id) {
      throw new Error("Dirección inválida");
    }

    localStorage.setItem("direccionSeleccionada", JSON.stringify(direccion));
    localStorage.setItem("direccionSeleccionadaId", direccion.id.toString());

    console.log("💾 Dirección COMPLETA guardada (WEB):", direccion);
  } catch (error) {
    console.error("❌ Error guardando dirección seleccionada (WEB):", error);
    throw error;
  }
}

// -----------------------------------------------------
// 6. OBTENER DIRECCIÓN SELECCIONADA (WEB)
// -----------------------------------------------------
export async function obtenerDireccionSeleccionada(): Promise<any | null> {
  try {
    const stored = localStorage.getItem("direccionSeleccionada");

    if (stored) {
      const direccion = JSON.parse(stored);
      console.log("📦 Dirección seleccionada obtenida (WEB):", direccion);
      return direccion;
    }

    console.log("ℹ️ No hay dirección seleccionada guardada (WEB)");
    return null;
  } catch (error) {
    console.error("❌ Error obteniendo dirección seleccionada (WEB):", error);
    return null;
  }
}

// -----------------------------------------------------
// 7. LIMPIAR DIRECCIÓN SELECCIONADA (WEB)
// -----------------------------------------------------
export async function limpiarDireccionSeleccionada(): Promise<void> {
  try {
    localStorage.removeItem("direccionSeleccionada");
    localStorage.removeItem("direccionSeleccionadaId");

    console.log("🧹 Dirección seleccionada limpiada (WEB)");
  } catch (error) {
    console.error("❌ Error limpiando dirección seleccionada (WEB):", error);
    throw error;
  }
}
