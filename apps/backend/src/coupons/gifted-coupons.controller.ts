import {
  Controller,
  Post,
  Get,
  Param,
  Body,
} from '@nestjs/common';
import { CouponsService } from './coupons.service';
import { CreateGiftedCouponDto } from './dto/create-gifted-coupon.dto';

@Controller('coupons/gifted')
export class GiftedCouponsController {
  constructor(private readonly couponsService: CouponsService) {}

  // Asignar cupón a usuario
  @Post()
  assign(@Body() dto: CreateGiftedCouponDto) {
    return this.couponsService.assignCouponToUser(dto);
  }

  // Cupones que tiene un usuario
  @Get('user/:userId')
  findByUser(@Param('userId') userId: number) {
    return this.couponsService.getCouponsByUser(userId);
  }

  // Usuarios que tienen este cupón
  @Get('coupon/:couponId')
  findUsersByCoupon(@Param('couponId') couponId: number) {
    return this.couponsService.getUsersByCoupon(couponId);
  }
}
