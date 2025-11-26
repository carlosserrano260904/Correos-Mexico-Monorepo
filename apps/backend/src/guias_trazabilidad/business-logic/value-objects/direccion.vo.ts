import { Result } from '../../../utils/result';

interface DireccionProps {
  calle: string;
  numero: string;
  numeroInterior?: string; // si aplica.
  asentamiento: string; // fracc, col, ejido, rancho, etc
  codigoPostal: string;
  localidad: string; // el correo no usa municipios ni alcaldias, solo usa la localidad asociada directamente al codigo postal
  estado: string;
  pais: string;
  lat?: number;
  lng?: number;
  referencia?: string;
}

export class DireccionVO {
  private constructor(private readonly props: DireccionProps) {}

  public static safeCreate(props: DireccionProps): DireccionVO {
    return new DireccionVO(props);
  }

  public static create(props: DireccionProps): Result<DireccionVO> {
    return Result.success(new DireccionVO(props));
  }

  public static fromPersistence(props: DireccionProps): DireccionVO {
    return new DireccionVO(props);
  }

  get getCalle(): string {
    return this.props.calle;
  }

  get getNumero(): string {
    return this.props.numero;
  }

  get getNumeroInterior(): string | undefined {
    return this.props.numeroInterior;
  }

  get getLocalidad(): string {
    return this.props.localidad;
  }

  get getPais(): string {
    return this.props.pais;
  }

  get getCodigoPostal(): string {
    return this.props.codigoPostal;
  }

  get getEstado(): string {
    return this.props.estado;
  }

  get getAsentamiento(): string {
    return this.props.asentamiento;
  }

  get getLat(): number | undefined {
    return this.props.lat;
  }

  get getLng(): number | undefined {
    return this.props.lng;
  }

  get getReferencia(): string | undefined {
    return this.props.referencia;
  }
}
