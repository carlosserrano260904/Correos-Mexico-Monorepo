import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger'; // <-- Importante para tu equipo

export class CreateUserDto {
  @ApiProperty({ example: 'Juan Pérez', description: 'Nombre completo del usuario' })
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @ApiProperty({ example: 'juan@example.com', description: 'Correo electrónico único' })
  @IsNotEmpty()
  @IsEmail()
  correo: string;

  @ApiProperty({ example: 'password123', description: 'Contraseña del usuario', required: false })
  @IsOptional()
  @IsString()
  @MinLength(6)
  contrasena?: string;

  @ApiProperty({ example: 'usuario', description: 'Rol del usuario (admin, vendedor, usuario)', required: false })
  @IsOptional()
  @IsString()
  rol?: string;
}