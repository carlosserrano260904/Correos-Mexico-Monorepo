import { Result } from '../../../utils/result';

export class TelefonoVO {
  private constructor(private readonly numero: string) {}

  public static create(numero: string): Result<TelefonoVO> {
    // Limpiar espacios para validación
    // const numeroLimpio = numero.replace(/\s/g, '');

    // if (!TelefonoVO.esFormatoValido(numeroLimpio)) {
    //     return Result.failure(`El numero ${numero} no cumple con el formato E.164`)
    // }

    if (!numero) {
      return Result.failure(`Falta el numero de telefono`);
    }

    return Result.success(new TelefonoVO(numero));
  }

  public static fromString(value: string): TelefonoVO {
    return new TelefonoVO(value);
  }

  // private static esFormatoValido(value: string): boolean {
  //     const regex = /^\+\d{8,15}$/
  //     return regex.test(value)
  // }

  get getNumero(): string {
    return this.numero;
  }
}
