//pedidos.controller.ts
// Este archivo define el controlador para manejar las rutas relacionadas con los pedidos.
import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { PedidosService } from './pedidos.service';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';

@Controller('api/pedido')
export class PedidosController {
  constructor(private readonly pedidosService: PedidosService) {}

  @Post()
  create(@Body() createPedidoDto: CreatePedidoDto) {
    return this.pedidosService.create(createPedidoDto);
  }

  @Get()
  findAll() {
    return this.pedidosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.pedidosService.findOne(id);
  }

  //@Patch(':id')
  //update(@Param('id', ParseIntPipe) id: number, @Body() updatePedidoDto: UpdatePedidoDto) {
  //  return this.pedidosService.update(id, updatePedidoDto);
  //}

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.pedidosService.remove(id);
  }

  // 🔥 Aquí está la ruta personalizada para el frontend: obtener pedidos por usuario
  @Get('user/:id')
  findByUser(@Param('id', ParseIntPipe) id: number) {
    return this.pedidosService.findByUser(id);
  }
}
