import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsInt, IsNotEmpty, IsNumber, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TransactionsContentsDto {
  @ApiProperty({ example: 1, description: 'ID del producto' })
  @IsNotEmpty({ message: 'El ID del producto no puede ir vacío' })
  @IsInt({ message: 'Producto no válido' })
  productId: number;

  @ApiProperty({ example: 2, description: 'Cantidad comprada del producto' })
  @IsNotEmpty({ message: 'La cantidad no puede ir vacía' })
  cantidad: number;

  @ApiProperty({ example: 150.00, description: 'Precio del producto en la transacción' })
  @IsNotEmpty({ message: 'El precio no puede ir vacío' })
  @IsNumber({}, { message: 'Precio no válido' })
  precio: number;
}

export class CreateTransactionDto {
   @ApiProperty({ example: 1, description: 'ID del perfil que hace la transacción' })
  @IsNotEmpty({ message: 'El ID del perfil no puede ir vacío' })
  @IsInt({ message: 'El ID del perfil debe ser un número entero' })
  profileId: number;
  @ApiProperty({ example: 300.00, description: 'Total de la transacción' })
  @IsNotEmpty({ message: 'El total no puede ir vacío' })
  @IsNumber({}, { message: 'Cantidad no válida' })
  total: number;

  @ApiProperty({ type: [TransactionsContentsDto], description: 'Lista de productos en la transacción' })
  @IsArray()
  @ArrayNotEmpty({ message: 'Los contenidos no pueden ir vacíos' })
  @ValidateNested({ each: true })
  @Type(() => TransactionsContentsDto)
  contenidos: TransactionsContentsDto[];
}
