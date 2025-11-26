// src/transactions/dto/create-transaction.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsInt,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';
import { TransactionsContentsDto } from './transactions-contents.dto';

export class CreateTransactionDto {
  @ApiProperty({
    example: 1,
    description: 'ID del perfil (usuario) que realiza la transacción',
  })
  @IsNotEmpty({ message: 'El ID del perfil no puede ir vacío' })
  @IsInt({ message: 'El ID del perfil debe ser un número entero' })
  profileId: number;

  @ApiProperty({
    type: [TransactionsContentsDto],
    description: 'Lista de productos detallados en la transacción',
  })
  @IsArray()
  @ArrayNotEmpty({ message: 'La lista de contenidos no puede estar vacía' })
  @ValidateNested({ each: true })
  @Type(() => TransactionsContentsDto)
  contenidos: TransactionsContentsDto[];
}
