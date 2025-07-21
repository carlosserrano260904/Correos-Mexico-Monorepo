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
    return this.envioRepo.find({ relations: ['guia', 'vehiculo'] });
  }

  async findByUnidad(id: number): Promise<Envio[]> {
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
    const envio = this.envioRepo.create(data);
    return this.envioRepo.save(envio);
  }
}