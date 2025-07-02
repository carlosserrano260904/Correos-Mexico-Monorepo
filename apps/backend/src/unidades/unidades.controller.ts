import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  ParseIntPipe, 
  Patch,
  UseInterceptors,
  ClassSerializerInterceptor
} from '@nestjs/common';
import { UnidadesService } from './unidades.service';
import { CreateUnidadDto } from './dto/create-unidad.dto';
import { UnidadResponseDto } from './dto/unidad-response.dto';
import { AssignConductorDto } from './dto/assign-conductor.dto';
import { SucursalTiposVehiculoDto } from './dto/sucursal-tipos-vehiculo.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Unidades')
@Controller('unidades')
@UseInterceptors(ClassSerializerInterceptor)
export class UnidadesController {
  constructor(private readonly unidadesService: UnidadesService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todas las unidades' })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de unidades',
    type: [UnidadResponseDto]
  })
  async findAll(): Promise<UnidadResponseDto[]> {
    return this.unidadesService.findAll();
  }

  @Get('sucursal/:clave')
  @ApiOperation({ summary: 'Obtener unidades disponibles por sucursal' })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de unidades disponibles en la sucursal',
    type: [UnidadResponseDto]
  })
  async findBySucursal(@Param('clave') clave: number) {
    return this.unidadesService.findBySucursal(clave);
  }

  @Post()
  @ApiOperation({ summary: 'Crear nueva unidad' })
  @ApiResponse({ 
    status: 201, 
    description: 'Unidad creada exitosamente',
    type: UnidadResponseDto
  })
  async create(@Body() createUnidadDto: CreateUnidadDto) {
    return this.unidadesService.create(createUnidadDto);
  }
@Patch(':placas/asignar') // Cambiamos :id por :placas
@ApiOperation({ summary: 'Asignar/desasignar conductor a unidad usando placas' })
@ApiResponse({ 
  status: 200, 
  description: 'Asignación actualizada correctamente',
  type: UnidadResponseDto
})
async assignConductor(
  @Param('placas') placas: string, // Recibimos placas como parámetro
  @Body() assignConductorDto: AssignConductorDto,
) {
  return this.unidadesService.assignConductor(placas, assignConductorDto);
}
@Get('tipos-vehiculo/:claveSucursal')
@ApiOperation({ summary: 'Obtener tipos de vehículo permitidos por sucursal' })
@ApiResponse({ 
  status: 200, 
  description: 'Tipos de vehículo permitidos',
  type: SucursalTiposVehiculoDto
})
async getTiposVehiculo(
  @Param('claveSucursal') claveSucursal: number,
) {
  return this.unidadesService.getTiposVehiculoPorSucursal(claveSucursal);
}
}