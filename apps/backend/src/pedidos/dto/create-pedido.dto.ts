import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsInt, IsNotEmpty, ValidateNested } from 'class-validator';

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
  profileid: number;

  @IsNotEmpty()
  status: string;

  @IsNotEmpty()
  @IsInt()
  direccionId: number;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true }) // 👈 ES IMPORTANTE PONER `each: true`
  @Type(() => PedidoProductoDto) // 👈 esto transforma los objetos del array
  productos: PedidoProductoDto[];
}
