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
    oficinaSalida: string,  // Nueva: clave de oficina de salida
    oficinaDestino: string  // Nueva: zona asignada (destino)
  ): Promise<HistorialAsignacion> {
    const nuevaAsignacion = this.historialRepository.create({
      nombreConductor,
      curp: curp.toUpperCase(),
      placasUnidad,
      rutaSalida: oficinaSalida,  // Asignar oficina de salida
      claveOficinaDestino: oficinaDestino // Asignar CUO de destino
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