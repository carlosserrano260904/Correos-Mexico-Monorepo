import { Test, TestingModule } from '@nestjs/testing';
import { ShippingRatesService } from './shipping_rates.service';

describe('ShippingRatesService', () => {
  let service: ShippingRatesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShippingRatesService],
    }).compile();

    service = module.get<ShippingRatesService>(ShippingRatesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
