// apps/backend/src/carrito/carrito.controller.ts

import { Controller, Get, Patch, Delete, Param, Body, Post } from '@nestjs/common';
import { CarritoService } from './carrito.service';

@Controller('carrito')
export class CarritoController {
  constructor(private readonly carritoService: CarritoService) {}

  @Get(':profileId')
  obtener(@Param('profileId') profileId: number) {
    return this.carritoService.obtenerCarrito(profileId);
  }

  @Post()
  agregarProducto(
    @Body() body: { profileId: number; productId: number; cantidad: number },
  ) {
    return this.carritoService.agregarProducto(body.profileId, body.productId, body.cantidad);
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

  @Get(':profileId/subtotal')
  calcularSubtotal(@Param('profileId') profileId: number) {
    return this.carritoService.subtotal(profileId);
  }

  @Get(':profileId/proceder')
  procederAlPago(@Param('profileId') profileId: number) {
    return this.carritoService.procederAlPago(profileId);
  }
}
