import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Patch,
  Delete,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { ConductoresService } from './conductores.service';
import { ConductorResponseDto } from './dto/conductor-response.dto';
import { CreateConductorDto } from './dto/create-conductor.dto';
import { UpdateDisponibilidadDto } from './dto/update-disponibilidad.dto';
import { UpdateLicenciaVigenteDto } from './dto/update-licencia-vigente.dto';

@Controller('conductores')
export class ConductoresController {
  constructor(private readonly conductoresService: ConductoresService) {}

  @Get()
  @ApiOperation({
    summary: 'Obtener todos los conductores',
    description:
      'Retorna una lista completa de todos los conductores con su información, incluyendo disponibilidad y estado de licencia',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de conductores',
    type: [ConductorResponseDto],
  })
  async getAll(): Promise<ConductorResponseDto[]> {
    return this.conductoresService.findAll();
  }

  @Get('disponibles')
  async getDisponibles(): Promise<ConductorResponseDto[]> {
    return this.conductoresService.findAllDisponibles();
  }

  @Get('no-disponibles')
  async getNoDisponibles(): Promise<ConductorResponseDto[]> {
    return this.conductoresService.findAllNoDisponibles();
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
  @ApiOperation({
    summary: 'Actualizar disponibilidad de un conductor',
    description:
      'Cambia el estado de disponibilidad de un conductor usando su CURP',
  })
  @ApiParam({
    name: 'CURP',
    description: 'CURP del conductor a actualizar',
    example: 'GOMA920511HDFLRN01',
  })
  @ApiBody({
    type: UpdateDisponibilidadDto,
    examples: {
      disponible: {
        summary: 'Marcar como disponible',
        value: { disponibilidad: true },
      },
      noDisponible: {
        summary: 'Marcar como no disponible',
        value: { disponibilidad: false },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Disponibilidad actualizada correctamente',
  })
  @ApiResponse({ status: 404, description: 'Conductor no encontrado' })
  async updateDisponibilidad(
    @Param('CURP') curp: string,
    @Body() updateDisponibilidadDto: UpdateDisponibilidadDto,
  ) {
    return this.conductoresService.updateDisponibilidad(
      curp,
      updateDisponibilidadDto,
    );
  }

  @Patch(':CURP/licencia-vigente')
  @ApiOperation({
    summary: 'Actualizar vigencia de licencia de un conductor',
    description:
      'Cambia el estado de vigencia de la licencia de un conductor usando su CURP',
  })
  @ApiParam({
    name: 'CURP',
    description: 'CURP del conductor a actualizar',
    example: 'GOMA920511HDFLRN01',
  })
  @ApiBody({
    type: UpdateLicenciaVigenteDto,
    examples: {
      vigente: {
        summary: 'Marcar licencia como vigente',
        value: { licenciaVigente: true },
      },
      noVigente: {
        summary: 'Marcar licencia como no vigente',
        value: { licenciaVigente: false },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Vigencia de licencia actualizada correctamente',
  })
  @ApiResponse({ status: 404, description: 'Conductor no encontrado' })
  async updateLicenciaVigente(
    @Param('CURP') curp: string,
    @Body() dto: UpdateLicenciaVigenteDto,
  ) {
    return this.conductoresService.updateLicenciaVigente(curp, dto);
  }

  @Delete(':CURP')
  async delete(@Param('CURP') curp: string) {
    return this.conductoresService.deleteByCurp(curp);
  }
}
