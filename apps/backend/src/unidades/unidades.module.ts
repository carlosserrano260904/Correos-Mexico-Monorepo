import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UnidadesController } from './unidades.controller';
import { UnidadesService } from './unidades.service';
import { Unidad } from './entities/unidad.entity';
import { TipoVehiculo } from './entities/tipo-vehiculo.entity';
import { Sucursal } from '../sucursalesdummy/entities/sucursal.entity';
import { TipoVehiculoSucursal } from '../sucursalesdummy/entities/tipo-vehiculo-sucursal.entity';
import { ConductoresModule } from '../conductores/conductores.module';
import { Conductor } from '../conductores/entities/conductor.entity';
import { HistorialAsignacionesModule } from '../historial-asignaciones/historial-asignaciones.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Unidad, 
      TipoVehiculo,
      Sucursal,
      TipoVehiculoSucursal,
      Conductor,
    ]),
    ConductoresModule,
    HistorialAsignacionesModule
  ],
  controllers: [UnidadesController],
  providers: [UnidadesService],
  exports: [UnidadesService],
})
export class UnidadesModule {}