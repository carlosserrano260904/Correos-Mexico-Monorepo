import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Envio } from './entities/envios.entity';

@Injectable()
export class EnviosService {
  constructor(
    @InjectRepository(Envio)
    private readonly envioRepo: Repository<Envio>
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
}