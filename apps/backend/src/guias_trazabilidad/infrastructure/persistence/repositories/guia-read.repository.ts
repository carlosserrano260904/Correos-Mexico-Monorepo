import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { GuiaReadRepositoryInterface } from '../../../application/ports/outbound/guia-read.repository.interface';
import {
  TrazabilidadReadModel,
  GuiaListReadModel,
  IncidenciaReadModel,
  ContactoReadModel,
} from '../../../application/read-models/guia.read-models';

@Injectable()
export class GuiaReadRepository implements GuiaReadRepositoryInterface {
  constructor(private readonly dataSource: DataSource) {}

  async findByNumeroRastreo(
    numeroRastreo: string,
  ): Promise<TrazabilidadReadModel | null> {
    const query = `
      WITH guia_info AS (
        SELECT 
          g.id_guia, 
          g.numero_de_rastreo, 
          g.situacion_actual,
          g.valor_declarado,
          g.peso_kg,
          CONCAT(g.alto_cm, 'x', g.largo_cm, 'x', g.ancho_cm, ' cm') as dimensiones,
          g.fecha_creacion,
          g.fecha_entrega_estimada,
          rem.nombres || ' ' || rem.apellidos as remitente_nombre,
          dest.nombres || ' ' || dest.apellidos as destinatario_nombre
        FROM guias g
        LEFT JOIN contactos_guias rem ON g.id_remitente = rem.id_contacto
        LEFT JOIN contactos_guias dest ON g.id_destinatario = dest.id_contacto
        WHERE g.numero_de_rastreo = $1
      ),
      movimientos_ordenados AS (
        SELECT 
          m.estado, 
          m.localizacion, 
          m.fecha_movimiento,
          ROW_NUMBER() OVER (ORDER BY m.fecha_movimiento ASC) as orden
        FROM movimientos_guias m
        INNER JOIN guia_info gi ON m.id_guia = gi.id_guia
      ),
      incidencias_info AS (
        SELECT 
          i.tipo_incidencia, 
          i.descripcion, 
          i.fecha_incidencia
        FROM incidencias_guias i
        INNER JOIN guia_info gi ON i.id_guia = gi.id_guia
        ORDER BY i.fecha_incidencia DESC
      )
      SELECT 
        gi.*,
        COALESCE(
          JSON_AGG(
            JSON_BUILD_OBJECT(
              'orden', mo.orden,
              'estado', mo.estado,
              'localizacion', mo.localizacion,
              'fecha', mo.fecha_movimiento
            ) ORDER BY mo.orden
          ) FILTER (WHERE mo.estado IS NOT NULL), 
          '[]'::json
        ) as historial_movimientos,
        COALESCE(
          JSON_AGG(
            JSON_BUILD_OBJECT(
              'tipo', ii.tipo_incidencia,
              'descripcion', ii.descripcion,
              'fecha', ii.fecha_incidencia
            ) ORDER BY ii.fecha_incidencia DESC
          ) FILTER (WHERE ii.tipo_incidencia IS NOT NULL),
          '[]'::json
        ) as incidencias
      FROM guia_info gi
      LEFT JOIN movimientos_ordenados mo ON true
      LEFT JOIN incidencias_info ii ON true
      GROUP BY 
        gi.id_guia, gi.numero_de_rastreo, gi.situacion_actual, 
        gi.remitente_nombre, gi.destinatario_nombre, gi.valor_declarado,
        gi.peso_kg, gi.dimensiones, gi.fecha_creacion, gi.fecha_entrega_estimada;
    `;

    const result = await this.dataSource.query(query, [numeroRastreo]);
    return result.length > 0 ? result[0] : null;
  }

  async findAllGuias(): Promise<GuiaListReadModel[]> {
    const query = `
      SELECT 
        g.numero_de_rastreo,
        g.situacion_actual,
        g.fecha_creacion,
        g.valor_declarado,
        g.peso_kg,
        rem.nombres || ' ' || rem.apellidos as remitente,
        dest.nombres || ' ' || dest.apellidos as destinatario,
        dest.localidad as ciudad_destino,
        dest.estado as estado_destino,
        m.ultimo_estado,
        m.fecha_ultimo_movimiento
      FROM guias g
      LEFT JOIN contactos_guias rem ON g.id_remitente = rem.id_contacto
      LEFT JOIN contactos_guias dest ON g.id_destinatario = dest.id_contacto
      LEFT JOIN LATERAL (
        SELECT 
          estado as ultimo_estado, 
          fecha_movimiento as fecha_ultimo_movimiento
        FROM movimientos_guias mg 
        WHERE mg.id_guia = g.id_guia
        ORDER BY mg.fecha_movimiento DESC
        LIMIT 1
      ) m ON true
      ORDER BY g.fecha_creacion DESC;
    `;

    return await this.dataSource.query(query);
  }

  async findAllIncidencias(): Promise<IncidenciaReadModel[]> {
    const query = `
      SELECT 
        i.id_incidencia,
        g.numero_de_rastreo,
        i.tipo_incidencia,
        i.descripcion,
        i.fecha_incidencia,
        i.id_usuario_responsable as id_responsable,
        rem.nombres || ' ' || rem.apellidos as remitente_nombre,
        dest.nombres || ' ' || dest.apellidos as destinatario_nombre
      FROM incidencias_guias i
      INNER JOIN guias g ON i.id_guia = g.id_guia
      LEFT JOIN contactos_guias rem ON g.id_remitente = rem.id_contacto
      LEFT JOIN contactos_guias dest ON g.id_destinatario = dest.id_contacto
      ORDER BY i.fecha_incidencia DESC;
    `;

    return await this.dataSource.query(query);
  }

  async findAllContactos(): Promise<ContactoReadModel[]> {
    const query = `
      SELECT 
        id_contacto,
        nombres,
        apellidos,
        telefono,
        CONCAT(
          calle, ' ', numero,
          CASE WHEN numero_interior IS NOT NULL AND numero_interior != ''
               THEN CONCAT(' Int. ', numero_interior) 
               ELSE '' END,
          ', ', asentamiento,
          ', ', localidad,
          ', ', estado,
          ' CP ', codigo_postal
        ) as direccion_completa,
        localidad as ciudad,
        estado,
        codigo_postal,
        id_usuario
      FROM contactos_guias
      ORDER BY nombres, apellidos;
    `;

    return await this.dataSource.query(query);
  }
}
