import { Result } from "../../../utils/result";

const incidencias = ['Extravio', 'Retraso'] as const
export type Incidencias = typeof incidencias[number]

export class TipoIncidenciaVO {
    private constructor(
        private readonly incidencia: Incidencias
    ) { }

    public static create(incidencia: Incidencias): Result<TipoIncidenciaVO> {
        if (!incidencias.includes(incidencia)) {
            return Result.failure(`Motivo ${incidencia} no valido`)
        }

        return Result.success(new TipoIncidenciaVO(incidencia as Incidencias))
    }

    public static safeCreate(incidencia: Incidencias): TipoIncidenciaVO {
        return new TipoIncidenciaVO(incidencia as Incidencias);
    }


    public static fromString(incidencia: string): TipoIncidenciaVO {
        return new TipoIncidenciaVO(incidencia as Incidencias)
    }
    
    public static fromPersistence(incidencia: string): TipoIncidenciaVO {
        return new TipoIncidenciaVO(incidencia as Incidencias)
    }

    get getIncidencia(): Incidencias {
        return this.incidencia
    }
}