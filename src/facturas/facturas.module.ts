import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Factura } from './factura.entity';
import { FacturasService } from './facturas.service';
import { FacturasController } from './facturas.controller';
import { Profile } from '../profile/entities/profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Factura, Profile])],
  providers: [FacturasService],
  controllers: [FacturasController],
  exports: [FacturasService],
})
export class FacturasModule {}
