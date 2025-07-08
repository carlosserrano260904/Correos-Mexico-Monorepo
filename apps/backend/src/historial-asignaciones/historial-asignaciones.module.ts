import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistorialAsignacion } from './entities/historial-asignacion.entity';
import { HistorialAsignacionesService } from './historial-asignaciones.service';
import { HistorialAsignacionesController } from './historial-asignaciones.controller'; // Asegúrate de importar el controlador

@Module({
  imports: [TypeOrmModule.forFeature([HistorialAsignacion])],
  controllers: [HistorialAsignacionesController], 
  providers: [HistorialAsignacionesService],
  exports: [HistorialAsignacionesService],
})
export class HistorialAsignacionesModule {}