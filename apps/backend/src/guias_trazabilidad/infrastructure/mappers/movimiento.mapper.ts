import { MovimientoDomainEntity } from "src/guias_trazabilidad/business-logic/movimiento.entity";
import { MovimientoGuiasTypeormEntity } from "../persistence/typeorm-entities/movimientos-guias.typeorm-entity";
import { IdVO } from "src/guias_trazabilidad/business-logic/value-objects/id.vo";


export class MovimientoMapper {
    static toOrm(movimiento: MovimientoDomainEntity): MovimientoGuiasTypeormEntity {
        const movimientoOrm = new MovimientoGuiasTypeormEntity();
        movimientoOrm.id_movimiento = crypto.randomUUID();
        movimientoOrm.id_sucursal = movimiento.idSucursal;
        movimientoOrm.id_ruta = movimiento.idRuta;
        movimientoOrm.estado = movimiento.estado;
        movimientoOrm.localizacion = movimiento.localizacion;
        movimientoOrm.fecha_movimiento = movimiento.fechaMovimiento;
        return movimientoOrm;
    }

    static toDomain(movimientoOrm: MovimientoGuiasTypeormEntity): MovimientoDomainEntity {
        return MovimientoDomainEntity.fromPersistence({
            idMovimiento: IdVO.fromPersistence(movimientoOrm.id_movimiento),
            idSucursal: movimientoOrm.id_sucursal,
            idRuta: movimientoOrm.id_ruta,
            estado: movimientoOrm.estado,
            localizacion: movimientoOrm.localizacion,
            fecha_movimiento: movimientoOrm.fecha_movimiento
        });
    }
}