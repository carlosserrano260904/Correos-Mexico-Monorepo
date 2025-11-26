import { Result } from '../../utils/result';
import { IdVO } from './value-objects/id.vo';
import { TipoIncidenciaVO } from './value-objects/tipoIncidencia.vo';

interface Props {
  idIncidencia: IdVO; // id tecnico
  tipoIncidencia: TipoIncidenciaVO;
  fechaIncidencia: Date; // auto
  idResponsable: string; // referencia al empleado que hizo el registro
  descripcion?: string;
}

type UpdatableProps = Partial<Pick<Props, 'tipoIncidencia' | 'descripcion'>>; // pendiente

export class IncidenciaDomainEntity {
  private constructor(private readonly props: Props) {}

  public static create(
    props: Omit<Props, 'idIncidencia' | 'fechaIncidencia'>,
  ): Result<IncidenciaDomainEntity> {
    if (!props.idResponsable) {
      return Result.failure('Falta el idResponsable');
    }
    return Result.success(
      new IncidenciaDomainEntity({
        ...props,
        idIncidencia: IdVO.safeCreate(),
        fechaIncidencia: new Date(),
      }),
    );
  }

  public static fromPersistence(props: Props): IncidenciaDomainEntity {
    return new IncidenciaDomainEntity(props);
  }

  private update(updatedProps: UpdatableProps): IncidenciaDomainEntity {
    return new IncidenciaDomainEntity({
      ...this.props,
      ...updatedProps,
    });
  }

  public cambiatTipoIncidencia(
    nuevaIncidencia: TipoIncidenciaVO,
  ): IncidenciaDomainEntity {
    return this.update({
      tipoIncidencia: nuevaIncidencia,
    });
  }

  public cambiarDescripcion(nuevaDescripcion: string): IncidenciaDomainEntity {
    return this.update({
      descripcion: nuevaDescripcion,
    });
  }

  get idIncidencia(): IdVO {
    return this.props.idIncidencia;
  }

  get tipoIncidencia(): TipoIncidenciaVO {
    return this.props.tipoIncidencia;
  }

  get getDescripcion(): string | undefined {
    return this.props.descripcion;
  }

  get getFechaIncidencia(): Date {
    return this.props.fechaIncidencia;
  }

  get getIdResponsable(): string {
    return this.props.idResponsable;
  }
}
