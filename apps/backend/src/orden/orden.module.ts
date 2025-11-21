import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdenController } from './orden.controller';
import { OrdenService } from './orden.service';

import { Transaction } from '../transactions/entities/transaction.entity';
import { Product } from '../products/entities/product.entity';
import { Profile } from '../profile/entities/profile.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction, Product, Profile]),
  ],
  controllers: [OrdenController],
  providers: [OrdenService],
})
export class OrdenModule {}