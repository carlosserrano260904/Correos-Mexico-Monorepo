import { Test, TestingModule } from '@nestjs/testing';
import { FavoritosService } from './favoritos.service';

describe('FavoritosService', () => {
  let service: FavoritosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FavoritosService],
    }).compile();

    service = module.get<FavoritosService>(FavoritosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
