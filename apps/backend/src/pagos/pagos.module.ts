import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PagosController } from './pagos.controller';
import { PagosService } from './pagos.service';
import { Profile } from '../profile/entities/profile.entity';
import { Card } from '../cards/entities/card.entity';
import { FacturasModule } from '../facturas/facturas.module';

@Module({
  imports: [TypeOrmModule.forFeature([Profile, Card]), FacturasModule],
  controllers: [PagosController],
  providers: [PagosService],
  exports: [PagosService],
})
export class PagosModule {}
