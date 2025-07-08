import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { HistorialAsignacion } from './entities/historial-asignacion.entity';

@Injectable()
export class HistorialAsignacionesService {
  constructor(
    @InjectRepository(HistorialAsignacion)
    private historialRepository: Repository<HistorialAsignacion>,
  ) {}

  async registrarAsignacion(
    nombreConductor: string,
    curp: string,
    placasUnidad: string,
  ): Promise<HistorialAsignacion> {
    const nuevaAsignacion = this.historialRepository.create({
      // Use the correct property names as defined in your entity
      // If 'nombreConductor' exists in the entity, keep it; otherwise, remove or rename as needed
      nombreConductor,
      curp: curp.toUpperCase(), // Asegurar mayúsculas
      placasUnidad,
    });
    return this.historialRepository.save(nuevaAsignacion);
  }

  async finalizarAsignacion(
    curp: string,
    placasUnidad: string,
  ): Promise<void> {
    await this.historialRepository.update(
      { curp: curp.toUpperCase(), placasUnidad, fechaFinalizacion: IsNull() },
      { fechaFinalizacion: new Date() },
    );
  }
  async getHistorial(
  placas?: string,
  curp?: string,
): Promise<HistorialAsignacion[]> {
    const where: any = {};
    if (placas) where.placasUnidad = placas;
    if (curp) where.curp = curp.toUpperCase();

    return this.historialRepository.find({
        where,
        order: { fechaAsignacion: 'DESC' },
    });
}
}