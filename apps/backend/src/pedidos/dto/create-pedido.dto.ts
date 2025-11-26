import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
  IsNumber,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PedidoProductoDto {
  @ApiProperty({ example: 3, description: 'ID del producto' })
  @IsNotEmpty()
  @IsInt()
  producto_id: number;

  @ApiProperty({
    example: 2,
    description: 'Cantidad solicitada de este producto',
  })
  @IsNotEmpty()
  @IsInt()
  cantidad: number;
}

export class CreatePedidoDto {
  @ApiProperty({
    example: 31,
    description: 'ID del perfil/usuario que realiza el pedido',
  })
  @IsNotEmpty()
  @IsInt()
  profileId: number;

  @ApiProperty({ example: 'aprobado', description: 'Estado del pedido' })
  @IsNotEmpty()
  @IsString()
  status: string;

  @ApiPropertyOptional({
    example: 'pendiente',
    description: 'Estado del pago (si aplica)',
  })
  @IsOptional()
  @IsString()
  estatus_pago?: string;

  @ApiPropertyOptional({ example: 2655.5, description: 'Total del pedido' })
  @IsOptional()
  @IsNumber()
  total?: number;

  // Dirección
  @ApiPropertyOptional({
    example: 7,
    description: 'ID de la dirección asociada al pedido',
  })
  @IsOptional()
  @IsInt()
  direccionId?: number;

  @ApiPropertyOptional({
    example: 'Unipoli',
    description: 'Calle de la dirección',
  })
  @IsOptional()
  @IsString()
  calle?: string;

  @ApiPropertyOptional({
    example: 'B',
    description: 'Número interior (si existe)',
  })
  @IsOptional()
  @IsString()
  numero_int?: string;

  @ApiPropertyOptional({ example: '500', description: 'Número exterior' })
  @IsOptional()
  @IsString()
  numero_exterior?: string;

  @ApiPropertyOptional({ example: '34000', description: 'Código postal' })
  @IsOptional()
  @IsString()
  cp?: string;

  @ApiPropertyOptional({ example: 'Durango', description: 'Ciudad del pedido' })
  @IsOptional()
  @IsString()
  ciudad?: string;

  // Datos de pago
  @ApiPropertyOptional({
    example: 'Daniel Baca',
    description: 'Nombre en la tarjeta o método de pago',
  })
  @IsOptional()
  @IsString()
  nombre?: string;

  @ApiPropertyOptional({
    example: '1234',
    description: 'Últimos 4 dígitos de la tarjeta',
  })
  @IsOptional()
  @IsString()
  last4?: string;

  @ApiPropertyOptional({ example: 'VISA', description: 'Marca de la tarjeta' })
  @IsOptional()
  @IsString()
  brand?: string;

  // Envío
  @ApiPropertyOptional({
    example: 'MX123456789',
    description: 'Número de guía del envío',
  })
  @IsOptional()
  @IsString()
  n_guia?: string;

  // Productos
  @ApiProperty({
    type: [PedidoProductoDto],
    description: 'Lista de productos que forman parte del pedido',
    example: [
      { producto_id: 3, cantidad: 1 },
      { producto_id: 4, cantidad: 2 },
    ],
  })
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => PedidoProductoDto)
  productos: PedidoProductoDto[];
}
