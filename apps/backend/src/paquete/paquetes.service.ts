import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Paquete } from './entities/paquete.entity';

@Injectable()
export class PaquetesService {
  constructor(
    @InjectRepository(Paquete)
    private readonly paqueteRepo: Repository<Paquete>,
  ) {}

  findAll() {
    return this.paqueteRepo.find();
  }

 async findOne(id: string): Promise<Paquete> {
    const paquete = await this.paqueteRepo.findOne({ where: { id } });
    if (!paquete) {
      throw new NotFoundException(`Paquete con ID ${id} no encontrado`);
    }
    return paquete;
  }

  create(data: Partial<Paquete>) {
    const nuevo = this.paqueteRepo.create(data);
    return this.paqueteRepo.save(nuevo);
  }

  async update(id: string, data: Partial<Paquete>): Promise<Paquete> {
    await this.paqueteRepo.update(id, data);
    return this.findOne(id);
  }

  async actualizarEstatus(id: string, nuevoEstatus: string): Promise<Paquete | null> {
    const paquete = await this.paqueteRepo.findOne({ where: { id } });

    if (!paquete) {
      return null;
    }

    paquete.estatus = nuevoEstatus;
    return await this.paqueteRepo.save(paquete);
  }

  async anadirEvidencia(id: string, urlEvidencia: string): Promise<Paquete | null> {
    const paquete = await this.paqueteRepo.findOne({ where: { id } });

    if (!paquete) {
      return null;
    }

    paquete.evidencia = urlEvidencia;

    return await this.paqueteRepo.save(paquete);
  }

  remove(id: string) {
    return this.paqueteRepo.delete(id);
  }
}
