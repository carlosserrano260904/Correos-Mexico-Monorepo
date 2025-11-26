import { Result } from '../../../utils/result';

interface EmbalajeProps {
  alto_cm: number;
  ancho_cm: number;
  largo_cm: number;
  peso: number;
}

export class EmbalajeVO {
  private constructor(private readonly props: EmbalajeProps) {}

  public static create(props: EmbalajeProps): Result<EmbalajeVO> {
    if (props.peso <= 0) {
      return Result.failure('El peso no puede ser menor o igual a 0');
    }

    if (props.largo_cm <= 0 || props.ancho_cm <= 0 || props.alto_cm <= 0) {
      return Result.failure('No puede haber dimensiones menores o igual a 0');
    }

    const obj = new EmbalajeVO(props);

    const pesoFisico = obj.calcularPeso();
    const pesoVolumetrico = obj.calcularPesoVolumetrico();

    if (pesoFisico > 25) {
      return Result.failure(`Peso actual de: ${pesoFisico} excede los 25 KG`);
    }

    if (pesoVolumetrico > 40) {
      return Result.failure(
        `Peso volumetrico actual de: ${pesoVolumetrico} excede los 40 KG`,
      );
    }

    return Result.success(obj);
  }

  public static safeCreate(props: EmbalajeProps): EmbalajeVO {
    return new EmbalajeVO(props);
  }

  public static fromPersistence(props: EmbalajeProps): EmbalajeVO {
    return new EmbalajeVO(props);
  }

  public calcularVolumen() {
    return this.props.alto_cm * this.props.ancho_cm * this.props.largo_cm;
  }

  public calcularPesoVolumetrico() {
    return this.calcularVolumen() / 6000;
  }

  public calcularPeso() {
    return this.props.peso;
  }

  get getAltoCm(): number {
    return this.props.alto_cm;
  }

  get getLargoCm(): number {
    return this.props.largo_cm;
  }

  get getPeso(): number {
    return this.props.peso;
  }

  get getAnchoCm(): number {
    return this.props.ancho_cm;
  }
}
