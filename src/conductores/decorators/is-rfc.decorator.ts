import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ name: 'IsRFC', async: false })
export class IsRFCConstraint implements ValidatorConstraintInterface {
  validate(rfc: string): boolean {
    if (typeof rfc !== 'string') return false;

    if (rfc === 'XAXX010101000' || rfc === 'XEXX010101000') return true;

    const regex = /^([A-ZÑ&]{3,4})(\d{2})(\d{2})(\d{2})([A-Z0-9]{3})$/;
    const match = rfc.match(regex);
    if (!match) return false;

    const [_, __, yy, mm, dd] = match;
    const year = parseInt(yy);
    const fullYear = year >= 0 && year <= 30 ? 2000 + year : 1900 + year;
    const month = parseInt(mm);
    const day = parseInt(dd);

    const date = new Date(fullYear, month - 1, day);
    return (
      date.getFullYear() === fullYear &&
      date.getMonth() === month - 1 &&
      date.getDate() === day
    );
  }

  defaultMessage(): string {
    return 'El RFC debe tener un formato válido y contener una fecha real (AAMMDD).';
  }
}


export function IsRFC(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsRFCConstraint,
    });
  };
}