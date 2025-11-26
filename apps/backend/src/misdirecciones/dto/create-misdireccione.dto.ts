import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMisdireccioneDto {
  @ApiProperty({
    description: 'Nombre de la persona asociada a la dirección',
    example: 'Juan Pérez',
  })
  @IsString()
  nombre: string;

  @ApiProperty({
    description: 'Calle donde se ubica la dirección',
    example: 'Av. Reforma',
  })
  @IsString()
  calle: string;

  @ApiProperty({
    description: 'Colonia o fraccionamiento',
    example: 'Centro Histórico',
  })
  @IsString()
  colonia_fraccionamiento: string;

  @ApiProperty({
    description: 'Número interior (si aplica)',
    example: 202,
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsNumber()
  numero_interior: number | null;

  @ApiProperty({
    description: 'Número exterior',
    example: 123,
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsNumber()
  numero_exterior: number | null;

  @ApiProperty({
    description: 'Número de celular asociado',
    example: '+52 5512345678',
  })
  @IsString()
  numero_celular: string;

  @ApiProperty({
    description: 'Código postal',
    example: '06000',
  })
  @IsString()
  codigo_postal: string;

  @ApiProperty({
    description: 'Estado',
    example: 'Ciudad de México',
  })
  @IsString()
  estado: string;

  @ApiProperty({
    description: 'Municipio',
    example: 'Cuauhtémoc',
  })
  @IsString()
  municipio: string;

  @ApiProperty({
    description: 'Información adicional sobre la dirección',
    example: 'Departamento en el segundo piso',
    required: false,
  })
  @IsOptional()
  @IsString()
  mas_info: string;

  @ApiProperty({
    description: 'ID del usuario dueño de la dirección',
    example: 1,
  })
  @IsNumber()
  usuarioId: number;
}
