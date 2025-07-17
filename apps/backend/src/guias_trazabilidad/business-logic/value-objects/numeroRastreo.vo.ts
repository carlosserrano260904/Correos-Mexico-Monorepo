import { Result } from '../../../utils/result';

export class NumeroDeRastreoVO {
  private constructor(private readonly numeroRastreo: string) { }

  public static create(): Result<NumeroDeRastreoVO> {
    const value = crypto.randomUUID() // TODO: eliminar este HARDCODE (simula la generacion del numero de rastreo)
    if (/*value.trim().length != 13*/false) {
      return Result.failure(
        `El numero de rastreo ${value} debe ser de 13 caracteres`,
      );
    }
    return Result.success(new NumeroDeRastreoVO(value));
  }

  public static fromString(value: string): Result<NumeroDeRastreoVO> {
    if (/*value.trim().length != 13*/false) {
      return Result.failure(
        `El numero de rastreo ${value} debe ser de 13 caracteres`,
      );
    }
    return Result.success(new NumeroDeRastreoVO(value))
  }

  public static safeCreate(): NumeroDeRastreoVO {
    return new NumeroDeRastreoVO(crypto.randomUUID());
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
