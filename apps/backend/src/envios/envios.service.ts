import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Envio } from './entities/envios.entity';

@Injectable()
export class EnviosService {
  constructor(
    @InjectRepository(Envio)
    private readonly envioRepository: Repository<Envio>,
  ) {}

  async findAll(): Promise<Envio[]> {
    return this.envioRepository.find({ relations: ['guia', 'unidad'] });
  }

  async findByUnidad(id: string): Promise<Envio[]> {
    return this.envioRepository.find({
      where: { unidad: { id } },
      relations: ['guia', 'unidad'],
    });
  }

  async findByGuia(id: string): Promise<Envio[]> {
    return this.envioRepository.find({
      where: { guia: { id_guia: id } },
      relations: ['guia', 'unidad'],
    });
  }

  async create(data: Partial<Envio>): Promise<Envio> {
    const fechaAsignacion = new Date();

    const fechaEntrega = new Date(fechaAsignacion);
    if (fechaAsignacion.getHours() >= 15) {
      fechaEntrega.setDate(fechaEntrega.getDate() + 1);
    }

    data.fecha_entrega_programada = fechaEntrega.toDateString();

    const envio = this.envioRepository.create(data);
    return this.envioRepository.save(envio);
  }

  async findEnviosDeHoyPorUnidad(unidadId: string): Promise<any[]> {
    const inicioDelDia = new Date();
    inicioDelDia.setHours(0, 0, 0, 0);

    const finDelDia = new Date();
    finDelDia.setHours(23, 59, 59, 999);

    const queryBuilder = this.envioRepository.createQueryBuilder('envio')
      .leftJoin('envio.guia', 'guia')
      .leftJoin('contactos_guias', 'contactoGuia', 'contactoGuia.id_contacto = guia.id_destinatario')
      .select([
        'envio.id AS id',
        'envio.estado_envio AS estado_envio',
        'contactoGuia.calle AS calle',
        'contactoGuia.numero AS numero',
        'contactoGuia.numero_interior AS numero_interior',
        'contactoGuia.asentamiento AS asentamiento',
        'contactoGuia.codigo_postal AS codigo_postal',
        'contactoGuia.localidad AS localidad',
        'contactoGuia.estado AS estado',
        'contactoGuia.pais AS pais',
        'contactoGuia.lat AS lat',
        'contactoGuia.lng AS lng',
        'contactoGuia.referencia AS referencia',
      ])
      .where('envio.id_unidad = :unidadId', { unidadId })
      .andWhere('envio.fecha_asignacion BETWEEN :inicioDelDia AND :finDelDia', {
        inicioDelDia,
        finDelDia,
      })
      .orderBy('envio.fecha_asignacion', 'ASC');

    const resultados = await queryBuilder.getRawMany();

    if (!resultados || resultados.length === 0) {
      throw new NotFoundException(`No se encontraron envíos para la unidad ${unidadId} en el día de hoy.`);
    }

    return resultados;
  }
}