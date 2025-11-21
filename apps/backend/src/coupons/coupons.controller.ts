import { Controller, Get } from '@nestjs/common';
import { CouponsService } from './coupons.service';

@Controller('coupons')
export class CouponsController {
  constructor(private readonly couponsService: CouponsService) {}

  @Get('created')
  getCreated() {
    return this.couponsService.findAllCreated();
  }

  @Get('gifted')
  getGifted() {
    return this.couponsService.findAllGifted();
  }
}
