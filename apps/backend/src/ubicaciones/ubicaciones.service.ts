import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Oficina } from '../oficinas/entities/oficina.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OficinasService {
  constructor(
    @InjectRepository(Oficina)
    private readonly oficinaRepository: Repository<Oficina>,
  ) {}

  // Método unificado de búsqueda optimizado
  async buscarOficinas(termino: string): Promise<Oficina[]> {
    try {
      const terminoLimpio = termino.trim();
      
      if (!terminoLimpio) {
        return [];
      }

      let query = this.oficinaRepository
        .createQueryBuilder('oficina')
        .where('oficina.activo = true');

      // Detectar si es código postal (5 dígitos)
      if (/^\d{5}$/.test(terminoLimpio)) {
        query = query.andWhere('oficina.codigo_postal = :codigo_postal', { 
          codigo_postal: terminoLimpio 
        });
      } else {
        // Buscar por nombre de entidad o municipio
        query = query.andWhere(
          '(oficina.nombre_entidad ILIKE :nombre OR oficina.nombre_municipio ILIKE :nombre)',
          { nombre: `%${terminoLimpio}%` }
        );
      }

      // Obtener todas las oficinas que coincidan
      const todasLasOficinas = await query
        .orderBy('oficina.id_oficina', 'ASC')
        .getMany();

      // DEDUPLICACIÓN MANUAL: Eliminar duplicados por domicilio
      const oficinasSinDuplicados: Oficina[] = [];

      const domiciliosVistos = new Set();

      for (const oficina of todasLasOficinas) {
        // Normalizar domicilio para comparación (sin espacios extra, mayúsculas)
        const domicilioNormalizado = oficina.domicilio
          .toLowerCase()
          .replace(/\s+/g, ' ')
          .trim();

        if (!domiciliosVistos.has(domicilioNormalizado)) {
          domiciliosVistos.add(domicilioNormalizado);
          oficinasSinDuplicados.push(oficina);
        }
      }

      return oficinasSinDuplicados; // Siempre devuelve array (vacío si no encuentra)
      
    } catch (error) {
      console.error('Error en buscarOficinas:', error);
      return []; // Devuelve array vacío en lugar de lanzar excepción
    }
  }

  // Métodos específicos (mantener por compatibilidad si es necesario)
  async findByCodigoPostal(codigo_postal: string): Promise<Oficina[]> {
    return this.buscarOficinas(codigo_postal);
  }

  async findByNombreEntidad(nombre_entidad: string): Promise<Oficina[]> {
    return this.buscarOficinas(nombre_entidad);
  }

  async findByNombreMunicipio(nombre_municipio: string): Promise<Oficina[]> {
    return this.buscarOficinas(nombre_municipio);
  }
}