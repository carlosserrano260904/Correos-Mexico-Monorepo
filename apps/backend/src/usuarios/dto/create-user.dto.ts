import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @IsNotEmpty()
  @ApiProperty({ example: 'Juan Pérez' })
  nombre: string;

  @IsEmail()
  @ApiProperty({ example: 'juan@example.com' })
  correo: string;

  @ApiProperty({ example: 'password123', required: false })
  contrasena?: string;

  @ApiProperty({ example: 'usuario', required: false })
  rol?: string;
}
