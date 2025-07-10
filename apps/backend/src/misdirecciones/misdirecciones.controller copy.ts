import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MisdireccionesService } from './misdirecciones.service';
import { CreateMisdireccioneDto } from './dto/create-misdireccione.dto';
import { UpdateMisdireccioneDto } from './dto/update-misdireccione.dto';

@Controller('misdirecciones')
export class MisdireccionesController {
  constructor(private readonly misdireccionesService: MisdireccionesService) {}

  @Post()
  create(@Body() createMisdireccioneDto: CreateMisdireccioneDto) {
    return this.misdireccionesService.create(createMisdireccioneDto);
  }
  

  @Get()
  findAll() {
    return this.misdireccionesService.findAll();
  }
  @Get('usuario/:usuarioId')
   async findByUsuario(@Param('usuarioId') usuarioId: number) {
  return this.misdireccionesService.obtenerPorUsuario(usuarioId);
}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.misdireccionesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMisdireccioneDto: UpdateMisdireccioneDto) {
    return this.misdireccionesService.update(+id, updateMisdireccioneDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.misdireccionesService.remove(+id);
  }
}
