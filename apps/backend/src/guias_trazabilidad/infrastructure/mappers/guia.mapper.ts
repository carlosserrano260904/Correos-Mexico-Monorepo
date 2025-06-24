import { GuiaDomainEntity } from "src/guias_trazabilidad/business-logic/guia.domain-entity-root";
import { GuiaTypeormEntity } from "../persistence/typeorm-entities/guia.typeorm-entity";
import { IdVO } from "src/guias_trazabilidad/business-logic/value-objects/id.vo";
import { NumeroSeguimientoVO } from "src/guias_trazabilidad/business-logic/value-objects/numeroSeguimiento.vo";
import { SituacionVO } from "src/guias_trazabilidad/business-logic/value-objects/situacion.vo";
import { EmbalajeVO } from "src/guias_trazabilidad/business-logic/value-objects/embalaje.vo";
import { ValorDeclaradoVO } from "src/guias_trazabilidad/business-logic/value-objects/valorDeclarado.vo";
import { ContactoVO } from "src/guias_trazabilidad/business-logic/value-objects/contacto.vo";
import { ContactosTypeormEntity } from "../persistence/typeorm-entities/contactos.typeorm-entity";
import { DireccionVO } from "src/guias_trazabilidad/business-logic/value-objects/direccion.vo";
import { MovimientoDomainEntity } from "src/guias_trazabilidad/business-logic/movimiento.entity";
import { MovimientoGuiasTypeormEntity } from "../persistence/typeorm-entities/movimientos-guias.typeorm-entity";

export class GuiaMapper {

    // dominio -> orm
    static toOrm(
        guiaDomainEntity: GuiaDomainEntity,
        idRemitente: string,
        idDestinatario: string
    ): GuiaTypeormEntity {
        const ormEntity = new GuiaTypeormEntity()
        ormEntity.id_guia = guiaDomainEntity.id.id
        ormEntity.numero_seguimiento = guiaDomainEntity.numeroSeguimiento.numeroSeguimiento
        ormEntity.situacion_actual = guiaDomainEntity.situacionActual.situacion
        ormEntity.id_remitente = idRemitente
        ormEntity.id_destinatario = idDestinatario
        ormEntity.alto_cm = guiaDomainEntity.embalaje.alto_cm
        ormEntity.ancho_cm = guiaDomainEntity.embalaje.ancho_cm
        ormEntity.largo_cm = guiaDomainEntity.embalaje.largo_cm
        ormEntity.peso_kg = guiaDomainEntity.embalaje.peso
        ormEntity.valor_declarado = guiaDomainEntity.valorDeclarado.valorDeclarado
        ormEntity.fecha_creacion = guiaDomainEntity.fechaCreacion
        ormEntity.fecha_actualizacion = guiaDomainEntity.fechaActualizacion
        ormEntity.fecha_entrega_estimada = guiaDomainEntity.fechaEntregaEstimada

        return ormEntity
    }

    // orm -> dominio
    static toDomain(
        guiaOrmEntity: GuiaTypeormEntity,
        remitenteOrmEntity: ContactosTypeormEntity,
        destinatarioOrmEntity: ContactosTypeormEntity,
        movimientoOrmEntity?: MovimientoGuiasTypeormEntity
    ): GuiaDomainEntity {
        return GuiaDomainEntity.fromPersistence({
            id: IdVO.fromPersistence(guiaOrmEntity.id_guia),
            numeroSeguimiento: NumeroSeguimientoVO.fromPersistence(guiaOrmEntity.numero_seguimiento),
            situacion: SituacionVO.fromPersistence(guiaOrmEntity.situacion_actual),
            remitente: ContactoVO.fromPersistence({
                nombres: remitenteOrmEntity.nombres,
                apellidos: remitenteOrmEntity.apellidos,
                telefono: remitenteOrmEntity.telefono,
                direccion: DireccionVO.fromPersistence({
                    calle: remitenteOrmEntity.calle,
                    numero: remitenteOrmEntity.numero,
                    ciudad: remitenteOrmEntity.ciudad,
                    pais: remitenteOrmEntity.pais,
                    codigoPostal: remitenteOrmEntity.codigo_postal,
                    estado: remitenteOrmEntity.estado,
                    municipio: remitenteOrmEntity.municipio,
                    delegacion: remitenteOrmEntity.delegacion,
                    colonia: remitenteOrmEntity.colonia,
                    fraccionamiento: remitenteOrmEntity.fraccionamiento,
                }),
            }),
            destinatario: ContactoVO.fromPersistence({
                nombres: destinatarioOrmEntity.nombres,
                apellidos: destinatarioOrmEntity.apellidos,
                telefono: destinatarioOrmEntity.telefono,
                direccion: DireccionVO.fromPersistence({
                    calle: destinatarioOrmEntity.calle,
                    numero: destinatarioOrmEntity.numero,
                    ciudad: destinatarioOrmEntity.ciudad,
                    pais: destinatarioOrmEntity.pais,
                    codigoPostal: destinatarioOrmEntity.codigo_postal,
                    estado: destinatarioOrmEntity.estado,
                    municipio: destinatarioOrmEntity.municipio,
                    delegacion: destinatarioOrmEntity.delegacion,
                    colonia: destinatarioOrmEntity.colonia,
                    fraccionamiento: destinatarioOrmEntity.fraccionamiento,
                }),
            }),
            embalaje: EmbalajeVO.fromPersistence({
                alto_cm: guiaOrmEntity.alto_cm,
                ancho_cm: guiaOrmEntity.ancho_cm,
                largo_cm: guiaOrmEntity.largo_cm,
                peso: guiaOrmEntity.peso_kg,
            }),
            valorDeclarado: ValorDeclaradoVO.fromPersistence(guiaOrmEntity.valor_declarado),
            fecha: guiaOrmEntity.fecha_creacion,
            fechaEntregaEstimada: guiaOrmEntity.fecha_entrega_estimada,
            ultimoMovimiento: movimientoOrmEntity ? MovimientoDomainEntity.fromPersistence(
                {
                    idMovimiento: IdVO.fromPersistence(movimientoOrmEntity.id_movimiento),
                    idSucursal: movimientoOrmEntity.id_sucursal,
                    idRuta: movimientoOrmEntity.id_ruta,
                    estado: movimientoOrmEntity.estado,
                    localizacion: movimientoOrmEntity.localizacion,
                    fecha_movimiento: movimientoOrmEntity.fecha_movimiento,
                }
            ) : undefined,
        })
    }
}