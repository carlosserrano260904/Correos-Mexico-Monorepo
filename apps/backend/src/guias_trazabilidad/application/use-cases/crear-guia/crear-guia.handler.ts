import { BadRequestException, Inject, InternalServerErrorException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  GUIAREPOSITORYINTERFACE,
  GuiaRepositoryInterface,
} from '../../ports/outbound/guia.repository.interface';
import {
  PDFGeneratorRepositoryInterface,
  PDF_GENERATOR_REPOSITORY_INTERFACE
} from '../../ports/outbound/pdf-generator.repository.interface';
import {
  QR_GENERATOR_REPOSITORY,
  QRGeneratorRepositoryInterface
} from '../../ports/outbound/qr-generator.repository.interface';
import { CrearGuiaCommand } from './crear-guia.command';
import { GuiaDomainEntity } from '../../../business-logic/guia.domain-entity-root';
import { ContactoVO } from '../../../business-logic/value-objects/contacto.vo';
import { EmbalajeVO } from '../../../business-logic/value-objects/embalaje.vo';
import { DireccionVO } from '../../../business-logic/value-objects/direccion.vo';
import { ValorDeclaradoVO } from '../../../business-logic/value-objects/valorDeclarado.vo';
import { TelefonoVO } from '../../../business-logic/value-objects/telefono.vo';

@CommandHandler(CrearGuiaCommand)
export class CrearGuiaCommandHandler
  implements ICommandHandler<CrearGuiaCommand>
{
  constructor(
    @Inject(GUIAREPOSITORYINTERFACE)
    private readonly guiaRepository: GuiaRepositoryInterface,
    @Inject(PDF_GENERATOR_REPOSITORY_INTERFACE)
    private readonly pdfRepository: PDFGeneratorRepositoryInterface,
    @Inject(QR_GENERATOR_REPOSITORY)
    private readonly qrRepository: QRGeneratorRepositoryInterface
  ) {}

  async execute(command: CrearGuiaCommand): Promise<{ numeroRastreo: string; pdf: Buffer }> {
    // mapper
    const dirRemResult = DireccionVO.create({
      calle: command.remitente.direccion.calle,
      numero: command.remitente.direccion.numero,
      ciudad: command.remitente.direccion.ciudad,
      pais: command.remitente.direccion.pais,
      codigoPostal: command.remitente.direccion.codigoPostal,
      estado: command.remitente.direccion.estado,
      municipioDelegacion: command.remitente.direccion.municipioDelegacion,
      asentamiento: command.remitente.direccion.asentamiento,
      referencia: command.remitente.direccion.referencia,
      numeroInterior: command.remitente.direccion.numeroInterior,
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
      ciudad: command.destinatario.direccion.ciudad,
      pais: command.destinatario.direccion.pais,
      codigoPostal: command.destinatario.direccion.codigoPostal,
      estado: command.destinatario.direccion.estado,
      municipioDelegacion: command.destinatario.direccion.municipioDelegacion,
      asentamiento: command.destinatario.direccion.asentamiento,
      referencia: command.destinatario.direccion.referencia,
      numeroInterior: command.destinatario.direccion.numeroInterior,
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

    // persistencia
    await this.guiaRepository.save(guia);

    // generar qr
    const qrResult = await this.qrRepository.generarQRComoDataURL({
      numeroDeRastreo: guia.NumeroRastreo.getNumeroRastreo,
      estado: guia.SituacionActual.getSituacion,
      idRuta: 'rutaPorDefectoPlaceHolder',
      idSucursal: 'sucursalPorDefectoPlaceHolder',
      localizacion: 'localizacionPlaceHolder'
    });
    if (qrResult.isFailure()) {
      throw new InternalServerErrorException(`Error al intentar generar QR: ${qrResult.getError()}`)
    }
    // generar pdf
    const pdfResult = await this.pdfRepository.generateGuiaPDF(guia, qrResult.getValue());
    if (pdfResult.isFailure()) {
      throw new InternalServerErrorException(`Error al generar PDF: ${pdfResult.getError()}`)
    }

    return {
      numeroRastreo: guia.NumeroRastreo.getNumeroRastreo,
      pdf: pdfResult.getValue()
    };
  }
}
