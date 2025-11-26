// src/transactions/dto/transactions-contents.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsNumber } from 'class-validator';

export class TransactionsContentsDto {
  @ApiProperty({
    example: 1,
    description: 'ID del producto relacionado con la transacción',
  })
  @IsNotEmpty({ message: 'El ID del producto no puede ir vacío' })
  @IsInt({ message: 'El ID del producto debe ser un número entero' })
  productId: number;

  @ApiProperty({ example: 2, description: 'Cantidad comprada del producto' })
  @IsNotEmpty({ message: 'La cantidad no puede ir vacía' })
  @IsInt({ message: 'La cantidad debe ser un entero válido' })
  cantidad: number;

  @ApiProperty({
    example: 150.0,
    description: 'Precio unitario del producto en la transacción',
  })
  @IsNotEmpty({ message: 'El precio no puede ir vacío' })
  @IsNumber({}, { message: 'El precio debe ser un valor numérico' })
  precio: number;
}
