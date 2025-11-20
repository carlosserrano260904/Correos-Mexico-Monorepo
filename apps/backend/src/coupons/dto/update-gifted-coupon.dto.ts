import { PartialType } from '@nestjs/mapped-types';
import { CreateGiftedCouponDto } from './create-gifted-coupon.dto';

export class UpdateGiftedCouponDto extends PartialType(CreateGiftedCouponDto) {}
