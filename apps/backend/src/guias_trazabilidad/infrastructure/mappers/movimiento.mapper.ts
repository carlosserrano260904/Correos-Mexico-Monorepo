import { MovimientoDomainEntity } from '../../business-logic/movimiento.entity';
import { MovimientoGuiasTypeormEntity } from '../persistence/typeorm-entities/movimientos-guias.typeorm-entity';
import { IdVO } from '../../business-logic/value-objects/id.vo';
import { SituacionVO } from '../../business-logic/value-objects/situacion.vo';

export class MovimientoMapper {
  static toOrm(
    movimiento: MovimientoDomainEntity,
  ): MovimientoGuiasTypeormEntity {
    const movimientoOrm = new MovimientoGuiasTypeormEntity();
    movimientoOrm.id_movimiento = movimiento.idMovimiento.getId;
    movimientoOrm.id_sucursal = movimiento.getIdSucursal;
    movimientoOrm.id_ruta = movimiento.getIdRuta;
    movimientoOrm.estado = movimiento.estado.getSituacion;
    movimientoOrm.localizacion = movimiento.getLocalizacion;
    movimientoOrm.fecha_movimiento = movimiento.getFechaMovimiento;
    return movimientoOrm;
  }

  static toDomain(
    movimientoOrm: MovimientoGuiasTypeormEntity,
  ): MovimientoDomainEntity {
    return MovimientoDomainEntity.fromPersistence({
      idMovimiento: IdVO.fromPersistence(movimientoOrm.id_movimiento),
      idSucursal: movimientoOrm.id_sucursal,
      idRuta: movimientoOrm.id_ruta,
      estado: SituacionVO.fromPersistence(movimientoOrm.estado),
      localizacion: movimientoOrm.localizacion,
      fechaMovimiento: movimientoOrm.fecha_movimiento,
    });
  }
}
