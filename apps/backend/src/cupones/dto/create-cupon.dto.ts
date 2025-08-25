import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsNumber, IsOptional, IsBoolean, IsArray, IsDateString, Min, Max, Length } from 'class-validator';
import { TipoCupon, EstadoCupon } from '../entities/cupon.entity';

export class CreateCuponDto {
  @ApiProperty({ 
    example: "DESCUENTO20",
    description: "Código único del cupón"
  })
  @IsString()
  @Length(3, 50)
  codigo: string;

  @ApiProperty({ 
    example: "Descuento del 20% en toda la tienda",
    description: "Descripción del cupón"
  })
  @IsString()
  @Length(10, 200)
  descripcion: string;

  @ApiProperty({ 
    example: "porcentaje",
    enum: TipoCupon,
    description: "Tipo de descuento"
  })
  @IsEnum(TipoCupon)
  tipo: TipoCupon;

  @ApiProperty({ 
    example: 20,
    description: "Valor del descuento"
  })
  @IsNumber()
  @Min(0.01)
  valor: number;

  @ApiProperty({ 
    example: 500,
    description: "Monto mínimo de compra",
    required: false
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  monto_minimo?: number;

  @ApiProperty({ 
    example: 1000,
    description: "Descuento máximo que puede aplicar",
    required: false
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  descuento_maximo?: number;

  @ApiProperty({ 
    example: 100,
    description: "Número máximo de usos",
    required: false
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  usos_maximos?: number;

  @ApiProperty({ 
    example: "2024-12-31T23:59:59.000Z",
    description: "Fecha de expiración",
    required: false
  })
  @IsOptional()
  @IsDateString()
  fecha_expiracion?: string;

  @ApiProperty({ 
    example: "activo",
    enum: EstadoCupon,
    description: "Estado del cupón",
    required: false
  })
  @IsOptional()
  @IsEnum(EstadoCupon)
  estado?: EstadoCupon;

  @ApiProperty({ 
    example: false,
    description: "Si es true, solo se puede usar una vez por usuario",
    required: false
  })
  @IsOptional()
  @IsBoolean()
  uso_unico_por_usuario?: boolean;

  @ApiProperty({ 
    example: ["electronica", "ropa"],
    description: "Categorías aplicables",
    required: false
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  categorias_aplicables?: string[];

  @ApiProperty({ 
    example: [1, 5, 10],
    description: "IDs de productos aplicables",
    required: false
  })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  productos_aplicables?: number[];
}
