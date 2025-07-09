import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  UseInterceptors,
  ClassSerializerInterceptor,
  ParseIntPipe,
  Put
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { UnidadesService } from './unidades.service';
import { CreateUnidadDto } from './dto/create-unidad.dto';
import { AssignConductorDto } from './dto/assign-conductor.dto';
import { UnidadResponseDto } from './dto/unidad-response.dto';
import { OficinaTipoVehiculoDto } from './dto/oficina-tipo-vehiculo.dto';
import { AssignZonaDto } from './dto/assign-zona.dto';

@ApiTags('Unidades')
@Controller('unidades')
@UseInterceptors(ClassSerializerInterceptor)
export class UnidadesController {
  constructor(private readonly unidadesService: UnidadesService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todas las unidades' })
  @ApiResponse({ status: 200, type: [UnidadResponseDto] })
  async findAll(): Promise<UnidadResponseDto[]> {
    return this.unidadesService.findAll();
  }

  @Get('oficina/:clave')
  @ApiOperation({ summary: 'Unidades disponibles por oficina' })
  @ApiResponse({ status: 200, type: [UnidadResponseDto] })
  async findByOficina(
    @Param('clave', ParseIntPipe) clave: number,
  ): Promise<Omit<UnidadResponseDto, 'claveOficina' | 'estado'>[]> {
    return this.unidadesService.findByOficina(clave);
  }

  @Post()
  @ApiOperation({ summary: 'Crear nueva unidad' })
  @ApiResponse({ status: 201, type: UnidadResponseDto })
  async create(@Body() dto: CreateUnidadDto): Promise<UnidadResponseDto> {
    return this.unidadesService.create(dto);
  }

  @Patch(':placas/asignar')
  @ApiOperation({ summary: 'Asignar/desasignar conductor' })
  @ApiResponse({ status: 200, type: UnidadResponseDto })
  async assignConductor(
    @Param('placas') placas: string,
    @Body() dto: AssignConductorDto,
  ): Promise<UnidadResponseDto> {
    return this.unidadesService.assignConductor(placas, dto);
  }

  @Get('tipos-vehiculo/:clave')
  @ApiOperation({ summary: 'Tipos de vehículo permitidos por oficina' })
  @ApiResponse({ status: 200, type: OficinaTipoVehiculoDto })
  async getTiposVehiculo(
    @Param('clave', ParseIntPipe) clave: number,
  ): Promise<OficinaTipoVehiculoDto> {
    return this.unidadesService.getTiposVehiculoPorOficina(clave);
  }
  @Put(':placas/asignar-zona')
  @ApiOperation({ summary: 'Asignar zona por código postal' })
  @ApiResponse({ status: 200, type: UnidadResponseDto })
  async assignZona(
    @Param('placas') placas: string,
    @Body() dto: AssignZonaDto,
  ): Promise<UnidadResponseDto> {
    return this.unidadesService.assignZona(placas, dto);
  }
}
