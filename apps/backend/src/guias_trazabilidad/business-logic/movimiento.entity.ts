import { Result } from '../../utils/result';
import { IdVO } from './value-objects/id.vo';
import { SituacionVO } from './value-objects/situacion.vo';

interface MovimientoProps {
  idMovimiento: IdVO; // auto
  idSucursal: string;
  idRuta: string;
  estado: SituacionVO; // El estado y la sincronizacion deben ser el mismo
  localizacion: string;
  fechaMovimiento: Date; // auto
}

export class MovimientoDomainEntity {
  private constructor(private readonly props: MovimientoProps) {}

  /**
   * Crea el movimiento por primera vez
   * @param props
   * @returns {}
   */
  public static create(
    props: Omit<MovimientoProps, 'idMovimiento' | 'fechaMovimiento'>,
  ): Result<MovimientoDomainEntity> {
    if (!props.idSucursal.trim()) {
      return Result.failure(
        'Falta el Id de la sucursal para registrar el movimiento',
      );
    }
    if (!props.localizacion.trim()) {
      return Result.failure(
        'Falta el campo localizacion para registrar el movimiento',
      );
    }
    if (!props.idRuta.trim()) {
      return Result.failure(
        'Falta el Id de la ruta para registrar el movimiento',
      );
    }
    return Result.success(
      new MovimientoDomainEntity({
        ...props,
        idMovimiento: IdVO.safeCreate(),
        fechaMovimiento: new Date(),
      }),
    );
  }

  public static fromPersistence(
    props: MovimientoProps,
  ): MovimientoDomainEntity {
    return new MovimientoDomainEntity(props);
  }

  get idMovimiento(): IdVO {
    return this.props.idMovimiento;
  }

  get getIdSucursal(): string {
    return this.props.idSucursal;
  }

  get getIdRuta(): string {
    return this.props.idRuta;
  }

  get estado(): SituacionVO {
    return this.props.estado;
  }

  get getLocalizacion(): string {
    return this.props.localizacion;
  }

  get getFechaMovimiento(): Date {
    return this.props.fechaMovimiento;
  }
}
