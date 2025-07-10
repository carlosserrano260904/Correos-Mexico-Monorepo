import { Test, TestingModule } from '@nestjs/testing';
import { MisdireccionesService } from './misdirecciones.service';

describe('MisdireccionesService', () => {
  let service: MisdireccionesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MisdireccionesService],
    }).compile();

    service = module.get<MisdireccionesService>(MisdireccionesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
