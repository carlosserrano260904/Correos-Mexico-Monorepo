import { Controller, Get, Post,  Patch, Body, Param, Delete, Put, NotFoundException, BadRequestException, UploadedFile, UseInterceptors } from '@nestjs/common';
import { PaquetesService } from './paquetes.service';
import { Paquete } from './entities/paquete.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadImageService } from '../upload-image/upload-image.service';

@Controller('paquetes')
export class PaquetesController {
  constructor(
    private readonly paquetesService: PaquetesService,
    private readonly uploadService: UploadImageService
  ) {}

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

  @Patch(':id/evidencia')
  @UseInterceptors(FileInterceptor('file'))
  async anadirEvidencia(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File
  ) {
    if (!file) {
      throw new BadRequestException('No se subió ningún archivo.');
    }

    const url = await this.uploadService.uploadFile(file);
    const actualizar = await this.paquetesService.anadirEvidencia(id, url);

    if (!actualizar) {
      throw new NotFoundException(`No se encontró el paquete con ID ${id}`);
    }

    return {
      mensaje: 'Evidencia actualizada correctamente',
      paquete: actualizar,
    };
  }


  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paquetesService.remove(id);
  }
}
