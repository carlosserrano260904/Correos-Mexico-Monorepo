import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Envio, EstadoEnvio } from './entities/envios.entity';
import { GuiaTypeormEntity } from '../guias_trazabilidad/infrastructure/persistence/typeorm-entities/guia.typeorm-entity';
import { Unidad } from '../unidades/entities/unidad.entity';
import { CreateEnvioDto } from './dto/CrearEnvioDto.dto';

@Injectable()
export class EnviosService {
  constructor(
    @InjectRepository(Envio)
    private readonly envioRepository: Repository<Envio>,

    @InjectRepository(GuiaTypeormEntity)
    private readonly guiaRepo: Repository<GuiaTypeormEntity>,

    @InjectRepository(Unidad)
    private readonly unidadRepo: Repository<Unidad>,
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

  async create(dto: CreateEnvioDto): Promise<Envio> {
    const guia = await this.guiaRepo.findOne({ where: { id_guia: dto.guiaId }, relations: ['destinatario'] });
    if (!guia) throw new NotFoundException('Guía no encontrada');

    const unidad = await this.unidadRepo.findOne({ where: { id: dto.unidadId } });
    if (!unidad) throw new NotFoundException('Unidad no encontrada');

    const fechaAsignacion = new Date();
    const horaLimite = new Date(fechaAsignacion);
    horaLimite.setHours(15, 0, 0, 0);

    const fechaEntrega = new Date(fechaAsignacion);
    if (fechaAsignacion > horaLimite) fechaEntrega.setDate(fechaEntrega.getDate() + 1);

    const nombres = guia.destinatario?.nombres ?? '';
    const apellidos = guia.destinatario?.apellidos ?? '';
    const nombreCompleto = `${nombres} ${apellidos}`.trim();

    const envio = this.envioRepository.create({
      guia,
      unidad,
      estado_envio: EstadoEnvio.PENDIENTE,
      fecha_asignacion: fechaAsignacion,
      fecha_entrega_programada: fechaEntrega,
      nombre_receptor: nombreCompleto !== '' ? nombreCompleto : 'Receptor desconocido',
    });

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
        'guia.numero_de_rastreo AS numero_de_rastreo',
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
      .andWhere('envio.fecha_entrega_programada BETWEEN :inicioDelDia AND :finDelDia', {
        inicioDelDia,
        finDelDia,
      })
      .orderBy('envio.fecha_entrega_programada', 'ASC');

    const resultados = await queryBuilder.getRawMany();

    if (!resultados || resultados.length === 0) {
      throw new NotFoundException(`No se encontraron envíos para la unidad ${unidadId} en el día de hoy.`);
    }

    return resultados;
  }

  async iniciarRuta(unidadId: string): Promise<{ updated: number }> {
    const hoy = new Date();
    const inicioDelDia = new Date(hoy);
    inicioDelDia.setHours(0, 0, 0, 0);

    const finDelDia = new Date(hoy);
    finDelDia.setHours(23, 59, 59, 999);

    const result = await this.envioRepository.update(
      {
        unidad: { id: unidadId },
        fecha_entrega_programada: Between(inicioDelDia, finDelDia),
        estado_envio: EstadoEnvio.PENDIENTE,
      },
      {
        estado_envio: EstadoEnvio.EN_RUTA,
      },
    );
    if (!result.affected) {
      throw new NotFoundException(`No se encontraron envíos pendientes para la unidad ${unidadId} para el día de hoy.`);
    }

    return { updated: result.affected };
  }

  async marcarComoFallido(id: string, motivo: string): Promise<Envio> {
    const envio = await this.envioRepository.findOneBy({ id });

    if (!envio) {
      throw new NotFoundException(`No se encontró un envío con el ID ${id}`);
    }

    envio.estado_envio = EstadoEnvio.FALLIDO;
    envio.motivo_fallo = motivo;
    envio.fecha_fallido = new Date();

    return this.envioRepository.save(envio);
  }
}