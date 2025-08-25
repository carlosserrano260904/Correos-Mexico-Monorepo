import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsArray } from 'class-validator';

export class ValidarCuponDto {
  @ApiProperty({ 
    example: "DESCUENTO20",
    description: "Código del cupón a validar"
  })
  @IsString()
  codigo: string;

  @ApiProperty({ 
    example: 1000,
    description: "Monto total de la compra"
  })
  @IsNumber()
  monto_compra: number;

  @ApiProperty({ 
    example: 1,
    description: "ID del usuario que aplica el cupón",
    required: false
  })
  @IsOptional()
  @IsNumber()
  usuario_id?: number;

  @ApiProperty({ 
    example: [1, 2, 3],
    description: "IDs de productos en el carrito",
    required: false
  })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  productos_ids?: number[];

  @ApiProperty({ 
    example: ["electronica", "ropa"],
    description: "Categorías de productos en el carrito",
    required: false
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  categorias?: string[];
}
