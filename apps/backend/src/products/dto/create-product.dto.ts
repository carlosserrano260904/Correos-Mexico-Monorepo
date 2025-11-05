import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsArray,
  ValidateNested,
  IsUUID,
  IsEnum,
  IsUrl,
  ArrayMinSize,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { productStatus } from '../entities/product.entity';

// /**
//  * Transforma un valor de entrada (como 'true', 'false', true, false) a un booleano estricto.
//  * Esencial para manejar datos de formularios multipart/form-data.
//  */
// const transformToBoolean = ({ value }): boolean | any => {
//   if (value === 'true' || value === true) return true;
//   if (value === 'false' || value === false) return false;
//   return value; // Deja que el validador @IsBoolean se encargue si no es un booleano válido
// };

class CreateProductImageDto{
  @ApiProperty({example: ''})
  @IsUrl()
  url: string;

  @ApiPropertyOptional({example: 1, description: 'Orden de la imagen'})
  @IsNumber()
  @IsOptional()
  sortOrder?: number;
}

class CreateProductAttributeDto{
  @ApiProperty({example: 'a1b2c3d4-e5f6-7890-g1h2-i3j4k5l6m7n8',description: 'El UUID del atributo'})
  @IsUUID()
  attributeId: string;

  @ApiProperty({example: 'Rojo', description: 'El valor del atributo'})
  @IsString()
  value: string;
}

class CreateProductVariantDto{
  @ApiProperty({ example: 'tenis Runner Pro - Rojo / Talla 9'})
  @IsString()
  title: string;

  @ApiProperty({example: 12999.9, description: 'Precio de esta variante'})
  @IsNumber()
  price: number;

  @ApiProperty({example: 'SKU-RUN-RED-9'})
  @IsString()
  @IsOptional()
  sku?: string;

  @ApiPropertyOptional({example: 25, description: 'Inventario de esta variante'})
  @IsNumber()
  @IsOptional()
  inventoryQuantity?: number;

  @ApiPropertyOptional({example: 0.8, description: 'Peso en kg'})
  @IsNumber()
  @IsOptional()
  weight?: number;

  @ApiProperty({type: [CreateProductImageDto]})
  @IsArray()
  @ValidateNested({each: true})
  @Type(()=> CreateProductImageDto)
  images: CreateProductImageDto[];

  @ApiProperty({type: [CreateProductAttributeDto]})
  @IsArray()
  @ValidateNested({each: true})
  @Type(()=> CreateProductAttributeDto)
  attributes: CreateProductAttributeDto[];
}

export class CreateProductDto {
  @ApiProperty({ example: 'Tenis Runner Pro'})
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({
  example: 'Tenis deportivos de alto rendimiento con suela antideslizante y material transpirable, ideales para correr largas distancias.'})
  @IsString()
  @IsOptional()
  descripcion?: string;

  // @ApiPropertyOptional({ example: 30, description: 'Altura del producto en cm' })
  // @Type(() => Number)
  // @IsNumber()
  // @IsOptional()
  // altura?: number;

  // @ApiPropertyOptional({ example: 25, description: 'Largo del producto en cm' })
  // @Type(() => Number)
  // @IsNumber()
  // @IsOptional()
  // largo?: number;

  // @ApiPropertyOptional({ example: 15, description: 'Ancho del producto en cm' })
  // @Type(() => Number)
  // @IsNumber()
  // @IsOptional()
  // ancho?: number;

  // @ApiPropertyOptional({ example: 2.5, description: 'Peso del producto en kg' })
  // @Type(() => Number)
  // @IsNumber()
  // @IsOptional()
  // peso?: number;

  // @ApiProperty({ example: 1299.9, description: 'Precio del producto', minimum: 0 })
  // @Type(() => Number)
  // @IsNumber()
  // @Min(0)
  // precio: number;

  // @ApiProperty({ example: 25, description: 'Cantidad en inventario', minimum: 0 })
  // @Type(() => Number)
  // @IsNumber()
  // @Min(0)
  // inventario: number;

  @ApiProperty({ example: 'e1f2g3h4-i5j6-7890-k1l2-m3n4o5p6q7r8', description: 'UUID de la ProductCategory' })
  @IsUUID()
  categoryId: string;

  // @ApiProperty({ example: 'Negro', description: 'Color del producto' })
  // @IsString()
  // color: string;

  // @ApiProperty({ example: 'MarcaGenial', description: 'Marca del producto' })
  // @IsString()
  // marca: string;

  @ApiProperty({ example: 'producto-de-ejemplo' })
  @IsString()
  slug: string;

  @ApiProperty({example: 'f1g2h3i4-j5k6-7890-l1m2-n3o4p5q6r7s8', description: 'UUID del vendedor (sellerId)'})
  @IsUUID()
  sellerId: string;

  @ApiProperty({enum: productStatus, example: productStatus.PUBLISHED,})
  @IsEnum(productStatus)
  status: productStatus;

  @ApiProperty({type:[CreateProductVariantDto], description: 'Lista de variantes del producto (al menos una)',})
  @IsArray()
  @ValidateNested({each: true})
  @Type(()=> CreateProductVariantDto)
  @ArrayMinSize(1)
  variants: CreateProductVariantDto[];

  // @ApiProperty({ example: true, description: 'Estado del producto (activo/inactivo)' })
  // @Transform(transformToBoolean)
  // @IsBoolean()
  // estado: boolean;

  // @ApiProperty({ example: 'SKU-ABC-001', description: 'SKU del producto' })
  // @IsString()
  // sku: string;

  // @ApiProperty({ example: 1, description: 'Numero de productos vendidos' })
  // @IsString()
  // vendidos: number;

  // @ApiProperty({ example: 'Comercializadora S.A. de C.V.', description: 'Nombre de la empresa vendedora' })
  // @IsString()
  // vendedor: string;

  // @ApiProperty({ example: 1, description: 'ID del perfil del vendedor' })
  // @Type(() => Number)
  // @IsNumber()
  // idPerfil: number;
}