import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DescuentosService } from './descuentos.service';
import { DescuentosController } from './descuentos.controller';
import { Descuento } from './entities/descuento.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Descuento])],
  controllers: [DescuentosController],
  providers: [DescuentosService],
  exports: [DescuentosService], // Exportar el servicio para usar en otros módulos
})
export class DescuentosModule {}
