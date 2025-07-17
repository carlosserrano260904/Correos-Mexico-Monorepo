import { Result } from '../../../utils/result';
import { DireccionVO } from './direccion.vo';
import { IdVO } from './id.vo';
import { TelefonoVO } from './telefono.vo';

interface ContactoProps {
  idTecnico: IdVO; // auto
  nombres: string;
  apellidos: string;
  telefono: TelefonoVO;
  direccion: DireccionVO;
  idUsuario?: IdVO; // referencia a entidad usuario
}

export class ContactoVO {
  private constructor(private readonly props: ContactoProps) {}

  public static create(
    props: Omit<ContactoProps, 'idTecnico'>,
  ): Result<ContactoVO> {
    if (!props.nombres || props.nombres.trim().length === 0) {
      return Result.failure('El campo nombres no puede estar vacio.');
    }
    if (!props.apellidos || props.apellidos.trim().length === 0) {
      return Result.failure('El campo apellidos no puede estar vacio.');
    }
    return Result.success(
      new ContactoVO({
        ...props,
        idTecnico: IdVO.safeCreate(),
      }),
    );
  }

  public static safeCreate(
    props: Omit<ContactoProps, 'idTecnico'>,
  ): ContactoVO {
    return new ContactoVO({
      ...props,
      idTecnico: IdVO.safeCreate(),
    });
  }

  public static fromPersistence(props: ContactoProps): ContactoVO {
    return new ContactoVO(props);
  }

  get getNombres(): string {
    return this.props.nombres;
  }

  get getApellidos(): string {
    return this.props.apellidos;
  }

  get getTelefono(): TelefonoVO {
    return this.props.telefono;
  }

  get getDireccion(): DireccionVO {
    return this.props.direccion;
  }
  get getIdUsuario(): IdVO | undefined {
    return this.props.idUsuario;
  }

  get getIdTecnico(): IdVO {
    return this.props.idTecnico;
  }
}
