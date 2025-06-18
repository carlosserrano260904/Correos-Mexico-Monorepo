// src/profile/dto/create-profile.dto.ts
import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProfileDto {
  @ApiProperty({ example: 'Diego', description: 'Nombre del usuario' })
  @IsNotEmpty({ message: 'El nombre del usuario es obligatorio' })
  @IsString()
  nombre: string;

  @ApiProperty({ example: 'Trejo', description: 'Apellido del usuario' })
  @IsNotEmpty({ message: 'El apellido del usuario es obligatorio' })
  @IsString()
  apellido: string;

  @ApiProperty({ example: '6182583019', description: 'Número telefónico del usuario' })
  @IsNotEmpty({ message: 'El número del usuario es obligatorio' })
  @Matches(/^\d{10}$/, { message: 'El número debe contener 10 dígitos' })
  numero: string;

  @ApiProperty({ example: 'Durango', description: 'Estado de origen del usuario' })
  @IsString()
  estado: string;

  @ApiProperty({ example: 'Durango', description: 'Ciudad de origen del usuario' })
  @IsString()
  ciudad: string;

  @ApiProperty({ example: 'Los encinos', description: 'Fraccionamiento del usuario' })
  @IsString()
  fraccionamiento: string;

  @ApiProperty({ example: 'Calle-Ejemplo', description: 'Calle del usuario' })
  @IsString()
  calle: string;

  @ApiProperty({ example: '34227', description: 'Código postal del usuario' })
  @Matches(/^\d{5}$/, { message: 'El código postal debe contener 5 dígitos' })
  codigoPostal: string;
}
