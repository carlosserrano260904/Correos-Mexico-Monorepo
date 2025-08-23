// create-product.dto.ts
import {
  IsBoolean, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, Min
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ example: 'Tenis Runner', maxLength: 60 })
  @IsString() @IsNotEmpty() @MaxLength(60)
  nombre: string;

  @ApiProperty({ example: 'Tenis deportivos para correr', maxLength: 120 })
  @IsString() @IsNotEmpty() @MaxLength(120)
  descripcion: string;

  @ApiProperty({ example: 1299.90, type: Number, minimum: 0 })
  @Type(() => Number) @IsNumber() @Min(0)
  precio: number;

  @ApiPropertyOptional({ example: 'Calzado' })
  @IsOptional() @IsString()
  categoria?: string;

  // REQUIRED por tu entity (no-nullable):
  @ApiProperty({ example: 'Negro', maxLength: 40 })
  @IsString() @IsNotEmpty() @MaxLength(40)
  color: string;

  @ApiProperty({ example: 'Nike', maxLength: 60 })
  @IsString() @IsNotEmpty() @MaxLength(60)
  marca: string;

  @ApiProperty({ example: 'tenis-runner-negro', maxLength: 120 })
  @IsString() @IsNotEmpty() @MaxLength(120)
  slug: string;

  @ApiProperty({ example: 'SportCenter MX', maxLength: 80 })
  @IsString() @IsNotEmpty() @MaxLength(80)
  vendedor: string;

  @ApiProperty({ example: 'SKU-ABC-001', maxLength: 60 })
  @IsString() @IsNotEmpty() @MaxLength(60)
  sku: string;

  // Campos con default en la entity → opcionales aquí:
  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true) // para multipart
  @IsBoolean()
  estado?: boolean;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional() @Type(() => Number) @IsInt() @Min(0)
  inventario?: number;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional() @Type(() => Number) @IsInt() @Min(0)
  vendidos?: number;
}
