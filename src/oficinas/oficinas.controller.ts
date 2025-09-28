import { Controller, Get, Post, Body, Param, Put, Patch } from '@nestjs/common';
import { OficinasService } from './oficinas.service';
import { CreateOficinaDto } from './dto/create-oficina.dto';
import { UpdateOficinaDto } from './dto/update-oficina.dto';
import { AgregarClaveZonaDto } from './dto/agregar-clave-zona.dto';
import { EliminarClaveZonaDto } from './dto/eliminar-clave-zona.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Oficina } from './entities/oficina.entity';

@ApiTags('oficinas')
@Controller('oficinas')
export class OficinasController {
  constructor(private readonly oficinasService: OficinasService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva oficina' })
  @ApiResponse({ status: 201, description: 'Oficina creada', type: Oficina })
  create(@Body() dto: CreateOficinaDto) {
    return this.oficinasService.create(dto);
  }

  @Get('activas')
  @ApiOperation({ summary: 'Obtener todas las oficinas activas' })
  @ApiResponse({ status: 200, description: 'Lista de oficinas activas', type: [Oficina] })
  find() {
    return this.oficinasService.active();
  }

  @Get('inactivas')
  @ApiOperation({ summary: 'Obtener todas las oficinas inactivas' })
  @ApiResponse({ status: 200, description: 'Lista de oficinas inactivas', type: [Oficina] })
  inactive() {
    return this.oficinasService.inactive();
  }

  @Get('clave/:clave_oficina_postal')
  @ApiOperation({ summary: 'Buscar oficina por clave postal' })
  @ApiResponse({ status: 200, description: 'Oficina encontrada', type: Oficina })
  findClave(@Param('clave_oficina_postal') clave: string) {
    return this.oficinasService.findClave(clave);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las oficinas' })
  @ApiResponse({ status: 200, description: 'Lista completa de oficinas', type: [Oficina] })
  findAll() {
    return this.oficinasService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener oficina por ID' })
  @ApiResponse({ status: 200, description: 'Oficina encontrada', type: Oficina })
  @ApiResponse({ status: 404, description: 'Oficina no encontrada' })
  findOne(@Param('id') id: string) {
    return this.oficinasService.findOne(+id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar oficina por ID' })
  @ApiResponse({ status: 200, description: 'Oficina actualizada', type: Oficina })
  @ApiResponse({ status: 404, description: 'Oficina no encontrada' })
  update(@Param('id') id: string, @Body() dto: UpdateOficinaDto) {
    return this.oficinasService.update(+id, dto);
  }

  @Patch(':id/desactivar')
  @ApiOperation({ summary: 'Desactivar oficina por ID' })
  @ApiResponse({ status: 200, description: 'Oficina desactivada correctamente' })
  @ApiResponse({ status: 404, description: 'Oficina no encontrada' })
  deactivate(@Param('id') id: number) {
    return this.oficinasService.deactivate(id);
  }

  @Patch(':id/activar')
  @ApiOperation({ summary: 'Activar oficina por ID' })
  @ApiResponse({ status: 200, description: 'Oficina activada correctamente' })
  @ApiResponse({ status: 404, description: 'Oficina no encontrada' })
  activate(@Param('id') id: number) {
    return this.oficinasService.activate(id);
  }

  @Patch(':cuo/agregar-clave-zona')
  @ApiOperation({ summary: 'Agregar clave de zona a una oficina' })
  @ApiResponse({ status: 200, description: 'Clave de zona agregada correctamente', type: Oficina })
  @ApiResponse({ status: 404, description: 'Oficina no encontrada' })
  agregarClaveZona(@Param('cuo') cuo: string, @Body() dto: AgregarClaveZonaDto) {
    return this.oficinasService.agregarClaveZona(cuo, dto);
  }

  @Patch(':cuo/eliminar-clave-zona')
  @ApiOperation({ summary: 'Eliminar clave de zona de una oficina' })
  @ApiResponse({ status: 200, description: 'Clave de zona eliminada correctamente', type: Oficina })
  @ApiResponse({ status: 404, description: 'Oficina no encontrada' })
  eliminarClaveZona(@Param('cuo') cuo: string, @Body() dto: EliminarClaveZonaDto) {
    return this.oficinasService.eliminarClaveZona(cuo, dto);
  }
}
