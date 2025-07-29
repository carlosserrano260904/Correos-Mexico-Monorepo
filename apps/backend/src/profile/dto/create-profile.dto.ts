import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  Matches,
  ValidateIf
} from 'class-validator';

export class CreateProfileDto {
  @ApiProperty({ example: 'Cristian', description: 'Nombre del usuario' })
  @IsOptional()
  @IsString()
  nombre?: string;

  @ApiProperty({ example: 'Torres', description: 'Apellido del usuario' })
  @IsOptional()
  @IsString()
  apellido?: string;

  @ApiProperty({ example: '6182538020', description: 'Número telefónico del usuario' })
  @IsOptional()
  @ValidateIf((o) => o.numero !== '')
  @Matches(/^\d{10}$/, { message: 'El número debe contener 10 dígitos' })
  numero?: string;

  @ApiProperty({ example: 'Durango', description: 'Estado de origen del usuario' })
  @IsOptional()
  @IsString()
  estado?: string;

  @ApiProperty({ example: 'Durango', description: 'Ciudad de origen del usuario' })
  @IsOptional()
  @IsString()
  ciudad?: string;

  @ApiProperty({ example: 'Los encinos', description: 'Fraccionamiento del usuario' })
  @IsOptional()
  @IsString()
  fraccionamiento?: string;

  @ApiProperty({ example: 'Calle-Ejemplo', description: 'Calle del usuario' })
  @IsOptional()
  @IsString()
  calle?: string;

  @ApiProperty({ example: '34227', description: 'Código postal del usuario' })
  @IsOptional()
  @ValidateIf((o) => o.codigoPostal !== '')
  @Matches(/^\d{5}$/, { message: 'El código postal debe contener 5 dígitos' })
  codigoPostal?: string;
}