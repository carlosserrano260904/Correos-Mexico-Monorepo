import { CrearGuiaCommand } from '../crear-guia.command';
import { 
    DireccionVO, 
    TelefonoVO,
    EmbalajeVO,
    ValorDeclaradoVO,
    ContactoVO
} from '../../../../../guias_trazabilidad/business-logic/value-objects/index';
import { GuiaDomainEntity } from '../../../../../guias_trazabilidad/business-logic/guia.domain-entity-root';
import { BadRequestException } from '@nestjs/common';
import { CoordenadasReadModel } from '../../../../../guias_trazabilidad/application/read-models/geocoding-response.read-model';

export function mapperCrearGuia(command: CrearGuiaCommand, coordRemitente: CoordenadasReadModel, coordDestinatario: CoordenadasReadModel): GuiaDomainEntity {

    // mapper
    const dirRemResult = DireccionVO.create({
      calle: command.remitente.direccion.calle,
      numero: command.remitente.direccion.numero,
      numeroInterior: command.remitente.direccion.numeroInterior,
      asentamiento: command.remitente.direccion.asentamiento,
      codigoPostal: command.remitente.direccion.codigoPostal,
      localidad: command.remitente.direccion.localidad,
      estado: command.remitente.direccion.estado,
      pais: command.remitente.direccion.pais,
      referencia: command.remitente.direccion.referencia,
      lat: coordRemitente.latitud,
      lng: coordRemitente.longitud
    });
    if (dirRemResult.isFailure()) {
      throw new BadRequestException(dirRemResult.getError());
    }
    const direccionRemitente = dirRemResult.getValue();

    const telRemResult = TelefonoVO.create(command.remitente.telefono);
    if (telRemResult.isFailure()) {
      throw new BadRequestException(telRemResult.getError());
    }
    const telefonoRemitente = telRemResult.getValue();

    const remitenteResult = ContactoVO.create({
      nombres: command.remitente.nombres,
      apellidos: command.remitente.apellidos,
      telefono: telefonoRemitente, // result pattern telefono
      direccion: direccionRemitente, // result pattern direccion
    });
    if (remitenteResult.isFailure()) {
      throw new BadRequestException(remitenteResult.getError())
    }
    const remitente = remitenteResult.getValue()

    const dirDestResult = DireccionVO.create({
      calle: command.destinatario.direccion.calle,
      numero: command.destinatario.direccion.numero,
      numeroInterior: command.destinatario.direccion.numeroInterior,
      asentamiento: command.destinatario.direccion.asentamiento,
      codigoPostal: command.destinatario.direccion.codigoPostal,
      localidad: command.destinatario.direccion.localidad,
      estado: command.destinatario.direccion.estado,
      pais: command.destinatario.direccion.pais,
      referencia: command.destinatario.direccion.referencia,
      lat: coordDestinatario.latitud,
      lng: coordDestinatario.longitud
    });
    if (dirDestResult.isFailure()) {
      throw new BadRequestException(dirDestResult.getError());
    }
    const direccionDestinatario = dirDestResult.getValue();

    const telDestResult = TelefonoVO.create(command.destinatario.telefono);
    if (telDestResult.isFailure()) {
      throw new BadRequestException(telDestResult.getError());
    }
    const telefonoDestinatario = telDestResult.getValue();

    const destinatarioResult = ContactoVO.create({
      nombres: command.destinatario.nombres,
      apellidos: command.destinatario.apellidos,
      telefono: telefonoDestinatario,
      direccion: direccionDestinatario,
    });
    if (destinatarioResult.isFailure()) {
      throw new BadRequestException(destinatarioResult.getError())
    }
    const destinatario = destinatarioResult.getValue()

    const embalajeResult = EmbalajeVO.create({
      alto_cm: command.dimensiones.alto_cm,
      ancho_cm: command.dimensiones.ancho_cm,
      largo_cm: command.dimensiones.largo_cm,
      peso: command.peso,
    });
    if (embalajeResult.isFailure()) {
      throw new BadRequestException(embalajeResult.getError());
    }
    const embalaje = embalajeResult.getValue();

    const valDdoResult = ValorDeclaradoVO.create(command.valorDeclarado);
    if (valDdoResult.isFailure()) {
      throw new BadRequestException(valDdoResult.getError());
    }
    const valorDeclarado = valDdoResult.getValue();

    const guia = GuiaDomainEntity.create({
      remitente: remitente, // result pattern remitente
      destinatario: destinatario, // result pattern destinatario
      embalaje: embalaje, // result pattern embalaje
      valorDeclarado: valorDeclarado, // result pattern valorDeclarado
    });
    // fin mapper

    return guia;
 }
