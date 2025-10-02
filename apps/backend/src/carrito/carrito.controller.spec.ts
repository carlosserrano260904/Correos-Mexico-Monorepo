import { Test, TestingModule } from '@nestjs/testing';
import { CarritoController } from './carrito.controller';
import { CarritoService } from './carrito.service';

describe('CarritoController', () => {
  let controller: CarritoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CarritoController],
      providers: [CarritoService],
    }).compile();

    controller = module.get<CarritoController>(CarritoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
