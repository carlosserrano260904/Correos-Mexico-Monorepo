import { Module } from '@nestjs/common';
import { CarritoService } from './carrito.service';
import { CarritoController } from './carrito.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Carrito } from './entities/carrito.entity';
import { Product } from 'src/products/entities/product.entity';
import { Profile } from 'src/profile/entities/profile.entity';
import { CreateAccount } from 'src/create-account/entities/create-account.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Carrito,   
      Product,   
      Profile,
      CreateAccount
    ])
  ],
  controllers: [CarritoController],
  providers: [CarritoService],
})
export class CarritoModule {}
