import { Controller, Get, Post,  Patch, Body, Param, Delete, Put, NotFoundException, BadRequestException, } from '@nestjs/common';
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

  @Patch(':id/estatus')
  async actualizarEstatus(
    @Param('id') id: string,
    @Body('estatus') estatus: string,
  ) {
    if (!estatus) {
      throw new BadRequestException('El estatus es obligatorio.');
    }

    const actualizado = await this.paquetesService.actualizarEstatus(id, estatus);
    if (!actualizado) {
      throw new NotFoundException(`No se encontró el paquete con ID ${id}`);
    }

    return {
      mensaje: 'Estatus actualizado correctamente',
      paquete: actualizado,
    };
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paquetesService.remove(id);
  }
}
