import { IsOptional, IsString, IsNumber, IsEnum, IsDateString } from 'class-validator';
import { CouponDiscountType, CouponStatus } from '../entities/created-coupon.entity';

export class EditCouponDto {
  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  @IsEnum(CouponDiscountType)
  type_discount?: CouponDiscountType;

  @IsOptional()
  @IsNumber()
  amount?: number;

  @IsOptional()
  @IsDateString()
  start_at?: string;

  @IsOptional()
  @IsDateString()
  expires_at?: string;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsEnum(CouponStatus)
  status?: CouponStatus;
}
