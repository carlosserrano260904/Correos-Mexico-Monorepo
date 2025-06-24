import { ContactoVO } from "src/guias_trazabilidad/business-logic/value-objects/contacto.vo";
import { ContactosTypeormEntity } from "../persistence/typeorm-entities/contactos.typeorm-entity";
import { DireccionVO } from "src/guias_trazabilidad/business-logic/value-objects/direccion.vo";

export class ContactoMapper {

    static toOrm(contacto: ContactoVO): ContactosTypeormEntity {
        const ormEntity = new ContactosTypeormEntity()
        ormEntity.id_contacto = crypto.randomUUID() // cada registro es inmutable
        ormEntity.nombres = contacto.nombres
        ormEntity.apellidos = contacto.apellidos
        ormEntity.telefono = contacto.telefono
        ormEntity.calle = contacto.direccion.calle
        ormEntity.numero = contacto.direccion.numero
        ormEntity.ciudad = contacto.direccion.ciudad
        ormEntity.pais = contacto.direccion.pais
        ormEntity.codigo_postal = contacto.direccion.codigoPostal
        ormEntity.estado = contacto.direccion.estado
        ormEntity.municipio = contacto.direccion.municipio
        ormEntity.delegacion = contacto.direccion.delegacion
        ormEntity.colonia = contacto.direccion.colonia
        ormEntity.fraccionamiento = contacto.direccion.fraccionamiento

        return ormEntity
    }

    static toDomain(contactoOrmEntity: ContactosTypeormEntity): ContactoVO {
        return ContactoVO.fromPersistence({
            nombres: contactoOrmEntity.nombres,
            apellidos: contactoOrmEntity.apellidos,
            telefono: contactoOrmEntity.telefono,
            direccion: DireccionVO.fromPersistence({
                calle: contactoOrmEntity.calle,
                numero: contactoOrmEntity.numero,
                ciudad: contactoOrmEntity.ciudad,
                pais: contactoOrmEntity.pais,
                codigoPostal: contactoOrmEntity.codigo_postal,
                estado: contactoOrmEntity.estado,
                municipio: contactoOrmEntity.municipio,
                delegacion: contactoOrmEntity.delegacion,
                colonia: contactoOrmEntity.colonia,
                fraccionamiento: contactoOrmEntity.fraccionamiento,
            })
        })
    }
}