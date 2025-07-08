import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UnidadesController } from './unidades.controller';
import { UnidadesService } from './unidades.service';

import { Unidad } from './entities/unidad.entity';
import { TipoVehiculo } from './entities/tipo-vehiculo.entity';
import { TipoVehiculoOficina } from './entities/tipo-vehiculo-oficina.entity';

import { Oficina } from '../oficinas/entities/oficina.entity';
import { Conductor } from '../conductores/entities/conductor.entity';

import { ConductoresModule } from '../conductores/conductores.module';
import { HistorialAsignacionesModule } from '../historial-asignaciones/historial-asignaciones.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Unidad,
      TipoVehiculo,
      TipoVehiculoOficina,
      Oficina,
      Conductor,
    ]),
    ConductoresModule,
    HistorialAsignacionesModule,
  ],
  controllers: [UnidadesController],
  providers: [UnidadesService],
  exports: [UnidadesService],
})
export class UnidadesModule {}
