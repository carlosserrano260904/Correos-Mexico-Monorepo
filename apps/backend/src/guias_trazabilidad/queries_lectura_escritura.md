 import { GuiaEntity } from '../entities/guia/guia.aggregate-root';
 import { IdGuiaVo } from '../value-objects/id-guia.vo';
 import { SituacionGuiaVo } from '../value-objects/situacion-guia.vo';

 export interface FiltrosGuia {
     situacion?: SituacionGuiaVo;
     codigoSeguimiento?: string;
     fechaCreacionDesde?: Date;
     fechaCreacionHasta?: Date;
     remitenteId?: string;
     destinatarioId?: string;
     idSucursal?: string;
     tipoGuia?: string;
 }

 export interface GuiaRepositoryInterface {
     save(guia: GuiaEntity): Promise<void>;
     findById(id: IdGuiaVo): Promise<GuiaEntity | null>;
     findByCodigoSeguimiento(codigo: string): Promise<GuiaEntity | null>;
     update(guia: GuiaEntity): Promise<void>;
     delete(id: IdGuiaVo): Promise<void>;

     findBySituacion(situacion: SituacionGuiaVo): Promise<GuiaEntity[]>;
     findByRemitente(remitenteId: string): Promise<GuiaEntity[]>;
     findByDestinatario(destinatarioId: string): Promise<GuiaEntity[]>;
     findBySucursal(idSucursal: string): Promise<GuiaEntity[]>;

     findWithFilters(filtros: FiltrosGuia): Promise<GuiaEntity[]>;
     findWithPagination(
         filtros: FiltrosGuia,
         page: number,
         limit: number
     ): Promise<{
         guias: GuiaEntity[];
         total: number;
         page: number;
         totalPages: number;
     }>;

     countBySituacion(situacion: SituacionGuiaVo): Promise<number>;
     countByFechaCreacion(fechaDesde: Date, fechaHasta: Date): Promise<number>;
     countGuiasConIncidencias(): Promise<number>;

     findGuiasVencidas(): Promise<GuiaEntity[]>;
     findGuiasConIncidenciasPendientes(): Promise<GuiaEntity[]>;
     findGuiasEnTransitoPorTiempo(dias: number): Promise<GuiaEntity[]>;
 } 