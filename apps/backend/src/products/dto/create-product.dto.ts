import { Type, Transform } from 'class-transformer';
import {
  IsArray,
  ArrayNotEmpty,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  Min,
  MaxLength,
  ValidateNested,
  IsUrl,
  ArrayMinSize,
  ArrayMaxSize,
  IsPositive,
  IsDecimal,
} from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty({ message: 'El nombre es obligatorio.' })
  @IsString({ message: 'El nombre debe ser una cadena de texto.' })
  nombre: string;

  @IsNotEmpty({ message: 'La descripción es obligatoria.' })
  @IsString({ message: 'La descripción debe ser una cadena de texto.' })
  descripcion: string;

  @IsOptional()
  imagen?: string[];

  @IsNotEmpty({ message: 'El inventario es obligatorio.' })
  @Type(() => Number)
  @IsInt({ message: 'El inventario debe ser un número entero.' })
  @Min(0, { message: 'El inventario no puede ser negativo.' })
  inventario: number;

  @IsNotEmpty({ message: 'El precio es obligatorio.' })
  @Type(() => Number)
  @IsNumber({}, { message: 'El precio debe ser un número válido.' })
  @Min(0, { message: 'El precio no puede ser negativo.' })
  precio: number;

  @IsOptional()
  @IsString({ message: 'La categoría debe ser una cadena de texto.' })
  categoria?: string;

  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      // acepta "rojo,azul" o "rojo, azul"
      return value
        .split(',')
        .map((v: string) => v.trim())
        .filter((v: string) => v.length > 0);
    }
    if (Array.isArray(value)) {
      return value.map((v) => String(v).trim()).filter((v) => v.length > 0);
    }
    return [];
  })
  @IsArray({ message: 'Colores debe ser un arreglo de cadenas.' })
  @ArrayNotEmpty({ message: 'El arreglo de colores no puede estar vacío si se proporciona.' })
  @IsString({ each: true, message: 'Cada color debe ser una cadena de texto.' })
  color?: string[];
}
