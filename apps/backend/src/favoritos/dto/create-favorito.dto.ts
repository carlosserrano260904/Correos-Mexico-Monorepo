import { IsInt } from 'class-validator';

export class CreateFavoritoDto {
  @IsInt()
  profileId: number;

  @IsInt()
  productId: number;
}
