import { Controller, Get, Query, Patch, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { HistorialAsignacionesService } from './historial-asignaciones.service';
import { HistorialAsignacion } from './entities/historial-asignacion.entity';
import { LlegadaDestinoDto } from './dto/llegada-destino.dto';
import { RetornoOrigenDto } from './dto/retorno-origen.dto';

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
  
  @Patch('llegada-destino')
  @ApiOperation({ summary: 'Registrar llegada a destino' })
  @ApiResponse({ status: 200, type: HistorialAsignacion })
  async registrarLlegada(
    @Body() dto: LlegadaDestinoDto // Usa el DTO en lugar del objeto genérico
  ) {
    return this.historialService.registrarLlegadaDestino(
      dto.curp,
      dto.placas,
      dto.oficinaActual
    );
  }

  @Patch('retorno-origen')
  @ApiOperation({ summary: 'Registrar retorno a oficina de origen' })
  @ApiResponse({ status: 200, type: HistorialAsignacion })
  async registrarRetorno(
    @Body() dto: RetornoOrigenDto // Usa el DTO en lugar del objeto genérico
  ) {
    return this.historialService.registrarRetornoOrigen(
      dto.curp,
      dto.placas
    );
  }
}

