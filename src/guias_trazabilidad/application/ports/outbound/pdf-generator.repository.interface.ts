import { GuiaDomainEntity } from "src/guias_trazabilidad/business-logic/guia.domain-entity-root";
import { Result } from "src/utils/result";

export const PDF_GENERATOR_REPOSITORY_INTERFACE = Symbol('PDFGeneratorRepository');

export interface PDFGeneratorRepositoryInterface {
  generarGuiaPDFNacional(pdfPayload: GuiaDomainEntity, qrCodeDataURL: string): Promise<Result<Buffer>>;
  generarGuiaPDFInternacional(pdfPayload: GuiaDomainEntity, qrCodeDataURL): Promise<Result<Buffer>>;
}