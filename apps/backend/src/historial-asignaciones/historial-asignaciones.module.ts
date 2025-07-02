import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistorialAsignacion } from './entities/historial-asignacion.entity';
import { HistorialAsignacionesService } from './historial-asignaciones.service';

@Module({
  imports: [TypeOrmModule.forFeature([HistorialAsignacion])],
  providers: [HistorialAsignacionesService],
  exports: [HistorialAsignacionesService],
})
export class HistorialAsignacionesModule {}