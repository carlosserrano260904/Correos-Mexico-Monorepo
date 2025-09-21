import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ name: 'IsCURP', async: false })
export class IsCURPConstraint implements ValidatorConstraintInterface {
  validate(curp: string): boolean {
    if (typeof curp !== 'string') return false;

    const regex = /^[A-Z]{4}(\d{2})(\d{2})(\d{2})([HM])[A-Z]{5}[A-Z\d]{2}$/;
    const match = curp.match(regex);
    if (!match) return false;

    const [_, yy, mm, dd] = match;

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
    return 'La CURP debe tener un formato válido y contener una fecha real (AAMMDD).';
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