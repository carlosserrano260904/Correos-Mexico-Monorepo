// Archivo: apps/backend/src/auth/dto/create-user.dto.ts

import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @ApiProperty({ example: 'Juan Pérez' })
  nombre: string;

  @IsEmail({}, { message: 'El correo electrónico no es válido' })
  @IsNotEmpty({ message: 'El correo electrónico es obligatorio' })
  @ApiProperty({ example: 'juan@example.com' })
  correo: string;

  @IsString()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  // Puedes añadir más validaciones si quieres (ej. @Matches(...))
  @ApiProperty({ example: 'password123' })
  contrasena: string;

  @IsString()
  @IsOptional() // El rol es opcional, ya que la entidad tiene un valor por defecto
  @ApiProperty({ example: 'usuario', required: false })
  rol?: string;
}