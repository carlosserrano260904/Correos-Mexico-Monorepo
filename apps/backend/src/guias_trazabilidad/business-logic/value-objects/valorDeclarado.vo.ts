import { Result } from '../../../utils/result';

export class ValorDeclaradoVO {
  private constructor(private readonly valorDeclarado: number) {}

  public static create(valorDeclarado: number): Result<ValorDeclaradoVO> {
    if (valorDeclarado <= 0) {
      return Result.failure(
        `El valor ${valorDeclarado} no puede ser menor a cero`,
      );
    }
    return Result.success(new ValorDeclaradoVO(valorDeclarado));
  }

  public static safeCreate(value: number): ValorDeclaradoVO {
    return new ValorDeclaradoVO(value);
  }

  public static fromPersistence(value: number): ValorDeclaradoVO {
    return new ValorDeclaradoVO(value);
  }

  get getValorDeclarado(): number {
    return this.valorDeclarado;
  }
}
