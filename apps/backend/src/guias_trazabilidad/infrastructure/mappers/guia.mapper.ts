import { GuiaDomainEntity } from '../../business-logic/guia.domain-entity-root';
import { GuiaTypeormEntity } from '../persistence/typeorm-entities/guia.typeorm-entity';
import { IdVO } from '../../business-logic/value-objects/id.vo';
import { NumeroDeRastreoVO } from '../../business-logic/value-objects/numeroRastreo.vo';
import { SituacionVO } from '../../business-logic/value-objects/situacion.vo';
import { EmbalajeVO } from '../../business-logic/value-objects/embalaje.vo';
import { ValorDeclaradoVO } from '../../business-logic/value-objects/valorDeclarado.vo';
import { ContactosTypeormEntity } from '../persistence/typeorm-entities/contactos.typeorm-entity';
import { MovimientoGuiasTypeormEntity } from '../persistence/typeorm-entities/movimientos-guias.typeorm-entity';
import { ContactoMapper } from './contacto.mapper';
import { MovimientoMapper } from './movimiento.mapper';

export class GuiaMapper {
  // dominio -> orm
  static toOrm(guiaDomainEntity: GuiaDomainEntity): GuiaTypeormEntity {
    const ormEntity = new GuiaTypeormEntity();
    ormEntity.id_guia = guiaDomainEntity.Id.getId;
    ormEntity.numero_de_rastreo =
      guiaDomainEntity.NumeroRastreo.getNumeroRastreo;
    ormEntity.situacion_actual = guiaDomainEntity.SituacionActual.getSituacion;
    ormEntity.id_remitente = guiaDomainEntity.Remitente.getIdTecnico.getId;
    ormEntity.id_destinatario =
      guiaDomainEntity.Destinatario.getIdTecnico.getId;
    ormEntity.alto_cm = guiaDomainEntity.Embalaje.getAltoCm;
    ormEntity.ancho_cm = guiaDomainEntity.Embalaje.getAnchoCm;
    ormEntity.largo_cm = guiaDomainEntity.Embalaje.getLargoCm;
    ormEntity.peso_kg = guiaDomainEntity.Embalaje.getPeso;
    ormEntity.valor_declarado =
      guiaDomainEntity.ValorDeclarado.getValorDeclarado;
    ormEntity.fecha_creacion = guiaDomainEntity.fechaCreacion;
    ormEntity.fecha_actualizacion = guiaDomainEntity.fechaActualizacion;
    ormEntity.fecha_entrega_estimada = guiaDomainEntity.fechaEntregaEstimada;

    return ormEntity;
  }

  // orm -> dominio
  static toDomain(
    guiaOrmEntity: GuiaTypeormEntity,
    remitenteOrmEntity: ContactosTypeormEntity,
    destinatarioOrmEntity: ContactosTypeormEntity,
    movimientoOrmEntity?: MovimientoGuiasTypeormEntity,
  ): GuiaDomainEntity {
    return GuiaDomainEntity.fromPersistence({
      id: IdVO.fromPersistence(guiaOrmEntity.id_guia),
      numeroDeRastreo: NumeroDeRastreoVO.fromPersistence(
        guiaOrmEntity.numero_de_rastreo,
      ),
      situacion: SituacionVO.fromPersistence(guiaOrmEntity.situacion_actual),
      remitente: ContactoMapper.toDomain(remitenteOrmEntity),
      destinatario: ContactoMapper.toDomain(destinatarioOrmEntity),
      embalaje: EmbalajeVO.fromPersistence({
        alto_cm: guiaOrmEntity.alto_cm,
        ancho_cm: guiaOrmEntity.ancho_cm,
        largo_cm: guiaOrmEntity.largo_cm,
        peso: guiaOrmEntity.peso_kg,
      }),
      valorDeclarado: ValorDeclaradoVO.fromPersistence(
        guiaOrmEntity.valor_declarado,
      ),
      fecha: guiaOrmEntity.fecha_creacion,
      fechaEntregaEstimada: guiaOrmEntity.fecha_entrega_estimada,
      ultimoMovimiento: movimientoOrmEntity
        ? MovimientoMapper.toDomain(movimientoOrmEntity)
        : undefined,
    });
  }

  static toPdfPayload(guiaDomainEntity: GuiaDomainEntity) {
    const pdfPayload = {
      numeroRastreo: guiaDomainEntity.NumeroRastreo.getNumeroRastreo,
      remitente: ContactoMapper.toPdfPayload(guiaDomainEntity.Remitente),
      destinatario: ContactoMapper.toPdfPayload(guiaDomainEntity.Destinatario),
      embalaje: {
        alto: guiaDomainEntity.Embalaje.getAltoCm.toString(),
        ancho: guiaDomainEntity.Embalaje.getAnchoCm.toString(),
        largo: guiaDomainEntity.Embalaje.getLargoCm.toString(),
        peso: guiaDomainEntity.Embalaje.getPeso.toString(),
      },
      valorDeclarado: guiaDomainEntity.ValorDeclarado.getValorDeclarado,
    };
    return pdfPayload;
  }
}
