import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SucursalesController } from './sucursales.controller';
import { SucursalesService } from './sucursales.service';
import { Sucursal } from './entities/sucursal.entity';
import { TipoVehiculoSucursal } from './entities/tipo-vehiculo-sucursal.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Sucursal, TipoVehiculoSucursal]),
  ],
  controllers: [SucursalesController],
  providers: [SucursalesService],
})
export class SucursalesModule {}