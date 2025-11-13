import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CouponsService } from './coupons.service';
import { CouponsController } from './coupons.controller';

import { CreatedCouponEntity } from './entities/created-coupon.entity';
import { GiftedCouponEntity  } from './entities/gifted-coupon.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CreatedCouponEntity,
      GiftedCouponEntity
    ]),
  ],
  controllers: [CouponsController],
  providers: [CouponsService],
  exports: [CouponsService],
})
export class CouponModule {}
