import { Controller, Post, Delete, Param, Get, ParseIntPipe } from '@nestjs/common';
import { LikesService } from './likes.service';

@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Post(':usuarioId/:productoId')
  likeProduct(
    @Param('usuarioId', ParseIntPipe) usuarioId: number,
    @Param('productoId', ParseIntPipe) productoId: number
  ) {
    return this.likesService.likeProduct(usuarioId, productoId);
  }

  @Delete(':usuarioId/:productoId')
  unlikeProduct(
    @Param('usuarioId', ParseIntPipe) usuarioId: number,
    @Param('productoId', ParseIntPipe) productoId: number
  ) {
    return this.likesService.unlikeProduct(usuarioId, productoId);
  }

  @Get()
  getAllLikes() {
    return this.likesService.getAllLikes();
  }

  @Get('usuario/:usuarioId')
  getLikesByUsuario(@Param('usuarioId', ParseIntPipe) usuarioId: number) {
    return this.likesService.getLikesByUsuario(usuarioId);
  }

  @Get('producto/:productoId')
  getLikesByProducto(@Param('productoId', ParseIntPipe) productoId: number) {
    return this.likesService.getLikesByProducto(productoId);
  }
}

