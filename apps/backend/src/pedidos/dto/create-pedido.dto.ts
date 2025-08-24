import { Type } from 'class-transformer';
import { 
  ArrayNotEmpty, 
  IsArray, 
  IsInt, 
  IsNotEmpty, 
  IsOptional, 
  IsString, 
  ValidateNested, 
  IsNumber 
} from 'class-validator';

export class PedidoProductoDto {
  @IsNotEmpty()
  @IsInt()
  producto_id: number;

  @IsNotEmpty()
  @IsInt()
  cantidad: number;
}

export class CreatePedidoDto {
  @IsNotEmpty()
  @IsInt()
  profileId: number;

  @IsNotEmpty()
  @IsString()
  status: string;

  @IsOptional()
  @IsString()
  estatus_pago?: string;

  @IsOptional()
  @IsNumber()
  total?: number;

  // Dirección
  @IsOptional()
  @IsInt()
  direccionId?: number;

  @IsOptional()
  @IsString()
  calle?: string;

  @IsOptional()
  @IsString()
  numero_int?: string;

  @IsOptional()
  @IsString()
  numero_exterior?: string;

  @IsOptional()
  @IsString()
  cp?: string;

  @IsOptional()
  @IsString()
  ciudad?: string;

  // Datos de pago
  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsString()
  last4?: string;

  @IsOptional()
  @IsString()
  brand?: string;

  // Envío
  @IsOptional()
  @IsString()
  n_guia?: string;

  // Productos
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => PedidoProductoDto)
  productos: PedidoProductoDto[];
}
