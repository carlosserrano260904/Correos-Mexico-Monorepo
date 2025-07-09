import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { RutaService } from './ruta.service';
import { Ruta } from './entities/ruta.entity';

@Controller('rutas')
export class RutaController {
  constructor(private readonly rutaService: RutaService) {}

  @Get()
  findAll(): Promise<Ruta[]> {
    return this.rutaService.findAll();
  }

@Get(':id')
findOne(@Param('id') id: string): Promise<Ruta> {
  return this.rutaService.findOne(id);
}

  @Post()
  create(@Body() data: Partial<Ruta>): Promise<Ruta> {
    return this.rutaService.create(data);
  }

@Put(':id')
update(
  @Param('id') id: string,
  @Body() data: Partial<Ruta>,
): Promise<Ruta> {
  return this.rutaService.update(id, data);
}

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rutaService.remove(id);
  }
}
