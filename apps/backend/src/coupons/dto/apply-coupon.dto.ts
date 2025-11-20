import { IsUUID, IsInt } from 'class-validator';

export class ApplyCouponDto {
  @IsUUID()
  product_id: string;

  @IsInt()
  user_id: number;
}
