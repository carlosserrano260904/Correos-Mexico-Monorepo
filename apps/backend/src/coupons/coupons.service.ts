import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatedCouponEntity } from './entities/created-coupon.entity';
import { GiftedCouponEntity } from './entities/gifted-coupon.entity';

@Injectable()
export class CouponsService {
  constructor(
    @InjectRepository(CreatedCouponEntity)
    private createdCouponRepo: Repository<CreatedCouponEntity>,

    @InjectRepository(GiftedCouponEntity)
    private giftedCouponRepo: Repository<GiftedCouponEntity>,
  ) {}

  findAllCreated() {
    return this.createdCouponRepo.find({
      relations: ['giftedCoupons'],
    });
  }

  findAllGifted() {
    return this.giftedCouponRepo.find({
      relations: ['coupon', 'user'],
    });
  }
}
