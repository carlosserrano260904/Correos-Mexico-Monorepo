import { ContactoVO } from 'src/guias_trazabilidad/business-logic/value-objects/contacto.vo';
import { ContactosTypeormEntity } from '../persistence/typeorm-entities/contactos.typeorm-entity';
import { DireccionVO } from 'src/guias_trazabilidad/business-logic/value-objects/direccion.vo';
import { IdVO } from 'src/guias_trazabilidad/business-logic/value-objects/id.vo';
import { TelefonoVO } from 'src/guias_trazabilidad/business-logic/value-objects/telefono.vo';

export class ContactoMapper {
  static toOrm(contacto: ContactoVO): ContactosTypeormEntity {
    const ormEntity = new ContactosTypeormEntity();
    ormEntity.id_contacto = contacto.getIdTecnico.getId;
    ormEntity.id_usuario = contacto.getIdUsuario?.getId ?? null;
    ormEntity.nombres = contacto.getNombres;
    ormEntity.apellidos = contacto.getApellidos;
    ormEntity.telefono = contacto.getTelefono.getNumero;
    ormEntity.calle = contacto.getDireccion.getCalle;
    ormEntity.numero = contacto.getDireccion.getNumero;
    ormEntity.ciudad = contacto.getDireccion.getCiudad;
    ormEntity.pais = contacto.getDireccion.getPais;
    ormEntity.codigo_postal = contacto.getDireccion.getCodigoPostal;
    ormEntity.estado = contacto.getDireccion.getEstado;
    ormEntity.municipio_delegacion = contacto.getDireccion.getMunicipioDelegacion;
    ormEntity.asentamiento = contacto.getDireccion.getAsentamiento ?? null;
    ormEntity.referencia = contacto.getDireccion.getReferencia ?? null;
    ormEntity.numero_interior = contacto.getDireccion.getNumeroInterior ?? null;
    return ormEntity;
  }

  static toDomain(contactoOrmEntity: ContactosTypeormEntity): ContactoVO {
    return ContactoVO.fromPersistence({
      idTecnico: IdVO.fromPersistence(contactoOrmEntity.id_contacto),
      idUsuario: contactoOrmEntity.id_usuario ? IdVO.fromPersistence(contactoOrmEntity.id_usuario) : undefined,
      nombres: contactoOrmEntity.nombres,
      apellidos: contactoOrmEntity.apellidos,
      telefono: TelefonoVO.fromString(contactoOrmEntity.telefono),
      direccion: DireccionVO.fromPersistence({
        calle: contactoOrmEntity.calle,
        numero: contactoOrmEntity.numero,
        ciudad: contactoOrmEntity.ciudad,
        pais: contactoOrmEntity.pais,
        codigoPostal: contactoOrmEntity.codigo_postal,
        estado: contactoOrmEntity.estado,
        municipioDelegacion: contactoOrmEntity.municipio_delegacion,
        asentamiento: contactoOrmEntity.asentamiento ?? undefined,
        referencia: contactoOrmEntity.referencia ?? undefined,
        numeroInterior: contactoOrmEntity.numero_interior ?? undefined,
      }),
    });
  }
}
