import { IsInt, IsString, IsNumber, IsDateString } from 'class-validator';

export class CreateCreatedCouponDto {
  /** ID del producto al que se le asigna el cupón */
  @IsInt()
  product_id: number;

  /** Código único del cupón (por ejemplo, “DESC10”) */
  @IsString()
  code: string;

  /** Porcentaje de descuento que aplica el cupón */
  @IsNumber()
  discount_percentage: number;

  /** Fecha de expiración del cupón */
  @IsDateString()
  expires_at: Date;
}
