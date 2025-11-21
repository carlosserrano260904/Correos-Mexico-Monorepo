import { Controller, Get, Param, Post, Body, Patch, BadRequestException, NotFoundException, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBadRequestResponse, ApiNotFoundResponse, ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { EnviosService } from './envios.service';
import { Envio, EstadoEnvio } from './entities/envios.entity';
import { CreateEnvioDto } from './dto/CrearEnvioDto.dto';
import { FalloEnvioDto } from './dto/FalloEnvio.dto';
import { UploadImageService } from '../upload-image/upload-image.service';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Envios')
@Controller('envios')
export class EnviosController {
  constructor(
              private readonly enviosService: EnviosService,
              private readonly uploadImageService: UploadImageService
            ) {}

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

  @Patch(':id/estatus')
  @ApiOperation({ summary: 'Actualizar estatus del envío' })
  @ApiParam({ name: 'id', type: String, description: 'ID del envío' })
  @ApiParam({ name: 'nuevoEstado', type: String, description: 'Nuevo estatus (pendiente, en_ruta, entregado, fallido)' })
  @ApiParam({ name: 'nombreReceptor', type: String, description: 'Es el nombre de quien lo recibio'})
  @ApiOkResponse({ description: 'Estatus actualizado correctamente' })
  @ApiNotFoundResponse({ description: 'Envío no encontrado' })
  @ApiBadRequestResponse({ description: 'Estado inválido' })
  async actualizarEstado(
    @Param('id') id: string,
    @Body() body: { estado: string, nombre_receptor: string }
  ) {
    const { estado, nombre_receptor } = body;

    if (!estado) {
      throw new BadRequestException('El estado es obligatorio.');
    }

    if (!nombre_receptor) {
      throw new BadRequestException('El receptor es obligatorio.');
    }

    const actualizado = await this.enviosService.actualizarEstatus(id, estado, nombre_receptor);

    if (!actualizado) {
      throw new NotFoundException(`No se encontró el envío con ID ${id}`);
    }

    return {
      mensaje: 'Estado actualizado correctamente',
      envio: actualizado,
    };
  }

  @Patch(':id/evidencia')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Subir evidencia fotográfica para un envío' })
  @ApiParam({ name: 'id', type: String, description: 'ID del envío' })
  @ApiOkResponse({ description: 'Evidencia actualizada correctamente' })
  @ApiBadRequestResponse({ description: 'No se subió ningún archivo' })
  @ApiNotFoundResponse({ description: 'Envío no encontrado' })
  async anadirEvidencia(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File
  ) {
    if (!file) {
      throw new BadRequestException('No se subió ningún archivo.');
    }

    // 1. Subir archivo y obtener url
    const url = await this.uploadImageService.uploadEvidenceDistributor(file);

    // 3. Guardar url en la entidad
    const actualizado = await this.enviosService.anadirEvidencia(id, url);

    if (!actualizado) {
      throw new NotFoundException(`No se encontró el envío con ID ${id}`);
    }

    return {
      mensaje: 'Evidencia actualizada correctamente',
      envio: actualizado,
    };
  }
}
