import { Result } from '../../../utils/result';

export class NumeroDeRastreoVO {
  private constructor(private readonly numeroRastreo: string) {}

  public static safeCreate(): NumeroDeRastreoVO {
    const servicios = { Estandar: 'CA', Express: 'EE', Menor: 'RT' };

    const pais = 'MX';

    function genId(): number {
      const min = 100_000_000;
      const max = 999_999_999;
      return Math.floor(Math.random() * (max - min + 1) + min);
    }

    const id = genId().toString();

    const value = `${servicios.Express}${pais}${id}`;

    return new NumeroDeRastreoVO(value);
  }

  public static fromString(value: string): Result<NumeroDeRastreoVO> {
    if (value.trim().length != 13) {
      return Result.failure(
        `El numero de rastreo ${value} debe ser de 13 caracteres`,
      );
    }
    return Result.success(new NumeroDeRastreoVO(value));
  }

  public static fromPersistence(value: string): NumeroDeRastreoVO {
    return new NumeroDeRastreoVO(value);
  }

  public toString(): string {
    return this.numeroRastreo;
  }

  get getNumeroRastreo(): string {
    return this.numeroRastreo;
  }
}
