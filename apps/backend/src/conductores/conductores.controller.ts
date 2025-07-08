import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import { ConductoresService } from './conductores.service';
import { ConductorResponseDto } from './dto/conductor-response.dto';
import { CreateConductorDto } from './dto/create-conductor.dto';
import { UpdateDisponibilidadDto } from './dto/update-disponibilidad.dto';

@Controller('conductores')
export class ConductoresController {
  constructor(private readonly conductoresService: ConductoresService) {}

  @Get('disponibles')
  async getDisponibles(): Promise<ConductorResponseDto[]> {
    return this.conductoresService.findAllDisponibles();
  }

  @Get('sucursal/:clave')
  async getBySucursal(@Param('clave') clave: string) {
    return this.conductoresService.findBySucursal(clave);
  }

  @Post()
  async create(@Body() createConductorDto: CreateConductorDto) {
    return this.conductoresService.create(createConductorDto);
  }

  @Patch(':id/disponibilidad')
  async updateDisponibilidad(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDisponibilidadDto: UpdateDisponibilidadDto,
  ) {
    return this.conductoresService.updateDisponibilidad(id, updateDisponibilidadDto);
  }
}