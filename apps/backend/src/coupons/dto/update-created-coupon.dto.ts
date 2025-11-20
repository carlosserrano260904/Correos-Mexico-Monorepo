import { PartialType } from '@nestjs/mapped-types';
import { CreateCreatedCouponDto } from './create-created-coupon.dto';

export class UpdateCreatedCouponDto extends PartialType(CreateCreatedCouponDto) {}
