import { IsString, IsNotEmpty, Matches } from 'class-validator';

export class CreateCardDto {
  @IsString()
  @IsNotEmpty({ message: 'El token de Stripe es obligatorio' })
  token: string;

  @IsString()
  @IsNotEmpty({ message: 'El nombre del titular es obligatorio' })
  @Matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/, {
    message: 'El nombre del titular solo puede contener letras y espacios',
  })
  cardholderName: string;
}
