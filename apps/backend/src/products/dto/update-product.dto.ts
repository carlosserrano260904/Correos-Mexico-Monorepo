// update-product.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  // OJO: Como es PartialType, usa ApiPropertyOptional para no contradecir
  @ApiPropertyOptional({
    example: 'Television',
    description: 'Nombre del producto',
  })
  @IsOptional()
  @IsString()
  nombre?: string;

  @ApiPropertyOptional({
    example: 'Televisión con excelente calidad',
    description: 'Descripción del producto',
  })
  @IsOptional()
  @IsString()
  descripcion?: string;

  // Renombrado de 'inventario' a 'stock' para coincidir con la entidad y el servicio.
  @ApiPropertyOptional({ example: 10, description: 'Cantidad en stock' })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 0 })
  @IsPositive()
  @Type(() => Number) // Para la transformación automática de string a number
  stock?: number;

  @ApiPropertyOptional({
    example: 1200.5,
    description: 'Precio del producto',
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @Type(() => Number)
  precio?: number;

  // Cambiado a categoryId para manejar la relación por ID.
  @ApiPropertyOptional({
    example: 1,
    description: 'ID de la categoría del producto',
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  categoryId?: number;

  // --- Dimensiones del producto ---

  @ApiPropertyOptional({
    example: 55.5,
    description: 'Altura del producto en cm',
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  altura?: number;

  @ApiPropertyOptional({
    example: 95.0,
    description: 'Largo del producto en cm',
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  largo?: number;

  @ApiPropertyOptional({
    example: 10.2,
    description: 'Ancho del producto en cm',
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  ancho?: number;

  @ApiPropertyOptional({
    example: 15.5,
    description: 'Peso del producto en kg',
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  peso?: number;
}
