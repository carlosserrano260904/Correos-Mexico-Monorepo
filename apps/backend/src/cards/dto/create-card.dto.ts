import { IsString, IsNotEmpty } from 'class-validator';

export class CreateCardDto {
  @IsString()
  @IsNotEmpty({ message: 'El token de Stripe es obligatorio' })
  token: string;
}
