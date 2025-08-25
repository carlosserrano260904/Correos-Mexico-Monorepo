import { Controller, Get, Post, Body, Param, Put, Patch } from '@nestjs/common';
import { OficinasService } from './oficinas.service';
import { CreateOficinaDto } from './dto/create-oficina.dto';
import { UpdateOficinaDto } from './dto/update-oficina.dto';
import { AgregarClaveZonaDto } from './dto/agregar-clave-zona.dto';
import { EliminarClaveZonaDto } from './dto/eliminar-clave-zona.dto';

@Controller('oficinas')
export class OficinasController {
  constructor(private readonly oficinasService: OficinasService) {}

  @Post()
  create(@Body() dto: CreateOficinaDto) {
    return this.oficinasService.create(dto);
  }

  @Get('activas')
  find() {
    return this.oficinasService.active();
  }

  @Get('inactivas')
  inactive() {
    return this.oficinasService.inactive();
  }

  @Get('clave/:clave_oficina_postal')
  findClave(@Param('clave_oficina_postal') clave: string) {
    return this.oficinasService.findClave(clave);
  }

  @Get()
  findAll() {
    return this.oficinasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.oficinasService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateOficinaDto) {
    return this.oficinasService.update(+id, dto);
  }

  @Patch(':id/desactivar')
  deactivate(@Param('id') id: number) {
    return this.oficinasService.deactivate(id);
  }

  @Patch(':id/activar')
  activate(@Param('id') id: number) {
    return this.oficinasService.activate(id);
  }

  @Patch(':cuo/agregar-clave-zona')
  agregarClaveZona(@Param('cuo') cuo: string, @Body() dto: AgregarClaveZonaDto) {
    return this.oficinasService.agregarClaveZona(cuo, dto);
  }

  @Patch(':cuo/eliminar-clave-zona')
  eliminarClaveZona(@Param('cuo') cuo: string, @Body() dto: EliminarClaveZonaDto) {
    return this.oficinasService.eliminarClaveZona(cuo, dto);
  }
}