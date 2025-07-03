import { Controller, Get, Query } from '@nestjs/common';
import { HistorialAsignacionesService } from './historial-asignaciones.service';
import { HistorialAsignacion } from './entities/historial-asignacion.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Historial de Asignaciones')
@Controller('historial-asignaciones')
export class HistorialAsignacionesController {
  constructor(private readonly historialService: HistorialAsignacionesService) {}

  @Get()
  async getHistorial(
    @Query('placas') placas?: string,
    @Query('curp') curp?: string,
  ): Promise<HistorialAsignacion[]> {
    return this.historialService.getHistorial(placas, curp);
  }
}