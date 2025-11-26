import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsDateString,
  IsNumber,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class GuiaFiltrosDto {
  @ApiProperty({
    description: 'Estado/situación de la guía',
    required: false,
    example: 'En proceso',
  })
  @IsOptional()
  @IsString()
  estado?: string;

  @ApiProperty({
    description: 'Fecha desde (formato ISO)',
    required: false,
    example: '2024-01-01',
  })
  @IsOptional()
  @IsDateString()
  fechaDesde?: string;

  @ApiProperty({
    description: 'Fecha hasta (formato ISO)',
    required: false,
    example: '2024-12-31',
  })
  @IsOptional()
  @IsDateString()
  fechaHasta?: string;

  @ApiProperty({
    description: 'Número de página',
    required: false,
    example: 1,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  pagina?: number;

  @ApiProperty({
    description: 'Límite de resultados por página',
    required: false,
    example: 10,
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limite?: number;
}
