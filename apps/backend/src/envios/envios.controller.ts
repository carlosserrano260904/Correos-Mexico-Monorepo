import { Controller, Get, Param, Post, Body, Patch } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBadRequestResponse, ApiNotFoundResponse, ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { EnviosService } from './envios.service';
import { Envio } from './entities/envios.entity';
import { CreateEnvioDto } from './dto/CrearEnvioDto.dto';
import { FalloEnvioDto } from './dto/FalloEnvio.dto';

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

  @Get('unidad/:id/hoy')
  @ApiOperation({ summary: 'Obtener los envíos del día para una unidad con detalles de contacto' })
  @ApiParam({ name: 'id', description: 'ID de la unidad (vehículo)', type: String })
  @ApiResponse({ status: 200, description: 'Lista de envíos del día para la unidad con detalles de contacto.' })
  @ApiResponse({ status: 404, description: 'No se encontraron envíos para esta unidad en el día de hoy' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  findEnviosDeHoyPorUnidad(@Param('id') id: string): Promise<any[]> {
    return this.enviosService.findEnviosDeHoyPorUnidad(id);
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
  @ApiCreatedResponse({ description: 'El envío fue creado correctamente.', type: Envio })
  @ApiBadRequestResponse({ description: 'Datos inválidos' })
  @ApiNotFoundResponse({ description: 'Guía o unidad no encontrada' })
  async create(@Body() dto: CreateEnvioDto): Promise<Envio> {
    return this.enviosService.create(dto);
  }

  @Patch('iniciar-ruta/hoy/unidad/:id')
  @ApiOperation({ summary: 'Actualiza el estado de los envíos del día de hoy de "pendiente" a "en_ruta" para una unidad específica.' })
  @ApiParam({ name: 'id', description: 'ID de la unidad (vehículo)', type: String })
  @ApiOkResponse({ description: 'Envíos actualizados a "en_ruta" correctamente.', schema: { example: { updated: 5 } } })
  @ApiNotFoundResponse({ description: 'No se encontraron envíos pendientes para la unidad y el día de hoy.' })
  @ApiBadRequestResponse({ description: 'ID de unidad inválido.' })
  async iniciarRuta(
    @Param('id') unidadId: string,
  ): Promise<{ updated: number }> {
    return this.enviosService.iniciarRuta(unidadId);
  }

  @Patch(':id/fallido')
  @ApiOperation({ summary: 'Marcar un envío como fallido' })
  @ApiParam({ name: 'id', description: 'ID del envío a marcar como fallido', type: String })
  @ApiOkResponse({ description: 'El envío ha sido marcado como fallido.', type: Envio })
  @ApiNotFoundResponse({ description: 'Envío no encontrado.' })
  @ApiBadRequestResponse({ description: 'Datos inválidos.' })
  marcarComoFallido(
    @Param('id') id: string,
    @Body() falloEnvioDto: FalloEnvioDto,
  ): Promise<Envio> {
    return this.enviosService.marcarComoFallido(id, falloEnvioDto.motivo_fallido);
  }
}
