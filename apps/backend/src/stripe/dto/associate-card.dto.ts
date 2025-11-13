import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class AssociateCardDto {
  @IsString()
  @IsNotEmpty({ message: 'El customerId es obligatorio' })
  customerId: string;

  @IsString()
  @IsNotEmpty({ message: 'El paymentMethodId es obligatorio' })
  paymentMethodId: string;

  @IsNumber()
  @IsNotEmpty({ message: 'El profileId es obligatorio' })
  profileId: number;

  @IsString()
  @IsNotEmpty({ message: 'El nombre del titular es obligatorio' })
  cardholderName: string;
}
