import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  UseInterceptors,
  ClassSerializerInterceptor,
  Put,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

import { UnidadesService } from './unidades.service';
import { CreateUnidadDto } from './dto/create-unidad.dto';
import { AssignConductorDto } from './dto/assign-conductor.dto';
import { UnidadResponseDto } from './dto/unidad-response.dto';
import { OficinaTipoVehiculoDto } from './dto/oficina-tipo-vehiculo.dto';
import { AssignZonaDto } from './dto/assign-zona.dto';
import { Unidad } from './entities/unidad.entity';

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
    @Param('clave') clave: string, 
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
  @ApiOperation({ summary: 'Asignar o desasignar conductor' })
  @ApiResponse({ status: 200, type: UnidadResponseDto })
  async assignConductor(
    @Param('placas') placas: string,
    @Body() dto: AssignConductorDto,
  ): Promise<UnidadResponseDto> {
    return this.unidadesService.assignConductor(placas, dto);
  }

  @Put(':placas/asignar-zona')
  @ApiOperation({ summary: 'Asignar zona (clave CUO de destino)' })
  async assignZona(
    @Param('placas') placas: string,
    @Body() dto: AssignZonaDto,
  ): Promise<UnidadResponseDto> {
    return this.unidadesService.assignZona(placas, dto);
  }

  @Get('tipos-vehiculo/:clave')
  @ApiOperation({ summary: 'Consultar tipos de vehículo permitidos en oficina' })
  @ApiResponse({ status: 200, type: OficinaTipoVehiculoDto })
  async getTiposVehiculo(
    @Param('clave') clave: string,
  ): Promise<OficinaTipoVehiculoDto> {
    return this.unidadesService.getTiposVehiculoPorOficina(clave);
  }

  @Get('qrs/all')
  @ApiOperation({ summary: 'Generar QR de todas las unidades (base64 y archivo)' })
  @ApiResponse({
    status: 200,
    description: 'Lista de objetos con id, base64 del QR y ruta del archivo PNG',
  })
  generarQrs() {
    return this.unidadesService.generarQRsDeUnidades();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una unidad por ID' })
  @ApiParam({ name: 'id', description: 'ID de la unidad' })
  @ApiResponse({ status: 200, description: 'Unidad encontrada', type: Unidad })
  @ApiResponse({ status: 404, description: 'Unidad no encontrada' })
  findOne(@Param('id') id: string) {
    return this.unidadesService.findOne(id);
  }
}
