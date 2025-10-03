import { Test, TestingModule } from '@nestjs/testing';
import { FavoritosController } from './favoritos.controller';
import { FavoritosService } from './favoritos.service';

describe('FavoritosController', () => {
  let controller: FavoritosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FavoritosController],
      providers: [FavoritosService],
    }).compile();

    controller = module.get<FavoritosController>(FavoritosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
