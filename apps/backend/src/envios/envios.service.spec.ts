import { Test, TestingModule } from '@nestjs/testing';
import { EnviosService } from './envios.service';

describe('EnviosService', () => {
  let service: EnviosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EnviosService],
    }).compile();

    service = module.get<EnviosService>(EnviosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
