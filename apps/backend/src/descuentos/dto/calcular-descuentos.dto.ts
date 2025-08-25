import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsArray, IsString } from 'class-validator';

export class CalcularDescuentosDto {
  @ApiProperty({ 
    example: 1000,
    description: "Monto total de la compra"
  })
  @IsNumber()
  monto_compra: number;

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

  @ApiProperty({ 
    example: ["Samsung", "Nike"],
    description: "Marcas de productos en el carrito",
    required: false
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  marcas?: string[];

  @ApiProperty({ 
    example: 1,
    description: "ID del usuario",
    required: false
  })
  @IsOptional()
  @IsNumber()
  usuario_id?: number;

  @ApiProperty({ 
    example: false,
    description: "Si es la primera compra del usuario",
    required: false
  })
  @IsOptional()
  es_primera_compra?: boolean;
}
