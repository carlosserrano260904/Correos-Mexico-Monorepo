import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    example: 'Juan Pérez',
    description: 'Nombre completo del usuario',
  })
  @IsString()
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  nombre: string;

  @ApiProperty({
    example: 'juan@example.com',
    description: 'Correo electrónico único',
  })
  @IsEmail({}, { message: 'El correo electrónico no es válido' })
  @IsNotEmpty({ message: 'El correo electrónico es obligatorio' })
  correo: string;

  // IMPORTANTE: Se deja opcional para permitir OAuth (Google/Facebook)
  // Se mantiene el mínimo de 6 caracteres del equipo para compatibilidad
  @ApiProperty({
    example: 'password123',
    description: 'Contraseña del usuario',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  contrasena?: string;

  @ApiProperty({
    example: 'usuario',
    description: 'Rol del usuario (admin, vendedor, usuario)',
    required: false,
  })
  @IsOptional()
  @IsString()
  rol?: string;
}
