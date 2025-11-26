export interface GuiaReadModel {
  id_guia: string;
  numero_de_rastreo: string;
  situacion_actual: string;
  valor_declarado: number;
  peso_kg: number;
  alto_cm: number;
  largo_cm: number;
  ancho_cm: number;
  fecha_creacion: Date;
  fecha_entrega_estimada: Date;

  // remitente (datos desnormalizados para eficiencia)
  remitente_nombres: string;
  remitente_apellidos: string;
  remitente_telefono: string;
  remitente_direccion_completa: string;
  remitente_ciudad: string;
  remitente_estado: string;
  remitente_cp: string;

  // destinatario
  destinatario_nombres: string;
  destinatario_apellidos: string;
  destinatario_telefono: string;
  destinatario_direccion_completa: string;
  destinatario_ciudad: string;
  destinatario_estado: string;
  destinatario_cp: string;

  // ultimo movimiento
  ultimo_estado?: string;
  ultima_localizacion?: string;
  fecha_ultimo_movimiento?: Date;
}

export interface GuiaListReadModel {
  numero_de_rastreo: string;
  situacion_actual: string;
  fecha_creacion: Date;
  remitente: string;
  destinatario: string;
  ciudad_destino: string;
  estado_destino: string;
  ultimo_estado?: string;
  fecha_ultimo_movimiento?: Date;
  valor_declarado: number;
  peso_kg: number;
}

export interface TrazabilidadReadModel {
  id_guia: string;
  numero_de_rastreo: string;
  situacion_actual: string;
  remitente_nombre: string;
  destinatario_nombre: string;
  valor_declarado: number;
  peso_kg: number;
  dimensiones: string;
  fecha_creacion: Date;
  fecha_entrega_estimada: Date;
  historial_movimientos: Array<{
    orden: number;
    estado: string;
    localizacion: string;
    fecha: Date;
  }>;
  incidencias: Array<{
    tipo: string;
    descripcion: string;
    fecha: Date;
  }>;
}

export interface IncidenciaReadModel {
  id_incidencia: string;
  numero_de_rastreo: string;
  tipo_incidencia: string;
  descripcion: string;
  fecha_incidencia: Date;
  id_responsable: string;
  remitente_nombre: string;
  destinatario_nombre: string;
}

export interface ContactoReadModel {
  id_contacto: string;
  nombres: string;
  apellidos: string;
  telefono: string;
  direccion_completa: string;
  ciudad: string;
  estado: string;
  codigo_postal: string;
  id_usuario?: string;
}
