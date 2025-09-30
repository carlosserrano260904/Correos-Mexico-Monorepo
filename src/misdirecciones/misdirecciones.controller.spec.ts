import { Test, TestingModule } from '@nestjs/testing';
import { MisdireccionesController } from './misdirecciones.controller';
import { MisdireccionesService } from './misdirecciones.service';

describe('MisdireccionesController', () => {
  let controller: MisdireccionesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MisdireccionesController],
      providers: [MisdireccionesService],
    }).compile();

    controller = module.get<MisdireccionesController>(MisdireccionesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
