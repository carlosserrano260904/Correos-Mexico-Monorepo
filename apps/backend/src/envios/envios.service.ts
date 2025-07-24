import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Envio } from './entities/envios.entity';
import { Contacto } from '../contactos/entities/contacto.entity';

@Injectable()
export class EnviosService {
  constructor(
    @InjectRepository(Envio)
    private readonly envioRepo: Repository<Envio>,
    @InjectRepository(Contacto)
    private readonly contactoRepo: Repository<Contacto>,
  ) {}

  async findAll(): Promise<Envio[]> {
    return this.envioRepo.find({ relations: ['guia', 'unidad'] });
  }

  async findByUnidad(id: string): Promise<Envio[]> {
    return this.envioRepo.find({
      where: { unidad: { id } },
      relations: ['guia', 'unidad'],
    });
  }

  async findByGuia(id: string): Promise<Envio[]> {
    return this.envioRepo.find({
      where: { guia: { id_guia: id } },
      relations: ['guia', 'unidad'],
    });
  }

  async findByUnidadAndFecha(
    idUnidad: string,
    fecha: string,
  ): Promise<{ count: number; vehicleName: string | null }> {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
      throw new BadRequestException('Formato de fecha inválido. Use YYYY-MM-DD.');
    }

    const startDate = new Date(`${fecha}T00:00:00`);
    const endDate = new Date(`${fecha}T23:59:59.999`);
    if (isNaN(startDate.getTime())) {
      throw new BadRequestException('Fecha inválida.');
    }

    const [envios, count] = await this.envioRepo.findAndCount({
      where: {
        unidad: { id: idUnidad },
        fecha_asignacion: Between(startDate, endDate),
      },
      relations: ['unidad'],
      take: 1, // Optimización: solo necesitamos un registro para obtener el nombre
    });

    const vehicleName = envios[0]?.unidad?.placas ?? null;

    return { count, vehicleName };
  }

  async findAllByUnidadAndFecha(idUnidad: string, fecha: string): Promise<Envio[]> {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
      throw new BadRequestException('Formato de fecha inválido. Use YYYY-MM-DD.');
    }

    const startDate = new Date(`${fecha}T00:00:00`);
    const endDate = new Date(`${fecha}T23:59:59.999`);
    if (isNaN(startDate.getTime())) {
      throw new BadRequestException('Fecha inválida.');
    }

    return this.envioRepo.find({
      where: {
        unidad: { id: idUnidad },
        fecha_asignacion: Between(startDate, endDate),
      },
      relations: ['guia', 'unidad', 'guia.destinatario'],
    });
  }

  async create(data: Partial<Envio>): Promise<Envio> {
    const fechaAsignacion = new Date();

    const fechaEntrega = new Date(fechaAsignacion);
    if (fechaAsignacion.getHours() >= 15) {
      fechaEntrega.setDate(fechaEntrega.getDate() + 1);
    }

    data.fecha_entrega_programada = fechaEntrega.toDateString();

    const envio = this.envioRepo.create(data);
    return this.envioRepo.save(envio);
  }

  async findContacto(id: string): Promise<Contacto> {
    // The where clause uses the entity property name 'id'
    const contacto = await this.contactoRepo.findOne({ where: { id } });

    if (!contacto) {
      throw new NotFoundException(`No se encontró un contacto con el ID "${id}"`);
    }

    return contacto;
  }
}