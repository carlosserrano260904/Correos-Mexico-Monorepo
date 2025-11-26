import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';

import { PedidosService } from './pedidos.service';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';
import { PedidoResponseDto } from './dto/pedido-response.dto';

@ApiTags('Pedidos') // Agrupa las rutas en la sección "Pedidos"
@Controller('pedido')
export class PedidosController {
  constructor(private readonly pedidosService: PedidosService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo pedido' })
  @ApiBody({ type: CreatePedidoDto })
  @ApiResponse({
    status: 201,
    description: 'Pedido creado exitosamente',
    type: PedidoResponseDto,
  })
  create(@Body() createPedidoDto: CreatePedidoDto) {
    return this.pedidosService.create(createPedidoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los pedidos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de pedidos',
    type: [PedidoResponseDto],
  })
  findAll() {
    return this.pedidosService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un pedido por ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID del pedido' })
  @ApiResponse({
    status: 200,
    description: 'Pedido encontrado',
    type: PedidoResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Pedido no encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.pedidosService.findOne(id);
  }

  /*
  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un pedido por ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID del pedido' })
  @ApiBody({ type: UpdatePedidoDto })
  @ApiResponse({ status: 200, description: 'Pedido actualizado', type: PedidoResponseDto })
  update(@Param('id', ParseIntPipe) id: number, @Body() updatePedidoDto: UpdatePedidoDto) {
    return this.pedidosService.update(id, updatePedidoDto);
  }
  */

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un pedido por ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID del pedido' })
  @ApiResponse({ status: 200, description: 'Pedido eliminado' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.pedidosService.remove(id);
  }

  // 🔥 Ruta personalizada para obtener pedidos por usuario
  @Get('user/:id')
  @ApiOperation({ summary: 'Obtener pedidos por ID de usuario' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID del usuario (profileId)',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de pedidos del usuario',
    type: [PedidoResponseDto],
  })
  @ApiResponse({
    status: 404,
    description: 'No se encontraron pedidos para el usuario',
  })
  findByUser(@Param('id', ParseIntPipe) id: number) {
    return this.pedidosService.findByUser(id);
  }
}
