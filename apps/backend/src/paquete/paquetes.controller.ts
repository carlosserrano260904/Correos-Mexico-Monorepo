import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { PaquetesService } from './paquetes.service';
import { Paquete } from './entities/paquete.entity';

@Controller('paquetes')
export class PaquetesController {
  constructor(private readonly paquetesService: PaquetesService) {}

  @Get()
  findAll(): Promise<Paquete[]> {
    return this.paquetesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Paquete> {
    return this.paquetesService.findOne(id);
  }

  @Post()
  create(@Body() data: Partial<Paquete>): Promise<Paquete> {
    return this.paquetesService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: Partial<Paquete>): Promise<Paquete> {
    return this.paquetesService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paquetesService.remove(id);
  }
}
