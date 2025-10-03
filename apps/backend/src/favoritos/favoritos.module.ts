import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Favorito } from './entities/favorito.entity';
import { Carrito } from 'src/carrito/entities/carrito.entity';
import { Product } from 'src/products/entities/product.entity';
import { Profile } from 'src/profile/entities/profile.entity';
import { FavoritosService } from './favoritos.service';
import { FavoritosController } from './favoritos.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Favorito, Product, Profile, Carrito])],
  controllers: [FavoritosController],
  providers: [FavoritosService],
})
export class FavoritosModule {}
