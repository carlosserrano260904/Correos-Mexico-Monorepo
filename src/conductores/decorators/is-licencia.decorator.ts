import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ name: 'IsLicenciaConducir', async: false })
export class IsLicenciaConducirConstraint implements ValidatorConstraintInterface {
  validate(licencia: string): boolean {
    if (typeof licencia !== 'string') return false;

    // Caso especial para licencias del sistema (como el ejemplo que mencionaste)
    if (licencia === 'DL00000000') return true;

    /* 
    // FORMATOS COMUNES DE LICENCIAS EN MÉXICO:
    // 1. Formato tradicional (ej. DL753951846)
    //    - 2 letras (DL = Driver License)
    //    - 8-9 dígitos
    */
    const formatoTradicional = /^DL\d{8,9}$/;

    /* 
    // 2. Formato de licencia tipo tarjeta (ej. MX123456789012)
    //    - 2 letras (MX)
    //    - 10-12 dígitos
    */
    const formatoTarjeta = /^MX\d{10,12}$/;

    /* 
    // 3. Formato de licencia federal (ej. FED1234567)
    //    - 3 letras (FED)
    //    - 7-9 dígitos
    */
    const formatoFederal = /^FED\d{7,9}$/;

    return formatoTradicional.test(licencia) || 
           formatoTarjeta.test(licencia) || 
           formatoFederal.test(licencia);
  }

  defaultMessage(): string {
    return 'La licencia debe tener un formato válido. Ejemplos: DL12345678, MX1234567890, FED1234567 o DL00000000 para sistema';
  }
}

export function IsLicenciaConducir(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsLicenciaConducirConstraint,
    });
  };
}