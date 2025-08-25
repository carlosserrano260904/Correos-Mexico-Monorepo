import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsNumber, IsOptional, IsBoolean, IsArray, IsDateString, Min, Length } from 'class-validator';
import { TipoDescuento, TipoAplicacion, EstadoDescuento } from '../entities/descuento.entity';

export class CreateDescuentoDto {
  @ApiProperty({ 
    example: "Black Friday 2024",
    description: "Nombre del descuento"
  })
  @IsString()
  @Length(3, 100)
  nombre: string;

  @ApiProperty({ 
    example: "Descuento especial para Black Friday",
    description: "Descripción del descuento",
    required: false
  })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiProperty({ 
    example: "porcentaje",
    enum: TipoDescuento,
    description: "Tipo de descuento"
  })
  @IsEnum(TipoDescuento)
  tipo: TipoDescuento;

  @ApiProperty({ 
    example: 20,
    description: "Valor del descuento"
  })
  @IsNumber()
  @Min(0.01)
  valor: number;

  @ApiProperty({ 
    example: "carrito",
    enum: TipoAplicacion,
    description: "Tipo de aplicación del descuento"
  })
  @IsEnum(TipoAplicacion)
  tipo_aplicacion: TipoAplicacion;

  @ApiProperty({ 
    example: ["electronica", "ropa"],
    description: "Valores específicos para la aplicación",
    required: false
  })
  @IsOptional()
  @IsArray()
  valores_aplicacion?: string[] | number[];

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
    description: "Descuento máximo aplicable",
    required: false
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  descuento_maximo?: number;

  @ApiProperty({ 
    example: "2024-11-25T00:00:00.000Z",
    description: "Fecha de inicio",
    required: false
  })
  @IsOptional()
  @IsDateString()
  fecha_inicio?: string;

  @ApiProperty({ 
    example: "2024-11-30T23:59:59.000Z",
    description: "Fecha de fin",
    required: false
  })
  @IsOptional()
  @IsDateString()
  fecha_fin?: string;

  @ApiProperty({ 
    example: "activo",
    enum: EstadoDescuento,
    description: "Estado del descuento",
    required: false
  })
  @IsOptional()
  @IsEnum(EstadoDescuento)
  estado?: EstadoDescuento;

  @ApiProperty({ 
    example: 10,
    description: "Prioridad del descuento",
    required: false
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  prioridad?: number;

  @ApiProperty({ 
    example: true,
    description: "Si se puede combinar con otros descuentos",
    required: false
  })
  @IsOptional()
  @IsBoolean()
  combinable?: boolean;

  @ApiProperty({ 
    example: true,
    description: "Si se puede combinar con cupones",
    required: false
  })
  @IsOptional()
  @IsBoolean()
  combinable_con_cupones?: boolean;

  @ApiProperty({ 
    example: 100,
    description: "Usos máximos",
    required: false
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  usos_maximos?: number;

  @ApiProperty({ 
    example: false,
    description: "Si se aplica automáticamente",
    required: false
  })
  @IsOptional()
  @IsBoolean()
  automatico?: boolean;

  @ApiProperty({ 
    example: true,
    description: "Si el descuento está activo",
    required: false
  })
  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}
