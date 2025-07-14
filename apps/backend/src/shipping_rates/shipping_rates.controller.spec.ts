import { Test, TestingModule } from '@nestjs/testing';
import { ShippingRatesController } from './shipping_rates.controller';
import { ShippingRatesService } from './shipping_rates.service';

describe('ShippingRatesController', () => {
  let controller: ShippingRatesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShippingRatesController],
      providers: [ShippingRatesService],
    }).compile();

    controller = module.get<ShippingRatesController>(ShippingRatesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
