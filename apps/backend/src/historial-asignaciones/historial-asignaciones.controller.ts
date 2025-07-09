import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { HistorialAsignacionesService } from './historial-asignaciones.service';
import { HistorialAsignacion } from './entities/historial-asignacion.entity';

@ApiTags('Historial de Asignaciones')
@Controller('historial-asignaciones')
export class HistorialAsignacionesController {
  constructor(private readonly historialService: HistorialAsignacionesService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener historial de asignaciones' })
  @ApiQuery({
    name: 'placas',
    required: false,
    description: 'Filtrar por placas de la unidad',
    example: 'ABC1234',
  })
  @ApiQuery({
    name: 'curp',
    required: false,
    description: 'Filtrar por CURP del conductor',
    example: 'GARC850101HDFLLL05',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de registros de asignación',
    type: [HistorialAsignacion],
  })
  async getHistorial(
    @Query('placas') placas?: string,
    @Query('curp') curp?: string,
  ): Promise<HistorialAsignacion[]> {
    return this.historialService.getHistorial(placas, curp);
  }
}
