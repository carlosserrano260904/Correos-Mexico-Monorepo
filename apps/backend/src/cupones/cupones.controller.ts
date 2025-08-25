import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { CuponesService } from './cupones.service';
import { CreateCuponDto } from './dto/create-cupon.dto';
import { UpdateCuponDto } from './dto/update-cupon.dto';
import { ValidarCuponDto } from './dto/validar-cupon.dto';
import { Cupon } from './entities/cupon.entity';

@ApiTags('cupones')
@Controller('cupones')
export class CuponesController {
  constructor(private readonly cuponesService: CuponesService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo cupón' })
  @ApiResponse({ 
    status: 201, 
    description: 'Cupón creado exitosamente',
    type: Cupon 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Datos inválidos o código duplicado' 
  })
  create(@Body() createCuponDto: CreateCuponDto): Promise<Cupon> {
    return this.cuponesService.create(createCuponDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los cupones' })
  @ApiQuery({ 
    name: 'activos', 
    required: false, 
    description: 'Filtrar solo cupones activos',
    type: Boolean 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de cupones',
    type: [Cupon] 
  })
  findAll(@Query('activos') activos?: string): Promise<Cupon[]> {
    if (activos === 'true') {
      return this.cuponesService.findAllActivos();
    }
    return this.cuponesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un cupón por ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Cupón encontrado',
    type: Cupon 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Cupón no encontrado' 
  })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Cupon> {
    return this.cuponesService.findOne(id);
  }

  @Get('codigo/:codigo')
  @ApiOperation({ summary: 'Obtener un cupón por código' })
  @ApiResponse({ 
    status: 200, 
    description: 'Cupón encontrado',
    type: Cupon 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Cupón no encontrado' 
  })
  findByCodigo(@Param('codigo') codigo: string): Promise<Cupon> {
    return this.cuponesService.findByCodigo(codigo);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un cupón' })
  @ApiResponse({ 
    status: 200, 
    description: 'Cupón actualizado',
    type: Cupon 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Cupón no encontrado' 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Datos inválidos' 
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCuponDto: UpdateCuponDto,
  ): Promise<Cupon> {
    return this.cuponesService.update(id, updateCuponDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un cupón' })
  @ApiResponse({ 
    status: 204, 
    description: 'Cupón eliminado' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Cupón no encontrado' 
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.cuponesService.remove(id);
  }

  @Post('validar')
  @ApiOperation({ summary: 'Validar un cupón' })
  @ApiResponse({ 
    status: 200, 
    description: 'Resultado de la validación',
    schema: {
      type: 'object',
      properties: {
        valido: { type: 'boolean' },
        mensaje: { type: 'string' },
        descuento: { type: 'number', nullable: true },
        cupon: { $ref: '#/components/schemas/Cupon', nullable: true }
      }
    }
  })
  validarCupon(@Body() validarCuponDto: ValidarCuponDto) {
    return this.cuponesService.validarCupon(validarCuponDto);
  }

  @Post('aplicar/:codigo')
  @ApiOperation({ summary: 'Aplicar un cupón (incrementar uso)' })
  @ApiResponse({ 
    status: 200, 
    description: 'Cupón aplicado',
    type: Cupon 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Cupón no encontrado' 
  })
  aplicarCupon(
    @Param('codigo') codigo: string,
    @Body('usuario_id') usuarioId?: number,
  ): Promise<Cupon> {
    return this.cuponesService.aplicarCupon(codigo, usuarioId);
  }

  @Patch(':id/desactivar')
  @ApiOperation({ summary: 'Desactivar un cupón' })
  @ApiResponse({ 
    status: 200, 
    description: 'Cupón desactivado',
    type: Cupon 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Cupón no encontrado' 
  })
  desactivarCupon(@Param('id', ParseIntPipe) id: number): Promise<Cupon> {
    return this.cuponesService.desactivarCupon(id);
  }

  @Patch(':id/activar')
  @ApiOperation({ summary: 'Activar un cupón' })
  @ApiResponse({ 
    status: 200, 
    description: 'Cupón activado',
    type: Cupon 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Cupón no encontrado' 
  })
  activarCupon(@Param('id', ParseIntPipe) id: number): Promise<Cupon> {
    return this.cuponesService.activarCupon(id);
  }

  @Get(':id/estadisticas')
  @ApiOperation({ summary: 'Obtener estadísticas de un cupón' })
  @ApiResponse({ 
    status: 200, 
    description: 'Estadísticas del cupón',
    schema: {
      type: 'object',
      properties: {
        cupon: { $ref: '#/components/schemas/Cupon' },
        porcentaje_uso: { type: 'number' },
        usos_restantes: { type: 'number' }
      }
    }
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Cupón no encontrado' 
  })
  getEstadisticas(@Param('id', ParseIntPipe) id: number) {
    return this.cuponesService.getEstadisticasCupon(id);
  }
}
