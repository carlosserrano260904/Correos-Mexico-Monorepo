import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { AsignacionPaquetesService } from './asignacion_paquetes.service';
import { AsignacionPaquetes } from './entities/asignacio_paquetes.entity';

@ApiTags('asignacion-paquetes')
@Controller('asignacion-paquetes')
export class AsignacionPaquetesController {
  constructor(private readonly asignacionService: AsignacionPaquetesService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todas las asignaciones de paquetes' })
  @ApiResponse({ status: 200, description: 'Lista de asignaciones', type: [AsignacionPaquetes] })
  findAll(): Promise<AsignacionPaquetes[]> {
    return this.asignacionService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una asignación por ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'ID de la asignación' })
  @ApiResponse({ status: 200, description: 'Asignación encontrada', type: AsignacionPaquetes })
  @ApiResponse({ status: 404, description: 'Asignación no encontrada' })
  findOne(@Param('id') id: string): Promise<AsignacionPaquetes | null> {
    return this.asignacionService.findOne(id);
  }

  @Get('paquetes/:idTransporte/:idRuta')
  @ApiOperation({ summary: 'Obtener paquetes por transporte y ruta' })
  @ApiParam({ name: 'idTransporte', type: 'string', description: 'ID del transporte' })
  @ApiParam({ name: 'idRuta', type: 'string', description: 'ID de la ruta' })
  @ApiResponse({ status: 200, description: 'Lista de paquetes filtrados', type: [Object] })
  getPaquetesByTransporteAndRuta(
    @Param('idTransporte') idTransporte: string,
    @Param('idRuta') idRuta: string,
  ): Promise<any[]> {
    return this.asignacionService.findPaquetesByTransporteAndRuta(idTransporte, idRuta);
  }

  @Post()
  @ApiOperation({ summary: 'Crear una nueva asignación de paquete' })
  @ApiBody({ type: AsignacionPaquetes })
  @ApiResponse({ status: 201, description: 'Asignación creada', type: AsignacionPaquetes })
  create(@Body() data: Partial<AsignacionPaquetes>): Promise<AsignacionPaquetes> {
    return this.asignacionService.create(data);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar una asignación de paquete' })
  @ApiParam({ name: 'id', type: 'string', description: 'ID de la asignación a actualizar' })
  @ApiBody({ type: AsignacionPaquetes })
  @ApiResponse({ status: 200, description: 'Asignación actualizada', type: AsignacionPaquetes })
  @ApiResponse({ status: 404, description: 'Asignación no encontrada' })
  update(
    @Param('id') id: string,
    @Body() data: Partial<AsignacionPaquetes>,
  ): Promise<AsignacionPaquetes | null> {
    return this.asignacionService.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una asignación de paquete' })
  @ApiParam({ name: 'id', type: 'string', description: 'ID de la asignación a eliminar' })
  @ApiResponse({ status: 204, description: 'Asignación eliminada' })
  remove(@Param('id') id: string) {
    return this.asignacionService.remove(id);
  }
}
