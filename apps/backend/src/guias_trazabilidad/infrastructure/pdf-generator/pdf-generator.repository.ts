import { Injectable } from '@nestjs/common';
import { Result } from '../../../utils/result';
import { PDFGeneratorRepositoryInterface } from '../../application/ports/outbound/pdf-generator.repository.interface';
import { plantillaGuiaInternacional } from './plantillas/guia-plantilla-internacional';
import { GuiaDomainEntity } from '../../../guias_trazabilidad/business-logic/guia.domain-entity-root';
import { GuiaMapper } from '../mappers/guia.mapper';
import { plantillaGuiaNacional } from './plantillas/guia-plantilla-nacional';

@Injectable()
export class PDFGeneratorRepository implements PDFGeneratorRepositoryInterface {
  async generarGuiaPDFNacional(
    pdfPayload: GuiaDomainEntity,
    qrCodeDataURL: string,
  ): Promise<Result<Buffer>> {
    try {
      const { pdf } = await import('@react-pdf/renderer');

      const data = GuiaMapper.toPdfPayload(pdfPayload);
      const GuiaDocument = await plantillaGuiaNacional(data, qrCodeDataURL);

      const pdfBlob = await pdf(GuiaDocument).toBlob();
      const pdfBuffer = Buffer.from(await pdfBlob.arrayBuffer());

      return Result.success(pdfBuffer);
    } catch (error) {
      return Result.failure(`Error generando PDF: ${error.message}`);
    }
  }

  async generarGuiaPDFInternacional(
    pdfPayload: GuiaDomainEntity,
    qrCodeDataURL,
  ): Promise<Result<Buffer>> {
    try {
      const { pdf } = await import('@react-pdf/renderer');

      const data = GuiaMapper.toPdfPayload(pdfPayload);
      const GuiaDocument = await plantillaGuiaInternacional(
        data,
        qrCodeDataURL,
      );

      const pdfBlob = await pdf(GuiaDocument).toBlob();
      const pdfBuffer = Buffer.from(await pdfBlob.arrayBuffer());

      return Result.success(pdfBuffer);
    } catch (error) {
      return Result.failure(`Error generando PDF: ${error.message}`);
    }
  }
}
