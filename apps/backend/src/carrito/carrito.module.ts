import { Module } from '@nestjs/common';
import { CarritoService } from './carrito.service';
import { CarritoController } from './carrito.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Carrito } from './entities/carrito.entity';
import { Product } from '../products/entities/product.entity';
import { Profile } from '../profile/entities/profile.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Carrito,   
      Product,   
      Profile   
    ])
  ],
  controllers: [CarritoController],
  providers: [CarritoService],
})
export class CarritoModule {}
