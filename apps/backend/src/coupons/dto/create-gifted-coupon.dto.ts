import { IsInt } from 'class-validator';

export class CreateGiftedCouponDto {
  /** ID del cupón creado por el vendedor */
  @IsInt()
  coupon_id: number;

  /** ID del usuario que reclama el cupón */
  @IsInt()
  user_id: number;
}
