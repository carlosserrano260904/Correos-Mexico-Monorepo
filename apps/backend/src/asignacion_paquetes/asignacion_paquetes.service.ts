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

  findAll() {
    return this.asignacionRepo.find({ relations: ['idPaquete', 'idTransporte', 'idRuta'] });
  }

  findOne(id: string) {
    return this.asignacionRepo.findOne({
      where: { id },
      relations: ['idPaquete', 'idTransporte', 'idRuta'],
    });
  }

  async findPaquetesByTransporteAndRuta(idTransporte: string, idRuta: string) {
  const asignaciones = await this.asignacionRepo.find({
    where: {
      idTransporte: { id: idTransporte },
      idRuta: { id: idRuta },
    },
    relations: ['idPaquete'],
  });

  // Extrae solo los datos del paquete
  return asignaciones
    .filter(a => a.idPaquete) // asegurarse que existe el paquete
    .map(a => a.idPaquete);
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
