import { IncidenciaDomainEntity } from '../../business-logic/incidencias.entity';
import { IncidenciasTypeormEntity } from '../persistence/typeorm-entities/incidencias.typeorm-entity';
import { IdVO } from '../../business-logic/value-objects/id.vo';
import { TipoIncidenciaVO } from '../../business-logic/value-objects/tipoIncidencia.vo';

export class IncidenciaMapper {
  // domain -> orm
  static toOrm(
    incidenciaEntity: IncidenciaDomainEntity,
    idGuia: string,
  ): IncidenciasTypeormEntity {
    const incidenciaOrm = new IncidenciasTypeormEntity();
    incidenciaOrm.id_incidencia = incidenciaEntity.idIncidencia.getId;
    incidenciaOrm.id_guia = idGuia;
    incidenciaOrm.tipo_incidencia =
      incidenciaEntity.tipoIncidencia.getIncidencia;
    incidenciaOrm.descripcion = incidenciaEntity.getDescripcion;
    incidenciaOrm.fecha_incidencia = incidenciaEntity.getFechaIncidencia;
    incidenciaOrm.id_usuario_responsable = incidenciaEntity.getIdResponsable;

    return incidenciaOrm;
  }

  // orm -> domain
  static toDomain(incidenciaOrm: IncidenciasTypeormEntity) {
    return IncidenciaDomainEntity.fromPersistence({
      idIncidencia: IdVO.fromPersistence(incidenciaOrm.id_incidencia),
      tipoIncidencia: TipoIncidenciaVO.fromPersistence(
        incidenciaOrm.tipo_incidencia,
      ),
      descripcion: incidenciaOrm.descripcion,
      fechaIncidencia: incidenciaOrm.fecha_incidencia,
      idResponsable: incidenciaOrm.id_usuario_responsable,
    });
  }
}
