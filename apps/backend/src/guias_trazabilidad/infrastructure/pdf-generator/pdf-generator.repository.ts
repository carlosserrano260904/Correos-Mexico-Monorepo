import { Injectable } from '@nestjs/common';
import { pdf } from '@react-pdf/renderer';
import { Result } from 'src/utils/result';
import { PDFGeneratorRepositoryInterface } from '../../application/ports/outbound/pdf-generator.repository.interface';
import { plantillaGuia } from './plantillas/guia-plantilla';
import { GuiaDomainEntity } from 'src/guias_trazabilidad/business-logic/guia.domain-entity-root';
import { GuiaMapper } from '../mappers/guia.mapper';

@Injectable()
export class PDFGeneratorRepository implements PDFGeneratorRepositoryInterface {

  async generateGuiaPDF(pdfPayload: GuiaDomainEntity, qrCodeDataURL: string): Promise<Result<Buffer>> {
    try {

      const data = GuiaMapper.toPdfPayload(pdfPayload);

      const GuiaDocument = plantillaGuia(data, qrCodeDataURL);
      const pdfBlob = await pdf(GuiaDocument).toBlob();
      const pdfBuffer = Buffer.from(await pdfBlob.arrayBuffer());
      return Result.success(pdfBuffer);
    } catch (error) {
      return Result.failure(`Error generando PDF: ${error.message}`);
    }
  }
}