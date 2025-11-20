import { IsInt, IsOptional, IsUUID } from 'class-validator';

export class CreateGiftedCouponDto {
  @IsInt()
  coupon_id: number;

  @IsInt()
  user_id: number;

  @IsOptional()
  @IsUUID()
  product_id?: string;
}
