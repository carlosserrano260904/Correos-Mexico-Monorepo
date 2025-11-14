import { Module } from '@nestjs/common';
import { CarritoService } from './carrito.service';
import { CarritoController } from './carrito.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Carrito } from './entities/carrito.entity';
import { Product } from 'src/products/entities/product.entity';
import { Profile } from 'src/profile/entities/profile.entity';
import { ProductVariant } from 'src/products/entities/productVariant.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Carrito,   
      Product,   
      Profile,
      ProductVariant  
    ])
  ],
  controllers: [CarritoController],
  providers: [CarritoService],
})
export class CarritoModule {}
