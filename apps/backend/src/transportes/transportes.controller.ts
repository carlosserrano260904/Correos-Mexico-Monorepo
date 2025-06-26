import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { TransportesService } from './transportes.service';
import { Transporte } from './entities/transporte.entity';

@Controller('transportes')
export class TransportesController {
  constructor(private readonly transportesService: TransportesService) {}

  @Get()
  findAll(): Promise<Transporte[]> {
    return this.transportesService.findAll();
  }

@Get(':id')
findOne(@Param('id') id: string): Promise<Transporte | null> {
  return this.transportesService.findOne(id);
}

  @Post()
  create(@Body() data: Partial<Transporte>): Promise<Transporte> {
    return this.transportesService.create(data);
  }

@Put(':id')
update(
  @Param('id') id: string,
  @Body() data: Partial<Transporte>,
): Promise<Transporte | null> {
  return this.transportesService.update(id, data);
}

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.transportesService.remove(id);
  }
}
