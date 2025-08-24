import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsBoolean,
  Min,
} from 'class-validator';

/**
 * Transforma un valor de entrada (como 'true', 'false', true, false) a un booleano estricto.
 * Esencial para manejar datos de formularios multipart/form-data.
 */
const transformToBoolean = ({ value }): boolean | any => {
  if (value === 'true' || value === true) return true;
  if (value === 'false' || value === false) return false;
  return value; // Deja que el validador @IsBoolean se encargue si no es un booleano válido
};

export class CreateProductDto {
  @ApiProperty({ example: 'Producto de Ejemplo', description: 'Nombre del producto' })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiProperty({ example: 'Una descripción detallada del producto.', description: 'Descripción del producto' })
  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @ApiPropertyOptional({ example: 30, description: 'Altura del producto en cm' })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  altura?: number;

  @ApiPropertyOptional({ example: 25, description: 'Largo del producto en cm' })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  largo?: number;

  @ApiPropertyOptional({ example: 15, description: 'Ancho del producto en cm' })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  ancho?: number;

  @ApiPropertyOptional({ example: 2.5, description: 'Peso del producto en kg' })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  peso?: number;

  @ApiProperty({ example: 1299.9, description: 'Precio del producto', minimum: 0 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  precio: number;

  @ApiProperty({ example: 25, description: 'Cantidad en inventario', minimum: 0 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  inventario: number;

  @ApiProperty({ example: 'Electrónicos', description: 'Categoría del producto' })
  @IsString()
  categoria: string;

  @ApiProperty({ example: 'Negro', description: 'Color del producto' })
  @IsString()
  color: string;

  @ApiProperty({ example: 'MarcaGenial', description: 'Marca del producto' })
  @IsString()
  marca: string;

  @ApiProperty({ example: 'producto-de-ejemplo', description: 'URL amigable del producto' })
  @IsString()
  slug: string;

  @ApiProperty({ example: true, description: 'Estado del producto (activo/inactivo)' })
  @Transform(transformToBoolean)
  @IsBoolean()
  estado: boolean;

  @ApiProperty({ example: 'SKU-ABC-001', description: 'SKU del producto' })
  @IsString()
  sku: string;

  @ApiProperty({ example: 1, description: 'Numero de productos vendidos' })
  @IsString()
  vendidos: number;

  @ApiProperty({ example: 'Comercializadora S.A. de C.V.', description: 'Nombre de la empresa vendedora' })
  @IsString()
  vendedor: string;

  @ApiProperty({ example: 1, description: 'ID del perfil del vendedor' })
  @Type(() => Number)
  @IsNumber()
  idPerfil: number;
}
