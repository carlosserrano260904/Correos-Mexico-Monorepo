import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { EnviosService } from './envios.service';
import { Envio } from './entities/envios.entity';
import { CrearEnvioDto } from './dto/CrearEnvioDto.dto';
import { Contacto } from '../contactos/entities/contacto.entity';

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

  @Get('unidad/:id/fecha/:fecha')
  @ApiOperation({
    summary:
      'Obtener la cantidad de envíos y el nombre del vehículo para una unidad y fecha específica (YYYY-MM-DD)',
  })
  @ApiParam({ name: 'id', description: 'ID de la unidad (vehículo)', type: String })
  @ApiParam({ name: 'fecha', description: 'Fecha de asignación (formato YYYY-MM-DD)', type: String, example: '2023-10-28' })
  @ApiResponse({
    status: 200,
    description: 'Cantidad de envíos y nombre del vehículo.',
    schema: {
      type: 'object',
      properties: {
        count: { type: 'number', example: 15 },
        vehicleName: { type: 'string', example: 'Camioneta Nissan 05' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Formato de fecha inválido.' })
  @ApiResponse({ status: 404, description: 'No se encontraron envíos para esta unidad y fecha' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  findByUnidadAndFecha(
    @Param('id') id: string,
    @Param('fecha') fecha: string,
  ): Promise<{ count: number; vehicleName: string | null }> {
    return this.enviosService.findByUnidadAndFecha(id, fecha);
  }

  @Get('unidad/:id/fecha/:fecha/all')
  @ApiOperation({
    summary:
      'Obtener todos los detalles de los envíos para una unidad y fecha específica (YYYY-MM-DD)',
  })
  @ApiParam({ name: 'id', description: 'ID de la unidad (vehículo)', type: String })
  @ApiParam({
    name: 'fecha',
    description: 'Fecha de asignación (formato YYYY-MM-DD)',
    type: String,
    example: '2023-10-28',
  })
  @ApiResponse({ status: 200, description: 'Lista detallada de envíos por unidad y fecha.', type: [Envio] })
  @ApiResponse({ status: 400, description: 'Formato de fecha inválido.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  findAllByUnidadAndFecha(
    @Param('id') id: string,
    @Param('fecha') fecha: string,
  ): Promise<Envio[]> {
    return this.enviosService.findAllByUnidadAndFecha(id, fecha);
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

  @Get('contactos/:id')
  @ApiOperation({ summary: 'Obtener datos de un contacto por su ID' })
  @ApiParam({ name: 'id', description: 'ID del contacto (destinatario)', type: String })
  @ApiResponse({ status: 200, description: 'Datos del contacto', type: Contacto })
  @ApiResponse({ status: 404, description: 'Contacto no encontrado' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  findContacto(@Param('id') id: string): Promise<Contacto> {
    return this.enviosService.findContacto(id);
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
