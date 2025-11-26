import {
  IsString,
  IsEmail,
  Length,
  Matches,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SolicitudDto {
  @ApiProperty({
    example: 'Abarrotes Don Pepe',
    description: 'Nombre comercial de la tienda',
  })
  @IsString()
  @IsNotEmpty({ message: 'El nombre de la tienda es obligatorio' })
  nombre_tienda: string;

  @ApiProperty({ example: 'electronica', description: 'Categoría del negocio' })
  @IsString()
  @IsNotEmpty({ message: 'La categoría es obligatoria' })
  categoria_tienda: string;

  @ApiProperty({ example: '6181234567', description: 'Teléfono a 10 dígitos' })
  @IsString()
  @Length(10, 10, { message: 'El teléfono debe tener exactamente 10 dígitos' })
  @Matches(/^[0-9]+$/, { message: 'El teléfono solo debe contener números' })
  telefono: string;

  @ApiProperty({ example: 'tienda@correo.com' })
  @IsEmail({}, { message: 'El formato del correo no es válido' })
  email: string;

  @ApiProperty({ example: 'Av. 20 de Noviembre #123' })
  @IsString()
  @IsNotEmpty({ message: 'La dirección fiscal es obligatoria' })
  direccion_fiscal: string;

  @ApiProperty({ example: 'XAXX010101000', description: 'RFC con homoclave' })
  @IsString()
  // Misma Regex que tu Frontend
  @Matches(/^[A-Z&Ñ]{3,4}\d{6}[A-Z\d]{3}$/, {
    message: 'El RFC no tiene un formato válido (Ej: GOMA900101H52)',
  })
  rfc: string;

  @ApiProperty({ example: 'AAAA000000HDFXXX00', description: 'CURP oficial' })
  @IsString()
  // Misma Regex que tu Frontend
  @Matches(/^[A-Z]{4}\d{6}[HM][A-Z]{5}[A-Z\d]\d$/, {
    message: 'La CURP no tiene un formato válido',
  })
  curp: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  img_uri?: string;

  @ApiProperty({ description: 'ID del usuario que solicita ser vendedor' })
  @IsString()
  @IsNotEmpty()
  userId: string;
}
