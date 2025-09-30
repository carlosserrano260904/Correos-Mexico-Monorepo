import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AsignacionPaquetesService } from './asignacion_paquetes.service';
import { AsignacionPaquetesController } from './asignacion_paquetes.controller';
import { AsignacionPaquetes } from './entities/asignacio_paquetes.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AsignacionPaquetes])],
  controllers: [AsignacionPaquetesController],
  providers: [AsignacionPaquetesService],
})
export class AsignacionPaquetesModule {}
