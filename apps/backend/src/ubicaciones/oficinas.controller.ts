import { Controller, Get } from '@nestjs/common';
import { OficinasService } from './oficinas.service';
import { Oficina } from '../oficinas/entities/oficina.entity';

@Controller('oficinas')
export class OficinasController {
  constructor(private readonly oficinasService: OficinasService) {}

  @Get()
  findAll(): Promise<Oficina[]> {
    return this.oficinasService.findAll();
  }
}
