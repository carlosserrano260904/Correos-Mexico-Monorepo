// apps/backend/src/carrito/carrito.controller.ts

import { Controller, Get, Patch, Delete, Param, Body, Post } from '@nestjs/common';
import { CarritoService } from './carrito.service';

@Controller('carrito')
export class CarritoController {
  constructor(private readonly carritoService: CarritoService) {}

  @Get(':usuarioId')
  obtener(@Param('usuarioId') usuarioId: number) {
    return this.carritoService.obtenerCarrito(usuarioId);
  }

  @Post()
  agregarProducto(
    @Body() body: { usuarioId: number; productId: number; cantidad: number },
  ) {
    return this.carritoService.agregarProducto(body.usuarioId, body.productId, body.cantidad);
  }

  @Patch(':id')
  editarCantidad(
    @Param('id') id: number,
    @Body() body: { cantidad: number },
  ) {
    return this.carritoService.editarCantidad(id, body.cantidad);
  }

  @Delete(':id')
  eliminar(@Param('id') id: number) {
    return this.carritoService.eliminarDelCarrito(id);
  }

  @Get(':usuarioId/subtotal')
  calcularSubtotal(@Param('usuarioId') usuarioId: number) {
    return this.carritoService.subtotal(usuarioId);
  }

  @Get(':usuarioId/proceder')
  procederAlPago(@Param('usuarioId') usuarioId: number) {
    return this.carritoService.procederAlPago(usuarioId);
  }
}
