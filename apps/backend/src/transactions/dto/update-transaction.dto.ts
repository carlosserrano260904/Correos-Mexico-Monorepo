// src/transactions/dto/update-transaction.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { TransactionsContentsDto } from './transactions-contents.dto';

export class UpdateTransactionDto {
  @ApiPropertyOptional({
    example: 1,
    description: 'ID del perfil (usuario) que realiza la transacción',
  })
  @IsInt({ message: 'El ID del perfil debe ser un número entero' })
  profileId?: number;

  @ApiPropertyOptional({
    type: [TransactionsContentsDto],
    description: 'Lista de productos detallados en la transacción',
  })
  @IsArray({ message: 'Los contenidos deben ser un arreglo' })
  @ValidateNested({ each: true })
  @Type(() => TransactionsContentsDto)
  contenidos?: TransactionsContentsDto[];
}
