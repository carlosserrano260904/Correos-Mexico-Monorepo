import { IsInt, IsNumber, IsPositive, IsBoolean } from 'class-validator';

export class CreateCarritoDto {
  @IsInt()
  profileId: number;

  @IsInt()
  productId: number;

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
