import { ContactoVO } from '../../business-logic/value-objects/contacto.vo';
import { ContactosTypeormEntity } from '../persistence/typeorm-entities/contactos.typeorm-entity';
import { DireccionVO } from '../../business-logic/value-objects/direccion.vo';
import { IdVO } from '../../business-logic/value-objects/id.vo';
import { TelefonoVO } from '../../business-logic/value-objects/telefono.vo';

export class ContactoMapper {
  static toOrm(contacto: ContactoVO): ContactosTypeormEntity {
    const ormEntity = new ContactosTypeormEntity();
    ormEntity.id_contacto = contacto.getIdTecnico.getId;
    ormEntity.id_usuario = contacto.getIdUsuario?.getId;
    ormEntity.nombres = contacto.getNombres;
    ormEntity.apellidos = contacto.getApellidos;
    ormEntity.telefono = contacto.getTelefono.getNumero;
    ormEntity.calle = contacto.getDireccion.getCalle;
    ormEntity.numero = contacto.getDireccion.getNumero;
    ormEntity.numero_interior = contacto.getDireccion.getNumeroInterior || null;
    ormEntity.asentamiento = contacto.getDireccion.getAsentamiento;
    ormEntity.codigo_postal = contacto.getDireccion.getCodigoPostal;
    ormEntity.localidad = contacto.getDireccion.getLocalidad;
    ormEntity.estado = contacto.getDireccion.getEstado;
    ormEntity.pais = contacto.getDireccion.getPais;
    ormEntity.lat = contacto.getDireccion.getLat;
    ormEntity.lng = contacto.getDireccion.getLng;
    ormEntity.referencia = contacto.getDireccion.getReferencia || null;
    return ormEntity;
  }

  static toDomain(contactoOrmEntity: ContactosTypeormEntity): ContactoVO {
    return ContactoVO.fromPersistence({
      idTecnico: IdVO.fromPersistence(contactoOrmEntity.id_contacto),
      idUsuario: contactoOrmEntity.id_usuario
        ? IdVO.fromPersistence(contactoOrmEntity.id_usuario)
        : undefined,
      nombres: contactoOrmEntity.nombres,
      apellidos: contactoOrmEntity.apellidos,
      telefono: TelefonoVO.fromString(contactoOrmEntity.telefono),
      direccion: DireccionVO.fromPersistence({
        calle: contactoOrmEntity.calle,
        numero: contactoOrmEntity.numero,
        numeroInterior: contactoOrmEntity.numero_interior ?? undefined,
        asentamiento: contactoOrmEntity.asentamiento,
        codigoPostal: contactoOrmEntity.codigo_postal,
        localidad: contactoOrmEntity.localidad,
        estado: contactoOrmEntity.estado,
        pais: contactoOrmEntity.pais,
        lat: contactoOrmEntity.lat ?? undefined,
        lng: contactoOrmEntity.lng ?? undefined,
        referencia: contactoOrmEntity.referencia ?? undefined,
      }),
    });
  }

  static toPdfPayload(contactoVO: ContactoVO) {
    return {
      nombres: contactoVO.getNombres,
      apellidos: contactoVO.getApellidos,
      TelefonoVO: contactoVO.getTelefono.getNumero,
      direccion: {
        calle: contactoVO.getDireccion.getCalle,
        numero: contactoVO.getDireccion.getNumero,
        numeroInterior: contactoVO.getDireccion.getNumeroInterior ?? '',
        asentamiento: contactoVO.getDireccion.getAsentamiento ?? '',
        codigoPostal: contactoVO.getDireccion.getCodigoPostal,
        localidad: contactoVO.getDireccion.getLocalidad,
        estado: contactoVO.getDireccion.getEstado,
        pais: contactoVO.getDireccion.getPais,
        referencia: contactoVO.getDireccion.getReferencia ?? '',
      },
    };
  }
}
