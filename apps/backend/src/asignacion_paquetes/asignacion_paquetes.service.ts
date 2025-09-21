import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AsignacionPaquetes } from './entities/asignacio_paquetes.entity';

@Injectable()
export class AsignacionPaquetesService {
  constructor(
    @InjectRepository(AsignacionPaquetes)
    private readonly asignacionRepo: Repository<AsignacionPaquetes>,
  ) {}


  findOne(id: string) {
    return this.asignacionRepo.findOne({
      where: { id },
      relations: ['idPaquete', 'idTransporte', 'idRuta'],
    });
  }

  create(data: Partial<AsignacionPaquetes>) {
    const nuevaAsignacion = this.asignacionRepo.create(data);
    return this.asignacionRepo.save(nuevaAsignacion);
  }

  async update(id: string, data: Partial<AsignacionPaquetes>) {
    await this.asignacionRepo.update(id, data);
    return this.findOne(id);
  }

  remove(id: string) {
    return this.asignacionRepo.delete(id);
  }
}
