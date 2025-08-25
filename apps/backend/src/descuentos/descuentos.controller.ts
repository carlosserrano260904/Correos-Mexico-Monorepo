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
import { DescuentosService } from './descuentos.service';
import { CreateDescuentoDto } from './dto/create-descuento.dto';
import { UpdateDescuentoDto } from './dto/update-descuento.dto';
import { CalcularDescuentosDto } from './dto/calcular-descuentos.dto';
import { Descuento } from './entities/descuento.entity';

@ApiTags('descuentos')
@Controller('descuentos')
export class DescuentosController {
  constructor(private readonly descuentosService: DescuentosService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo descuento' })
  @ApiResponse({ 
    status: 201, 
    description: 'Descuento creado exitosamente',
    type: Descuento 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Datos inválidos' 
  })
  create(@Body() createDescuentoDto: CreateDescuentoDto): Promise<Descuento> {
    return this.descuentosService.create(createDescuentoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los descuentos' })
  @ApiQuery({ 
    name: 'activos', 
    required: false, 
    description: 'Filtrar solo descuentos activos',
    type: Boolean 
  })
  @ApiQuery({ 
    name: 'automaticos', 
    required: false, 
    description: 'Filtrar solo descuentos automáticos',
    type: Boolean 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de descuentos',
    type: [Descuento] 
  })
  findAll(
    @Query('activos') activos?: string,
    @Query('automaticos') automaticos?: string
  ): Promise<Descuento[]> {
    if (automaticos === 'true') {
      return this.descuentosService.findAllAutomaticos();
    }
    if (activos === 'true') {
      return this.descuentosService.findAllActivos();
    }
    return this.descuentosService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un descuento por ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Descuento encontrado',
    type: Descuento 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Descuento no encontrado' 
  })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Descuento> {
    return this.descuentosService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un descuento' })
  @ApiResponse({ 
    status: 200, 
    description: 'Descuento actualizado',
    type: Descuento 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Descuento no encontrado' 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Datos inválidos' 
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDescuentoDto: UpdateDescuentoDto,
  ): Promise<Descuento> {
    return this.descuentosService.update(id, updateDescuentoDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un descuento' })
  @ApiResponse({ 
    status: 204, 
    description: 'Descuento eliminado' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Descuento no encontrado' 
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.descuentosService.remove(id);
  }

  @Post('calcular')
  @ApiOperation({ summary: 'Calcular descuentos aplicables' })
  @ApiResponse({ 
    status: 200, 
    description: 'Descuentos calculados',
    schema: {
      type: 'object',
      properties: {
        descuentos_aplicables: { 
          type: 'array',
          items: { $ref: '#/components/schemas/Descuento' }
        },
        mejor_descuento: { $ref: '#/components/schemas/Descuento', nullable: true },
        descuento_total: { type: 'number' },
        ahorro_maximo: { type: 'number' }
      }
    }
  })
  calcularDescuentos(@Body() calcularDescuentosDto: CalcularDescuentosDto) {
    return this.descuentosService.calcularDescuentosAplicables(calcularDescuentosDto);
  }

  @Post('aplicar/:id')
  @ApiOperation({ summary: 'Aplicar un descuento (incrementar uso)' })
  @ApiResponse({ 
    status: 200, 
    description: 'Descuento aplicado',
    type: Descuento 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Descuento no encontrado' 
  })
  aplicarDescuento(@Param('id', ParseIntPipe) id: number): Promise<Descuento> {
    return this.descuentosService.aplicarDescuento(id);
  }

  @Patch(':id/desactivar')
  @ApiOperation({ summary: 'Desactivar un descuento' })
  @ApiResponse({ 
    status: 200, 
    description: 'Descuento desactivado',
    type: Descuento 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Descuento no encontrado' 
  })
  desactivarDescuento(@Param('id', ParseIntPipe) id: number): Promise<Descuento> {
    return this.descuentosService.desactivarDescuento(id);
  }

  @Patch(':id/activar')
  @ApiOperation({ summary: 'Activar un descuento' })
  @ApiResponse({ 
    status: 200, 
    description: 'Descuento activado',
    type: Descuento 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Descuento no encontrado' 
  })
  activarDescuento(@Param('id', ParseIntPipe) id: number): Promise<Descuento> {
    return this.descuentosService.activarDescuento(id);
  }

  @Get(':id/estadisticas')
  @ApiOperation({ summary: 'Obtener estadísticas de un descuento' })
  @ApiResponse({ 
    status: 200, 
    description: 'Estadísticas del descuento',
    schema: {
      type: 'object',
      properties: {
        descuento: { $ref: '#/components/schemas/Descuento' },
        porcentaje_uso: { type: 'number' },
        usos_restantes: { type: 'number' },
        dias_restantes: { type: 'number', nullable: true }
      }
    }
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Descuento no encontrado' 
  })
  getEstadisticas(@Param('id', ParseIntPipe) id: number) {
    return this.descuentosService.getEstadisticasDescuento(id);
  }

  @Post('actualizar-expirados')
  @ApiOperation({ summary: 'Actualizar estados de descuentos expirados' })
  @ApiResponse({ 
    status: 200, 
    description: 'Estados actualizados exitosamente' 
  })
  @HttpCode(HttpStatus.OK)
  actualizarExpirados(): Promise<void> {
    return this.descuentosService.actualizarEstadosExpirados();
  }
}
