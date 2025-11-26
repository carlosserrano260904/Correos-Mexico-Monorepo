// apps/backend/src/favoritos/favoritos.controller.ts
import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { FavoritosService } from './favoritos.service';
import { CreateFavoritoDto } from './dto/create-favorito.dto';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('Favoritos')
@Controller('favoritos')
export class FavoritosController {
  constructor(private readonly favoritosService: FavoritosService) {}

  @Get(':profileId')
  @ApiOperation({
    summary: 'Listar favoritos por perfil',
    description:
      'Devuelve todos los productos marcados como favoritos para el `profileId`.',
  })
  @ApiParam({
    name: 'profileId',
    type: Number,
    description: 'ID del perfil (profileId)',
  })
  @ApiResponse({ status: 200, description: 'Lista de favoritos obtenida.' })
  getFavoritos(@Param('profileId', ParseIntPipe) profileId: number) {
    return this.favoritosService.findByUsuario(profileId);
  }

  @Post()
  @ApiOperation({
    summary: 'Agregar producto a favoritos',
    description:
      'Registra un producto como favorito para el usuario indicado por `profileId`.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        profileId: { type: 'number', example: 12 },
        productId: { type: 'number', example: 45 },
      },
      required: ['profileId', 'productId'],
    },
  })
  @ApiResponse({ status: 201, description: 'Producto agregado a favoritos.' })
  addFavorito(@Body() body: CreateFavoritoDto) {
    return this.favoritosService.addFavorito(body.profileId, body.productId);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar favorito',
    description: 'Elimina un registro de favoritos usando el id del favorito.',
  })
  @ApiParam({ name: 'id', type: Number, description: 'ID del favorito' })
  @ApiResponse({ status: 200, description: 'Favorito eliminado.' })
  deleteFavorito(@Param('id', ParseIntPipe) id: number) {
    return this.favoritosService.removeFavorito(id);
  }

  @Post('agregar-a-carrito')
  @ApiOperation({
    summary: 'Agregar al carrito desde favoritos',
    description:
      'Agrega al carrito un producto que está en favoritos, indicando `profileId` y `productId`.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        profileId: { type: 'number', example: 12 },
        productId: { type: 'number', example: 45 },
      },
      required: ['profileId', 'productId'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Producto agregado al carrito desde favoritos.',
  })
  agregarProductoDesdeFavorito(
    @Body() body: { profileId: number; productId: number },
  ) {
    return this.favoritosService.addToCarritoDesdeFavorito(
      body.profileId,
      body.productId,
    );
  }
}
