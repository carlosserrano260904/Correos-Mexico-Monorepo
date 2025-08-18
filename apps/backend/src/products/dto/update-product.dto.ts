// update-product.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  // OJO: Como es PartialType, usa ApiPropertyOptional para no contradecir
  @ApiPropertyOptional({ example: 'Television', description: 'Nombre del producto' })
  @IsOptional()
  @IsString()
  nombre?: string;

  @ApiPropertyOptional({ example: 'Televisión con excelente calidad', description: 'Descripción del producto' })
  @IsOptional()
  @IsString()
  descripcion?: string;

  // Si sigues usando inventario aquí, documéntalo (y añade la columna en la entidad si aplica)
  @ApiPropertyOptional({ example: 10, description: 'Cantidad en stock' })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 0 })
  inventario?: number;

  @ApiPropertyOptional({ example: 1200, description: 'Precio' })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  precio?: number;

  @ApiPropertyOptional({ example: 'Electrónica', description: 'Categoría' })
  @IsOptional()
  @IsString()
  categoria?: string;
}
