import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ name: 'IsCURP', async: false })
export class IsCURPConstraint implements ValidatorConstraintInterface {
  validate(curp: string): boolean {
    if (typeof curp !== 'string') return false;
    
    const regex = /^[A-Z]{4}\d{6}[HM][A-Z]{5}[A-Z\d]{2}$/;
    if (!regex.test(curp)) return false;
    
    // Aquí podrías añadir validación del dígito verificador si lo necesitas
    return true;
  }

  defaultMessage(): string {
    return 'La CURP debe tener un formato válido (4 letras, 6 dígitos fecha, H/M, 5 letras, 2 caracteres alfanuméricos)';
  }
}

export function IsCURP(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsCURPConstraint,
    });
  };
}