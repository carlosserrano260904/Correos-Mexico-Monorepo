import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ name: 'IsRFC', async: false })
export class IsRFCConstraint implements ValidatorConstraintInterface {
  validate(rfc: string): boolean {
    if (typeof rfc !== 'string') return false;
    
    // Casos especiales del sistema (como XAXX010101000 para unidades sin conductor)
    if (rfc === 'XAXX010101000' || rfc === 'XEXX010101000') return true;
    
    // Expresión regular para RFCs válidos (personas físicas y morales)
    const regex = /^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/;
    if (!regex.test(rfc)) return false;
    
    /* 
    // VALIDACIÓN DE FECHA (COMENTADA - PUEDES DESCOMENTAR SI LA NECESITAS)
    // Extraer componentes de fecha (AAMMDD)
    const fechaStr = rfc.match(/[A-ZÑ&]{3,4}(\d{6})/)[1];
    const anio = parseInt(fechaStr.substr(0, 2));
    const mes = parseInt(fechaStr.substr(2, 2));
    const dia = parseInt(fechaStr.substr(4, 2));
    
    // Validar fecha (formato básico)
    if (mes < 1 || mes > 12) return false;
    if (dia < 1 || dia > 31) return false;
    */
    
    return true;
  }

  defaultMessage(): string {
    return 'El RFC debe tener un formato válido. Ejemplos: Personas físicas: MEPJ910101ABC (13 caracteres), Personas morales: ABC800101XYZ (12 caracteres), o valores especiales: XAXX010101000';
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