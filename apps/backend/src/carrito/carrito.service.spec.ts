import { Test, TestingModule } from '@nestjs/testing';
import { CarritoService } from './carrito.service';

describe('CarritoService', () => {
  let service: CarritoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CarritoService],
    }).compile();

    service = module.get<CarritoService>(CarritoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
