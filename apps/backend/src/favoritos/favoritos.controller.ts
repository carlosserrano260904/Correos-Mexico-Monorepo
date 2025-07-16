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

@Controller('favoritos')
export class FavoritosController {
  constructor(private readonly favoritosService: FavoritosService) {}

  @Get(':usuarioId')
  getFavoritos(@Param('usuarioId', ParseIntPipe) usuarioId: number) {
    return this.favoritosService.findByUsuario(usuarioId);
  }

  @Post()
  addFavorito(@Body() body: CreateFavoritoDto) {
    return this.favoritosService.addFavorito(body.usuarioId, body.productId);
  }

  @Delete(':id')
  deleteFavorito(@Param('id', ParseIntPipe) id: number) {
    return this.favoritosService.removeFavorito(id);
  }

  @Post('agregar-a-carrito')
  agregarProductoDesdeFavorito(
    @Body() body: { usuarioId: number; productId: number },
  ) {
    return this.favoritosService.addToCarritoDesdeFavorito(
      body.usuarioId,
      body.productId,
    );
  }
}
