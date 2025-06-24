import { GuiaDomainEntity } from 'src/guias_trazabilidad/business-logic/guia.domain-entity-root';
import { NumeroSeguimientoVO } from 'src/guias_trazabilidad/business-logic/value-objects/numeroSeguimiento.vo';

export const GUIAREPOSITORYINTERFACE = Symbol('GuiaRepositoryInterface');

export interface GuiaRepositoryInterface {
  // CRUD
  save(guia: GuiaDomainEntity): Promise<void>;
  findByNumeroSeguimiento(numeroSeguimiento: NumeroSeguimientoVO): Promise<GuiaDomainEntity | null>;
  // delete(id: IdVO): Promise<void>;
}
