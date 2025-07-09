import { IsInt } from 'class-validator';

export class CreateFavoritoDto {
  @IsInt()
  usuarioId: number;

  @IsInt()
  productId: number;
}
