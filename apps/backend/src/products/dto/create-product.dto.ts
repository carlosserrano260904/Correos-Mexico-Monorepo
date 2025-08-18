// create-product.dto.ts
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ example: 'Tenis Runner', description: 'Nombre del producto', maxLength: 60 })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiProperty({ example: 'Tenis deportivos para correr', description: 'Descripción del producto', maxLength: 120 })
  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @ApiProperty({ example: 1299.90, description: 'Precio del producto', minimum: 0 })
  @Type(() => Number)
  @IsNumber()
  precio: number;

  @ApiPropertyOptional({ example: 'Calzado', description: 'Categoría del producto' })
  @IsOptional()
  @IsString()
  categoria?: string;
}
