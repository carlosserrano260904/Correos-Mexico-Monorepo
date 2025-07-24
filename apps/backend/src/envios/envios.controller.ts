import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { EnviosService } from './envios.service';
import { Envio } from './entities/envios.entity';
import { CrearEnvioDto } from './dto/CrearEnvioDto.dto';

@ApiTags('Envios')
@Controller('envios')
export class EnviosController {
  constructor(private readonly enviosService: EnviosService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todos los registros de envíos' })
  @ApiResponse({ status: 200, description: 'Lista de envíos obtenida exitosamente', type: [Envio] })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  findAll(): Promise<Envio[]> {
    return this.enviosService.findAll();
  }

  @Get('unidad/:id')
  @ApiOperation({ summary: 'Obtener envíos asignados a una unidad (vehículo)' })
  @ApiParam({ name: 'id', description: 'ID del vehículo', type: String })
  @ApiResponse({ status: 200, description: 'Lista de envíos por unidad', type: [Envio] })
  @ApiResponse({ status: 404, description: 'No se encontraron envíos para esta unidad' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  findByUnidad(@Param('id') id: string): Promise<Envio[]> {
    return this.enviosService.findByUnidad(id);
  }

  @Get('guia/:id')
  @ApiOperation({ summary: 'Obtener historial de envíos para una guía específica' })
  @ApiParam({ name: 'id', description: 'ID de la guía', type: String })
  @ApiResponse({ status: 200, description: 'Historial de envíos por guía', type: [Envio] })
  @ApiResponse({ status: 404, description: 'No se encontró ningún envío para esta guía' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  findByGuia(@Param('id') id: string): Promise<Envio[]> {
    return this.enviosService.findByGuia(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo registro de envío' })
  @ApiBody({ type: CrearEnvioDto })
  @ApiResponse({ status: 201, description: 'Registro de envío creado exitosamente', type: Envio })
  @ApiResponse({ status: 400, description: 'Datos inválidos en el cuerpo de la solicitud' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  create(@Body() envio: Partial<Envio>): Promise<Envio> {
    return this.enviosService.create(envio);
  }
}
