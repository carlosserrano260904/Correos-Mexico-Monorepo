import { IsUUID, IsInt, IsString, IsNumber, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { CouponDiscountType } from '../entities/created-coupon.entity';

export class CreateCreatedCouponDto {
  @IsUUID()
  product_id?: string;

  @IsInt()
  seller_id?: number;

  @IsString()
  code: string;

  @IsEnum(CouponDiscountType)
  type_discount: CouponDiscountType;

  @IsNumber()
  amount: number;

  @IsOptional()
  @IsDateString()
  start_at?: string;

  @IsOptional()
  @IsDateString()
  expires_at?: string;

  @IsOptional()
  @IsString()
  color?: string;
}
