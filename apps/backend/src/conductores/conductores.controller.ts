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
import { UpdateLicenciaVigenteDto } from './dto/update-licencia-vigente.dto';

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

  @Patch(':CURP/disponibilidad')
  async updateDisponibilidad(
    @Param('CURP') curp: string,
    @Body() updateDisponibilidadDto: UpdateDisponibilidadDto,
  ) {
    return this.conductoresService.updateDisponibilidad(curp, updateDisponibilidadDto);
  }
  @Patch(':CURP/licencia-vigente')
  async updateLicenciaVigente(
    @Param('CURP') curp: string,
    @Body() dto: UpdateLicenciaVigenteDto,
  ) {
    return this.conductoresService.updateLicenciaVigente(curp, dto);
  }
}