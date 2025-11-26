// apps/backend/src/carrito/carrito.controller.ts
import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  Post,
} from '@nestjs/common';
import { CarritoService } from './carrito.service';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('Carrito')
@Controller('carrito')
export class CarritoController {
  constructor(private readonly carritoService: CarritoService) {}

  @Get(':profileId')
  @ApiOperation({
    summary: 'Obtener carrito por perfil',
    description:
      'Devuelve el contenido del carrito (productos, cantidades y totales) asociado al `profileId`.',
  })
  @ApiParam({
    name: 'profileId',
    type: Number,
    description: 'ID del perfil (profileId)',
  })
  @ApiResponse({ status: 200, description: 'Carrito obtenido correctamente.' })
  obtener(@Param('profileId') profileId: number) {
    return this.carritoService.obtenerCarrito(profileId);
  }

  @Post()
  @ApiOperation({
    summary: 'Agregar producto al carrito',
    description:
      'Agrega un producto al carrito del usuario. Si el producto ya existe, puede incrementarse la cantidad.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        profileId: { type: 'number', example: 12 },
        productId: { type: 'number', example: 45 },
        cantidad: { type: 'number', example: 2, minimum: 1 },
      },
      required: ['profileId', 'productId', 'cantidad'],
    },
  })
  @ApiResponse({ status: 201, description: 'Producto agregado al carrito.' })
  agregarProducto(
    @Body() body: { profileId: number; productId: number; cantidad: number },
  ) {
    return this.carritoService.agregarProducto(
      body.profileId,
      body.productId,
      body.cantidad,
    );
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Editar cantidad de un ítem del carrito',
    description:
      'Actualiza la cantidad de un registro específico del carrito por su `id`.',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID del registro en el carrito',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        cantidad: { type: 'number', example: 3, minimum: 1 },
      },
      required: ['cantidad'],
    },
  })
  @ApiResponse({ status: 200, description: 'Cantidad actualizada.' })
  editarCantidad(@Param('id') id: number, @Body() body: { cantidad: number }) {
    return this.carritoService.editarCantidad(id, body.cantidad);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar producto del carrito',
    description:
      'Elimina un ítem del carrito usando el `id` del registro del carrito (no el `productId`).',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID del registro en el carrito',
  })
  @ApiResponse({ status: 200, description: 'Ítem eliminado del carrito.' })
  eliminar(@Param('id') id: number) {
    return this.carritoService.eliminarDelCarrito(id);
  }

  @Get(':profileId/subtotal')
  @ApiOperation({
    summary: 'Calcular subtotal del carrito',
    description: 'Calcula y devuelve el subtotal del carrito del `profileId`.',
  })
  @ApiParam({
    name: 'profileId',
    type: Number,
    description: 'ID del perfil (Profile.id)',
  })
  @ApiResponse({
    status: 200,
    description: 'Subtotal calculado correctamente.',
  })
  calcularSubtotal(@Param('profileId') profileId: number) {
    return this.carritoService.subtotal(profileId);
  }

  @Get(':profileId/proceder')
  @ApiOperation({
    summary: 'Proceder al pago',
    description: 'Prepara el proceso para pago para el `profileId`.',
  })
  @ApiParam({
    name: 'profileId',
    type: Number,
    description: 'ID del perfil (Profile.id)',
  })
  @ApiResponse({
    status: 200,
    description: 'Proceso de pago iniciado/preparado.',
  })
  procederAlPago(@Param('profileId') profileId: number) {
    return this.carritoService.procederAlPago(profileId);
  }
}
