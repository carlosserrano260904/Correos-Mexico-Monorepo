import { Result } from '../../../utils/result';

const situaciones = [
  'Creado',
  'En proceso',
  'En recoleccion',
  'Recolectado',
  'En transito',
  'En aduana',
  'En entrega',
  'Entregado',
  'Reprogramado',
  'Cancelado',
  'Devuelto',
  'Rechazado',
  'Investigacion en curso',
  'Perdida confirmada',
  'Retrasado',
] as const;

export type Situacion = (typeof situaciones)[number];

export class SituacionVO {
  private constructor(private readonly situacion: Situacion) { }

  public static create(situacion: Situacion): Result<SituacionVO> {
    if (!situaciones.includes(situacion)) {
      return Result.failure('La situacion no es valida');
    }
    return Result.success(new SituacionVO(situacion));
  }

  public static safeCreate(situacion: Situacion): SituacionVO {
    return new SituacionVO(situacion as Situacion);
  }

  public static fromPersistence(value: string): SituacionVO {
    return new SituacionVO(value as Situacion);
  }

  public static fromString(value: string): SituacionVO {
    return new SituacionVO(value as Situacion);
  }

  get getSituacion(): Situacion {
    return this.situacion;
  }
}
