import { Inject, InternalServerErrorException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  GUIAREPOSITORYINTERFACE,
  GuiaRepositoryInterface,
} from '../../ports/outbound/guia.repository.interface';
import {
  PDFGeneratorRepositoryInterface,
  PDF_GENERATOR_REPOSITORY_INTERFACE,
} from '../../ports/outbound/pdf-generator.repository.interface';
import {
  QR_GENERATOR_REPOSITORY,
  QRGeneratorRepositoryInterface,
} from '../../ports/outbound/qr-generator.repository.interface';
import {
  GOOGLE_GEOCODE_REPOSITORY_INTERFACE,
  GoogleGeocodeRepositoryInterface,
} from '../../ports/outbound/geocode.repository.interface';
import {
  AWS_REPOSITORY_INTERFACE,
  AWSRepositoryInterface,
} from '../../ports/outbound/aws.repository.interface';
import { CrearGuiaCommand } from './crear-guia.command';
import { mapperCrearGuia } from './mapper/crear-guia.mapper';

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
    private readonly qrRepository: QRGeneratorRepositoryInterface,
    @Inject(GOOGLE_GEOCODE_REPOSITORY_INTERFACE)
    private readonly geocodeRepository: GoogleGeocodeRepositoryInterface,
    @Inject(AWS_REPOSITORY_INTERFACE)
    private readonly awsRepository: AWSRepositoryInterface,
  ) {}

  async execute(
    command: CrearGuiaCommand,
  ): Promise<{ numeroRastreo: string; pdf: Buffer }> {
    // obtener las coordenadas de cada guia
    const coordenadasRemitenteResult =
      await this.geocodeRepository.obtenerCoordenadas({
        calle: command.remitente.direccion.calle,
        numeroExterior: command.remitente.direccion.numero,
        numeroInterior: command.remitente.direccion.numeroInterior,
        asentamiento: command.remitente.direccion.asentamiento,
        codigoPostal: command.remitente.direccion.codigoPostal,
        localidad: command.remitente.direccion.localidad,
        estado: command.remitente.direccion.estado,
        pais: command.remitente.direccion.pais,
      });
    if (coordenadasRemitenteResult.isFailure()) {
      throw new InternalServerErrorException(
        coordenadasRemitenteResult.getError(),
      );
    }
    const coordenadasRemitente = coordenadasRemitenteResult.getValue();

    const coordenadasDestinatarioResult =
      await this.geocodeRepository.obtenerCoordenadas({
        calle: command.destinatario.direccion.calle,
        numeroExterior: command.destinatario.direccion.numero,
        numeroInterior: command.destinatario.direccion.numeroInterior,
        asentamiento: command.destinatario.direccion.asentamiento,
        codigoPostal: command.destinatario.direccion.codigoPostal,
        localidad: command.destinatario.direccion.localidad,
        estado: command.destinatario.direccion.estado,
        pais: command.destinatario.direccion.pais,
      });
    if (coordenadasDestinatarioResult.isFailure()) {
      throw new InternalServerErrorException(
        coordenadasRemitenteResult.getError(),
      );
    }
    const coordenadasDestinatario = coordenadasDestinatarioResult.getValue();

    // crear guia pasando por todas las validaciones
    const guia = mapperCrearGuia(
      command,
      coordenadasRemitente,
      coordenadasDestinatario,
    );

    // persistencia
    await this.guiaRepository.save(guia);

    // generar qr
    const qrResult = await this.qrRepository.generarQRComoDataURL({
      numeroDeRastreo: guia.NumeroRastreo.getNumeroRastreo,
      estado: guia.SituacionActual.getSituacion,
      idRuta: 'rutaPorDefectoPlaceHolder',
      idSucursal: 'sucursalPorDefectoPlaceHolder',
      localizacion: 'localizacionPlaceHolder',
    });
    if (qrResult.isFailure()) {
      throw new InternalServerErrorException(
        `Error al intentar generar QR: ${qrResult.getError()}`,
      );
    }

    // generar pdf
    let pdfResult;
    if (command.tipoServicio === 'nacional') {
      pdfResult = await this.pdfRepository.generarGuiaPDFNacional(
        guia,
        qrResult.getValue(),
      );
      if (pdfResult.isFailure()) {
        throw new InternalServerErrorException(
          `Error al generar PDF: ${pdfResult.getError()}`,
        );
      }
    } else {
      pdfResult = await this.pdfRepository.generarGuiaPDFInternacional(
        guia,
        qrResult.getValue(),
      );
      if (pdfResult.isFailure()) {
        throw new InternalServerErrorException(
          `Error al generar PDF: ${pdfResult.getError()}`,
        );
      }
    }

    // // subir pdf a s3
    // const pdfBuffer = pdfResult.getValue();
    // const pdfKey = await this.awsRepository.subirPDF(pdfBuffer, guia.NumeroRastreo.getNumeroRastreo);
    // console.log(`Se subio el PDF a S3 con el key: ${pdfKey}`); // TODO: eliminar, comentario de debug

    return {
      numeroRastreo: guia.NumeroRastreo.getNumeroRastreo,
      pdf: pdfResult.getValue(),
    };
  }
}
