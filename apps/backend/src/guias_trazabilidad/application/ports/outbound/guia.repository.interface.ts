import { GuiaDomainEntity } from '../../../business-logic/guia.domain-entity-root';
import { NumeroDeRastreoVO } from '../../../business-logic/value-objects/numeroRastreo.vo';

export const GUIAREPOSITORYINTERFACE = Symbol('GuiaRepositoryInterface');

export interface GuiaRepositoryInterface {
  save(guia: GuiaDomainEntity): Promise<void>;
  findByNumeroRastreo(
    numeroRastreo: NumeroDeRastreoVO,
  ): Promise<GuiaDomainEntity | null>;
}
