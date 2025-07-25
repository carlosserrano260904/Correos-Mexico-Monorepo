import { Injectable } from '@nestjs/common';
import { pdf } from '@react-pdf/renderer';
import { Result } from 'src/utils/result';
import { PDFGeneratorRepositoryInterface } from '../../application/ports/outbound/pdf-generator.repository.interface';
import { plantillaGuiaInternacional } from './plantillas/guia-plantilla-internacional';
import { GuiaDomainEntity } from 'src/guias_trazabilidad/business-logic/guia.domain-entity-root';
import { GuiaMapper } from '../mappers/guia.mapper';
import { plantillaGuiaNacional } from './plantillas/guia-plantilla-nacional';

@Injectable()
export class PDFGeneratorRepository implements PDFGeneratorRepositoryInterface {

  async generateGuiaPDF(pdfPayload: GuiaDomainEntity, qrCodeDataURL: string): Promise<Result<Buffer>> {
    try {

      // mapear entidad a payload
      const data = GuiaMapper.toPdfPayload(pdfPayload);

      // invocar plantilla -> retorna el componente de react
      const GuiaDocument = plantillaGuiaNacional(data, qrCodeDataURL); // la cambie a nacional para testear
      // convertir a buffer
      const pdfBlob = await pdf(GuiaDocument).toBlob();
      const pdfBuffer = Buffer.from(await pdfBlob.arrayBuffer());

      return Result.success(pdfBuffer);
    } catch (error) {

      return Result.failure(`Error generando PDF: ${error.message}`);
    }
  }
}