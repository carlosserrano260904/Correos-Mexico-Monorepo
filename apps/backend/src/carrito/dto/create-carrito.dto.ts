import { IsInt, IsNumber, IsPositive, IsBoolean, IsUUID } from 'class-validator';

export class CreateCarritoDto {
  @IsInt()
  profileId: number;

  @IsUUID() // Validamos que sea un UUID v4
  productVariantId: string;

  @IsInt()
  @IsPositive()
  cantidad: number;
}
export class EditarCantidadDto {
  @IsInt()
  @IsPositive()
  cantidad: number;
}
export class SubtotalDto {
  @IsInt()
  profileId: number;
}

