import { Controller, Get, Post, Body, Param, Put, Patch } from '@nestjs/common';
import { OficinasService } from './oficinas.service';
import { CreateOficinaDto } from './dto/create-oficina.dto';
import { UpdateOficinaDto } from './dto/update-oficina.dto';

@Controller('oficinas')
export class OficinasController {
  constructor(private readonly oficinasService: OficinasService) {}

  @Post()
  create(@Body() dto: CreateOficinaDto) {
    return this.oficinasService.create(dto);
  }

  @Get('activos')
  find() {
    return this.oficinasService.find();
  }

  @Get('clave/:clave_oficina_postal')
  findClave(@Param('clave_oficina_postal') clave: number) {
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

  @Patch(':id/deactivate')
  deactivate(@Param('id') id: number) {
    return this.oficinasService.deactivate(id);
  }

  @Patch(':id/activate')
  activate(@Param('id') id: number) {
    return this.oficinasService.activate(id);
  }
}