import { Injectable } from '@nestjs/common';
import { Result } from 'src/utils/result';
import { PDFGeneratorRepositoryInterface } from '../../application/ports/outbound/pdf-generator.repository.interface';
import { GuiaDomainEntity } from 'src/guias_trazabilidad/business-logic/guia.domain-entity-root';
import { GuiaMapper } from '../mappers/guia.mapper';
import { plantillaGuiaNacional } from './plantillas/guia-plantilla-nacional';

@Injectable()
export class PDFGeneratorRepository implements PDFGeneratorRepositoryInterface {

  async generateGuiaPDF(guiaEntity: GuiaDomainEntity, qrCodeDataURL: string): Promise<Result<Buffer>> {
    try {
      // Importación dinámica para evitar el error ERR_REQUIRE_ESM
      const { pdf } = await import('@react-pdf/renderer');

      // mapear entidad a payload
      const data = GuiaMapper.toPdfPayload(guiaEntity);

      // invocar plantilla -> retorna el componente de react
      const GuiaDocument = await plantillaGuiaNacional(data, qrCodeDataURL);
      // convertir a buffer
      const pdfBlob = await pdf(GuiaDocument).toBlob();
      const pdfBuffer = Buffer.from(await pdfBlob.arrayBuffer());

      return Result.success(pdfBuffer);
    } catch (error) {
      return Result.failure(`Error generando PDF: ${error.message}`);
    }
  }
}